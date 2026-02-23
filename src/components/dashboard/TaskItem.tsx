import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  title: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
}

const priorityColors = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export function TaskItem({ title, priority, dueDate }: TaskItemProps) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/50 transition-colors">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => setChecked(v === true)}
        className="transition-all duration-200"
      />
      <span className={cn("flex-1 text-sm", checked && "line-through text-muted-foreground")}>{title}</span>
      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", priorityColors[priority])}>
        {priority}
      </span>
      <span className="text-xs text-muted-foreground">{dueDate}</span>
    </div>
  );
}
