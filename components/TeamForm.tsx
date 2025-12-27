'use client';

import { useState, useEffect, FormEvent } from 'react';
import Sidebar from './Sidebar';
import { teamApi, projectApi } from '@/lib/api';
import { CreateTeamDto, UpdateTeamDto, Team, Project } from '@/types';

interface TeamFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  team?: Team | null; // If provided, it's an update operation
}

export default function TeamForm({
  isOpen,
  onClose,
  onSuccess,
  team,
}: TeamFormProps) {
  const isUpdate = !!team;

  const [formData, setFormData] = useState<CreateTeamDto>({
    name: '',
    ownerId: '',
    projectId: '',
  });

  // Update form data when team prop changes or form opens
  useEffect(() => {
    // Get logged-in user ID from localStorage
    const userStr = localStorage.getItem('user');
    const userId = userStr ? JSON.parse(userStr).id : '';

    if (team) {
      setFormData({
        name: team.name,
        ownerId: team.ownerId,
        projectId: team.projectId,
      });
    } else {
      setFormData({
        name: '',
        ownerId: userId,
        projectId: '',
      });
    }
  }, [team, isOpen]);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects when form opens
  useEffect(() => {
    if (isOpen) {
      // Also update ownerId when form opens
      const userStr = localStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr).id : '';
      if (!team && userId) {
        setFormData((prev) => ({ ...prev, ownerId: userId }));
      }

      setLoadingProjects(true);
      projectApi
        .getAll(1, 1000) // Get all projects for dropdown
        .then((response) => setProjects(response.data.data))
        .catch((err) => console.error('Failed to fetch projects', err))
        .finally(() => setLoadingProjects(false));
    }
  }, [isOpen, team]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isUpdate && team) {
        await teamApi.update(team.id, formData);
      } else {
        await teamApi.create(formData);
      }

      onSuccess?.();
      onClose();
      const userStr = localStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr).id : '';
      setFormData({
        name: '',
        ownerId: userId,
        projectId: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdate ? 'Update Team' : 'Create Team'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Team Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project *
          </label>
          <select
            required
            value={formData.projectId}
            onChange={(e) =>
              setFormData({ ...formData, projectId: e.target.value })
            }
            disabled={loadingProjects}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:opacity-50"
          >
            <option value="">
              {loadingProjects ? 'Loading projects...' : 'Select a project'}
            </option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
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
