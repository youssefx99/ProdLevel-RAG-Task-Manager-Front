'use client';

import { useState, Fragment } from 'react';
import { Task, User, TaskStatus } from '@/types';
import { userApi } from '@/lib/api';
import { ChevronDown, ChevronRight, CheckSquare } from 'lucide-react';

interface TaskViewProps {
  tasks: Task[];
}

const statusConfig = {
  [TaskStatus.TODO]: {
    label: 'To Do',
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-200',
  },
  [TaskStatus.IN_PROGRESS]: {
    label: 'In Progress',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-200',
  },
  [TaskStatus.DONE]: {
    label: 'Done',
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-800 dark:text-green-200',
  },
};

export default function TaskView({ tasks }: TaskViewProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [taskUsers, setTaskUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const toggleTask = async (task: Task) => {
    const newExpanded = new Set(expandedTasks);

    if (newExpanded.has(task.id)) {
      newExpanded.delete(task.id);
    } else {
      newExpanded.add(task.id);
      // Fetch user for this task if not already loaded
      if (!taskUsers[task.id] && task.assignedTo) {
        setLoading({ ...loading, [task.id]: true });
        try {
          const response = await userApi.getById(task.assignedTo);
          setTaskUsers({ ...taskUsers, [task.id]: response.data });
        } catch (error) {
          console.error('Failed to fetch user:', error);
        } finally {
          setLoading({ ...loading, [task.id]: false });
        }
      }
    }

    setExpandedTasks(newExpanded);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <CheckSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p>No tasks found</p>
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
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Deadline
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {tasks.map((task) => (
            <Fragment key={task.id}>
              {/* Task Row */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleTask(task)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {expandedTasks.has(task.id) ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {task.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      statusConfig[task.status].bg
                    } ${statusConfig[task.status].text}`}
                  >
                    {statusConfig[task.status].label}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {task.deadline
                    ? new Date(task.deadline).toLocaleDateString()
                    : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(task.createdAt).toLocaleDateString()}
                </td>
              </tr>

              {/* Expanded User Details */}
              {expandedTasks.has(task.id) && (
                <tr key={`${task.id}-user`}>
                  <td
                    colSpan={5}
                    className="px-6 py-2 bg-blue-50 dark:bg-blue-900/10"
                  >
                    {loading[task.id] ? (
                      <div className="text-center py-4 text-gray-500">
                        Loading user details...
                      </div>
                    ) : taskUsers[task.id] ? (
                      <div className="ml-12 py-2">
                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                          Assigned To
                        </h4>
                        <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-4 max-w-md">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-blue-700 dark:text-blue-400 font-medium">
                                Name:
                              </span>
                              <span className="ml-2 text-blue-900 dark:text-blue-200">
                                {taskUsers[task.id].name}
                              </span>
                            </div>
                            <div>
                              <span className="text-blue-700 dark:text-blue-400 font-medium">
                                Email:
                              </span>
                              <span className="ml-2 text-blue-900 dark:text-blue-200">
                                {taskUsers[task.id].email}
                              </span>
                            </div>
                            <div>
                              <span className="text-blue-700 dark:text-blue-400 font-medium">
                                Role:
                              </span>
                              <span className="ml-2 text-blue-900 dark:text-blue-200">
                                {taskUsers[task.id].role}
                              </span>
                            </div>
                            {taskUsers[task.id].teamId && (
                              <div>
                                <span className="text-blue-700 dark:text-blue-400 font-medium">
                                  Team ID:
                                </span>
                                <span className="ml-2 text-blue-900 dark:text-blue-200 font-mono text-xs">
                                  {taskUsers[task.id].teamId}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        User not found
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
  );
}
