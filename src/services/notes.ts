import api from '@/lib/axios';
import { type BackendResponse } from './auth';

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
    const response = await api.post<BackendResponse<Note>>('/notes', data);
    return response.data.data;
  },

  // Get all notes
  getAll: async () => {
    const response = await api.get<BackendResponse<Note[]>>('/notes');
    return response.data.data;
  },

  // Get notes statistics
  getStats: async () => {
    const response = await api.get<BackendResponse<NoteStats>>('/notes/status');
    return response.data.data;
  },

  // Get recent notes
  getRecent: async (limit: number = 10) => {
    const response = await api.get<BackendResponse<Note[]>>('/notes/recent', { params: { limit } });
    return response.data.data;
  },

  // Get notes for specific document
  getByDocument: async (docId: string) => {
    const response = await api.get<BackendResponse<Note[]>>(`/notes/document/${docId}`);
    return response.data.data;
  },

  // Get specific note
  getById: async (id: string) => {
    const response = await api.get<BackendResponse<Note>>(`/notes/${id}`);
    return response.data.data;
  },

  // Update note
  update: async (id: string, data: UpdateNoteInput) => {
    const response = await api.patch<BackendResponse<Note>>(`/notes/${id}`, data);
    return response.data.data;
  },

  // Delete note
  delete: async (id: string) => {
    const response = await api.delete<BackendResponse<any>>(`/notes/${id}`);
    return response.data.data;
  },
};