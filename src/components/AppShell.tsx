import Link from "next/link";
import { BarChart3, CalendarClock, FileText, Megaphone, Sparkles, Users } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/prospects", label: "Prospects", icon: Users },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/followups", label: "Follow-ups", icon: CalendarClock },
  { href: "/reports", label: "Reports", icon: FileText },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-zinc-800 bg-zinc-950/95 px-4 py-5 lg:block">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-emerald-500/12 text-emerald-300">
            <Sparkles size={21} />
          </span>
          <span>
            <span className="block text-sm font-semibold">MyMUA Market Checker</span>
            <span className="text-xs text-zinc-500">7-day validation cockpit</span>
          </span>
        </Link>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 rounded-md border border-zinc-800 bg-zinc-900/60 p-3 text-xs text-zinc-400">
          Manual Instagram workflow only. Meta-ready fields are present for a future bridge.
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/85 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="font-semibold">MyMUA Checker</Link>
            <div className="flex gap-2">
              {nav.slice(0, 4).map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="rounded-md border border-zinc-800 p-2 text-zinc-300">
                    <Icon size={16} />
                  </Link>
                );
              })}
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
