import { MobileNav, Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950/20 via-zinc-950 to-zinc-950">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto p-4 pb-24 lg:p-8 lg:pb-8">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
