import React from 'react';
import { AppLayout } from './Layout/AppLayout';
import { CheckCircleIcon, ClockIcon, AlertCircleIcon, PlusCircleIcon, ListChecksIcon, FileTextIcon, DollarSignIcon } from 'lucide-react';
interface DashboardProps {
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
}
export function Dashboard({
  onCreateTaskClick,
  onTaskReportClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLogoutClick
}: DashboardProps) {
  // Mock data
  const stats = {
    tasksAssigned: 12,
    tasksCompleted: 8,
    tasksPending: 4,
    tasksOverdue: 1
  };
  const recentTasks = [{
    id: 1,
    title: 'Review Q4 Marketing Strategy',
    status: 'completed',
    dueDate: '2023-11-18',
    assignee: {
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  }, {
    id: 2,
    title: 'Prepare Financial Report',
    status: 'in-progress',
    dueDate: '2023-11-20',
    assignee: {
      name: 'Sarah Miller',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    }
  }, {
    id: 3,
    title: 'Update Website Content',
    status: 'pending',
    dueDate: '2023-11-25',
    assignee: {
      name: 'David Chen',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    }
  }];
  return <AppLayout onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back! Here's an overview of your tasks
            </p>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <ClockIcon size={24} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.tasksAssigned}
                  </div>
                  <div className="text-sm text-gray-600">Tasks Assigned</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <CheckCircleIcon size={24} className="text-green-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.tasksCompleted}
                  </div>
                  <div className="text-sm text-gray-600">Tasks Completed</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 mr-4">
                  <ClockIcon size={24} className="text-yellow-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.tasksPending}
                  </div>
                  <div className="text-sm text-gray-600">Tasks Pending</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 mr-4">
                  <AlertCircleIcon size={24} className="text-red-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.tasksOverdue}
                  </div>
                  <div className="text-sm text-gray-600">Tasks Overdue</div>
                </div>
              </div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={onCreateTaskClick} className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium transition-colors">
                <PlusCircleIcon size={20} className="mr-2" />
                Create New Task
              </button>
              <button onClick={onTaskReportClick} className="flex items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium transition-colors">
                <ListChecksIcon size={20} className="mr-2" />
                View Task Report
              </button>
              <button className="flex items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium transition-colors">
                <CheckCircleIcon size={20} className="mr-2" />
                Mark Tasks Complete
              </button>
            </div>
          </div>
          {/* Recent Tasks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Tasks</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentTasks.map(task => <div key={task.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={task.assignee.avatar} alt={task.assignee.name} className="w-10 h-10 rounded-full mr-4" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {task.title}
                        </h3>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-600 mr-4">
                            Assigned to: {task.assignee.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {task.status === 'completed' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon size={14} className="mr-1" />
                          Completed
                        </span>}
                      {task.status === 'in-progress' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <ClockIcon size={14} className="mr-1" />
                          In Progress
                        </span>}
                      {task.status === 'pending' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <ClockIcon size={14} className="mr-1" />
                          Pending
                        </span>}
                    </div>
                  </div>
                </div>)}
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
              <button onClick={onTaskReportClick} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Tasks
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>;
}