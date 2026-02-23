import { TaskItemFull, type TaskItemFullProps } from "./TaskItemFull";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface TaskListProps {
  title: string;
  tasks: TaskItemFullProps[];
  onToggle: (id: string) => void;
  defaultOpen?: boolean;
}

export function TaskList({ title, tasks, onToggle, defaultOpen = true }: TaskListProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (tasks.length === 0) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full text-left py-2 group">
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "" : "-rotate-90"}`} />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">({tasks.length})</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0.5 mt-1">
        {tasks.map((task) => (
          <TaskItemFull key={task.id} {...task} onToggle={onToggle} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
