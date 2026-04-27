"use client";

import { useState, useTransition } from "react";
import { Bot, Copy } from "lucide-react";
import { Button } from "@/components/ui";

export function AnalyzeButton({ prospectId, initialReply }: { prospectId: number; initialReply?: string | null }) {
  const [reply, setReply] = useState(initialReply || "");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function analyze() {
    setMessage("");
    startTransition(async () => {
      const res = await fetch(`/api/prospects/${prospectId}/analyze`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setMessage(data.error || "AI analysis failed.");
        return;
      }
      setReply(data.analysis?.suggested_reply || data.analysis?.suggestedReply || "");
      setMessage("Analysis saved. Review the suggested reply before sending manually.");
    });
  }

  async function copyReply() {
    if (!reply) return;
    await navigator.clipboard.writeText(reply);
    setMessage("Suggested reply copied.");
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={analyze} disabled={isPending}><Bot size={16} /> {isPending ? "Analyzing..." : "Analyze conversation"}</Button>
        <Button type="button" onClick={copyReply} disabled={!reply}><Copy size={16} /> Copy reply</Button>
      </div>
      {reply ? <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">{reply}</div> : null}
      {message ? <p className="text-sm text-zinc-400">{message}</p> : null}
    </div>
  );
}
