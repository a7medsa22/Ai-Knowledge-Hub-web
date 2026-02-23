import { File, BookOpen, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { NotePreview } from "@/components/dashboard/NotePreview";
import { TaskItem } from "@/components/dashboard/TaskItem";
import { documentsService } from "@/services/documents";
import { notesService } from "@/services/notes";
import { tasksService } from "@/services/tasks";

const Index = () => {
  const { data: documentStats, isLoading: docsLoading } = useQuery({
    queryKey: ["documents", "stats"],
    queryFn: documentsService.getStats,
  });

  const { data: noteStats, isLoading: notesStatsLoading } = useQuery({
    queryKey: ["notes", "stats"],
    queryFn: notesService.getStats,
  });

  const { data: taskStats, isLoading: tasksStatsLoading } = useQuery({
    queryKey: ["tasks", "stats"],
    queryFn: tasksService.getStats,
  });

  const { data: recentNotes, isLoading: recentNotesLoading } = useQuery({
    queryKey: ["notes", "recent", 4],
    queryFn: () => notesService.getRecent(4),
  });

  const { data: upcomingTasks, isLoading: upcomingTasksLoading } = useQuery({
    queryKey: ["tasks", "upcoming"],
    queryFn: tasksService.getUpcoming,
  });

  const loading = docsLoading || notesStatsLoading || tasksStatsLoading || recentNotesLoading || upcomingTasksLoading;

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back to your AI Knowledge Hub</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Documents"
          value={documentStats?.totalDocuments ?? 0}
          borderColor="border-l-4 border-l-indigo-500"
          icon={File}
          loading={loading}
        />
        <StatCard
          title="Notes"
          value={noteStats?.totalNotes ?? 0}
          borderColor="border-l-4 border-l-emerald-500"
          icon={BookOpen}
          loading={loading}
        />
        <StatCard
          title="Tasks"
          value={taskStats?.totalTasks ?? 0}
          borderColor="border-l-4 border-l-amber-500"
          icon={CheckCircle}
          loading={loading}
        />
      </div>

      {/* Recent Notes */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Notes</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <NotePreview key={i} title="" excerpt="" tag="" timestamp="" loading />
              ))
            : (recentNotes ?? []).map((note) => (
                <NotePreview
                  key={note.id}
                  title={note.title}
                  excerpt={note.content}
                  tag={note.tags?.[0] ?? "Note"}
                  timestamp={new Date(note.createdAt).toLocaleDateString()}
                  loading={false}
                />
              ))}
        </div>
      </section>

      {/* Upcoming Tasks */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Tasks</h2>
        <Card>
          <CardContent className="divide-y divide-border p-2">
            {(upcomingTasks ?? []).map((task) => (
              <TaskItem
                key={task.id}
                title={task.title}
                priority={task.priority === "high" ? "High" : task.priority === "medium" ? "Medium" : "Low"}
                dueDate={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
              />
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
