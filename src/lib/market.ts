import type { ConversationAnalysis, OutreachMessage, Prospect } from "@prisma/client";
import { clampScore, percent } from "@/lib/utils";

export type ProspectWithLatest = Prospect & {
  messages?: OutreachMessage[];
  analyses?: ConversationAnalysis[];
};

export function calculateReplyDelay(firstSent?: Date | null, firstReply?: Date | null) {
  if (!firstSent || !firstReply) return null;
  return Math.max(0, Math.round((firstReply.getTime() - firstSent.getTime()) / 60000));
}

export function scoreFromSignals(args: {
  replied?: boolean;
  handlesDms?: boolean;
  painConfirmed?: boolean;
  busy?: boolean;
  delayed?: boolean;
  missedMessages?: boolean;
  askedHow?: boolean;
  askedAuto?: boolean;
  askedPrice?: boolean;
  askedDemo?: boolean;
  acceptedBeta?: boolean;
  sharedContact?: boolean;
  notNeeded?: boolean;
  teamHandles?: boolean;
  noInquiries?: boolean;
  ghostedAfterIntro?: boolean;
  annoyed?: boolean;
  tooExpensive?: boolean;
  beginnerNoBudget?: boolean;
}) {
  let score = 0;
  if (args.replied) score += 10;
  if (args.handlesDms) score += 15;
  if (args.painConfirmed) score += 25;
  if (args.busy) score += 20;
  if (args.delayed) score += 25;
  if (args.missedMessages) score += 30;
  if (args.askedHow) score += 20;
  if (args.askedAuto) score += 15;
  if (args.askedPrice) score += 20;
  if (args.askedDemo) score += 35;
  if (args.acceptedBeta) score += 50;
  if (args.sharedContact) score += 40;
  if (args.notNeeded) score -= 25;
  if (args.teamHandles) score -= 10;
  if (args.noInquiries) score -= 25;
  if (args.ghostedAfterIntro) score -= 20;
  if (args.annoyed) score -= 40;
  if (args.tooExpensive) score -= 15;
  if (args.beginnerNoBudget) score -= 20;
  return clampScore(score);
}

export function statusFromAnalysis(analysis: {
  pain_confirmed?: boolean;
  asked_price?: boolean;
  asked_demo?: boolean;
  next_action?: string;
  interest_score?: number;
  objection?: string | null;
}): string | null {
  const action = (analysis.next_action || "").toLowerCase();
  const objection = (analysis.objection || "").toLowerCase();
  if (action.includes("beta") || action.includes("closed")) return "beta_closed";
  if (analysis.asked_demo) return "demo_requested";
  if (analysis.asked_price) return "asked_price";
  if (analysis.interest_score != null && analysis.interest_score >= 80) return "hot_beta_prospect";
  if (analysis.pain_confirmed) return "pain_confirmed";
  if (objection.includes("not interested") || objection.includes("not needed")) return "not_interested";
  return null;
}

export function marketSummary(prospects: ProspectWithLatest[]) {
  const active = prospects.filter((prospect) => !prospect.archivedAt);
  const contacted = active.filter((prospect) => Boolean(prospect.firstMessageSentAt));
  const replied = active.filter((prospect) => Boolean(prospect.firstReplyAt));
  const painConfirmed = active.filter((prospect) => prospect.status === "pain_confirmed" || prospect.analyses?.some((analysis) => analysis.painConfirmed));
  const priceOrDemo = active.filter((prospect) =>
    ["asked_how_it_works", "asked_price", "demo_requested", "hot_beta_prospect", "beta_closed"].includes(prospect.status) ||
    prospect.analyses?.some((analysis) => analysis.askedPrice || analysis.askedDemo),
  );
  const betaInterested = active.filter((prospect) => ["demo_requested", "hot_beta_prospect", "beta_closed"].includes(prospect.status));
  const betaClosed = active.filter((prospect) => prospect.status === "beta_closed");
  const ghosted = active.filter((prospect) => prospect.status === "ghosted");
  const notInterested = active.filter((prospect) => prospect.status === "not_interested");
  const seenNoReply = active.filter((prospect) => prospect.seenWithoutReplyCount > 0 && !prospect.firstReplyAt);
  const seenTracked = active.filter((prospect) => prospect.seenWithoutReplyCount > 0);
  const delays = replied.map((prospect) => prospect.replyDelayMinutes).filter((delay): delay is number => typeof delay === "number");
  const averageReplyDelay = delays.length ? Math.round(delays.reduce((sum, delay) => sum + delay, 0) / delays.length) : null;
  const sorted = [...delays].sort((a, b) => a - b);
  const medianReplyDelay = sorted.length ? sorted[Math.floor(sorted.length / 2)] : null;
  const replyRate = percent(replied.length, contacted.length);
  const painConfirmedRate = percent(painConfirmed.length, replied.length);
  const priceDemoRate = percent(priceOrDemo.length, replied.length);

  let verdict = "Moderate signal: continue testing";
  if (contacted.length < 30) verdict = "Too early: need more data";
  else if (contacted.length >= 50 && replyRate < 10) verdict = "Weak signal: change pitch";
  else if (contacted.length >= 100 && replyRate > 15 && painConfirmedRate > 40 && priceDemoRate > 10 && betaInterested.length >= 2) {
    verdict = "Strong signal: build beta product";
  }

  return {
    totalProspects: active.length,
    totalContacted: contacted.length,
    totalReplied: replied.length,
    replyRate,
    painConfirmed: painConfirmed.length,
    painConfirmedRate,
    priceOrDemo: priceOrDemo.length,
    priceDemoRate,
    betaInterested: betaInterested.length,
    betaClosed: betaClosed.length,
    seenTracked: seenTracked.length,
    seenNoReply: seenNoReply.length,
    seenNoReplyRate: percent(seenNoReply.length, seenTracked.length),
    ghostRate: percent(ghosted.length, contacted.length),
    notInterestedRate: percent(notInterested.length, replied.length),
    hotProspects: active.filter((prospect) => prospect.interestScore >= 80 || prospect.status === "hot_beta_prospect").length,
    warmProspects: active.filter((prospect) => prospect.interestScore >= 50 && prospect.interestScore < 80).length,
    averageReplyDelay,
    medianReplyDelay,
    verdict,
  };
}
