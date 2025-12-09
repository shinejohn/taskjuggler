import React, { useEffect, useState } from 'react';
import { TrackingParams } from './TaskInvitationPage';
import { AppLayout } from '../Layout/AppLayout';
import { CalendarIcon, ClockIcon, AlertCircleIcon, UserIcon, MessageSquareIcon, PaperclipIcon, FileTextIcon } from 'lucide-react';
interface TaskViewPageProps {
  trackingParams: TrackingParams;
  onRespond: (response: 'accept' | 'reject', trackingParams: TrackingParams) => void;
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
}
interface TaskData {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  creator: {
    name: string;
    avatar: string;
    email: string;
  };
  attachments?: {
    name: string;
    type: string;
    size: string;
  }[];
  location?: string;
  notes?: string;
}
export function TaskViewPage({
  trackingParams,
  onRespond,
  onCreateTaskClick,
  onTaskReportClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLogoutClick
}: TaskViewPageProps) {
  const [task, setTask] = useState<TaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    // Update tracking params to indicate task was viewed
    const updatedParams: TrackingParams = {
      ...trackingParams,
      step: 'viewed',
      timestamp: Date.now()
    };
    // Log the view event
    console.log('Task viewed', updatedParams);
    // In a real app, we would send this tracking data to the server
    // trackTaskViewed(updatedParams)
    // Fetch task data
    fetchTaskData();
  }, [trackingParams]);
  const fetchTaskData = async () => {
    setLoading(true);
    try {
      // In a real app, we would fetch task data from the server
      // const response = await api.getTask(trackingParams.taskId)
      // setTask(response.data)
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTask({
        id: trackingParams.taskId,
        title: 'Website Redesign Project',
        description: 'Complete overhaul of company website with modern design principles. We need to update the homepage, about page, and contact page with new branding guidelines.',
        dueDate: '2023-12-15',
        priority: 'high',
        creator: {
          name: 'Alex Johnson',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          email: 'alex@example.com'
        },
        attachments: [{
          name: 'brand-guidelines-2023.pdf',
          type: 'pdf',
          size: '2.4 MB'
        }, {
          name: 'website-mockups.zip',
          type: 'zip',
          size: '8.7 MB'
        }],
        location: 'Remote',
        notes: 'Please review the attached brand guidelines before starting. We need this completed before the holiday break.'
      });
    } catch (err) {
      setError('Failed to load task details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleAccept = () => {
    const updatedParams: TrackingParams = {
      ...trackingParams,
      step: 'responded',
      timestamp: Date.now()
    };
    onRespond('accept', updatedParams);
  };
  const handleReject = () => {
    const updatedParams: TrackingParams = {
      ...trackingParams,
      step: 'responded',
      timestamp: Date.now()
    };
    onRespond('reject', updatedParams);
  };
  // Priority badge color
  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <AppLayout onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Task Invitation
            </h1>
            <p className="mt-1 text-gray-600">
              Review the task details below and decide if you want to accept or
              decline.
            </p>
          </div>
          {loading ? <div className="bg-white rounded-lg shadow-md p-8 flex justify-center">
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading task details...</p>
              </div>
            </div> : error ? <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <AlertCircleIcon size={48} className="text-red-500 mx-auto mb-4" />
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Error Loading Task
                </h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button onClick={fetchTaskData} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                  Try Again
                </button>
              </div>
            </div> : task ? <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Task Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {task.title}
                  </h2>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}{' '}
                    Priority
                  </span>
                </div>
                <div className="flex items-center mb-4">
                  <img src={task.creator.avatar} alt={task.creator.name} className="h-10 w-10 rounded-full mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Assigned by {task.creator.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {task.creator.email}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon size={16} className="mr-1 text-gray-400" />
                    Due:{' '}
                    {new Date(task.dueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
                  </div>
                  {task.location && <div className="flex items-center text-sm text-gray-600">
                      <UserIcon size={16} className="mr-1 text-gray-400" />
                      Location: {task.location}
                    </div>}
                </div>
              </div>
              {/* Task Details */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-900">{task.description}</p>
                </div>
                {task.notes && <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </h3>
                    <p className="text-gray-900">{task.notes}</p>
                  </div>}
                {task.attachments && task.attachments.length > 0 && <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Attachments
                    </h3>
                    <div className="space-y-2">
                      {task.attachments.map((attachment, index) => <div key={index} className="flex items-center p-3 border border-gray-200 rounded-md">
                          <div className="p-2 bg-gray-100 rounded-md mr-3">
                            <FileTextIcon size={20} className="text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {attachment.size}
                            </p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Download
                          </button>
                        </div>)}
                    </div>
                  </div>}
                {/* Decision Buttons */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Your Response
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Please indicate whether you can take on this task. If you
                    accept, you'll be able to set your own timeline for
                    completion.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                    <button onClick={handleAccept} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center">
                      Accept Task
                    </button>
                    <button onClick={handleReject} className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-md flex items-center justify-center">
                      Decline Task
                    </button>
                  </div>
                </div>
              </div>
              {/* Task Actions */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center" onClick={onChatClick}>
                    <MessageSquareIcon size={16} className="mr-1" />
                    Message Assignor
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    <PaperclipIcon size={16} className="mr-1" />
                    Request More Info
                  </button>
                </div>
              </div>
            </div> : null}
        </div>
      </div>
    </AppLayout>;
}