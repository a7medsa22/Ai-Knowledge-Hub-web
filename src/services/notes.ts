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
    const response = await api.post<Note>('/notes', data);
    return response.data;
  },

  // Get all notes
  getAll: async () => {
    const response = await api.get<Note[]>('/notes');
    return response.data;
  },

  // Get notes statistics
  getStats: async () => {
    const response = await api.get<NoteStats>('/notes/stats');
    return response.data;
  },

  // Get recent notes
  getRecent: async (limit: number = 10) => {
    const response = await api.get<Note[]>('/notes/recent', { params: { limit } });
    return response.data;
  },

  // Get notes for specific document
  getByDocument: async (docId: string) => {
    const response = await api.get<Note[]>(`/notes/document/${docId}`);
    return response.data;
  },

  // Get specific note
  getById: async (id: string) => {
    const response = await api.get<Note>(`/notes/${id}`);
    return response.data;
  },

  // Update note
  update: async (id: string, data: UpdateNoteInput) => {
    const response = await api.patch<Note>(`/notes/${id}`, data);
    return response.data;
  },

  // Delete note
  delete: async (id: string) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};