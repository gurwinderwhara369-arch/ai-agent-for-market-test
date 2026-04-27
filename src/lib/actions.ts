"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { calculateReplyDelay, scoreFromSignals } from "@/lib/market";
import { getPrisma } from "@/lib/prisma";
import { clampScore, normalizeUsername } from "@/lib/utils";

const optionalInt = z
  .string()
  .optional()
  .transform((value) => {
    if (!value?.trim()) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.round(parsed) : null;
  });

const optionalDate = z
  .string()
  .optional()
  .transform((value) => (value ? new Date(value) : new Date()));

const prospectSchema = z.object({
  instagramUsername: z.string().min(1),
  artistName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  followersCount: optionalInt,
  followingCount: optionalInt,
  profileUrl: z.string().optional(),
  bioText: z.string().optional(),
  category: z.string().default("unknown"),
  servicesDetected: z.string().optional(),
  hasWebsite: z.string().optional(),
  websiteUrl: z.string().optional(),
  source: z.string().optional(),
  campaignId: optionalInt,
  notes: z.string().optional(),
});

function emptyToNull(value: string | null | undefined) {
  const clean = value?.trim();
  return clean || null;
}

function refreshAll() {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/prospects");
  revalidatePath("/campaigns");
  revalidatePath("/followups");
  revalidatePath("/reports");
}

export async function createProspect(formData: FormData) {
  const parsed = prospectSchema.parse(Object.fromEntries(formData));
  const prisma = getPrisma();
  const prospect = await prisma.prospect.create({
    data: {
      instagramUsername: normalizeUsername(parsed.instagramUsername),
      artistName: emptyToNull(parsed.artistName),
      city: emptyToNull(parsed.city),
      state: emptyToNull(parsed.state),
      followersCount: parsed.followersCount,
      followingCount: parsed.followingCount,
      profileUrl: emptyToNull(parsed.profileUrl),
      bioText: emptyToNull(parsed.bioText),
      category: parsed.category,
      servicesDetected: emptyToNull(parsed.servicesDetected),
      hasWebsite: parsed.hasWebsite === "on",
      websiteUrl: emptyToNull(parsed.websiteUrl),
      source: emptyToNull(parsed.source),
      campaignId: parsed.campaignId,
      notes: emptyToNull(parsed.notes),
    },
  });
  refreshAll();
  redirect(`/prospects/${prospect.id}`);
}

export async function updateProspect(id: number, formData: FormData) {
  const parsed = prospectSchema.parse(Object.fromEntries(formData));
  const prisma = getPrisma();
  await prisma.prospect.update({
    where: { id },
    data: {
      instagramUsername: normalizeUsername(parsed.instagramUsername),
      artistName: emptyToNull(parsed.artistName),
      city: emptyToNull(parsed.city),
      state: emptyToNull(parsed.state),
      followersCount: parsed.followersCount,
      followingCount: parsed.followingCount,
      profileUrl: emptyToNull(parsed.profileUrl),
      bioText: emptyToNull(parsed.bioText),
      category: parsed.category,
      servicesDetected: emptyToNull(parsed.servicesDetected),
      hasWebsite: parsed.hasWebsite === "on",
      websiteUrl: emptyToNull(parsed.websiteUrl),
      source: emptyToNull(parsed.source),
      campaignId: parsed.campaignId,
      notes: emptyToNull(parsed.notes),
    },
  });
  refreshAll();
}

export async function archiveProspect(id: number) {
  await getPrisma().prospect.update({ where: { id }, data: { archivedAt: new Date() } });
  refreshAll();
  redirect("/prospects");
}

export async function setProspectStatus(id: number, formData: FormData) {
  const status = z.string().min(1).parse(formData.get("status"));
  await getPrisma().prospect.update({ where: { id }, data: { status } });
  refreshAll();
}

