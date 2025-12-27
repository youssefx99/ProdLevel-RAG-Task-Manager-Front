import axiosInstance from './axios';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  Team,
  CreateTeamDto,
  UpdateTeamDto,
  PaginatedResult,
} from '@/types';
import { ChatRequestDto, ChatResponseDto } from '@/types/chat';

// User API
export const userApi = {
  getAll: (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return axiosInstance.get<PaginatedResult<User>>(
      `/users?${params.toString()}`
    );
  },
  getById: (id: string) => axiosInstance.get<User>(`/users/${id}`),
  create: (data: CreateUserDto) => axiosInstance.post<User>('/users', data),
  update: (id: string, data: UpdateUserDto) =>
    axiosInstance.patch<User>(`/users/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/users/${id}`),
};

// Task API
export const taskApi = {
  getAll: (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return axiosInstance.get<PaginatedResult<Task>>(
      `/tasks?${params.toString()}`
    );
  },
  getCount: () => axiosInstance.get<number>('/tasks/count'),
  getById: (id: string) => axiosInstance.get<Task>(`/tasks/${id}`),
  create: (data: CreateTaskDto) => axiosInstance.post<Task>('/tasks', data),
  update: (id: string, data: UpdateTaskDto) =>
    axiosInstance.patch<Task>(`/tasks/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/tasks/${id}`),
};

// Project API
export const projectApi = {
  getAll: (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return axiosInstance.get<PaginatedResult<Project>>(
      `/projects?${params.toString()}`
    );
  },
  getCount: () => axiosInstance.get<number>('/projects/count'),
  getById: (id: string) => axiosInstance.get<Project>(`/projects/${id}`),
  create: (data: CreateProjectDto) =>
    axiosInstance.post<Project>('/projects', data),
  update: (id: string, data: UpdateProjectDto) =>
    axiosInstance.patch<Project>(`/projects/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/projects/${id}`),
};

// Team API
export const teamApi = {
  getAll: (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return axiosInstance.get<PaginatedResult<Team>>(
      `/teams?${params.toString()}`
    );
  },
  getCount: () => axiosInstance.get<number>('/teams/count'),
  getById: (id: string) => axiosInstance.get<Team>(`/teams/${id}`),
  create: (data: CreateTeamDto) => axiosInstance.post<Team>('/teams', data),
  update: (id: string, data: UpdateTeamDto) =>
    axiosInstance.patch<Team>(`/teams/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/teams/${id}`),
};

// Chat API
export const chatApi = {
  sendMessage: (data: ChatRequestDto) =>
    axiosInstance.post<ChatResponseDto>('/task-manager/chat', data),
};
