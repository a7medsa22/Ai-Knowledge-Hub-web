import { StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotesEmptyStateProps {
  onCreateNote: () => void;
}

export function NotesEmptyState({ onCreateNote }: NotesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="rounded-full bg-primary/10 p-6 mb-6">
        <StickyNote className="h-12 w-12 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">No notes yet</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Create your first note to capture ideas
      </p>
      <Button
        onClick={onCreateNote}
        className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90"
      >
        Create Note
      </Button>
    </div>
  );
}
