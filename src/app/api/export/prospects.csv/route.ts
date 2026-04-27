import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const prospects = await getPrisma().prospect.findMany({ where: { archivedAt: null }, include: { campaign: true }, orderBy: { updatedAt: "desc" } });
  const headers = ["username", "artist_name", "city", "category", "status", "interest_score", "followers", "first_dm", "first_reply", "reply_delay_minutes", "campaign", "notes"];
  const rows = prospects.map((p) => [
    p.instagramUsername,
    p.artistName,
    p.city,
    p.category,
    p.status,
    p.interestScore,
    p.followersCount,
    p.firstMessageSentAt?.toISOString(),
    p.firstReplyAt?.toISOString(),
    p.replyDelayMinutes,
    p.campaign?.campaignName,
    p.notes,
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=mymua-prospects.csv",
    },
  });
}
