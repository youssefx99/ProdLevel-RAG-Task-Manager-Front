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
import ChatWidget from '@/components/ChatWidget';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Data state
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  // Form visibility state
  const [showUserForm, setShowUserForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);

  // View drawer visibility state
  const [showTeamView, setShowTeamView] = useState(false);
  const [showProjectView, setShowProjectView] = useState(false);
  const [showTaskView, setShowTaskView] = useState(false);

  // Selected items for editing
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Fetch functions
  const fetchUsers = async () => {
    try {
      const response = await userApi.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await taskApi.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectApi.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await teamApi.getAll();
      setTeams(response.data);
    } catch (error) {
      console.error('Failed to fetch teams', error);
    }
  };

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

    // Fetch all data
    fetchUsers();
    fetchTasks();
    fetchProjects();
    fetchTeams();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
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

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-black">Teams</h3>
              <span className="text-2xl font-bold text-orange-600">
                {teams.length}
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
                {projects.length}
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
                {tasks.length}
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
        onSuccess={fetchUsers}
      />

      <TaskForm
        isOpen={showTaskForm}
        onClose={() => {
          setShowTaskForm(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSuccess={fetchTasks}
      />

      <ProjectForm
        isOpen={showProjectForm}
        onClose={() => {
          setShowProjectForm(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        onSuccess={fetchProjects}
      />

      <TeamForm
        isOpen={showTeamForm}
        onClose={() => {
          setShowTeamForm(false);
          setSelectedTeam(null);
        }}
        team={selectedTeam}
        onSuccess={fetchTeams}
      />

      {/* Bottom Drawers for Viewing Data */}
      <BottomDrawer
        isOpen={showTeamView}
        onClose={() => setShowTeamView(false)}
        title="All Teams"
      >
        <TeamView teams={teams} />
      </BottomDrawer>

      <BottomDrawer
        isOpen={showProjectView}
        onClose={() => setShowProjectView(false)}
        title="All Projects"
      >
        <ProjectView projects={projects} />
      </BottomDrawer>

      <BottomDrawer
        isOpen={showTaskView}
        onClose={() => setShowTaskView(false)}
        title="All Tasks"
      >
        <TaskView tasks={tasks} />
      </BottomDrawer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
