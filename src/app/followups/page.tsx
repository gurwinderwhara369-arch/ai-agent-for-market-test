import Link from "next/link";
import { Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge, Button, PageHeader } from "@/components/ui";
import { completeFollowup } from "@/lib/actions";
import { getPrisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function FollowupsPage() {
  const followups = await getPrisma().followup.findMany({ include: { prospect: true }, orderBy: [{ status: "desc" }, { followupAt: "asc" }] });
  return (
    <AppShell>
      <PageHeader title="Follow-ups" description="Manual reminders for warm conversations, demo requests, and silent leads." />
      <section className="panel overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950 text-xs uppercase text-zinc-500">
            <tr><th className="px-4 py-3">Prospect</th><th>Due</th><th>Reason</th><th>Suggested message</th><th>Status</th><th></th></tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {followups.map((followup) => (
              <tr key={followup.id}>
                <td className="px-4 py-3"><Link href={`/prospects/${followup.prospectId}`} className="font-medium hover:text-emerald-300">@{followup.prospect.instagramUsername}</Link></td>
                <td>{formatDateTime(followup.followupAt)}</td>
                <td>{followup.followupReason || "-"}</td>
                <td className="max-w-md text-zinc-400">{followup.suggestedMessage || "-"}</td>
                <td><Badge tone={followup.status === "pending" ? "yellow" : "green"}>{followup.status}</Badge></td>
                <td>{followup.status === "pending" ? <form action={completeFollowup.bind(null, followup.id)}><Button><Check size={16} /> Done</Button></form> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
