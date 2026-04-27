import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { env } from "@/lib/env";
import { scoreFromSignals, statusFromAnalysis } from "@/lib/market";
import { getPrisma } from "@/lib/prisma";
import { clampScore, formatDelay } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const analysisSchema = z.object({
  stage: z.string().optional().default("artist_replied"),
  prospect_mood: z.string().optional().default("neutral"),
  pain_confirmed: z.boolean().optional().default(false),
  pain_type: z.string().nullable().optional().default(""),
  interest_score: z.number().optional().default(0),
  objection: z.string().nullable().optional().default(""),
  asked_price: z.boolean().optional().default(false),
  asked_demo: z.boolean().optional().default(false),
  should_use_reply_delay_hook: z.boolean().optional().default(false),
  suggested_reply: z.string().optional().default(""),
  alternative_reply: z.string().optional().default(""),
  next_action: z.string().optional().default("send_reply"),
  market_insight: z.string().optional().default(""),
});

function extractJson(text: string) {
  const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
}

function promptFor(prospect: NonNullable<Awaited<ReturnType<typeof loadProspect>>>) {
  const timeline = prospect.messages
    .map((message) => `${message.direction.toUpperCase()} ${message.sentOrReceivedAt.toISOString()}: ${message.messageText}`)
    .join("\n");
  return [
    "You are MyMUA Market Checker AI, an AI sales-research assistant.",
    "Goal: test whether makeup artists in India want an Instagram AI booking assistant.",
    "This is controlled manual market research. You are not sending messages automatically.",
    "",
    "Product being tested: an Instagram booking assistant for makeup artists. It replies to booking DMs, asks service type, event date, city/venue, WhatsApp number, and shows serious leads in a dashboard. It does not confirm booking or invent pricing. The artist stays in control.",
    "",
    "Rules: never pretend to be a bride/client, never pressure, never insult late replies, never promise guaranteed bookings, no corporate long pitch, use Hinglish only if the artist used Hindi/Hinglish first, mention beta around INR 499/month only when context is right.",
    "",
    `Prospect: @${prospect.instagramUsername}, ${prospect.artistName || "unknown artist"}, ${prospect.city || "unknown city"}, category ${prospect.category}.`,
    `Current status: ${prospect.status}. Interest score: ${prospect.interestScore}. Reply delay: ${formatDelay(prospect.replyDelayMinutes)}.`,
    `Bio: ${prospect.bioText || "No bio captured."}`,
    "",
    "Conversation:",
    timeline || "No messages logged.",
    "",
    "Return JSON only with keys: stage, prospect_mood, pain_confirmed, pain_type, interest_score, objection, asked_price, asked_demo, should_use_reply_delay_hook, suggested_reply, alternative_reply, next_action, market_insight.",
  ].join("\n");
}

async function loadProspect(id: number) {
  return getPrisma().prospect.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { sentOrReceivedAt: "asc" } },
      analyses: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
}

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prospectId = Number(id);
  const prospect = await loadProspect(prospectId);
  if (!prospect) return NextResponse.json({ ok: false, error: "Prospect not found." }, { status: 404 });
  if (!env.geminiApiKey) {
    return NextResponse.json({ ok: false, error: "GEMINI_API_KEY is missing. Manual tracking still works; add the key to enable AI analysis." }, { status: 409 });
  }

  const prompt = promptFor(prospect);
  const model = new GoogleGenerativeAI(env.geminiApiKey).getGenerativeModel({ model: env.geminiModel });
  const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.35, maxOutputTokens: 700 } });
  const text = result.response.text();
  const parsed = analysisSchema.parse(JSON.parse(extractJson(text)));
  const deterministicScore = scoreFromSignals({
    replied: Boolean(prospect.firstReplyAt),
    painConfirmed: parsed.pain_confirmed,
    askedHow: parsed.stage?.includes("how") || parsed.next_action?.includes("explain"),
    askedPrice: parsed.asked_price,
    askedDemo: parsed.asked_demo,
    delayed: Boolean(prospect.replyDelayMinutes && prospect.replyDelayMinutes >= 60),
    notNeeded: (parsed.objection || "").toLowerCase().includes("not needed"),
  });
  const nextScore = clampScore(Math.max(prospect.interestScore, parsed.interest_score, deterministicScore));
  const nextStatus = statusFromAnalysis(parsed) || prospect.status;
  const prisma = getPrisma();
  const saved = await prisma.conversationAnalysis.create({
    data: {
      prospectId,
      stage: parsed.stage,
      prospectMood: parsed.prospect_mood,
      painConfirmed: parsed.pain_confirmed,
      painType: parsed.pain_type || null,
      interestScore: nextScore,
      objection: parsed.objection || null,
      askedPrice: parsed.asked_price,
      askedDemo: parsed.asked_demo,
      shouldUseReplyDelayHook: parsed.should_use_reply_delay_hook,
      suggestedReply: parsed.suggested_reply,
      alternativeReply: parsed.alternative_reply,
      nextAction: parsed.next_action,
      marketInsight: parsed.market_insight,
      rawJson: JSON.stringify(parsed),
    },
  });
  await prisma.prospect.update({ where: { id: prospectId }, data: { interestScore: nextScore, status: nextStatus } });
  revalidatePath(`/prospects/${prospectId}`);
  revalidatePath("/dashboard");
  return NextResponse.json({ ok: true, analysis: { ...parsed, id: saved.id, suggestedReply: saved.suggestedReply } });
}
