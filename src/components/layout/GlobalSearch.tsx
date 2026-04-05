import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { File, BookOpen, CheckCircle } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { documentsService } from "@/services/documents";
import { notesService } from "@/services/notes";
import { tasksService } from "@/services/tasks";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const navigate = useNavigate();

  // Fetch all data
  const { data: documents = [] } = useQuery({
    queryKey: ["documents"],
    queryFn: () => documentsService.getAll(),
  });

  const { data: notes = [] } = useQuery({
    queryKey: ["notes"],
    queryFn: () => notesService.getAll(),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => tasksService.getAll(),
  });

  // Toggle dialog with Cmd/Ctrl + K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {documents.length > 0 && (
          <CommandGroup heading="Knowledge Base (Documents)">
            {documents.map((doc) => (
              <CommandItem
                key={doc.id}
                value={`document ${doc.title}`}
                onSelect={() => runCommand(() => navigate(`/documents/${doc.id}`))}
              >
                <File className="mr-2 h-4 w-4" />
                <span>{doc.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {notes.length > 0 && (
          <CommandGroup heading="Notes">
            {notes.map((note) => {
              const noteTitle = note.title || (note.content ? note.content.split('\n')[0].slice(0, 40) : "Untitled Note");
              return (
                <CommandItem
                  key={note.id}
                  value={`note ${noteTitle}`}
                  onSelect={() => runCommand(() => navigate(`/notes`))}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>{noteTitle}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {tasks.length > 0 && (
          <CommandGroup heading="Tasks">
            {tasks.map((task) => (
              <CommandItem
                key={task.id}
                value={`task ${task.title}`}
                onSelect={() => runCommand(() => navigate(`/tasks`))}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                <span>{task.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