export async function addMessage(prospectId: number, formData: FormData) {
  const parsed = z
    .object({
      direction: z.enum(["sent", "received", "manual_note"]),
      channel: z.enum(["instagram", "whatsapp", "manual_note"]).default("instagram"),
      messageText: z.string().min(1),
      sentOrReceivedAt: optionalDate,
      aiGenerated: z.string().optional(),
    })
    .parse(Object.fromEntries(formData));
  const prisma = getPrisma();
  const prospect = await prisma.prospect.findUnique({ where: { id: prospectId } });
  if (!prospect) throw new Error("Prospect not found");

  const isFirstMessage = parsed.direction === "sent" && !prospect.firstMessageSentAt;
  const isFirstReply = parsed.direction === "received" && !prospect.firstReplyAt;
  const firstMessageSentAt = isFirstMessage ? parsed.sentOrReceivedAt : prospect.firstMessageSentAt;
  const firstReplyAt = isFirstReply ? parsed.sentOrReceivedAt : prospect.firstReplyAt;
  const replyDelayMinutes = calculateReplyDelay(firstMessageSentAt, firstReplyAt);
  const status =
    isFirstReply ? "replied" : isFirstMessage && prospect.status === "not_contacted" ? "message_sent" : prospect.status;
  const interestScore = clampScore(
    scoreFromSignals({
      replied: Boolean(firstReplyAt),
      delayed: Boolean(replyDelayMinutes && replyDelayMinutes >= 60),
    }) + Math.max(0, prospect.interestScore - 10),
  );

  await prisma.$transaction([
    prisma.outreachMessage.create({
      data: {
        prospectId,
        direction: parsed.direction,
        channel: parsed.channel,
        messageText: parsed.messageText.trim(),
        sentOrReceivedAt: parsed.sentOrReceivedAt,
        isFirstMessage,
        isFirstReply,
        aiGenerated: parsed.aiGenerated === "on",
      },
    }),
    prisma.prospect.update({
      where: { id: prospectId },
      data: {
        firstMessageSentAt,
        firstReplyAt,
        replyDelayMinutes,
        lastMessageAt: parsed.sentOrReceivedAt,
        status,
        interestScore,
      },
    }),
  ]);
  refreshAll();
}

export async function markFirstDmSent(prospectId: number) {
  const prisma = getPrisma();
  const prospect = await prisma.prospect.findUnique({ where: { id: prospectId } });
  if (!prospect) throw new Error("Prospect not found");
  const timestamp = prospect.firstMessageSentAt ?? new Date();
  await prisma.prospect.update({
    where: { id: prospectId },
    data: {
      firstMessageSentAt: timestamp,
      replyDelayMinutes: calculateReplyDelay(timestamp, prospect.firstReplyAt),
      status: prospect.status === "not_contacted" ? "message_sent" : prospect.status,
      lastMessageAt: timestamp,
    },
  });
  refreshAll();
}

export async function markFirstReply(prospectId: number) {
  const prisma = getPrisma();
  const prospect = await prisma.prospect.findUnique({ where: { id: prospectId } });
  if (!prospect) throw new Error("Prospect not found");
  const timestamp = prospect.firstReplyAt ?? new Date();
  await prisma.prospect.update({
    where: { id: prospectId },
    data: {
      firstReplyAt: timestamp,
      replyDelayMinutes: calculateReplyDelay(prospect.firstMessageSentAt, timestamp),
      status: "replied",
      lastMessageAt: timestamp,
      interestScore: clampScore(Math.max(prospect.interestScore, 10)),
    },
  });
  refreshAll();
}

export async function createCampaign(formData: FormData) {
  const parsed = z
    .object({
      campaignName: z.string().min(1),
      openingMessage: z.string().optional(),
      positioningAngle: z.string().optional(),
      targetCity: z.string().optional(),
      targetCategory: z.string().optional(),
      betaPrice: optionalInt,
      notes: z.string().optional(),
    })
    .parse(Object.fromEntries(formData));
  await getPrisma().campaign.create({
    data: {
      campaignName: parsed.campaignName.trim(),
      openingMessage: emptyToNull(parsed.openingMessage),
      positioningAngle: emptyToNull(parsed.positioningAngle),
      targetCity: emptyToNull(parsed.targetCity),
      targetCategory: emptyToNull(parsed.targetCategory),
      betaPrice: parsed.betaPrice ?? 499,
      notes: emptyToNull(parsed.notes),
    },
  });
  refreshAll();
}

export async function setFollowup(prospectId: number, formData: FormData) {
  const parsed = z
    .object({
      followupAt: z.string().min(1),
      followupReason: z.string().optional(),
      suggestedMessage: z.string().optional(),
    })
    .parse(Object.fromEntries(formData));
  const followupAt = new Date(parsed.followupAt);
  const prisma = getPrisma();
  await prisma.$transaction([
    prisma.followup.create({
      data: {
        prospectId,
        followupAt,
        followupReason: emptyToNull(parsed.followupReason),
        suggestedMessage: emptyToNull(parsed.suggestedMessage),
      },
    }),
    prisma.prospect.update({ where: { id: prospectId }, data: { nextFollowupAt: followupAt, status: "followup_needed" } }),
  ]);
  refreshAll();
}

export async function completeFollowup(id: number) {
  await getPrisma().followup.update({ where: { id }, data: { status: "completed", completedAt: new Date() } });
  refreshAll();
}
