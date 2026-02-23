import { cn } from "@/lib/utils";
import { Brain } from "lucide-react";

interface AiResultCardProps {
  title: string;
  content: string;
  visible: boolean;
}

export function AiResultCard({ title, content, visible }: AiResultCardProps) {
  if (!visible) return null;

  return (
    <div className="rounded-2xl border-l-4 border-l-indigo-500 bg-primary/5 p-5 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">{title}</h3>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">AI</span>
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{content}</div>
    </div>
  );
}
