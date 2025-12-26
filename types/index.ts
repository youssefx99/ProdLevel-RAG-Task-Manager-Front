// User Types
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  teamId?: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  role?: UserRole;
  teamId?: string;
}

// Task Types
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  assignedTo: string;
  deadline?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedTo?: string;
  deadline?: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  ownerId: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamDto {
  name: string;
  ownerId: string;
  projectId: string;
}

export interface UpdateTeamDto {
  name?: string;
  ownerId?: string;
  projectId?: string;
}
