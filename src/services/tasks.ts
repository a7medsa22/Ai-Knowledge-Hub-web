import api from '@/lib/axios';
import { type BackendResponse } from './auth';

// ==================== Types ====================

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  tags?: string[];
  documentId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  tags?: string[];
  documentId?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  tags?: string[];
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

// ==================== Tasks Service ====================

export const tasksService = {
  // Create task
  create: async (data: CreateTaskInput) => {
    const response = await api.post<BackendResponse<Task>>('/tasks', data);
    return response.data.data;
  },

  // Get all tasks with filters
  getAll: async (params?: { status?: TaskStatus; priority?: TaskPriority; tags?: string[] }) => {
    const response = await api.get<BackendResponse<Task[]>>('/tasks', { params });
    return response.data.data;
  },

  // Get task statistics
  getStats: async () => {
    const response = await api.get<BackendResponse<TaskStats>>('/tasks/stats');
    return response.data.data;
  },

  // Get upcoming tasks
  getUpcoming: async () => {
    const response = await api.get<BackendResponse<Task[]>>('/tasks/upcoming');
    return response.data.data;
  },

  // Get overdue tasks
  getOverdue: async () => {
    const response = await api.get<BackendResponse<Task[]>>('/tasks/overdue');
    return response.data.data;
  },

  // Get specific task
  getById: async (id: string) => {
    const response = await api.get<BackendResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },

  // Update task
  update: async (id: string, data: UpdateTaskInput) => {
    const response = await api.patch<BackendResponse<Task>>(`/tasks/${id}`, data);
    return response.data.data;
  },

  // Update task status
  updateStatus: async (id: string, status: TaskStatus) => {
    const response = await api.patch<BackendResponse<Task>>(`/tasks/${id}/status`, { status });
    return response.data.data;
  },

  // Delete task
  delete: async (id: string) => {
    const response = await api.delete<BackendResponse<any>>(`/tasks/${id}`);
    return response.data.data;
  },
};