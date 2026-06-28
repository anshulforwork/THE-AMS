"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookMarked, BookOpen, CalendarCheck, CheckCircle2, Flame, Goal, GraduationCap,
  History, Home, Network, Settings, Target, TrendingUp, Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/check-in", label: "Check-in", icon: CalendarCheck },
  { href: "/habits", label: "Habits", icon: CheckCircle2 },
  { href: "/streaks", label: "Streaks", icon: Flame },
  { href: "/history", label: "History", icon: History },
  { href: "/goals", label: "Goals", icon: Goal },
  { href: "/finance", label: "Finance", icon: Wallet },
  { href: "/learning", label: "Learning", icon: GraduationCap },
  { href: "/skills", label: "Skills", icon: TrendingUp },
  { href: "/planning", label: "Planning", icon: Target },
  { href: "/network", label: "Network", icon: Network },
  { href: "/journal", label: "Journal", icon: BookMarked },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-white/10 lg:bg-black/20">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <img
            src="/profile.png"
            alt="Profile"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-violet-500/40"
          />
          <div>
            <p className="font-semibold text-white">Anshul Sahu</p>
            <p className="text-xs text-zinc-500">Self Improvement</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-violet-600/20 text-violet-300"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const mobileItems = navItems.slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-zinc-950/95 backdrop-blur-lg lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {mobileItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px]",
                active ? "text-violet-400" : "text-zinc-500"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
