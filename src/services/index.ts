// Export all services from one place

export * from './auth';
export * from './users';
export * from './documents';
export * from './notes';
export * from './tasks';
export * from './ai';
export * from './mcp';
export * from './files';

// Default exports for easy import
import * as authService from './auth';
import * as usersService from './users';
import * as documentsService from './documents';
import * as notesService from './notes';
import * as tasksService from './tasks';
import * as aiService from './ai';
import * as mcpService from './mcp';
import * as filesService from './files';

export default {
  auth: authService,
  users: usersService,
  documents: documentsService,
  notes: notesService,
  tasks: tasksService,
  ai: aiService,
  mcp: mcpService,
  files: filesService,
};