import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge, PageHeader, StatCard } from "@/components/ui";
import { marketSummary } from "@/lib/market";
import { getPrisma } from "@/lib/prisma";
import { formatDelay, formatDateTime, percent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const prisma = getPrisma();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [prospects, campaigns, followups] = await Promise.all([
    prisma.prospect.findMany({
      where: { archivedAt: null },
      include: { analyses: { orderBy: { createdAt: "desc" }, take: 1 }, messages: { orderBy: { sentOrReceivedAt: "desc" }, take: 1 }, campaign: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.campaign.findMany({ include: { prospects: true }, orderBy: { createdAt: "desc" } }),
    prisma.followup.findMany({
      where: { status: "pending", followupAt: { lte: tomorrow } },
      include: { prospect: true },
      orderBy: { followupAt: "asc" },
      take: 8,
    }),
  ]);
  const summary = marketSummary(prospects);
  const hot = prospects.filter((prospect) => prospect.interestScore >= 50 || ["demo_requested", "hot_beta_prospect", "beta_closed"].includes(prospect.status)).slice(0, 8);

  return (
    <AppShell>
      <PageHeader
        title="Market Dashboard"
        description="Track whether Indian MUAs are replying, confirming booking-DM pain, asking price/demo, and becoming beta prospects."
        action={<Link href="/prospects" className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-950">Add prospects</Link>}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Prospects" value={summary.totalProspects} detail={`${summary.totalContacted} contacted`} />
        <StatCard label="Reply rate" value={`${summary.replyRate}%`} detail={`${summary.totalReplied} replies`} />
        <StatCard label="Pain confirmed" value={`${summary.painConfirmedRate}%`} detail={`${summary.painConfirmed} prospects`} />
        <StatCard label="Price/demo signal" value={`${summary.priceDemoRate}%`} detail={`${summary.priceOrDemo} asked how/price/demo`} />
        <StatCard label="Beta closed" value={summary.betaClosed} detail={`${summary.betaInterested} beta/demo interested`} />
        <StatCard label="Seen no reply" value={summary.seenNoReply} detail={`${summary.seenTracked} seen events tracked`} />
        <StatCard label="Avg delay" value={formatDelay(summary.averageReplyDelay)} detail={`Median ${formatDelay(summary.medianReplyDelay)}`} />
        <StatCard label="Hot/warm" value={`${summary.hotProspects}/${summary.warmProspects}`} detail="Hot over warm prospects" />
        <StatCard label="No/ghost" value={`${summary.notInterestedRate}% / ${summary.ghostRate}%`} detail="Not interested / ghost rate" />
      </div>

      <section className="panel mt-4 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Market verdict</h2>
            <p className="text-sm text-zinc-400">Decision signal based on PRD thresholds.</p>
          </div>
          <Badge tone={summary.verdict.startsWith("Strong") ? "green" : summary.verdict.startsWith("Weak") ? "red" : summary.verdict.startsWith("Too") ? "yellow" : "blue"}>
            {summary.verdict}
          </Badge>
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="panel p-4">
          <h2 className="mb-3 text-lg font-semibold">Hot and warm prospects</h2>
          <div className="space-y-2">
            {hot.length ? hot.map((prospect) => (
              <Link key={prospect.id} href={`/prospects/${prospect.id}`} className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 p-3 hover:border-zinc-700">
                <div>
                  <div className="font-medium">@{prospect.instagramUsername}</div>
                  <div className="text-xs text-zinc-500">{prospect.city || "No city"} · {prospect.status.replaceAll("_", " ")}</div>
                </div>
                <Badge tone={prospect.interestScore >= 80 ? "green" : "blue"}>{prospect.interestScore}</Badge>
              </Link>
            )) : <p className="text-sm text-zinc-500">No warm prospects yet.</p>}
          </div>
        </section>
        <section className="panel p-4">
          <h2 className="mb-3 text-lg font-semibold">Follow-ups due</h2>
          <div className="space-y-2">
            {followups.length ? followups.map((followup) => (
              <Link key={followup.id} href={`/prospects/${followup.prospectId}`} className="block rounded-md border border-zinc-800 bg-zinc-950 p-3 hover:border-zinc-700">
                <div className="flex justify-between gap-3">
                  <span className="font-medium">@{followup.prospect.instagramUsername}</span>
                  <span className="text-xs text-zinc-500">{formatDateTime(followup.followupAt)}</span>
                </div>
                <p className="mt-1 text-sm text-zinc-400">{followup.followupReason || "Follow up manually"}</p>
              </Link>
            )) : <p className="text-sm text-zinc-500">No follow-ups due today.</p>}
          </div>
        </section>
      </div>

      <section className="panel mt-4 overflow-hidden p-4">
        <h2 className="mb-3 text-lg font-semibold">Campaign performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-zinc-500">
              <tr><th className="py-2">Campaign</th><th>Contacted</th><th>Replies</th><th>Reply rate</th><th>Beta/demo</th></tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {campaigns.map((campaign) => {
                const contacted = campaign.prospects.filter((p) => p.firstMessageSentAt).length;
                const replied = campaign.prospects.filter((p) => p.firstReplyAt).length;
                const beta = campaign.prospects.filter((p) => ["demo_requested", "hot_beta_prospect", "beta_closed"].includes(p.status)).length;
                return (
                  <tr key={campaign.id}>
                    <td className="py-3 font-medium">{campaign.campaignName}</td>
                    <td>{contacted}</td>
                    <td>{replied}</td>
                    <td>{percent(replied, contacted)}%</td>
                    <td>{beta}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
