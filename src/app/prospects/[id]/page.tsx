import { notFound } from "next/navigation";
import { Archive, Clock, MessageSquare, Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AnalyzeButton } from "@/components/prospects/AnalyzeButton";
import { ProspectForm } from "@/components/prospects/ProspectForm";
import { Badge, Button, Field, PageHeader, inputClass, textareaClass } from "@/components/ui";
import { addMessage, archiveProspect, markFirstDmSent, markFirstReply, setFollowup, setProspectStatus } from "@/lib/actions";
import { getPrisma } from "@/lib/prisma";
import { formatDateTime, formatDelay } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProspectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prospectId = Number(id);
  const prisma = getPrisma();
  const [prospect, campaigns] = await Promise.all([
    prisma.prospect.findUnique({
      where: { id: prospectId },
      include: {
        campaign: true,
        messages: { orderBy: { sentOrReceivedAt: "asc" } },
        analyses: { orderBy: { createdAt: "desc" } },
        followups: { orderBy: { followupAt: "desc" } },
      },
    }),
    prisma.campaign.findMany({ orderBy: { campaignName: "asc" } }),
  ]);
  if (!prospect) notFound();
  const latest = prospect.analyses[0];

  return (
    <AppShell>
      <PageHeader
        title={`@${prospect.instagramUsername}`}
        description={`${prospect.artistName || "MUA prospect"} · ${prospect.city || "No city"} · ${prospect.category.replaceAll("_", " ")}`}
        action={<Badge tone={prospect.interestScore >= 80 ? "green" : prospect.interestScore >= 50 ? "blue" : "neutral"}>Score {prospect.interestScore}</Badge>}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <section className="panel p-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <div><div className="text-xs text-zinc-500">Status</div><Badge>{prospect.status.replaceAll("_", " ")}</Badge></div>
              <div><div className="text-xs text-zinc-500">First DM</div><div className="text-sm">{formatDateTime(prospect.firstMessageSentAt)}</div></div>
              <div><div className="text-xs text-zinc-500">First reply</div><div className="text-sm">{formatDateTime(prospect.firstReplyAt)}</div></div>
              <div><div className="text-xs text-zinc-500">Reply delay</div><div className="text-sm">{formatDelay(prospect.replyDelayMinutes)}</div></div>
              <div><div className="text-xs text-zinc-500">Last seen</div><div className="text-sm">{formatDateTime(prospect.lastSeenAt)}</div></div>
              <div><div className="text-xs text-zinc-500">Seen no reply</div><div className="text-sm">{prospect.seenWithoutReplyCount} · {prospect.followupAttempts}/3 follow-ups</div></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <form action={markFirstDmSent.bind(null, prospect.id)}><Button><Send size={16} /> Mark DM sent</Button></form>
              <form action={markFirstReply.bind(null, prospect.id)}><Button><Clock size={16} /> Mark replied</Button></form>
              <form action={archiveProspect.bind(null, prospect.id)}><Button className="border-rose-500/40 text-rose-200"><Archive size={16} /> Archive</Button></form>
            </div>
          </section>

          <section className="panel p-4">
            <h2 className="mb-3 text-lg font-semibold">Conversation timeline</h2>
            <div className="space-y-3">
              {prospect.messages.length ? prospect.messages.map((message) => (
                <div key={message.id} className={`rounded-md border p-3 ${message.direction === "received" ? "border-sky-500/20 bg-sky-500/10" : message.direction === "sent" ? "border-emerald-500/20 bg-emerald-500/10" : "border-zinc-800 bg-zinc-950"}`}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-xs text-zinc-500">
                    <span>{message.direction.replaceAll("_", " ")} · {message.channel}</span>
                    <span>{formatDateTime(message.sentOrReceivedAt)}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-zinc-100">{message.messageText}</p>
                </div>
              )) : <p className="text-sm text-zinc-500">No messages yet. Log your manual Instagram outreach here.</p>}
            </div>
          </section>

          <section className="panel p-4">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><MessageSquare size={18} /> Add message</h2>
            <form action={addMessage.bind(null, prospect.id)} className="grid gap-3 sm:grid-cols-3">
              <Field label="Direction">
                <select name="direction" className={inputClass}>
                  <option value="sent">sent</option>
                  <option value="received">received</option>
                  <option value="manual_note">manual note</option>
                </select>
              </Field>
              <Field label="Channel">
                <select name="channel" className={inputClass}>
                  <option value="instagram">instagram</option>
                  <option value="whatsapp">whatsapp</option>
                  <option value="manual_note">manual note</option>
                </select>
              </Field>
              <Field label="Time">
                <input name="sentOrReceivedAt" type="datetime-local" className={inputClass} />
              </Field>
              <div className="sm:col-span-3">
                <Field label="Message text">
                  <textarea name="messageText" required className={textareaClass} placeholder="Paste the exact DM or your manual note." />
                </Field>
              </div>
              <div className="sm:col-span-3"><Button className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400">Save message</Button></div>
            </form>
          </section>

          <section className="panel p-4">
            <h2 className="mb-3 text-lg font-semibold">Edit prospect</h2>
            <ProspectForm campaigns={campaigns} prospect={prospect} />
          </section>
        </div>

        <aside className="space-y-4">
          <section className="panel p-4">
            <h2 className="mb-3 text-lg font-semibold">AI analysis</h2>
            {latest ? (
              <div className="mb-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-zinc-500">Stage</span><span>{latest.stage || "-"}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Mood</span><span>{latest.prospectMood || "-"}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Pain</span><span>{latest.painConfirmed ? "yes" : "no"}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Price/demo</span><span>{latest.askedPrice ? "price" : latest.askedDemo ? "demo" : "-"}</span></div>
                {latest.marketInsight ? <p className="rounded-md border border-zinc-800 bg-zinc-950 p-2 text-zinc-300">{latest.marketInsight}</p> : null}
              </div>
            ) : <p className="mb-4 text-sm text-zinc-500">No analysis yet.</p>}
            <AnalyzeButton prospectId={prospect.id} initialReply={latest?.suggestedReply} />
          </section>

          <section className="panel p-4">
            <h2 className="mb-3 text-lg font-semibold">Status control</h2>
            <form action={setProspectStatus.bind(null, prospect.id)} className="space-y-3">
              <select name="status" defaultValue={prospect.status} className={`${inputClass} w-full`}>
                {["not_contacted", "message_sent", "replied", "pain_discovery", "pain_confirmed", "product_intro_sent", "asked_how_it_works", "asked_price", "demo_requested", "not_interested", "ghosted", "followup_needed", "hot_beta_prospect", "beta_closed"].map((status) => (
                  <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
                ))}
              </select>
              <Button>Update status</Button>
            </form>
          </section>

          <section className="panel p-4">
            <h2 className="mb-3 text-lg font-semibold">Set follow-up</h2>
            <form action={setFollowup.bind(null, prospect.id)} className="space-y-3">
              <Field label="When"><input name="followupAt" type="datetime-local" required className={inputClass} /></Field>
              <Field label="Reason"><input name="followupReason" className={inputClass} placeholder="Warm conversation paused" /></Field>
              <Field label="Suggested message"><textarea name="suggestedMessage" className={textareaClass} placeholder="Hey, just wanted to ask..." /></Field>
              <Button>Save follow-up</Button>
            </form>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
