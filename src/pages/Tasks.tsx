import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskList } from "@/components/tasks/TaskList";
import type { TaskItemFullProps } from "@/components/tasks/TaskItemFull";
import { tasksService, type Task } from "@/services/tasks";

const Tasks = () => {
  const [filter, setFilter] = useState("all");

  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => tasksService.getAll(),
  });

  const toggleMutation = useMutation({
    mutationFn: (task: Task) => {
      const nextStatus = task.status === "done" ? "todo" : "done";
      return tasksService.updateStatus(task.id, nextStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleToggle = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    toggleMutation.mutate(task);
  };

  const mappedTasks: TaskItemFullProps[] = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description ?? "",
    priority: task.priority === "high" ? "High" : task.priority === "medium" ? "Medium" : "Low",
    dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date",
    completed: task.status === "done",
  }));

  const today = new Date().toDateString();

  const filtered = mappedTasks.filter((t) => {
    const dueDateString = t.dueDate && t.dueDate !== "No date" ? new Date(t.dueDate).toDateString() : "";
    if (filter === "completed") return t.completed;
    if (filter === "today") return !t.completed && dueDateString === today;
    if (filter === "upcoming") return !t.completed && dueDateString !== "" && dueDateString !== today;
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

      {isLoading ? (
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
