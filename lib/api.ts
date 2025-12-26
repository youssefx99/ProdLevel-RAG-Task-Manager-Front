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
} from '@/types';
import { ChatRequestDto, ChatResponseDto } from '@/types/chat';

// User API
export const userApi = {
  getAll: () => axiosInstance.get<User[]>('/users'),
  getById: (id: string) => axiosInstance.get<User>(`/users/${id}`),
  create: (data: CreateUserDto) => axiosInstance.post<User>('/users', data),
  update: (id: string, data: UpdateUserDto) =>
    axiosInstance.patch<User>(`/users/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/users/${id}`),
};

// Task API
export const taskApi = {
  getAll: () => axiosInstance.get<Task[]>('/tasks'),
  getById: (id: string) => axiosInstance.get<Task>(`/tasks/${id}`),
  create: (data: CreateTaskDto) => axiosInstance.post<Task>('/tasks', data),
  update: (id: string, data: UpdateTaskDto) =>
    axiosInstance.patch<Task>(`/tasks/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/tasks/${id}`),
};

// Project API
export const projectApi = {
  getAll: () => axiosInstance.get<Project[]>('/projects'),
  getById: (id: string) => axiosInstance.get<Project>(`/projects/${id}`),
  create: (data: CreateProjectDto) =>
    axiosInstance.post<Project>('/projects', data),
  update: (id: string, data: UpdateProjectDto) =>
    axiosInstance.patch<Project>(`/projects/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/projects/${id}`),
};

// Team API
export const teamApi = {
  getAll: () => axiosInstance.get<Team[]>('/teams'),
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
