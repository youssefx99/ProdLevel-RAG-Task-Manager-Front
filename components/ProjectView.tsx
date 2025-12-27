'use client';

import { useState, Fragment } from 'react';
import { Project, Team, User } from '@/types';
import { teamApi, userApi, projectApi } from '@/lib/api';
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Pencil,
  Trash2,
  LogOut,
} from 'lucide-react';
import Pagination from './Pagination';

interface ProjectViewProps {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onResign?: (projectId: string) => void;
  onRefresh?: () => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
}

export default function ProjectView({
  projects,
  onEdit,
  onDelete,
  onResign,
  onRefresh,
  pagination,
}: ProjectViewProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set()
  );
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [projectTeams, setProjectTeams] = useState<Record<string, Team[]>>({});
  const [teamUsers, setTeamUsers] = useState<Record<string, User[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const toggleProject = async (projectId: string) => {
    const newExpanded = new Set(expandedProjects);

    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
      // Fetch teams for this project if not already loaded
      if (!projectTeams[projectId]) {
        setLoading({ ...loading, [projectId]: true });
        try {
          const response = await teamApi.getAll(1, 1000); // Get all teams
          const teams = response.data.data.filter(
            (team: Team) => team.projectId === projectId
          );
          setProjectTeams({ ...projectTeams, [projectId]: teams });
        } catch (error) {
          console.error('Failed to fetch teams:', error);
        } finally {
          setLoading({ ...loading, [projectId]: false });
        }
      }
    }

    setExpandedProjects(newExpanded);
  };

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

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p>No projects found</p>
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
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Description
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
          {projects.map((project) => (
            <Fragment key={project.id}>
              {/* Project Row */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleProject(project.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {expandedProjects.has(project.id) ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {project.name}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                  {project.description || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(project.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(project)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Edit project"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {onResign && (
                      <button
                        onClick={() => onResign(project.id)}
                        className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                        title="Resign from project"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(project.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>

              {/* Expanded Teams */}
              {expandedProjects.has(project.id) && (
                <tr key={`${project.id}-teams`}>
                  <td
                    colSpan={5}
                    className="px-6 py-2 bg-purple-50 dark:bg-purple-900/10"
                  >
                    {loading[project.id] ? (
                      <div className="text-center py-4 text-gray-500">
                        Loading teams...
                      </div>
                    ) : projectTeams[project.id]?.length > 0 ? (
                      <div className="ml-12">
                        <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2">
                          Teams in {project.name}
                        </h4>
                        <table className="w-full">
                          <thead className="bg-purple-100 dark:bg-purple-900/20">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 dark:text-purple-400 w-12"></th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 dark:text-purple-400">
                                Team Name
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 dark:text-purple-400">
                                Created
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-purple-100 dark:divide-purple-900/30">
                            {projectTeams[project.id].map((team) => (
                              <Fragment key={team.id}>
                                {/* Team Row */}
                                <tr className="hover:bg-purple-100 dark:hover:bg-purple-900/20">
                                  <td className="px-4 py-3">
                                    <button
                                      onClick={() => toggleTeam(team.id)}
                                      className="text-purple-400 hover:text-purple-600 dark:hover:text-purple-300"
                                    >
                                      {expandedTeams.has(team.id) ? (
                                        <ChevronDown className="w-4 h-4" />
                                      ) : (
                                        <ChevronRight className="w-4 h-4" />
                                      )}
                                    </button>
                                  </td>
                                  <td className="px-4 py-3 font-medium text-purple-900 dark:text-purple-200">
                                    {team.name}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-purple-700 dark:text-purple-300">
                                    {new Date(
                                      team.createdAt
                                    ).toLocaleDateString()}
                                  </td>
                                </tr>

                                {/* Expanded Users */}
                                {expandedTeams.has(team.id) && (
                                  <tr key={`${team.id}-users`}>
                                    <td
                                      colSpan={3}
                                      className="px-4 py-2 bg-orange-50 dark:bg-orange-900/10"
                                    >
                                      {loading[team.id] ? (
                                        <div className="text-center py-2 text-gray-500 text-sm">
                                          Loading users...
                                        </div>
                                      ) : teamUsers[team.id]?.length > 0 ? (
                                        <div className="ml-8">
                                          <h5 className="text-xs font-semibold text-orange-900 dark:text-orange-300 mb-1">
                                            Users in {team.name}
                                          </h5>
                                          <table className="w-full text-sm">
                                            <thead className="bg-orange-100 dark:bg-orange-900/20">
                                              <tr>
                                                <th className="px-3 py-1.5 text-left text-xs font-medium text-orange-700 dark:text-orange-400">
                                                  Name
                                                </th>
                                                <th className="px-3 py-1.5 text-left text-xs font-medium text-orange-700 dark:text-orange-400">
                                                  Email
                                                </th>
                                                <th className="px-3 py-1.5 text-left text-xs font-medium text-orange-700 dark:text-orange-400">
                                                  Role
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody className="divide-y divide-orange-100 dark:divide-orange-900/30">
                                              {teamUsers[team.id].map(
                                                (user) => (
                                                  <tr
                                                    key={user.id}
                                                    className="hover:bg-orange-100 dark:hover:bg-orange-900/20"
                                                  >
                                                    <td className="px-3 py-2 text-orange-900 dark:text-orange-200">
                                                      {user.name}
                                                    </td>
                                                    <td className="px-3 py-2 text-orange-700 dark:text-orange-300">
                                                      {user.email}
                                                    </td>
                                                    <td className="px-3 py-2 text-orange-600 dark:text-orange-400">
                                                      {user.role}
                                                    </td>
                                                  </tr>
                                                )
                                              )}
                                            </tbody>
                                          </table>
                                        </div>
                                      ) : (
                                        <div className="text-center py-2 text-gray-500 text-sm">
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
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No teams in this project
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
