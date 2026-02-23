import api from '@/lib/axios';
import { type BackendResponse } from './auth';

// ==================== Types ====================

export interface File {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  documentId?: string;
  userId: string;
  createdAt: string;
}

export interface UploadFileInput {
  file: File;
  documentId?: string;
}

export interface UploadAndExtractInput {
  file: File;
  title: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface FileStats {
  totalFiles: number;
  totalSize: number; // in bytes
  averageSize: number;
  largestFile: {
    filename: string;
    size: number;
  };
}

// ==================== Files Service ====================

export const filesService = {
  // Upload file
  upload: async (data: UploadFileInput) => {
    const formData = new FormData();
    formData.append('file', data.file as unknown as Blob);
    if (data.documentId) formData.append('documentId', data.documentId);

    const response = await api.post<BackendResponse<File>>('/v1/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Upload file and create document
  uploadAndExtract: async (data: UploadAndExtractInput) => {
    const formData = new FormData();
    formData.append('file', data.file as unknown as Blob);
    formData.append('title', data.title);
    if (data.tags) formData.append('tags', data.tags.join(','));
    if (data.isPublic !== undefined) formData.append('isPublic', String(data.isPublic));

    const response = await api.post<BackendResponse<{ file: File; document: any }>>('/v1/files/upload-and-extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Get all files
  getAll: async () => {
    const response = await api.get<BackendResponse<File[]>>('/v1/files');
    return response.data.data;
  },

  // Get file statistics
  getStats: async () => {
    const response = await api.get<BackendResponse<FileStats>>('/v1/files/stats');
    return response.data.data;
  },

  // Get files for specific document
  getByDocument: async (docId: string) => {
    const response = await api.get<BackendResponse<File[]>>(`/v1/files/document/${docId}`);
    return response.data.data;
  },

  // Get file metadata
  getById: async (id: string) => {
    const response = await api.get<BackendResponse<File>>(`/v1/files/${id}`);
    return response.data.data;
  },

  // Serve/download file
  serve: async (filename: string) => {
    const response = await api.get<Blob>(`/v1/files/serve/${filename}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Delete file
  delete: async (id: string) => {
    const response = await api.delete<BackendResponse<any>>(`/v1/files/${id}`);
    return response.data.data;
  },

  // Download helper function
  downloadFile: async (filename: string, originalName?: string) => {
    const blob = await filesService.serve(filename);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = originalName || filename;
    link.click();
    window.URL.revokeObjectURL(url);
  },
};