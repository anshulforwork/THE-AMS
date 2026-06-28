import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  accent?: string;
}

export function KpiCard({ title, value, subtitle, icon: Icon, trend, accent = "from-violet-600 to-fuchsia-600" }: KpiCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-zinc-400">{title}</p>
            <p className="mt-1 text-2xl font-bold text-white">{value}</p>
            {subtitle && <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>}
            {trend && <p className="mt-2 text-xs text-emerald-400">{trend}</p>}
          </div>
          <div className={`rounded-xl bg-gradient-to-br ${accent} p-2.5`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function KpiCurrency({ title, amount, icon, accent }: { title: string; amount: number; icon: LucideIcon; accent?: string }) {
  return <KpiCard title={title} value={formatCurrency(amount)} icon={icon} accent={accent} />;
}
