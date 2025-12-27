'use client';

import { useState, Fragment } from 'react';
import { Team, User } from '@/types';
import { userApi, teamApi } from '@/lib/api';
import {
  ChevronDown,
  ChevronRight,
  Users,
  Pencil,
  Trash2,
  UserPlus,
} from 'lucide-react';
import Pagination from './Pagination';

interface TeamViewProps {
  teams: Team[];
  onEdit?: (team: Team) => void;
  onDelete?: (teamId: string) => void;
  onAssign?: (teamId: string) => void;
  onRefresh?: () => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
}

export default function TeamView({
  teams,
  onEdit,
  onDelete,
  onAssign,
  onRefresh,
  pagination,
}: TeamViewProps) {
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [teamUsers, setTeamUsers] = useState<Record<string, User[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const toggleTeam = async (teamId: string) => {
    const newExpanded = new Set(expandedTeams);

    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
      // Fetch users for this team if not already loaded
      if (!teamUsers[teamId]) {
        setLoading({ ...loading, [teamId]: true });
        try {
          const response = await userApi.getAll(1, 1000); // Get all users
          const users = response.data.data.filter(
            (user: User) => user.teamId === teamId
          );
          setTeamUsers({ ...teamUsers, [teamId]: users });
        } catch (error) {
          console.error('Failed to fetch users:', error);
        } finally {
          setLoading({ ...loading, [teamId]: false });
        }
      }
    }

    setExpandedTeams(newExpanded);
  };

  if (!teams || teams.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p>No teams found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12"></th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Team Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Project ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {teams.map((team) => (
            <Fragment key={team.id}>
              {/* Team Row */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleTeam(team.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {expandedTeams.has(team.id) ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {team.name}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-mono text-sm">
                  {team.projectId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(team.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(team)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Edit team"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {onAssign && (
                      <button
                        onClick={() => onAssign(team.id)}
                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                        title="Assign user to team"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(team.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete team"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>

              {/* Expanded Users */}
              {expandedTeams.has(team.id) && (
                <tr key={`${team.id}-users`}>
                  <td
                    colSpan={5}
                    className="px-6 py-2 bg-orange-50 dark:bg-orange-900/10"
                  >
                    {loading[team.id] ? (
                      <div className="text-center py-4 text-gray-500">
                        Loading users...
                      </div>
                    ) : teamUsers[team.id]?.length > 0 ? (
                      <div className="ml-12">
                        <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-300 mb-2">
                          Users in {team.name}
                        </h4>
                        <table className="w-full">
                          <thead className="bg-orange-100 dark:bg-orange-900/20">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-orange-700 dark:text-orange-400">
                                Name
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-orange-700 dark:text-orange-400">
                                Email
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-orange-700 dark:text-orange-400">
                                Role
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-orange-700 dark:text-orange-400">
                                Created
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-orange-100 dark:divide-orange-900/30">
                            {teamUsers[team.id].map((user) => (
                              <tr
                                key={user.id}
                                className="hover:bg-orange-100 dark:hover:bg-orange-900/20"
                              >
                                <td className="px-4 py-3 font-medium text-orange-900 dark:text-orange-200">
                                  {user.name}
                                </td>
                                <td className="px-4 py-3 text-orange-700 dark:text-orange-300">
                                  {user.email}
                                </td>
                                <td className="px-4 py-3 text-orange-600 dark:text-orange-400">
                                  {user.role}
                                </td>
                                <td className="px-4 py-3 text-sm text-orange-500 dark:text-orange-500">
                                  {new Date(
                                    user.createdAt
                                  ).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No users in this team
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
