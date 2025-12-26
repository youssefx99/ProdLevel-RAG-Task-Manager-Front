'use client';

import { useState, useEffect, FormEvent } from 'react';
import Sidebar from './Sidebar';
import { userApi, teamApi } from '@/lib/api';
import { CreateUserDto, UpdateUserDto, User, UserRole, Team } from '@/types';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user?: User | null; // If provided, it's an update operation
}

export default function UserForm({
  isOpen,
  onClose,
  onSuccess,
  user,
}: UserFormProps) {
  const isUpdate = !!user;

  const [formData, setFormData] = useState<CreateUserDto>({
    email: user?.email || '',
    password: '',
    name: user?.name || '',
    role: user?.role || UserRole.MEMBER,
    teamId: user?.teamId || '',
  });

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch teams when form opens
  useEffect(() => {
    if (isOpen) {
      setLoadingTeams(true);
      teamApi
        .getAll()
        .then((response) => setTeams(response.data))
        .catch((err) => console.error('Failed to fetch teams', err))
        .finally(() => setLoadingTeams(false));
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isUpdate && user) {
        const updateData: UpdateUserDto = { ...formData };
        if (!updateData.password) delete updateData.password; // Don't send empty password
        await userApi.update(user.id, updateData);
      } else {
        await userApi.create(formData);
      }

      onSuccess?.();
      onClose();
      // Reset form
      setFormData({
        email: '',
        password: '',
        name: '',
        role: UserRole.MEMBER,
        teamId: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdate ? 'Update User' : 'Create User'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password {isUpdate && '(leave blank to keep current)'}
          </label>
          <input
            type="password"
            required={!isUpdate}
            minLength={6}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name *
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
            Role
          </label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as UserRole })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value={UserRole.MEMBER}>Member</option>
            <option value={UserRole.MANAGER}>Manager</option>
            <option value={UserRole.ADMIN}>Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Team (Optional)
          </label>
          <select
            value={formData.teamId}
            onChange={(e) =>
              setFormData({ ...formData, teamId: e.target.value })
            }
            disabled={loadingTeams}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:opacity-50"
          >
            <option value="">
              {loadingTeams ? 'Loading teams...' : 'No team (optional)'}
            </option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
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
