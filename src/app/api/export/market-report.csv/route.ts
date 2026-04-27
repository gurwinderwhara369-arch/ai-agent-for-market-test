import { NextResponse } from "next/server";
import { marketSummary } from "@/lib/market";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const prospects = await getPrisma().prospect.findMany({ where: { archivedAt: null }, include: { analyses: true } });
  const summary = marketSummary(prospects);
  const rows = Object.entries(summary).map(([key, value]) => `"${key}","${String(value).replaceAll('"', '""')}"`).join("\n");
  return new NextResponse(`"metric","value"\n${rows}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=mymua-market-report.csv",
    },
  });
}
