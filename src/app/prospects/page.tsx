import Link from "next/link";
import { Plus, Download } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProspectForm } from "@/components/prospects/ProspectForm";
import { Badge, LinkButton, PageHeader } from "@/components/ui";
import { getPrisma } from "@/lib/prisma";
import { formatDateTime, formatDelay } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProspectsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const prisma = getPrisma();
  const [prospects, campaigns] = await Promise.all([
    prisma.prospect.findMany({
      where: {
        archivedAt: null,
        ...(params.status ? { status: params.status as never } : {}),
        ...(params.city ? { city: { contains: params.city } } : {}),
      },
      include: { campaign: true, messages: { orderBy: { sentOrReceivedAt: "desc" }, take: 1 } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.campaign.findMany({ orderBy: { campaignName: "asc" } }),
  ]);

  return (
    <AppShell>
      <PageHeader
        title="Prospects"
        description="Add MUAs, track outreach, log replies, and keep the validation CRM clean."
        action={<LinkButton href="/api/export/prospects.csv"><Download size={16} /> Export CSV</LinkButton>}
      />
      <section className="panel mb-4 p-4">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Plus size={18} /> Add prospect</h2>
        <ProspectForm campaigns={campaigns} />
      </section>
      <section className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3">MUA</th><th>City</th><th>Category</th><th>Status</th><th>Delay</th><th>Score</th><th>Last message</th><th>Campaign</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {prospects.map((prospect) => (
                <tr key={prospect.id} className="hover:bg-zinc-950/60">
                  <td className="px-4 py-3">
                    <Link href={`/prospects/${prospect.id}`} className="font-medium text-white hover:text-emerald-300">@{prospect.instagramUsername}</Link>
                    <div className="text-xs text-zinc-500">{prospect.artistName || "No artist name"} · {prospect.followersCount?.toLocaleString("en-IN") || "-"} followers</div>
                  </td>
                  <td>{prospect.city || "-"}</td>
                  <td>{prospect.category.replaceAll("_", " ")}</td>
                  <td><Badge>{prospect.status.replaceAll("_", " ")}</Badge></td>
                  <td>{formatDelay(prospect.replyDelayMinutes)}</td>
                  <td><Badge tone={prospect.interestScore >= 80 ? "green" : prospect.interestScore >= 50 ? "blue" : "neutral"}>{prospect.interestScore}</Badge></td>
                  <td>{formatDateTime(prospect.lastMessageAt)}</td>
                  <td>{prospect.campaign?.campaignName || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
