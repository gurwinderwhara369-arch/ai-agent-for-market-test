import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/lib/env";
import { calculateReplyDelay, scoreFromSignals } from "@/lib/market";
import { getPrisma } from "@/lib/prisma";
import { clampScore } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get("hub.mode") || params.get("hub_mode");
  const token = params.get("hub.verify_token") || params.get("hub_verify_token");
  const challenge = params.get("hub.challenge") || params.get("hub_challenge") || "";

  if (mode === "subscribe" && token && token === env.webhookVerifyToken) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json(
    {
      ok: false,
      error: "Webhook verification failed. Check WEBHOOK_VERIFY_TOKEN.",
    },
    { status: 403 },
  );
}

type InstagramMessage = {
  mid?: string;
  text?: string;
  is_echo?: boolean;
  attachments?: Array<{ type?: string; payload?: { url?: string } }>;
};

type InstagramMessagingEvent = {
  sender?: { id?: string };
  recipient?: { id?: string };
  timestamp?: number;
  message?: InstagramMessage;
  read?: { mid?: string; watermark?: number; seq?: number };
  delivery?: unknown;
  postback?: unknown;
  reaction?: unknown;
  referral?: unknown;
  optin?: unknown;
  standby?: unknown;
};

type InstagramEntry = {
  id?: string;
  changes?: Array<{ field?: string; value?: unknown }>;
  messaging?: InstagramMessagingEvent[];
};

type InstagramWebhookPayload = {
  object?: string;
  entry?: InstagramEntry[];
};

function sha1(value: string) {
  return crypto.createHash("sha1").update(value).digest("hex");
}

function eventTime(event: InstagramMessagingEvent) {
  return event.timestamp ? new Date(event.timestamp) : new Date();
}

function eventType(event: InstagramMessagingEvent) {
  if (event.message?.is_echo) return "message_echo";
  if (event.message) return "messages";
  if (event.read) return "messaging_seen";
  if (event.delivery) return "delivery";
  if (event.postback) return "messaging_postbacks";
  if (event.reaction) return "message_reactions";
  if (event.referral) return "messaging_referral";
  if (event.optin) return "messaging_optins";
  if (event.standby) return "standby";
  return "unknown";
}

async function logWebhookEvent(args: {
  eventType: string;
  field?: string;
  senderId?: string;
  recipientId?: string;
  externalMessageId?: string;
  payload: unknown;
  processedStatus?: string;
}) {
  return getPrisma().webhookEvent.create({
    data: {
      eventType: args.eventType,
      field: args.field || null,
      senderId: args.senderId || null,
      recipientId: args.recipientId || null,
      externalMessageId: args.externalMessageId || null,
      payload: JSON.stringify(args.payload),
      processedStatus: args.processedStatus || "received",
    },
  });
}

async function findOrCreateProspect(senderId: string, pageId: string, timestamp: Date) {
  const prisma = getPrisma();
  const existing = await prisma.prospect.findFirst({
    where: {
      OR: [{ instagramUserId: senderId }, { externalThreadId: senderId }],
    },
  });
  if (existing) {
    return prisma.prospect.update({
      where: { id: existing.id },
      data: { instagramPageId: pageId || existing.instagramPageId, lastWebhookEventAt: timestamp },
    });
  }

  return prisma.prospect.create({
    data: {
      instagramUsername: `ig_${senderId}`,
      artistName: "Instagram prospect",
      category: "unknown",
      source: "instagram_webhook",
      status: "replied",
      interestScore: 10,
      instagramUserId: senderId,
      instagramPageId: pageId || null,
      externalThreadId: senderId,
      firstReplyAt: timestamp,
      lastMessageAt: timestamp,
      lastWebhookEventAt: timestamp,
      notes: "Created automatically from Instagram webhook. Rename after identifying the MUA profile.",
    },
  });
}

function messageBody(message: InstagramMessage) {
  const text = message.text?.trim();
  if (text) return text;
  const attachment = message.attachments?.[0];
  if (attachment?.type) return `[${attachment.type} attachment]`;
  return "[Instagram message]";
}

