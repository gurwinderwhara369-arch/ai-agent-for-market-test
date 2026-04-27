import { AppShell } from "@/components/AppShell";
import { LinkButton, PageHeader } from "@/components/ui";
import { marketSummary } from "@/lib/market";
import { getPrisma } from "@/lib/prisma";
import { formatDelay } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const prospects = await getPrisma().prospect.findMany({ where: { archivedAt: null }, include: { analyses: true } });
  const summary = marketSummary(prospects);
  const report = [
    `Market signal: ${summary.verdict}`,
    "",
    `${summary.totalContacted} MUAs contacted.`,
    `${summary.totalReplied} replied (${summary.replyRate}%).`,
    `${summary.painConfirmed} confirmed DM-handling pain (${summary.painConfirmedRate}% of replies).`,
    `${summary.priceOrDemo} asked how it works, price, or demo (${summary.priceDemoRate}% of replies).`,
    `${summary.seenNoReply} have seen signals without a reply (${summary.seenNoReplyRate}% of seen-tracked prospects).`,
    `${summary.betaClosed} beta closed.`,
    `Average reply delay: ${formatDelay(summary.averageReplyDelay)}.`,
    "",
    `Recommendation: ${summary.verdict}.`,
  ].join("\n");

  return (
    <AppShell>
      <PageHeader title="Market Report" description="Copy this report into your founder notes after each outreach batch." action={<LinkButton href="/api/export/market-report.csv">Export CSV</LinkButton>} />
      <section className="panel p-4">
        <pre className="whitespace-pre-wrap rounded-md border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm text-zinc-200">{report}</pre>
      </section>
    </AppShell>
  );
}
