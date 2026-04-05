import { File, BookOpen, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { NotePreview } from "@/components/dashboard/NotePreview";
import { TaskItem } from "@/components/dashboard/TaskItem";
import { documentsService } from "@/services/documents";
import { notesService } from "@/services/notes";
import { tasksService } from "@/services/tasks";
import { SystemStatus } from "@/components/dashboard/SystemStatus";

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
        <Link to="/documents" className="block outline-none focus:ring-2 focus:ring-primary rounded-2xl">
          <StatCard
            title="Documents"
            value={documentStats?.totalDocuments ?? 0}
            borderColor="border-l-4 border-l-indigo-500"
            icon={File}
            loading={loading}
          />
        </Link>
        <Link to="/notes" className="block outline-none focus:ring-2 focus:ring-primary rounded-2xl">
          <StatCard
            title="Notes"
            value={noteStats?.totalNotes ?? 0}
            borderColor="border-l-4 border-l-emerald-500"
            icon={BookOpen}
            loading={loading}
          />
        </Link>
        <Link to="/tasks" className="block outline-none focus:ring-2 focus:ring-primary rounded-2xl">
          <StatCard
            title="Tasks"
            value={taskStats?.totalTasks ?? 0}
            borderColor="border-l-4 border-l-amber-500"
            icon={CheckCircle}
            loading={loading}
          />
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Notes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Recent Notes</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <NotePreview key={i} title="" excerpt="" tag="" timestamp="" loading />
                  ))
                : (recentNotes ?? []).map((note) => (
                    <Link to="/notes" key={note.id} className="block outline-none focus:ring-2 focus:ring-primary rounded-2xl">
                      <NotePreview
                        title={note.title}
                        excerpt={note.content}
                        tag={note.tags?.[0] ?? "Note"}
                        timestamp={new Date(note.createdAt).toLocaleDateString()}
                        loading={false}
                      />
                    </Link>
                  ))}
            </div>
          </section>

          {/* Upcoming Tasks */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Upcoming Tasks</h2>
            <Card className="rounded-2xl border-border bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden">
              <CardContent className="divide-y divide-border/50 p-2">
                {(upcomingTasks ?? []).length === 0 ? (
                   <div className="py-8 text-center text-muted-foreground text-sm">No upcoming tasks</div>
                ) : (upcomingTasks ?? []).map((task) => (
                  <Link to="/tasks" key={task.id} className="block outline-none focus:ring-2 focus:ring-primary">
                    <TaskItem
                      title={task.title}
                      priority={task.priority === "HIGH" ? "High" : task.priority === "MEDIUM" ? "Medium" : "Low"}
                      dueDate={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
                    />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="space-y-8">
          <SystemStatus />
          
          <Card className="rounded-2xl border-border bg-gradient-to-br from-indigo-500/10 to-violet-500/10 backdrop-blur-sm shadow-sm">
            <CardHeader tabIndex={0}>
              <CardTitle className="text-sm font-bold">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Use the <span className="text-primary font-bold">AI Tools</span> to summarize documents or extract key points instantly. You can also upload files directly in the <span className="text-primary font-bold">Library</span> section.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
