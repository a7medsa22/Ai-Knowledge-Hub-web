// =============================================================
// Re-export all services from the centralized barrel file.
// Kept for backward compatibility — prefer importing from @/services directly.
// =============================================================

export {
  documentsService,
  notesService,
  tasksService,
  authService,
  aiService,
  type Document,
  type Note,
  type Task,
  type User,
} from "@/services";
