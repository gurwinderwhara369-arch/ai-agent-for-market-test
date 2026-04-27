import { Megaphone } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button, Field, PageHeader, inputClass, textareaClass } from "@/components/ui";
import { createCampaign } from "@/lib/actions";
import { getPrisma } from "@/lib/prisma";
import { percent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const campaigns = await getPrisma().campaign.findMany({ include: { prospects: true }, orderBy: { createdAt: "desc" } });
  return (
    <AppShell>
      <PageHeader title="Campaigns" description="Compare opener variants and positioning angles before changing the product." />
      <section className="panel mb-4 p-4">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Megaphone size={18} /> New campaign</h2>
        <form action={createCampaign} className="grid gap-3 md:grid-cols-3">
          <Field label="Campaign name"><input name="campaignName" required className={inputClass} /></Field>
          <Field label="Positioning angle"><input name="positioningAngle" className={inputClass} placeholder="DM workload" /></Field>
          <Field label="Beta price"><input name="betaPrice" className={inputClass} defaultValue="499" inputMode="numeric" /></Field>
          <Field label="Target city"><input name="targetCity" className={inputClass} /></Field>
          <Field label="Target category"><input name="targetCategory" className={inputClass} placeholder="bridal_mua" /></Field>
          <div className="md:col-span-3"><Field label="Opening message"><textarea name="openingMessage" className={textareaClass} /></Field></div>
          <div className="md:col-span-3"><Field label="Notes"><textarea name="notes" className={textareaClass} /></Field></div>
          <div className="md:col-span-3"><Button className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400">Create campaign</Button></div>
        </form>
      </section>
      <section className="panel overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950 text-xs uppercase text-zinc-500">
            <tr><th className="px-4 py-3">Campaign</th><th>Contacted</th><th>Replies</th><th>Reply rate</th><th>Pain</th><th>Price/demo</th><th>Beta closed</th></tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {campaigns.map((campaign) => {
              const contacted = campaign.prospects.filter((p) => p.firstMessageSentAt).length;
              const replied = campaign.prospects.filter((p) => p.firstReplyAt).length;
              const pain = campaign.prospects.filter((p) => p.status === "pain_confirmed").length;
              const priceDemo = campaign.prospects.filter((p) => ["asked_how_it_works", "asked_price", "demo_requested", "hot_beta_prospect", "beta_closed"].includes(p.status)).length;
              const beta = campaign.prospects.filter((p) => p.status === "beta_closed").length;
              return (
                <tr key={campaign.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{campaign.campaignName}</div>
                    <div className="text-xs text-zinc-500">{campaign.openingMessage || "No opener"}</div>
                  </td>
                  <td>{contacted}</td><td>{replied}</td><td>{percent(replied, contacted)}%</td><td>{pain}</td><td>{priceDemo}</td><td>{beta}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
