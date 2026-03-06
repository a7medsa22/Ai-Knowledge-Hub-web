import { useState } from "react";
import { GripVertical, Edit2, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskPriorityBadge, type Priority } from "./TaskPriorityBadge";
import { cn } from "@/lib/utils";

export interface TaskItemFullProps {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  completed?: boolean;
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskItemFull({ id, title, description, priority, dueDate, completed = false, onToggle, onEdit, onDelete }: TaskItemFullProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-muted/50 transition-colors group",
      completed && "opacity-70"
    )}>
      <Checkbox
        checked={completed}
        onCheckedChange={() => onToggle?.(id)}
        className="transition-all duration-200"
      />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", completed && "line-through text-muted-foreground")}>{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
      <TaskPriorityBadge priority={priority} />
      <span className="text-xs text-muted-foreground whitespace-nowrap bg-muted/50 px-2 py-1 rounded-lg">{dueDate}</span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit?.(id); }}
          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-primary transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete?.(id); }}
          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab shrink-0" />
    </div>
  );
}
