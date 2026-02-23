import { cn } from "@/lib/utils";

export type Priority = "High" | "Medium" | "Low";

const priorityColors: Record<Priority, string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export function TaskPriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", priorityColors[priority])}>
      {priority}
    </span>
  );
}
