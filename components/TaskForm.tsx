'use client';

import { useState, useEffect, FormEvent } from 'react';
import Sidebar from './Sidebar';
import { taskApi, userApi } from '@/lib/api';
import { CreateTaskDto, UpdateTaskDto, Task, TaskStatus, User } from '@/types';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  task?: Task | null; // If provided, it's an update operation
}

export default function TaskForm({
  isOpen,
  onClose,
  onSuccess,
  task,
}: TaskFormProps) {
  const isUpdate = !!task;

  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    assignedTo: '',
    deadline: '',
  });

  // Update form data when task prop changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        assignedTo: task.assignedTo,
        deadline: task.deadline ? task.deadline.split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: TaskStatus.TODO,
        assignedTo: '',
        deadline: '',
      });
    }
  }, [task]);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users when form opens
  useEffect(() => {
    if (isOpen) {
      setLoadingData(true);
      userApi
        .getAll(1, 1000) // Get all users for dropdown
        .then((response) => setUsers(response.data.data))
        .catch((err) => console.error('Failed to fetch users', err))
        .finally(() => setLoadingData(false));
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isUpdate && task) {
        await taskApi.update(task.id, formData);
      } else {
        await taskApi.create(formData);
      }

      onSuccess?.();
      onClose();
      setFormData({
        title: '',
        description: '',
        status: TaskStatus.TODO,
        assignedTo: '',
        deadline: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdate ? 'Update Task' : 'Create Task'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as TaskStatus })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.DONE}>Done</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Assigned To *
          </label>
          <select
            required
            value={formData.assignedTo}
            onChange={(e) =>
              setFormData({ ...formData, assignedTo: e.target.value })
            }
            disabled={loadingData}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:opacity-50"
          >
            <option value="">
              {loadingData ? 'Loading users...' : 'Select a user'}
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Deadline
          </label>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Saving...' : isUpdate ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </Sidebar>
  );
}
