import { useQuery } from "@tanstack/react-query";
import { NoteCard } from "@/components/notes/NoteCard";
import { NotesEmptyState } from "@/components/notes/NotesEmptyState";
import { NotesFab } from "@/components/notes/NotesFab";
import { notesService } from "@/services/notes";

const Notes = () => {
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: notesService.getAll,
  });

  const handleCreateNote = () => {
    // TODO: integrate note creation flow
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
        <NotesEmptyState onCreateNote={handleCreateNote} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              title={note.title}
              excerpt={note.content}
              tag={note.tags?.[0] ?? "Note"}
              timestamp={new Date(note.createdAt).toLocaleDateString()}
            />
          ))}
        </div>
      )}

      <NotesFab onClick={handleCreateNote} />
    </div>
  );
};

export default Notes;
