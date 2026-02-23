import api from '@/lib/axios';

// ==================== Types ====================

export interface MCPTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  category: string;
}

export interface ExecuteToolInput {
  toolName: string;
  parameters: Record<string, any>;
}

export interface ExecuteToolResponse {
  success: boolean;
  result: any;
  metadata?: {
    executionTime: number;
    toolVersion: string;
  };
}

export interface ExecuteBatchInput {
  tools: Array<{
    toolName: string;
    parameters: Record<string, any>;
  }>;
}

export interface QuickSearchDocsInput {
  query: string;
  limit?: number;
}

export interface QuickAddNoteInput {
  title: string;
  content: string;
  tags?: string[];
}

export interface QuickCreateTaskInput {
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string;
}

export interface QuickUserStats {
  documents: number;
  notes: number;
  tasks: number;
  totalActivity: number;
}

// ==================== MCP Service ====================

export const mcpService = {
  // List available tools
  getTools: async () => {
    const response = await api.get<MCPTool[]>('/mcp/tools');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get<{ healthy: boolean; uptime: string }>('/mcp/health');
    return response.data;
  },

  // Execute single tool
  execute: async (data: ExecuteToolInput) => {
    const response = await api.post<ExecuteToolResponse>('/mcp/execute', data);
    return response.data;
  },

  // Execute multiple tools
  executeBatch: async (data: ExecuteBatchInput) => {
    const response = await api.post<ExecuteToolResponse[]>('/mcp/execute-batch', data);
    return response.data;
  },

  // Quick actions
  quickSearchDocs: async (data: QuickSearchDocsInput) => {
    const response = await api.post('/mcp/quick/search-docs', data);
    return response.data;
  },

  quickAddNote: async (data: QuickAddNoteInput) => {
    const response = await api.post('/mcp/quick/add-note', data);
    return response.data;
  },

  quickCreateTask: async (data: QuickCreateTaskInput) => {
    const response = await api.post('/mcp/quick/create-task', data);
    return response.data;
  },

  // User statistics
  quickGetUserStats: async () => {
    const response = await api.get<QuickUserStats>('/mcp/quick/user-stats');
    return response.data;
  },
};