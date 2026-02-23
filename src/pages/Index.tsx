import { useState, useEffect } from "react";
import { File, BookOpen, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { NotePreview } from "@/components/dashboard/NotePreview";
import { TaskItem } from "@/components/dashboard/TaskItem";

const mockNotes = [
  { title: "Transformer Architecture Notes", excerpt: "Key insights about attention mechanisms and their role in modern NLP models.", tag: "AI Research", timestamp: "2h ago" },
  { title: "GPT-4 Capabilities", excerpt: "Comparing GPT-4's performance across reasoning, coding, and creative tasks.", tag: "LLMs", timestamp: "5h ago" },
  { title: "RAG Pipeline Design", excerpt: "Steps to build a retrieval-augmented generation pipeline with vector databases.", tag: "Engineering", timestamp: "1d ago" },
  { title: "Prompt Engineering Tips", excerpt: "Best practices for crafting effective prompts for different use cases.", tag: "Prompts", timestamp: "2d ago" },
];

const mockTasks = [
  { title: "Review RAG pipeline architecture doc", priority: "High" as const, dueDate: "Today" },
  { title: "Write summary of transformer paper", priority: "Medium" as const, dueDate: "Tomorrow" },
  { title: "Update prompt templates library", priority: "Low" as const, dueDate: "Feb 14" },
  { title: "Test new embedding model", priority: "High" as const, dueDate: "Feb 15" },
  { title: "Organize AI tools bookmarks", priority: "Low" as const, dueDate: "Feb 18" },
];

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back to your AI Knowledge Hub</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Documents" value={42} borderColor="border-l-4 border-l-indigo-500" icon={File} loading={loading} />
        <StatCard title="Notes" value={28} borderColor="border-l-4 border-l-emerald-500" icon={BookOpen} loading={loading} />
        <StatCard title="Tasks" value={12} borderColor="border-l-4 border-l-amber-500" icon={CheckCircle} loading={loading} />
      </div>

      {/* Recent Notes */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Notes</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <NotePreview key={i} title="" excerpt="" tag="" timestamp="" loading />
              ))
            : mockNotes.map((note) => (
                <NotePreview key={note.title} {...note} />
              ))}
        </div>
      </section>

      {/* Upcoming Tasks */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Tasks</h2>
        <Card>
          <CardContent className="divide-y divide-border p-2">
            {mockTasks.map((task) => (
              <TaskItem key={task.title} {...task} />
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
