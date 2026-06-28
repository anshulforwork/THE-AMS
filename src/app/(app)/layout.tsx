import { MobileNav, Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950/20 via-zinc-950 to-zinc-950">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-white/10 bg-black/20 px-4 py-3 lg:hidden">
          <img
            src="/profile.png"
            alt="Profile"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-violet-500/40"
          />
          <div>
            <p className="text-sm font-semibold text-white">Anshul Sahu</p>
            <p className="text-[11px] text-zinc-500">Self Improvement</p>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 pb-24 lg:p-8 lg:pb-8">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
