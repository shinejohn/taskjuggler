import React, { useEffect, useState } from 'react';
import { AppLayout } from '../Layout/AppLayout';
import { UserIcon, CalendarIcon, ClockIcon, AlertCircleIcon, PaperclipIcon, MapPinIcon, PhoneIcon, MailIcon, InfoIcon, SendIcon, MessageSquareIcon, CheckCircleIcon, EditIcon, TrashIcon, FileTextIcon, ArrowLeftIcon, CheckIcon, XIcon, ExternalLinkIcon, PlusCircleIcon } from 'lucide-react';
type Priority = 'low' | 'medium' | 'high';
type AssignmentOption = 'friend' | 'invite' | 'marketplace-post' | 'marketplace-browse' | 'self';
type TaskStatus = 'not_started' | 'in_progress' | 'paused' | 'in_review' | 'revision_requested' | 'completed' | 'cancelled' | 'pending_acceptance' | 'declined';
interface TaskDetailProps {
  taskId?: string;
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onMyTasksClick?: () => void;
  onTaskMarketClick?: () => void;
  onDoerMarketClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
  onBackToTasks?: () => void;
  onEditTask?: (taskId: string) => void;
}
interface TaskData {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: Priority;
  location: string;
  locationContactName: string;
  locationContactPhone: string;
  attachments: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  notes: string;
  assignmentOption: AssignmentOption;
  assignedTo: {
    id: string;
    name: string;
    avatar: string;
    type: 'human' | 'ai';
    status: string;
    email?: string;
    phone?: string;
    rating?: number;
    skills?: string[];
  } | null;
  taskVisibility: 'public' | 'private';
  taskBudget: string;
  requiredSkills: string[];
  applicationsDeadline: string;
  status: TaskStatus;
  progress: number;
  createdAt: string;
  lastUpdated: string;
  activity: Array<{
    id: string;
    type: 'status_change' | 'message' | 'file' | 'note';
    content: string;
    timestamp: string;
    user: {
      id: string;
      name: string;
      avatar: string;
      isClient: boolean;
    };
  }>;
  milestones?: Array<{
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }>;
}
// Time entry interface
interface TimeEntry {
  hours: number;
  minutes: number;
  description: string;
  date: string;
}
export function TaskDetailPage({
  taskId = 'TASK-1001',
  onCreateTaskClick,
  onTaskReportClick,
  onMyTasksClick,
  onTaskMarketClick,
  onDoerMarketClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLogoutClick,
  onBackToTasks,
  onEditTask
}: TaskDetailProps) {
  const [task, setTask] = useState<TaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'activity' | 'files' | 'messages'>('details');
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState<TaskStatus | ''>('');
  const [statusNote, setStatusNote] = useState('');
  // New state variables for the additional modals
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showTimeLogModal, setShowTimeLogModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  // File upload state
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState('');
  // Time log state
  const [timeEntry, setTimeEntry] = useState<TimeEntry>({
    hours: 0,
    minutes: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  // Edit task state
  const [editedTask, setEditedTask] = useState<Partial<TaskData> | null>(null);
  // Message state
  const [newMessage, setNewMessage] = useState('');
  // Fetch task data
  useEffect(() => {
    const fetchTaskData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await api.getTaskById(taskId)
        // setTask(response.data)
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock task data
        const mockTask: TaskData = {
          id: taskId,
          title: 'Website Redesign for Small Business',
          description: 'Need a complete redesign of our 5-page business website. Looking for modern design with mobile responsiveness. Current site is outdated and not mobile-friendly. Please include a new logo design and updated color scheme that matches our brand identity.',
          dueDate: '2023-12-15',
          dueTime: '18:00',
          priority: 'high',
          location: 'Remote',
          locationContactName: 'Sarah Miller',
          locationContactPhone: '555-123-4567',
          attachments: [{
            id: 'att-1',
            name: 'current-website-screenshots.pdf',
            type: 'pdf',
            url: '#'
          }, {
            id: 'att-2',
            name: 'brand-guidelines.docx',
            type: 'docx',
            url: '#'
          }],
          notes: 'Please focus on improving the user experience and making the site mobile-friendly. We want a modern, clean design that loads quickly.',
          assignmentOption: 'marketplace-browse',
          assignedTo: {
            id: 'user-123',
            name: 'Alex Johnson',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            type: 'human',
            status: 'available',
            rating: 4.8,
            skills: ['Web Design', 'UI/UX', 'JavaScript']
          },
          taskVisibility: 'public',
          taskBudget: '500',
          requiredSkills: ['Web Design', 'HTML/CSS', 'JavaScript', 'Responsive Design'],
          applicationsDeadline: '2023-11-30',
          status: 'in_progress',
          progress: 65,
          createdAt: '2023-11-01T14:32:00Z',
          lastUpdated: '2023-11-10T09:15:00Z',
          activity: [{
            id: 'act-1',
            type: 'status_change',
            content: 'Task status changed to in_progress',
            timestamp: '2023-11-05T10:30:00Z',
            user: {
              id: 'user-123',
              name: 'Alex Johnson',
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
              isClient: false
            }
          }, {
            id: 'act-2',
            type: 'message',
            content: "I've started working on the wireframes. Will share a draft by tomorrow.",
            timestamp: '2023-11-06T15:45:00Z',
            user: {
              id: 'user-123',
              name: 'Alex Johnson',
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
              isClient: false
            }
          }, {
            id: 'act-3',
            type: 'file',
            content: 'Uploaded wireframes-draft-v1.pdf',
            timestamp: '2023-11-07T11:20:00Z',
            user: {
              id: 'user-123',
              name: 'Alex Johnson',
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
              isClient: false
            }
          }, {
            id: 'act-4',
            type: 'message',
            content: 'The wireframes look great! Could we adjust the navigation menu to be more prominent?',
            timestamp: '2023-11-08T09:15:00Z',
            user: {
              id: 'client-456',
              name: 'Sarah Miller',
              avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
              isClient: true
            }
          }, {
            id: 'act-5',
            type: 'message',
            content: "Sure, I'll make those adjustments and send an updated version.",
            timestamp: '2023-11-08T10:30:00Z',
            user: {
              id: 'user-123',
              name: 'Alex Johnson',
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
              isClient: false
            }
          }],
          milestones: [{
            id: 'ms-1',
            title: 'Wireframes Approval',
            dueDate: '2023-11-10',
            completed: true
          }, {
            id: 'ms-2',
            title: 'Design Mockups',
            dueDate: '2023-11-25',
            completed: false
          }, {
            id: 'ms-3',
            title: 'Development & Testing',
            dueDate: '2023-12-10',
            completed: false
          }, {
            id: 'ms-4',
            title: 'Final Delivery',
            dueDate: '2023-12-15',
            completed: false
          }]
        };
        setTask(mockTask);
        // Initialize editedTask with the fetched task data
        setEditedTask(mockTask);
      } catch (err) {
        console.error('Error fetching task data:', err);
        setError('Failed to load task details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTaskData();
  }, [taskId]);
  // Helper functions
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };
  const getDaysRemaining = (dateString: string) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    // Reset time to compare just dates
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  // Handler functions
  const handleStatusUpdate = () => {
    if (!newStatus) return;
    // In a real app, this would call an API to update the task status
    if (task) {
      const updatedTask = {
        ...task,
        status: newStatus,
        activity: [{
          id: `act-${Date.now()}`,
          type: 'status_change' as const,
          content: `Task status changed to ${newStatus}${statusNote ? `: ${statusNote}` : ''}`,
          timestamp: new Date().toISOString(),
          user: {
            id: 'current-user',
            name: 'You',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            isClient: false
          }
        }, ...task.activity]
      };
      setTask(updatedTask);
      setShowStatusUpdateModal(false);
      setNewStatus('');
      setStatusNote('');
    }
  };
  // Handle milestone completion
  const handleMilestoneComplete = (milestoneId: string) => {
    if (task && task.milestones) {
      const updatedMilestones = task.milestones.map(milestone => milestone.id === milestoneId ? {
        ...milestone,
        completed: true
      } : milestone);
      const updatedActivity = [{
        id: `act-${Date.now()}`,
        type: 'status_change' as const,
        content: `Milestone completed: ${task.milestones.find(m => m.id === milestoneId)?.title}`,
        timestamp: new Date().toISOString(),
        user: {
          id: 'current-user',
          name: 'You',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          isClient: false
        }
      }, ...task.activity];
      setTask({
        ...task,
        milestones: updatedMilestones,
        activity: updatedActivity
      });
    }
  };
  // Handle file upload
  const handleFileUpload = () => {
    if (!fileToUpload) return;
    if (task) {
      // Create a new attachment
      const newAttachment = {
        id: `att-${Date.now()}`,
        name: fileToUpload.name,
        type: fileToUpload.name.split('.').pop() || 'file',
        url: '#' // In a real app, this would be the URL to the uploaded file
      };
      // Create a new activity entry
      const newActivity = {
        id: `act-${Date.now()}`,
        type: 'file' as const,
        content: `Uploaded ${fileToUpload.name}${fileDescription ? `: ${fileDescription}` : ''}`,
        timestamp: new Date().toISOString(),
        user: {
          id: 'current-user',
          name: 'You',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          isClient: false
        }
      };
      // Update task with new attachment and activity
      setTask({
        ...task,
        attachments: [newAttachment, ...task.attachments],
        activity: [newActivity, ...task.activity]
      });
      // Reset file upload state
      setFileToUpload(null);
      setFileDescription('');
      setShowFileUploadModal(false);
    }
  };
  // Handle time log
  const handleTimeLog = () => {
    if (task && (timeEntry.hours > 0 || timeEntry.minutes > 0)) {
      // Create a new activity entry
      const newActivity = {
        id: `act-${Date.now()}`,
        type: 'note' as const,
        content: `Logged time: ${timeEntry.hours}h ${timeEntry.minutes}m${timeEntry.description ? ` - ${timeEntry.description}` : ''}`,
        timestamp: new Date().toISOString(),
        user: {
          id: 'current-user',
          name: 'You',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          isClient: false
        }
      };
      // Update task with new activity
      setTask({
        ...task,
        activity: [newActivity, ...task.activity]
      });
      // Reset time log state
      setTimeEntry({
        hours: 0,
        minutes: 0,
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowTimeLogModal(false);
    }
  };
  // Handle sending a message
  const handleSendMessage = () => {
    if (task && newMessage.trim()) {
      // Create a new message activity
      const newMessageActivity = {
        id: `act-${Date.now()}`,
        type: 'message' as const,
        content: newMessage,
        timestamp: new Date().toISOString(),
        user: {
          id: 'current-user',
          name: 'You',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          isClient: false
        }
      };
      // Update task with new message
      setTask({
        ...task,
        activity: [newMessageActivity, ...task.activity]
      });
      // Reset message state
      setNewMessage('');
    }
  };
  // Handle edit task
  const handleEditTask = () => {
    if (task && editedTask) {
      // Update task with edited values
      const updatedTask = {
        ...task,
        ...editedTask,
        lastUpdated: new Date().toISOString(),
        activity: [{
          id: `act-${Date.now()}`,
          type: 'status_change' as const,
          content: 'Task details updated',
          timestamp: new Date().toISOString(),
          user: {
            id: 'current-user',
            name: 'You',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            isClient: false
          }
        }, ...task.activity]
      };
      setTask(updatedTask);
      setShowEditTaskModal(false);
    }
  };
  // Handle mark as completed
  const handleMarkAsCompleted = () => {
    if (task) {
      const updatedTask = {
        ...task,
        status: 'completed' as TaskStatus,
        progress: 100,
        activity: [{
          id: `act-${Date.now()}`,
          type: 'status_change' as const,
          content: 'Task marked as completed',
          timestamp: new Date().toISOString(),
          user: {
            id: 'current-user',
            name: 'You',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            isClient: false
          }
        }, ...task.activity]
      };
      setTask(updatedTask);
    }
  };
  // New function for printing task details
  const handlePrintTask = () => {
    if (!task) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print task details');
      return;
    }
    const statusLabel = task.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    const styles = `
      body { 
        font-family: system-ui, -apple-system, sans-serif; 
        padding: 20px; 
      }
      h1 { 
        font-size: 24px; 
        margin-bottom: 10px; 
      }
      .task-id { 
        color: #666; 
        margin-bottom: 15px; 
      }
      .section { 
        margin-bottom: 20px; 
      }
      .section-title { 
        font-size: 18px; 
        margin-bottom: 10px; 
        border-bottom: 1px solid #eee; 
        padding-bottom: 5px; 
      }
      .field { 
        margin-bottom: 8px; 
      }
      .field-label { 
        font-weight: bold; 
        display: inline-block; 
        width: 120px; 
      }
      .description { 
        white-space: pre-line; 
      }
      .footer { 
        margin-top: 30px; 
        text-align: center; 
        font-size: 12px; 
        color: #666; 
      }
      @media print {
        body { 
          padding: 0; 
        }
        button { 
          display: none; 
        }
      }
    `;
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Task Details - ${task.id}</title>
          <style>{`;
    $;
    {
      styles;
    }
    ;
    `}</style>
        </head>
        <body>
          <h1>${task.title}</h1>
          <div class="task-id">ID: ${task.id}</div>
          <div class="section">
            <div class="section-title">Task Details</div>
            <div class="field"><span class="field-label">Status:</span> ${statusLabel}</div>
            <div class="field"><span class="field-label">Priority:</span> ${priorityLabel}</div>
            <div class="field"><span class="field-label">Due Date:</span> ${formatDate(task.dueDate)}${task.dueTime ? ` at ${task.dueTime}` : ''}</div>
            ${task.taskBudget ? `<div class="field"><span class="field-label">Budget:</span> $${task.taskBudget}</div>` : ''}
            <div class="field"><span class="field-label">Created:</span> ${formatDate(task.createdAt)}</div>
            <div class="field"><span class="field-label">Last Updated:</span> ${formatDate(task.lastUpdated)}</div>
          </div>
          <div class="section">
            <div class="section-title">Description</div>
            <div class="description">${task.description}</div>
          </div>
          ${task.notes ? `
          <div class="section">
            <div class="section-title">Additional Notes</div>
            <div class="description">${task.notes}</div>
          </div>
          ` : ''}
          ${task.location ? `
          <div class="section">
            <div class="section-title">Location</div>
            <div class="field">${task.location}</div>
            ${task.locationContactName ? `
              <div class="field"><span class="field-label">Contact:</span> ${task.locationContactName}</div>
            ` : ''}
            ${task.locationContactPhone ? `
              <div class="field"><span class="field-label">Phone:</span> ${task.locationContactPhone}</div>
            ` : ''}
          </div>
          ` : ''}
          ${task.requiredSkills && task.requiredSkills.length > 0 ? `
          <div class="section">
            <div class="section-title">Required Skills</div>
            <div>${task.requiredSkills.join(', ')}</div>
          </div>
          ` : ''}
          ${task.assignedTo ? `
          <div class="section">
            <div class="section-title">Assigned To</div>
            <div class="field">${task.assignedTo.name}</div>
          </div>
          ` : ''}
          ${task.milestones && task.milestones.length > 0 ? `
          <div class="section">
            <div class="section-title">Milestones</div>
            ${task.milestones.map(milestone => `
              <div class="field">
                ${milestone.completed ? '✓ ' : '○ '}
                ${milestone.title} (Due: ${formatDate(milestone.dueDate)})
              </div>
            `).join('')}
          </div>
          ` : ''}
          <div class="footer">
            Generated on ${new Date().toLocaleDateString()} • Task Management System
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;
    // Write to the print window
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };
  // Render loading state
  if (loading) {
    return <AppLayout onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onMyTasksClick={onMyTasksClick} onTaskMarketClick={onTaskMarketClick} onDoerMarketClick={onDoerMarketClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick}>
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 flex justify-center">
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading task details...</p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>;
  }
  // Render error state
  if (error) {
    return <AppLayout onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onMyTasksClick={onMyTasksClick} onTaskMarketClick={onTaskMarketClick} onDoerMarketClick={onDoerMarketClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick}>
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <AlertCircleIcon size={48} className="text-red-500 mx-auto mb-4" />
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Error Loading Task
                </h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>;
  }
  // If task is null (should not happen with proper loading state)
  if (!task) {
    return <AppLayout onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onMyTasksClick={onMyTasksClick} onTaskMarketClick={onTaskMarketClick} onDoerMarketClick={onDoerMarketClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick}>
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <AlertCircleIcon size={48} className="text-red-500 mx-auto mb-4" />
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Task Not Found
                </h2>
                <p className="text-gray-600 mb-4">
                  The requested task could not be found.
                </p>
                <button onClick={onBackToTasks} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                  Back to Tasks
                </button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>;
  }
  // Calculate days remaining and urgency
  const daysRemaining = getDaysRemaining(task.dueDate);
  const isOverdue = daysRemaining < 0;
  const isUrgent = daysRemaining <= 3 && !isOverdue && task.status !== 'completed';
  // Get status badge color
  const getStatusBadgeColor = (status: TaskStatus) => {
    switch (status) {
      case 'not_started':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_review':
        return 'bg-purple-100 text-purple-800';
      case 'revision_requested':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending_acceptance':
        return 'bg-orange-100 text-orange-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  // Get priority badge color
  const getPriorityBadgeColor = (priority: Priority) => {
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
  // Main render
  return <AppLayout onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onMyTasksClick={onMyTasksClick} onTaskMarketClick={onTaskMarketClick} onDoerMarketClick={onDoerMarketClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header with back button */}
          <div className="mb-6 flex items-center">
            <button onClick={onBackToTasks} className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon size={20} className="mr-2" />
              Back to Tasks
            </button>
          </div>
          {/* Task header section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(task.status)}`}>
                      {task.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}{' '}
                      Priority
                    </span>
                    {(isUrgent || isOverdue) && <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isOverdue ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                        <AlertCircleIcon size={12} className="mr-1" />
                        {isOverdue ? 'Overdue' : 'Urgent'}
                      </span>}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {task.title}
                  </h1>
                  <div className="text-sm text-gray-500 mb-4">
                    Task ID: {task.id} • Created: {formatDate(task.createdAt)} •
                    Last Updated: {formatDate(task.lastUpdated)}
                  </div>
                  {task.progress > 0 && task.status === 'in_progress' && <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Progress
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {task.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{
                      width: `${task.progress}%`
                    }}></div>
                      </div>
                    </div>}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button onClick={() => setShowEditTaskModal(true)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                    <EditIcon size={16} className="mr-2" />
                    Edit Task
                  </button>
                  <button onClick={() => setShowStatusUpdateModal(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                    <CheckCircleIcon size={16} className="mr-2" />
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Main content area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Task details */}
            <div className="md:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    <button className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('details')}>
                      Details
                    </button>
                    <button className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${activeTab === 'activity' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('activity')}>
                      Activity
                    </button>
                    <button className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${activeTab === 'files' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('files')}>
                      Files
                    </button>
                    <button className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${activeTab === 'messages' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('messages')}>
                      Messages
                    </button>
                  </nav>
                </div>
                {/* Tab content */}
                <div className="p-6">
                  {/* Details tab */}
                  {activeTab === 'details' && <div>
                      <div className="mb-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-3">
                          Description
                        </h2>
                        <p className="text-gray-700 whitespace-pre-line">
                          {task.description}
                        </p>
                      </div>
                      {task.notes && <div className="mb-6">
                          <h2 className="text-lg font-medium text-gray-900 mb-3">
                            Additional Notes
                          </h2>
                          <p className="text-gray-700 whitespace-pre-line">
                            {task.notes}
                          </p>
                        </div>}
                      {task.location && <div className="mb-6">
                          <h2 className="text-lg font-medium text-gray-900 mb-3">
                            Location
                          </h2>
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start">
                              <MapPinIcon size={20} className="text-gray-400 mr-2 mt-0.5" />
                              <div>
                                <p className="text-gray-700">{task.location}</p>
                                {task.locationContactName && <div className="mt-2">
                                    <p className="text-sm font-medium text-gray-700">
                                      Contact:
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {task.locationContactName}
                                    </p>
                                    {task.locationContactPhone && <p className="text-sm text-gray-600 flex items-center mt-1">
                                        <PhoneIcon size={14} className="mr-1" />
                                        {task.locationContactPhone}
                                      </p>}
                                  </div>}
                              </div>
                            </div>
                          </div>
                        </div>}
                      {task.requiredSkills.length > 0 && <div className="mb-6">
                          <h2 className="text-lg font-medium text-gray-900 mb-3">
                            Required Skills
                          </h2>
                          <div className="flex flex-wrap gap-2">
                            {task.requiredSkills.map((skill, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {skill}
                              </span>)}
                          </div>
                        </div>}
                      {task.milestones && task.milestones.length > 0 && <div className="mb-6">
                          <h2 className="text-lg font-medium text-gray-900 mb-3">
                            Milestones
                          </h2>
                          <div className="space-y-3">
                            {task.milestones.map(milestone => <div key={milestone.id} className={`p-3 border rounded-md ${milestone.completed ? 'bg-green-50 border-green-200' : 'border-gray-200'}`}>
                                <div className="flex items-center">
                                  <div className={`p-1 rounded-full ${milestone.completed ? 'bg-green-100' : 'bg-gray-100'} mr-3`}>
                                    {milestone.completed ? <CheckIcon size={16} className="text-green-600" /> : <ClockIcon size={16} className="text-gray-400" />}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {milestone.title}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Due: {formatDate(milestone.dueDate)}
                                    </div>
                                  </div>
                                  {!milestone.completed && <button className="ml-auto text-sm text-blue-600 hover:text-blue-800" onClick={() => handleMilestoneComplete(milestone.id)}>
                                      Mark Complete
                                    </button>}
                                </div>
                              </div>)}
                          </div>
                        </div>}
                    </div>}
                  {/* Activity tab */}
                  {activeTab === 'activity' && <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900">
                          Activity Timeline
                        </h2>
                        <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                          <PlusCircleIcon size={16} className="mr-1" />
                          Add Note
                        </button>
                      </div>
                      <div className="space-y-6">
                        {task.activity.map((activity, index) => <div key={activity.id} className="flex">
                            <div className="mr-4 relative">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                {activity.type === 'status_change' && <CheckCircleIcon size={20} className="text-blue-600" />}
                                {activity.type === 'message' && <MessageSquareIcon size={20} className="text-blue-600" />}
                                {activity.type === 'file' && <PaperclipIcon size={20} className="text-blue-600" />}
                                {activity.type === 'note' && <FileTextIcon size={20} className="text-blue-600" />}
                              </div>
                              {index < task.activity.length - 1 && <div className="absolute top-10 bottom-0 left-5 w-0.5 bg-gray-200"></div>}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <img src={activity.user.avatar} alt={activity.user.name} className="w-5 h-5 rounded-full mr-2" />
                                <span className="font-medium text-gray-900">
                                  {activity.user.name}
                                </span>
                                <span className="text-gray-500 text-sm ml-2">
                                  {formatDateTime(activity.timestamp)}
                                </span>
                              </div>
                              <div className="mt-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                                {activity.content}
                              </div>
                              {activity.type === 'message' && <button className="mt-1 text-sm text-blue-600 hover:text-blue-800" onClick={() => setActiveTab('messages')}>
                                  Reply
                                </button>}
                            </div>
                          </div>)}
                      </div>
                    </div>}
                  {/* Files tab */}
                  {activeTab === 'files' && <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900">
                          Files & Attachments
                        </h2>
                        <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center" onClick={() => setShowFileUploadModal(true)}>
                          <PlusCircleIcon size={16} className="mr-1" />
                          Upload File
                        </button>
                      </div>
                      {task.attachments.length > 0 ? <div className="space-y-3">
                          {task.attachments.map(attachment => <div key={attachment.id} className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                              <div className="p-2 bg-gray-100 rounded-md mr-3">
                                <FileTextIcon size={20} className="text-gray-500" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                  {attachment.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {attachment.type.toUpperCase()}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                  <ExternalLinkIcon size={18} />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                  <TrashIcon size={18} />
                                </button>
                              </div>
                            </div>)}
                        </div> : <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                          <PaperclipIcon size={36} className="mx-auto text-gray-400 mb-4" />
                          <h3 className="text-sm font-medium text-gray-900 mb-1">
                            No files attached
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Upload files related to this task
                          </p>
                          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700" onClick={() => setShowFileUploadModal(true)}>
                            <PlusCircleIcon size={16} className="mr-2" />
                            Upload File
                          </button>
                        </div>}
                    </div>}
                  {/* Messages tab */}
                  {activeTab === 'messages' && <div>
                      <div className="mb-4">
                        <h2 className="text-lg font-medium text-gray-900 mb-3">
                          Messages
                        </h2>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="space-y-4 max-h-80 overflow-y-auto mb-4">
                            {task.activity.filter(activity => activity.type === 'message').map(message => <div key={message.id} className={`flex ${message.user.isClient ? 'justify-start' : 'justify-end'}`}>
                                  <div className={`max-w-xs sm:max-w-md rounded-lg p-3 ${message.user.isClient ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>
                                    <div className="flex items-center mb-1">
                                      <img src={message.user.avatar} alt={message.user.name} className="w-5 h-5 rounded-full mr-2" />
                                      <span className="text-xs font-medium">
                                        {message.user.name}
                                      </span>
                                      <span className="text-xs text-gray-500 ml-2">
                                        {new Date(message.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                                      </span>
                                    </div>
                                    <p className="text-sm">{message.content}</p>
                                  </div>
                                </div>)}
                          </div>
                          <div className="relative">
                            <textarea placeholder="Type your message here..." rows={3} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={newMessage} onChange={e => setNewMessage(e.target.value)}></textarea>
                            <div className="absolute bottom-2 right-2">
                              <button className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                                <SendIcon size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>}
                </div>
              </div>
            </div>
            {/* Right column - Task sidebar */}
            <div>
              {/* Task details card */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Task Details
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6 space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Due Date
                    </div>
                    <div className="mt-1 flex items-center">
                      <CalendarIcon size={16} className="text-gray-400 mr-1" />
                      <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatDate(task.dueDate)}
                        {task.dueTime && ` at ${task.dueTime}`}
                      </span>
                    </div>
                    {task.status !== 'completed' && <div className={`text-xs mt-1 ${isOverdue ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-500'}`}>
                        {isOverdue ? `Overdue by ${Math.abs(daysRemaining)} days` : `${daysRemaining} days remaining`}
                      </div>}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Priority
                    </div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                  {task.assignedTo && <div>
                      <div className="text-sm font-medium text-gray-500">
                        Assigned To
                      </div>
                      <div className="mt-1 flex items-center">
                        <img src={task.assignedTo.avatar} alt={task.assignedTo.name} className="h-8 w-8 rounded-full mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {task.assignedTo.name}
                            {task.assignedTo.type === 'ai' && <span className="ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                                AI
                              </span>}
                          </div>
                          {task.assignedTo.rating && <div className="text-xs text-gray-500">
                              Rating: {task.assignedTo.rating} ★
                            </div>}
                        </div>
                      </div>
                    </div>}
                  {task.taskBudget && <div>
                      <div className="text-sm font-medium text-gray-500">
                        Budget
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        ${task.taskBudget}
                      </div>
                    </div>}
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Visibility
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                      {task.taskVisibility === 'public' ? 'Public' : 'Private'}
                    </div>
                  </div>
                  {task.applicationsDeadline && <div>
                      <div className="text-sm font-medium text-gray-500">
                        Applications Deadline
                      </div>
                      <div className="mt-1 text-sm text-gray-900">
                        {formatDate(task.applicationsDeadline)}
                      </div>
                    </div>}
                </div>
              </div>
              {/* Quick actions card */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Quick Actions
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6 space-y-3">
                  <button onClick={() => setShowStatusUpdateModal(true)} className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    <CheckCircleIcon size={16} className="mr-2" />
                    Update Status
                  </button>
                  <button onClick={() => setActiveTab('messages')} className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <MessageSquareIcon size={16} className="mr-2" />
                    Send Message
                  </button>
                  <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" onClick={() => setShowFileUploadModal(true)}>
                    <PaperclipIcon size={16} className="mr-2" />
                    Upload File
                  </button>
                  <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" onClick={() => setShowTimeLogModal(true)}>
                    <ClockIcon size={16} className="mr-2" />
                    Log Time
                  </button>
                  <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" onClick={handlePrintTask}>
                    <FileTextIcon size={16} className="mr-2" />
                    Print Task
                  </button>
                  {task.status !== 'completed' && <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-green-500 rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50" onClick={handleMarkAsCompleted}>
                      <CheckIcon size={16} className="mr-2" />
                      Mark as Completed
                    </button>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Status update modal */}
      {showStatusUpdateModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Update Task Status
              </h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowStatusUpdateModal(false)}>
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={newStatus} onChange={e => setNewStatus(e.target.value as TaskStatus)}>
                  <option value="">Select a status...</option>
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="paused">Paused</option>
                  <option value="in_review">In Review</option>
                  <option value="revision_requested">Revision Requested</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Note (Optional)
                </label>
                <textarea className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" rows={3} placeholder="Add a note about this status update..." value={statusNote} onChange={e => setStatusNote(e.target.value)}></textarea>
              </div>
              <div className="flex items-center mb-4">
                <input type="checkbox" id="notify-client" className="h-4 w-4 text-blue-600 border-gray-300 rounded" defaultChecked />
                <label htmlFor="notify-client" className="ml-2 text-sm text-gray-700">
                  Notify client about this update
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium" onClick={() => setShowStatusUpdateModal(false)}>
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium" onClick={handleStatusUpdate} disabled={!newStatus}>
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>}
      {/* File upload modal */}
      {showFileUploadModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Upload File</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowFileUploadModal(false)}>
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <PaperclipIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setFileToUpload(e.target.files[0]);
                      }
                    }} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF, DOC up to 10MB
                    </p>
                  </div>
                </div>
                {fileToUpload && <div className="mt-2 text-sm text-gray-900">
                    Selected: {fileToUpload.name}
                  </div>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" rows={3} placeholder="Add a description for this file..." value={fileDescription} onChange={e => setFileDescription(e.target.value)}></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium" onClick={() => setShowFileUploadModal(false)}>
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium" onClick={handleFileUpload} disabled={!fileToUpload}>
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>}
      {/* Time log modal */}
      {showTimeLogModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Log Time</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowTimeLogModal(false)}>
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input type="date" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={timeEntry.date} onChange={e => setTimeEntry({
              ...timeEntry,
              date: e.target.value
            })} />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours
                  </label>
                  <input type="number" min="0" max="24" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={timeEntry.hours} onChange={e => setTimeEntry({
                ...timeEntry,
                hours: parseInt(e.target.value) || 0
              })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minutes
                  </label>
                  <input type="number" min="0" max="59" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={timeEntry.minutes} onChange={e => setTimeEntry({
                ...timeEntry,
                minutes: parseInt(e.target.value) || 0
              })} />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" rows={3} placeholder="What did you work on?" value={timeEntry.description} onChange={e => setTimeEntry({
              ...timeEntry,
              description: e.target.value
            })}></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium" onClick={() => setShowTimeLogModal(false)}>
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium" onClick={handleTimeLog} disabled={timeEntry.hours === 0 && timeEntry.minutes === 0}>
                  Log Time
                </button>
              </div>
            </div>
          </div>
        </div>}
      {/* Edit task modal */}
      {showEditTaskModal && editedTask && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Edit Task</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowEditTaskModal(false)}>
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input type="text" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={editedTask.title} onChange={e => setEditedTask({
                ...editedTask,
                title: e.target.value
              })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" rows={4} value={editedTask.description} onChange={e => setEditedTask({
                ...editedTask,
                description: e.target.value
              })}></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input type="date" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={editedTask.dueDate} onChange={e => setEditedTask({
                  ...editedTask,
                  dueDate: e.target.value
                })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Time
                    </label>
                    <input type="time" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={editedTask.dueTime} onChange={e => setEditedTask({
                  ...editedTask,
                  dueTime: e.target.value
                })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={editedTask.priority} onChange={e => setEditedTask({
                ...editedTask,
                priority: e.target.value as Priority
              })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input type="text" className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="0.00" value={editedTask.taskBudget} onChange={e => setEditedTask({
                  ...editedTask,
                  taskBudget: e.target.value
                })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input type="text" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={editedTask.location} onChange={e => setEditedTask({
                ...editedTask,
                location: e.target.value
              })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" rows={3} value={editedTask.notes} onChange={e => setEditedTask({
                ...editedTask,
                notes: e.target.value
              })}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Visibility
                  </label>
                  <div className="mt-2 space-y-4">
                    <div className="flex items-center">
                      <input id="visibility-public" name="visibility" type="radio" className="h-4 w-4 text-blue-600 border-gray-300" checked={editedTask.taskVisibility === 'public'} onChange={() => setEditedTask({
                    ...editedTask,
                    taskVisibility: 'public'
                  })} />
                      <label htmlFor="visibility-public" className="ml-3 block text-sm font-medium text-gray-700">
                        Public - Visible to all users
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input id="visibility-private" name="visibility" type="radio" className="h-4 w-4 text-blue-600 border-gray-300" checked={editedTask.taskVisibility === 'private'} onChange={() => setEditedTask({
                    ...editedTask,
                    taskVisibility: 'private'
                  })} />
                      <label htmlFor="visibility-private" className="ml-3 block text-sm font-medium text-gray-700">
                        Private - Visible only to you and those you invite
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium" onClick={() => setShowEditTaskModal(false)}>
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium" onClick={handleEditTask}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>}
    </AppLayout>;
}