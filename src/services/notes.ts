import api from '@/lib/axios';

// ==================== Types ====================

export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  color?: string;
  documentId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tags?: string[];
  color?: string;
  documentId?: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
  color?: string;
}

export interface NoteStats {
  totalNotes: number;
  notesWithTags: number;
  notesWithDocuments: number;
}

// ==================== Notes Service ====================

export const notesService = {
  // Create note
  create: async (data: CreateNoteInput) => {
    const response = await api.post<Note>('/v1/notes', data);
    return response.data;
  },

  // Get all notes
  getAll: async () => {
    const response = await api.get<Note[]>('/v1/notes');
    return response.data;
  },

  // Get notes statistics
  getStats: async () => {
    const response = await api.get<NoteStats>('/v1/notes/status');
    return response.data;
  },

  // Get recent notes
  getRecent: async (limit: number = 10) => {
    const response = await api.get<Note[]>('/v1/notes/recent', { params: { limit } });
    return response.data;
  },

  // Get notes for specific document
  getByDocument: async (docId: string) => {
    const response = await api.get<Note[]>(`/v1/notes/document/${docId}`);
    return response.data;
  },

  // Get specific note
  getById: async (id: string) => {
    const response = await api.get<Note>(`/v1/notes/${id}`);
    return response.data;
  },

  // Update note
  update: async (id: string, data: UpdateNoteInput) => {
    const response = await api.patch<Note>(`/v1/notes/${id}`, data);
    return response.data;
  },

  // Delete note
  delete: async (id: string) => {
    const response = await api.delete(`/v1/notes/${id}`);
    return response.data;
  },
};