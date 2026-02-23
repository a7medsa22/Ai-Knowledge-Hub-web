import api from '@/lib/axios';

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
    const response = await api.post<Document>('/docs', data);
    return response.data;
  },

  // Create document from file upload
  createFromFile: async (data: CreateDocumentFromFileInput) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('file', data.file);
    if (data.tags) formData.append('tags', data.tags.join(','));
    if (data.isPublic !== undefined) formData.append('isPublic', String(data.isPublic));

    const response = await api.post<Document>('/docs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all public documents (searchable)
  getAll: async (params?: { search?: string; tags?: string[]; page?: number; limit?: number }) => {
    const response = await api.get<Document[]>('/docs', { params });
    return response.data;
  },

  // Get user's documents
  getMyDocuments: async () => {
    const response = await api.get<Document[]>('/docs/my-docs');
    return response.data;
  },

  // Get all tags
  getTags: async () => {
    const response = await api.get<string[]>('/docs/tags');
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await api.get<DocumentStats>('/docs/stats');
    return response.data;
  },

  // Get specific document
  getById: async (id: string) => {
    const response = await api.get<Document>(`/docs/${id}`);
    return response.data;
  },

  // Update document
  update: async (id: string, data: UpdateDocumentInput) => {
    const response = await api.patch<Document>(`/docs/${id}`, data);
    return response.data;
  },

  // Delete document
  delete: async (id: string) => {
    const response = await api.delete(`/docs/${id}`);
    return response.data;
  },
};