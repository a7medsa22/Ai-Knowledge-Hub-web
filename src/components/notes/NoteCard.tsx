import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface NoteCardProps {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  timestamp: string;
  loading?: boolean;
}

export function NoteCard({ title, excerpt, tag, timestamp, loading }: NoteCardProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 hover:scale-[1.02] hover:shadow-md transition-all duration-200 cursor-pointer">
      <h3 className="text-lg font-semibold mb-1 truncate">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{excerpt}</p>
      <div className="flex items-center justify-between">
        <span className="inline-block rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          {tag}
        </span>
        <span className="text-xs text-muted-foreground">{timestamp}</span>
      </div>
    </div>
  );
}
