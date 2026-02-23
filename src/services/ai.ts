import api from '@/lib/axios';

// ==================== Types ====================

export interface AIStatus {
  available: boolean;
  model: string;
  version: string;
  uptime: string;
}

export interface SummarizeInput {
  text?: string;
  docId?: string;
  length?: 'short' | 'medium' | 'long';
}

export interface SummarizeResponse {
  summary: string;
  originalLength: number;
  summaryLength: number;
  reductionPercentage: number;
}

export interface AskInput {
  question: string;
  docId?: string;
  context?: string;
}

export interface AskResponse {
  answer: string;
  sources?: Array<{
    text: string;
    relevance: number;
  }>;
}

export interface SearchInput {
  query: string;
  topK?: number;
  docId?: string;
}

export interface SearchResult {
  id: string;
  text: string;
  similarity: number;
  metadata?: Record<string, any>;
}

export interface ExtractKeyPointsInput {
  text?: string;
  docId?: string;
  maxPoints?: number;
}

export interface ExtractKeyPointsResponse {
  keyPoints: string[];
  count: number;
}

export interface BulkSummarizeInput {
  docIds: string[];
  length?: 'short' | 'medium' | 'long';
}

export interface BulkSummarizeResponse {
  summaries: Array<{
    docId: string;
    title: string;
    summary: string;
  }>;
}

// ==================== AI Service ====================

export const aiService = {
  // Check AI service availability
  getStatus: async () => {
    const response = await api.get<AIStatus>('/v1/ai/status');
    return response.data;
  },

  // Summarize text or document
  summarize: async (data: SummarizeInput) => {
    const response = await api.post<SummarizeResponse>('/v1/ai/summarize', data);
    return response.data;
  },

  // RAG Question & Answer
  ask: async (data: AskInput) => {
    const response = await api.post<AskResponse>('/v1/ai/ask', data);
    return response.data;
  },

  // Alias for ask
  qa: async (data: AskInput) => {
    const response = await api.post<AskResponse>('/v1/ai/ask', data);
    return response.data;
  },

  // Semantic Search
  search: async (data: SearchInput) => {
    const response = await api.post<SearchResult[]>('/v1/ai/search', data);
    return response.data;
  },

  // Legacy Q&A (Direct context)
  chat: async (data: { message: string; context?: string }) => {
    const response = await api.post<{ response: string }>('/v1/ai/chat', data);
    return response.data;
  },

  // Extract key points
  extractKeyPoints: async (data: ExtractKeyPointsInput) => {
    const response = await api.post<ExtractKeyPointsResponse>('/v1/ai/extract-key-points', data);
    return response.data;
  },

  // Summarize multiple documents
  bulkSummarize: async (data: BulkSummarizeInput) => {
    const response = await api.post<BulkSummarizeResponse>('/v1/ai/bulk-summarize', data);
    return response.data;
  },
};