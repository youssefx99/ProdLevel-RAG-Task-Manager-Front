'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userApi, taskApi, projectApi, teamApi } from '@/lib/api';
import { User, Task, Project, Team } from '@/types';
import UserForm from '@/components/UserForm';
import TaskForm from '@/components/TaskForm';
import ProjectForm from '@/components/ProjectForm';
import TeamForm from '@/components/TeamForm';
import BottomDrawer from '@/components/BottomDrawer';
import TeamView from '@/components/TeamView';
import ProjectView from '@/components/ProjectView';
import TaskView from '@/components/TaskView';
import UserView from '@/components/UserView';
import ChatWidget from '@/components/ChatWidget';
import UserSelectionModal from '@/components/UserSelectionModal';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Data state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Counts state (for dashboard cards - loaded on page open)
  const [counts, setCounts] = useState({
    teams: 0,
    projects: 0,
    tasks: 0,
    users: 0,
  });

  // Pagination state
  const [teamsPagination, setTeamsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [projectsPagination, setProjectsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [tasksPagination, setTasksPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [usersPagination, setUsersPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Form visibility state
  const [showUserForm, setShowUserForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);

  // View drawer visibility state
  const [showTeamView, setShowTeamView] = useState(false);
  const [showProjectView, setShowProjectView] = useState(false);
  const [showTaskView, setShowTaskView] = useState(false);
  const [showUserView, setShowUserView] = useState(false);

  // User selection modal state
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalContext, setModalContext] = useState<{
    type: 'task' | 'team';
    id: string;
    currentUserId?: string;
  } | null>(null);

  // Selected items for editing
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Search state
  const [tasksSearch, setTasksSearch] = useState('');
  const [projectsSearch, setProjectsSearch] = useState('');
  const [teamsSearch, setTeamsSearch] = useState('');
  const [usersSearch, setUsersSearch] = useState('');

  // Fetch functions
  const fetchTasks = async (page: number = 1, search?: string) => {
    try {
      const searchTerm = search !== undefined ? search : tasksSearch;
      const response = await taskApi.getAll(
        page,
        tasksPagination.itemsPerPage,
        searchTerm || undefined
      );
      setTasks(response.data.data);
      setTasksPagination({
        currentPage: response.data.page,
        totalPages: response.data.totalPages,
        totalItems: response.data.total,
        itemsPerPage: response.data.limit,
      });
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const fetchProjects = async (page: number = 1, search?: string) => {
    try {
      const searchTerm = search !== undefined ? search : projectsSearch;
      const response = await projectApi.getAll(
        page,
        projectsPagination.itemsPerPage,
        searchTerm || undefined
      );
      setProjects(response.data.data);
      setProjectsPagination({
        currentPage: response.data.page,
        totalPages: response.data.totalPages,
        totalItems: response.data.total,
        itemsPerPage: response.data.limit,
      });
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  const fetchTeams = async (page: number = 1, search?: string) => {
    try {
      const searchTerm = search !== undefined ? search : teamsSearch;
      const response = await teamApi.getAll(
        page,
        teamsPagination.itemsPerPage,
        searchTerm || undefined
      );
      setTeams(response.data.data);
      setTeamsPagination({
        currentPage: response.data.page,
        totalPages: response.data.totalPages,
        totalItems: response.data.total,
        itemsPerPage: response.data.limit,
      });
    } catch (error) {
      console.error('Failed to fetch teams', error);
    }
  };

  const fetchUsers = async (page: number = 1, search?: string) => {
    try {
      const searchTerm = search !== undefined ? search : usersSearch;
      const response = await userApi.getAll(
        page,
        usersPagination.itemsPerPage,
        searchTerm || undefined
      );
      setUsers(response.data.data);
      setUsersPagination({
        currentPage: response.data.page,
        totalPages: response.data.totalPages,
        totalItems: response.data.total,
        itemsPerPage: response.data.limit,
      });
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  // Fetch only counts for dashboard cards (lightweight)
  const fetchCounts = async () => {
    try {
      const [teamsRes, projectsRes, tasksRes, usersRes] = await Promise.all([
        teamApi.getCount(),
        projectApi.getCount(),
        taskApi.getCount(),
        userApi.getCount(),
      ]);
      setCounts({
        teams: teamsRes.data,
        projects: projectsRes.data,
        tasks: tasksRes.data,
        users: usersRes.data,
      });
    } catch (error) {
      console.error('Failed to fetch counts', error);
    }
  };

  // Track which views have been loaded
  const [teamsLoaded, setTeamsLoaded] = useState(false);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch only counts on page load (lightweight)
    fetchCounts();
  }, [router]);

  // Effect to fetch teams when drawer opens
  useEffect(() => {
    if (showTeamView && !teamsLoaded) {
      fetchTeams();
      setTeamsLoaded(true);
    }
  }, [showTeamView]);

  // Effect to fetch projects when drawer opens
  useEffect(() => {
    if (showProjectView && !projectsLoaded) {
      fetchProjects();
      setProjectsLoaded(true);
    }
  }, [showProjectView]);

  // Effect to fetch tasks when drawer opens
  useEffect(() => {
    if (showTaskView && !tasksLoaded) {
      fetchTasks();
      setTasksLoaded(true);
    }
  }, [showTaskView]);

  // Effect to fetch users when drawer opens
  useEffect(() => {
    if (showUserView && !usersLoaded) {
      fetchUsers();
      setUsersLoaded(true);
    }
  }, [showUserView]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Delete handlers
  const handleDeleteTeam = async (teamId: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      try {
        await teamApi.delete(teamId);
        fetchTeams(teamsPagination.currentPage);
        fetchCounts(); // Update dashboard counts
      } catch (error) {
        console.error('Failed to delete team', error);
        alert('Failed to delete team');
      }
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectApi.delete(projectId);
        fetchProjects(projectsPagination.currentPage);
        fetchCounts(); // Update dashboard counts
      } catch (error) {
        console.error('Failed to delete project', error);
        alert('Failed to delete project');
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.delete(taskId);
        fetchTasks(tasksPagination.currentPage);
        fetchCounts(); // Update dashboard counts
      } catch (error) {
        console.error('Failed to delete task', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.delete(userId);
        fetchUsers(usersPagination.currentPage);
        fetchCounts(); // Update dashboard counts
      } catch (error) {
        console.error('Failed to delete user', error);
        alert('Failed to delete user');
      }
    }
  };

  // Edit handlers
  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setShowTeamForm(true);
    setShowTeamView(false);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowProjectForm(true);
    setShowProjectView(false);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskForm(true);
    setShowTaskView(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowUserForm(true);
    setShowUserView(false);
  };

  // Assign handlers (opens modal for user selection)
  const handleAssignToTeam = (teamId: string) => {
    setModalContext({ type: 'team', id: teamId });
    setShowUserModal(true);
  };

  const handleAssignTask = (taskId: string, currentUserId?: string) => {
    setModalContext({ type: 'task', id: taskId, currentUserId });
    setShowUserModal(true);
  };

  const handleUserSelection = async (userId: string) => {
    if (!modalContext) return;

    try {
      if (modalContext.type === 'task') {
        await taskApi.update(modalContext.id, { assignedTo: userId });
        fetchTasks(tasksPagination.currentPage);
      } else if (modalContext.type === 'team') {
        await userApi.update(userId, { teamId: modalContext.id });
        // User assigned to team - no need to refresh since UserSelectionModal handles its own data
      }
      setModalContext(null);
    } catch (error) {
      console.error('Failed to assign user', error);
      alert('Failed to assign user');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-black">Task Manager</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-black">
            Welcome, {user.name}!
          </h2>
          <p className="text-gray-600 mb-4">Email: {user.email}</p>
          <p className="text-gray-600">Role: {user.role}</p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-black">Teams</h3>
              <span className="text-2xl font-bold text-orange-600">
                {counts.teams}
              </span>
            </div>
            <p className="text-gray-600 mb-4">Manage your teams</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTeamForm(true)}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create
              </button>
              <button
                onClick={() => setShowTeamView(true)}
                className="bg-orange-100 hover:bg-orange-200 text-orange-600 px-4 py-2 rounded-lg font-medium transition-colors"
                title="View teams"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-black">Projects</h3>
              <span className="text-2xl font-bold text-purple-600">
                {counts.projects}
              </span>
            </div>
            <p className="text-gray-600 mb-4">View your projects</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowProjectForm(true)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create
              </button>
              <button
                onClick={() => setShowProjectView(true)}
                className="bg-purple-100 hover:bg-purple-200 text-purple-600 px-4 py-2 rounded-lg font-medium transition-colors"
                title="View projects"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-black">Tasks</h3>
              <span className="text-2xl font-bold text-green-600">
                {counts.tasks}
              </span>
            </div>
            <p className="text-gray-600 mb-4">Track your tasks</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTaskForm(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create
              </button>
              <button
                onClick={() => setShowTaskView(true)}
                className="bg-green-100 hover:bg-green-200 text-green-600 px-4 py-2 rounded-lg font-medium transition-colors"
                title="View tasks"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-black">Users</h3>
              <span className="text-2xl font-bold text-cyan-600">
                {counts.users}
              </span>
            </div>
            <p className="text-gray-600 mb-4">Manage your users</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowUserForm(true)}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create
              </button>
              <button
                onClick={() => setShowUserView(true)}
                className="bg-cyan-100 hover:bg-cyan-200 text-cyan-600 px-4 py-2 rounded-lg font-medium transition-colors"
                title="View users"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forms */}
      <UserForm
        isOpen={showUserForm}
        onClose={() => {
          setShowUserForm(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={() => {
          fetchUsers(usersPagination.currentPage);
          fetchCounts();
        }}
      />

      <TaskForm
        isOpen={showTaskForm}
        onClose={() => {
          setShowTaskForm(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSuccess={() => {
          fetchTasks(tasksPagination.currentPage);
          fetchCounts();
        }}
      />

      <ProjectForm
        isOpen={showProjectForm}
        onClose={() => {
          setShowProjectForm(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        onSuccess={() => {
          fetchProjects(projectsPagination.currentPage);
          fetchCounts();
        }}
      />

      <TeamForm
        isOpen={showTeamForm}
        onClose={() => {
          setShowTeamForm(false);
          setSelectedTeam(null);
        }}
        team={selectedTeam}
        onSuccess={() => {
          fetchTeams(teamsPagination.currentPage);
          fetchCounts();
        }}
      />

      {/* Bottom Drawers for Viewing Data */}
      <BottomDrawer
        isOpen={showTeamView}
        onClose={() => {
          setShowTeamView(false);
          setTeamsSearch('');
        }}
        title="All Teams"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search teams..."
            value={teamsSearch}
            onChange={(e) => {
              setTeamsSearch(e.target.value);
              fetchTeams(1, e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <TeamView
          teams={teams}
          onEdit={handleEditTeam}
          onDelete={handleDeleteTeam}
          onAssign={handleAssignToTeam}
          onRefresh={() => fetchTeams(1, teamsSearch)}
          pagination={
            teamsPagination.totalPages > 0
              ? {
                  currentPage: teamsPagination.currentPage,
                  totalPages: teamsPagination.totalPages,
                  totalItems: teamsPagination.totalItems,
                  itemsPerPage: teamsPagination.itemsPerPage,
                  onPageChange: (page) => fetchTeams(page, teamsSearch),
                }
              : undefined
          }
        />
      </BottomDrawer>

      <BottomDrawer
        isOpen={showProjectView}
        onClose={() => {
          setShowProjectView(false);
          setProjectsSearch('');
        }}
        title="All Projects"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search projects..."
            value={projectsSearch}
            onChange={(e) => {
              setProjectsSearch(e.target.value);
              fetchProjects(1, e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <ProjectView
          projects={projects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onRefresh={() => fetchProjects(1, projectsSearch)}
          pagination={
            projectsPagination.totalPages > 0
              ? {
                  currentPage: projectsPagination.currentPage,
                  totalPages: projectsPagination.totalPages,
                  totalItems: projectsPagination.totalItems,
                  itemsPerPage: projectsPagination.itemsPerPage,
                  onPageChange: (page) => fetchProjects(page, projectsSearch),
                }
              : undefined
          }
        />
      </BottomDrawer>

      <BottomDrawer
        isOpen={showTaskView}
        onClose={() => {
          setShowTaskView(false);
          setTasksSearch('');
        }}
        title="All Tasks"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={tasksSearch}
            onChange={(e) => {
              setTasksSearch(e.target.value);
              fetchTasks(1, e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <TaskView
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onAssign={handleAssignTask}
          onRefresh={() => fetchTasks(1, tasksSearch)}
          pagination={
            tasksPagination.totalPages > 0
              ? {
                  currentPage: tasksPagination.currentPage,
                  totalPages: tasksPagination.totalPages,
                  totalItems: tasksPagination.totalItems,
                  itemsPerPage: tasksPagination.itemsPerPage,
                  onPageChange: (page) => fetchTasks(page, tasksSearch),
                }
              : undefined
          }
        />
      </BottomDrawer>

      <BottomDrawer
        isOpen={showUserView}
        onClose={() => {
          setShowUserView(false);
          setUsersSearch('');
        }}
        title="All Users"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={usersSearch}
            onChange={(e) => {
              setUsersSearch(e.target.value);
              fetchUsers(1, e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <UserView
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onRefresh={() => fetchUsers(1, usersSearch)}
          pagination={
            usersPagination.totalPages > 0
              ? {
                  currentPage: usersPagination.currentPage,
                  totalPages: usersPagination.totalPages,
                  totalItems: usersPagination.totalItems,
                  itemsPerPage: usersPagination.itemsPerPage,
                  onPageChange: (page) => fetchUsers(page, usersSearch),
                }
              : undefined
          }
        />
      </BottomDrawer>

      {/* User Selection Modal */}
      <UserSelectionModal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setModalContext(null);
        }}
        onSelect={handleUserSelection}
        title={
          modalContext?.type === 'task'
            ? 'Assign Task To User'
            : 'Assign User To Team'
        }
        currentUserId={modalContext?.currentUserId}
      />

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
