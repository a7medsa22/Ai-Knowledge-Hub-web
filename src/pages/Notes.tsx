import { useState, useEffect } from "react";
import { NoteCard } from "@/components/notes/NoteCard";
import { NotesEmptyState } from "@/components/notes/NotesEmptyState";
import { NotesFab } from "@/components/notes/NotesFab";

const mockNotes = [
  { id: "1", title: "Transformer Architecture Notes", excerpt: "Key insights about attention mechanisms and their role in modern NLP models. Self-attention allows the model to weigh different parts of the input.", tag: "AI Research", timestamp: "2h ago" },
  { id: "2", title: "GPT-4 Capabilities", excerpt: "Comparing GPT-4's performance across reasoning, coding, and creative tasks. Notable improvements in multi-step reasoning.", tag: "LLMs", timestamp: "5h ago" },
  { id: "3", title: "RAG Pipeline Design", excerpt: "Steps to build a retrieval-augmented generation pipeline with vector databases. Key considerations for chunking strategies.", tag: "Engineering", timestamp: "1d ago" },
  { id: "4", title: "Prompt Engineering Tips", excerpt: "Best practices for crafting effective prompts for different use cases. Chain-of-thought prompting yields better results.", tag: "Prompts", timestamp: "2d ago" },
  { id: "5", title: "Fine-tuning Best Practices", excerpt: "Guidelines for fine-tuning models on custom datasets. Data quality matters more than quantity.", tag: "Training", timestamp: "3d ago" },
  { id: "6", title: "Vector Database Comparison", excerpt: "Comparing Pinecone, Weaviate, and Chroma for production use cases. Performance benchmarks and pricing analysis.", tag: "Infrastructure", timestamp: "4d ago" },
];

const Notes = () => {
  const [loading, setLoading] = useState(true);
  const [notes] = useState(mockNotes);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateNote = () => {
    // Placeholder for future note creation
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Notes</h1>
        <p className="text-muted-foreground mt-1">Your quick thoughts and ideas</p>
      </div>

      {loading ? (
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
            <NoteCard key={note.id} {...note} />
          ))}
        </div>
      )}

      <NotesFab onClick={handleCreateNote} />
    </div>
  );
};

export default Notes;