async function handleIncomingMessage(event: InstagramMessagingEvent, entryId?: string) {
  const message = event.message;
  const senderId = event.sender?.id || "";
  const recipientId = event.recipient?.id || entryId || "";
  const timestamp = eventTime(event);
  if (!message || message.is_echo || !senderId) return { status: "ignored", reason: "empty_or_echo" };

  const externalId = message.mid || `ig_${sha1(`${senderId}:${recipientId}:${event.timestamp || Date.now()}:${message.text || ""}`)}`;
  const prisma = getPrisma();
  const duplicate = await prisma.outreachMessage.findFirst({ where: { externalMessageId: externalId } });
  if (duplicate) return { status: "skipped", reason: "duplicate_message", externalId };

  const prospect = await findOrCreateProspect(senderId, recipientId, timestamp);
  const isFirstReply = !prospect.firstReplyAt;
  const firstReplyAt = prospect.firstReplyAt || timestamp;
  const replyDelayMinutes = calculateReplyDelay(prospect.firstMessageSentAt, firstReplyAt);
  const nextScore = clampScore(
    Math.max(
      prospect.interestScore,
      scoreFromSignals({
        replied: true,
        delayed: Boolean(replyDelayMinutes && replyDelayMinutes >= 60),
      }),
    ),
  );
  const nextStatus = ["not_contacted", "message_sent", "followup_needed", "ghosted"].includes(prospect.status) ? "replied" : prospect.status;

  await prisma.$transaction([
    prisma.outreachMessage.create({
      data: {
        prospectId: prospect.id,
        direction: "received",
        channel: "instagram",
        messageText: messageBody(message),
        sentOrReceivedAt: timestamp,
        isFirstReply,
        externalMessageId: externalId,
        rawPayload: JSON.stringify(event),
      },
    }),
    prisma.prospect.update({
      where: { id: prospect.id },
      data: {
        firstReplyAt,
        replyDelayMinutes,
        lastMessageAt: timestamp,
        lastWebhookEventAt: timestamp,
        seenWithoutReplyCount: 0,
        status: nextStatus,
        interestScore: nextScore,
      },
    }),
  ]);

  return { status: "stored", type: "messages", prospectId: prospect.id, externalId };
}

async function handleSeen(event: InstagramMessagingEvent, entryId?: string) {
  const senderId = event.sender?.id || "";
  const recipientId = event.recipient?.id || entryId || "";
  const timestamp = eventTime(event);
  const prisma = getPrisma();
  const prospect = senderId
    ? await prisma.prospect.findFirst({ where: { OR: [{ instagramUserId: senderId }, { externalThreadId: senderId }] } })
    : null;

  if (!prospect) return { status: "logged", type: "messaging_seen", reason: "no_matching_prospect", senderId, recipientId };
  const attempts = Math.min(3, prospect.followupAttempts + 1);
  const shouldSchedule = attempts <= 3;
  const followupAt = new Date(timestamp.getTime() + 24 * 3600 * 1000);
  const updates = prisma.prospect.update({
    where: { id: prospect.id },
    data: {
      lastSeenAt: timestamp,
      lastWebhookEventAt: timestamp,
      seenWithoutReplyCount: prospect.seenWithoutReplyCount + 1,
      followupAttempts: attempts,
      nextFollowupAt: shouldSchedule ? followupAt : prospect.nextFollowupAt,
      status: shouldSchedule ? "followup_needed" : prospect.status,
    },
  });
  const followup = shouldSchedule
    ? prisma.followup.create({
        data: {
          prospectId: prospect.id,
          followupAt,
          followupReason: `Seen on Instagram but no reply. Manual follow-up attempt ${attempts}/3.`,
          suggestedMessage: attempts === 1
            ? "Hey, just checking once - do you handle booking DMs yourself or someone from your team does it?"
            : "Hey, quick follow-up - would a simple assistant that collects date/city/service from booking DMs be useful for your page?",
        },
      })
    : prisma.followup.findMany({ take: 0 });
  await prisma.$transaction([updates, followup]);
  return { status: "stored", type: "messaging_seen", prospectId: prospect.id, followupScheduled: shouldSchedule, attempts };
}

async function handleEvent(event: InstagramMessagingEvent, entryId?: string) {
  const type = eventType(event);
  const senderId = event.sender?.id || "";
  const recipientId = event.recipient?.id || entryId || "";
  const externalMessageId = event.message?.mid || event.read?.mid || undefined;

  let result: Record<string, unknown>;
  if (type === "messages") result = await handleIncomingMessage(event, entryId);
  else if (type === "messaging_seen") result = await handleSeen(event, entryId);
  else result = { status: "logged", type };

  await logWebhookEvent({
    eventType: type,
    senderId,
    recipientId,
    externalMessageId,
    payload: event,
    processedStatus: String(result.status || "received"),
  });
  return result;
}

export async function POST(request: NextRequest) {
  let payload: InstagramWebhookPayload;
  try {
    payload = (await request.json()) as InstagramWebhookPayload;
  } catch {
    return NextResponse.json({ ok: true, ignored: "invalid_json" });
  }

  const results = [];
  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      await logWebhookEvent({
        eventType: change.field || "change",
        field: change.field,
        payload: change,
        processedStatus: "logged",
      });
      results.push({ status: "logged", type: change.field || "change" });
    }
    for (const event of entry.messaging || []) {
      try {
        results.push(await handleEvent(event, entry.id));
      } catch (error) {
        await logWebhookEvent({
          eventType: eventType(event),
          senderId: event.sender?.id,
          recipientId: event.recipient?.id || entry.id,
          payload: event,
          processedStatus: "error",
        });
        results.push({ status: "error", reason: error instanceof Error ? error.message : "Unknown webhook error" });
      }
    }
  }

  return NextResponse.json({ ok: true, results });
}
