import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Plus, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskList } from "@/components/tasks/TaskList";
import type { TaskItemFullProps } from "@/components/tasks/TaskItemFull";
import { tasksService, type Task, type TaskPriority } from "@/services/tasks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Tasks = () => {
  const [filter, setFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>("MEDIUM");
  
  const todayDate = new Date().toISOString().split('T')[0];
  const [dueDate, setDueDate] = useState(todayDate);

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

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => tasksService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: tasksService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsCreateOpen(false);
      resetForm();
      toast.success("Task created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create task");
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setDueDate(todayDate);
  };

  const handleCreateTask = () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    createMutation.mutate({
      title,
      description,
      priority,
      dueDate: dueDate || undefined,
    });
  };

  const toggleMutation = useMutation({
    mutationFn: (task: Task) => {
      const nextStatus = task.status === "DONE" ? "TODO" : "DONE";
      return tasksService.updateStatus(task.id, nextStatus as any);
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
    priority: task.priority,
    dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date",
    completed: task.status === "DONE",
  }));

  const today = new Date().toDateString();

  const filtered = mappedTasks.filter((t) => {
    if (filter === "completed") return t.completed;
    
    // For other filters, only show non-completed tasks
    if (t.completed) return false;
    
    const taskDate = t.dueDate !== "No date" ? new Date(t.dueDate).toDateString() : null;
    
    if (filter === "today") return taskDate === today;
    if (filter === "upcoming") return taskDate !== null && taskDate !== today;
    return true;
  });

  const todayTasks = filtered.filter((t) => 
    t.dueDate !== "No date" && new Date(t.dueDate).toDateString() === today
  );
  const upcomingTasks = filtered.filter((t) => 
    !t.completed && t.dueDate !== "No date" && new Date(t.dueDate).toDateString() !== today
  );
  const completedTasks = mappedTasks.filter((t) => t.completed);

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
          <Button onClick={() => setIsCreateOpen(true)} className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90">
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
          <Button onClick={() => setIsCreateOpen(true)} className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90">
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

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-medium">Title</Label>
              <Input
                id="title"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl bg-muted/50 border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add some details..."
                className="min-h-[100px] rounded-xl bg-muted/50 border-border resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                <Select value={priority} onValueChange={(v: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT') => setPriority(v)}>
                  <SelectTrigger id="priority" className="rounded-xl bg-muted/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate" className="text-sm font-medium">Due Date (Optional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-xl bg-muted/50 border-border"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTask} 
              disabled={createMutation.isPending}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90"
            >
              {createMutation.isPending ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
