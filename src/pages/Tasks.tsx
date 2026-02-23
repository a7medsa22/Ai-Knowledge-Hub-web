import { useState, useEffect } from "react";
import { Plus, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskList } from "@/components/tasks/TaskList";
import type { TaskItemFullProps } from "@/components/tasks/TaskItemFull";

const initialTasks: TaskItemFullProps[] = [
  { id: "1", title: "Review RAG pipeline architecture doc", description: "Check the latest design decisions and provide feedback", priority: "High", dueDate: "Today", completed: false },
  { id: "2", title: "Write summary of transformer paper", description: "Focus on attention mechanism innovations", priority: "Medium", dueDate: "Today", completed: false },
  { id: "3", title: "Update prompt templates library", description: "Add new chain-of-thought templates", priority: "Low", dueDate: "Tomorrow", completed: false },
  { id: "4", title: "Test new embedding model", description: "Benchmark against current production model", priority: "High", dueDate: "Feb 15", completed: false },
  { id: "5", title: "Organize AI tools bookmarks", description: "Categorize and remove dead links", priority: "Low", dueDate: "Feb 18", completed: false },
  { id: "6", title: "Prepare dataset for fine-tuning", description: "Clean and format 500 training examples", priority: "Medium", dueDate: "Feb 20", completed: false },
  { id: "7", title: "Draft API documentation", description: "Document all public endpoints", priority: "High", dueDate: "Feb 22", completed: false },
];

const Tasks = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const filtered = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "today") return t.dueDate === "Today";
    if (filter === "upcoming") return !t.completed && t.dueDate !== "Today";
    return true;
  });

  const todayTasks = filtered.filter((t) => t.dueDate === "Today");
  const upcomingTasks = filtered.filter((t) => t.dueDate !== "Today" && !t.completed);
  const completedTasks = filtered.filter((t) => t.completed);

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Your upcoming and completed tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-36 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90">
            <Plus className="h-4 w-4 mr-1" /> New Task
          </Button>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="h-4 w-4 rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <div className="rounded-full bg-primary/10 p-6 mb-6">
            <ListChecks className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No tasks found</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">Create your first task to stay organized</p>
          <Button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90">
            Create Task
          </Button>
        </div>
      ) : (
        <Card>
          <CardContent className="p-4 space-y-4">
            <TaskList title="Today" tasks={todayTasks} onToggle={handleToggle} />
            <TaskList title="Upcoming" tasks={upcomingTasks} onToggle={handleToggle} />
            <TaskList title="Completed" tasks={completedTasks} onToggle={handleToggle} defaultOpen={false} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Tasks;
