import { cn } from "@/lib/utils";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-white">{title}</h1>
        {description ? <p className="mt-1 max-w-3xl text-sm text-zinc-400">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm font-medium text-zinc-100 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    />
  );
}

export function LinkButton({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm font-medium text-zinc-100 hover:bg-zinc-800",
        className,
      )}
    />
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm text-zinc-300">
      <span>{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-500/80";

export const textareaClass =
  "min-h-24 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-500/80";

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "green" | "blue" | "yellow" | "red" }) {
  const tones = {
    neutral: "border-zinc-700 bg-zinc-900 text-zinc-300",
    green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    blue: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    yellow: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    red: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  };
  return <span className={cn("inline-flex rounded-md border px-2 py-1 text-xs font-medium", tones[tone])}>{children}</span>;
}

export function StatCard({ label, value, detail }: { label: string; value: React.ReactNode; detail?: string }) {
  return (
    <div className="metric-card p-4">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
      {detail ? <div className="mt-1 text-xs text-zinc-500">{detail}</div> : null}
    </div>
  );
}
