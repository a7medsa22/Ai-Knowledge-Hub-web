import { Skeleton } from "@/components/ui/skeleton";

interface NotePreviewProps {
  title: string;
  excerpt: string;
  tag: string;
  timestamp: string;
  loading?: boolean;
}

export function NotePreview({ title, excerpt, tag, timestamp, loading }: NotePreviewProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 hover:shadow-lg transition-all duration-200">
      <h3 className="font-semibold mb-1 truncate">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{excerpt}</p>
      <div className="flex items-center justify-between">
        <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {tag}
        </span>
        <span className="text-xs text-muted-foreground">{timestamp}</span>
      </div>
    </div>
  );
}
