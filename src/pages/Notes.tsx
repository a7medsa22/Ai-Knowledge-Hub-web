import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { NoteCard } from "@/components/notes/NoteCard";
import { NotesEmptyState } from "@/components/notes/NotesEmptyState";
import { NotesFab } from "@/components/notes/NotesFab";
import { notesService } from "@/services/notes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Notes = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [content, setContent] = useState("");
  
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setIsCreateOpen(true);
      // Clean up the URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("create");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: notesService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: notesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsCreateOpen(false);
      setContent("");
      toast.success("Note created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create note");
    },
  });

  const handleCreateNote = () => {
    if (!content.trim()) {
      toast.error("Please fill in the content");
      return;
    }
    createMutation.mutate({ content });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Notes</h1>
        <p className="text-muted-foreground mt-1">Your quick thoughts and ideas</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <NoteCard key={i} id="" title="" excerpt="" tag="" timestamp="" loading />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <NotesEmptyState onCreateNote={() => setIsCreateOpen(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              title={note.content.split('\n')[0].slice(0, 40) || "Untitled Note"}
              excerpt={note.content}
              tag={note.tags?.[0] ?? "Note"}
              timestamp={new Date(note.createdAt).toLocaleDateString()}
            />
          ))}
        </div>
      )}

      <NotesFab onClick={() => setIsCreateOpen(true)} />

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">New Note</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="content" className="text-sm font-medium">Content</Label>
              <Textarea
                id="content"
                placeholder="What's on your mind?"
                className="min-h-[250px] rounded-xl bg-muted/50 border-border resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateNote} 
              disabled={createMutation.isPending}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90"
            >
              {createMutation.isPending ? "Creating..." : "Create Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notes;
