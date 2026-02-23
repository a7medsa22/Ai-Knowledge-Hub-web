import { cn } from "@/lib/utils";

export type Priority = "HIGH" | "MEDIUM" | "LOW" | "URGENT";

const priorityColors: Record<Priority, string> = {
  URGENT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  HIGH: "bg-destructive/10 text-destructive",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  LOW: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export function TaskPriorityBadge({ priority }: { priority: Priority }) {
  const displayLabel = priority.charAt(0) + priority.slice(1).toLowerCase();
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", priorityColors[priority])}>
      {displayLabel}
    </span>
  );
}
