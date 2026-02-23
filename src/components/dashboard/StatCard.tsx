import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: number;
  borderColor: string;
  icon: LucideIcon;
  loading?: boolean;
}

export function StatCard({ title, value, borderColor, icon: Icon, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 shadow-md">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-8 w-16" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 shadow-md hover:shadow-lg transition-all duration-200",
        borderColor
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
