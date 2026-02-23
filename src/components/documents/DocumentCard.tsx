import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const tagColors = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
];

interface DocumentCardProps {
  title: string;
  excerpt: string;
  size: string;
  date: string;
  tags: string[];
  loading?: boolean;
}

export function DocumentCard({ title, excerpt, size, date, tags, loading }: DocumentCardProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-pointer">
      <h3 className="font-semibold mb-1 truncate">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{excerpt}</p>
      <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
        <span>{size}</span>
        <span>·</span>
        <span>{date}</span>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {tags.slice(0, 2).map((tag, i) => (
          <span key={tag} className={cn("rounded-full px-2 py-0.5 text-xs font-medium", tagColors[i % tagColors.length])}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
