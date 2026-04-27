import type { Campaign, Prospect } from "@prisma/client";
import { createProspect, updateProspect } from "@/lib/actions";
import { Field, Button, inputClass, textareaClass } from "@/components/ui";

export function ProspectForm({ campaigns, prospect }: { campaigns: Campaign[]; prospect?: Prospect }) {
  const action = prospect ? updateProspect.bind(null, prospect.id) : createProspect;
  return (
    <form action={action} className="grid gap-3 md:grid-cols-3">
      <Field label="Instagram username">
        <input name="instagramUsername" required defaultValue={prospect?.instagramUsername} className={inputClass} placeholder="glambyxyz" />
      </Field>
      <Field label="Artist name">
        <input name="artistName" defaultValue={prospect?.artistName || ""} className={inputClass} placeholder="Glam by XYZ" />
      </Field>
      <Field label="City">
        <input name="city" defaultValue={prospect?.city || ""} className={inputClass} placeholder="Delhi" />
      </Field>
      <Field label="State">
        <input name="state" defaultValue={prospect?.state || ""} className={inputClass} placeholder="Delhi" />
      </Field>
      <Field label="Followers">
        <input name="followersCount" defaultValue={prospect?.followersCount || ""} className={inputClass} inputMode="numeric" />
      </Field>
      <Field label="Category">
        <select name="category" defaultValue={prospect?.category || "unknown"} className={inputClass}>
          {["bridal_mua", "party_mua", "freelance_mua", "makeup_studio", "beauty_salon", "makeup_academy", "unknown"].map((value) => (
            <option key={value} value={value}>{value.replaceAll("_", " ")}</option>
          ))}
        </select>
      </Field>
      <Field label="Profile URL">
        <input name="profileUrl" defaultValue={prospect?.profileUrl || ""} className={inputClass} placeholder="https://instagram.com/..." />
      </Field>
      <Field label="Campaign">
        <select name="campaignId" defaultValue={prospect?.campaignId || ""} className={inputClass}>
          <option value="">No campaign</option>
          {campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.campaignName}</option>)}
        </select>
      </Field>
      <Field label="Source">
        <input name="source" defaultValue={prospect?.source || ""} className={inputClass} placeholder="Instagram search" />
      </Field>
      <div className="md:col-span-3">
        <Field label="Bio / notes">
          <textarea name="bioText" defaultValue={prospect?.bioText || ""} className={textareaClass} placeholder="DM for bookings, bridal specialist..." />
        </Field>
      </div>
      <div className="md:col-span-3">
        <Field label="Internal notes">
          <textarea name="notes" defaultValue={prospect?.notes || ""} className={textareaClass} placeholder="Why this prospect matters, observed niche, pricing clues..." />
        </Field>
      </div>
      <div className="md:col-span-3">
        <Button className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400">{prospect ? "Save prospect" : "Create prospect"}</Button>
      </div>
    </form>
  );
}
