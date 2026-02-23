import api from '@/lib/axios';
import { type BackendResponse } from './auth';

// ==================== Types ====================

export interface Document {
  id: string;
  title: string;
  content?: string;
  contentUrl?: string;
  type: 'text' | 'pdf' | 'doc' | 'docx' | 'txt';
  tags: string[];
  isPublic: boolean;
  userId: string;
  stats: {
    views: number;
    downloads: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentInput {
  title: string;
  content?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface CreateDocumentFromFileInput {
  title: string;
  file: File;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateDocumentInput {
  title?: string;
  content?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface DocumentStats {
  totalDocuments: number;
  publicDocuments: number;
  privateDocuments: number;
  totalSize: number; // in bytes
}

// ==================== Documents Service ====================

export const documentsService = {
  // Create document (text)
  create: async (data: CreateDocumentInput) => {
    const response = await api.post<BackendResponse<Document>>('/v1/docs', data);
    return response.data.data;
  },

  // Create document from file upload
  createFromFile: async (data: CreateDocumentFromFileInput) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('file', data.file);
    if (data.tags) formData.append('tags', data.tags.join(','));
    if (data.isPublic !== undefined) formData.append('isPublic', String(data.isPublic));

    const response = await api.post<BackendResponse<Document>>('/v1/docs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Get all public documents (searchable)
  getAll: async (params?: { search?: string; tags?: string[]; page?: number; limit?: number }) => {
    const response = await api.get<BackendResponse<Document[]>>('/v1/docs', { params });
    return response.data.data;
  },

  // Get user's documents
  getMyDocuments: async () => {
    const response = await api.get<BackendResponse<Document[]>>('/v1/docs/my-docs');
    return response.data.data;
  },

  // Get all tags
  getTags: async () => {
    const response = await api.get<BackendResponse<string[]>>('/v1/docs/tags');
    return response.data.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await api.get<BackendResponse<DocumentStats>>('/v1/docs/status');
    return response.data.data;
  },

  // Get specific document
  getById: async (id: string) => {
    const response = await api.get<BackendResponse<Document>>(`/v1/docs/${id}`);
    return response.data.data;
  },

  // Update document
  update: async (id: string, data: UpdateDocumentInput) => {
    const response = await api.patch<BackendResponse<Document>>(`/v1/docs/${id}`, data);
    return response.data.data;
  },

  // Delete document
  delete: async (id: string) => {
    const response = await api.delete<BackendResponse<any>>(`/v1/docs/${id}`);
    return response.data.data;
  },
};