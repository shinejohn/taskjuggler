import React, { useState } from 'react';
import { SearchIcon, FilterIcon, ChevronDownIcon, ChevronUpIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon, UserIcon, CalendarIcon, ArrowUpIcon, ArrowDownIcon, MoreHorizontalIcon, XIcon, RefreshCwIcon, MessageSquareIcon, InboxIcon, FlagIcon, DollarSignIcon, Download } from 'lucide-react';
// Mock data for demonstration
const mockTasks = [{
  id: 1,
  title: 'Review Q4 Marketing Strategy',
  description: 'Review and provide feedback on the Q4 marketing strategy document',
  status: 'completed',
  progress: 100,
  priority: 'high',
  assignee: {
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    email: 'alex@example.com'
  },
  created: '2023-11-15T14:30:00',
  startDate: '2023-11-16',
  dueDate: '2023-11-18',
  completedDate: '2023-11-17',
  paymentStatus: 'paid',
  statusUpdates: [{
    id: 1,
    date: '2023-11-16T10:15:00',
    status: 'in-progress',
    progress: 50,
    note: 'Started reviewing the marketing strategy. Initial feedback drafted for the first three sections.',
    updatedBy: 'Alex Johnson'
  }, {
    id: 2,
    date: '2023-11-17T14:30:00',
    status: 'completed',
    progress: 100,
    note: 'Completed the review with detailed feedback. All sections covered with suggestions for improvement.',
    updatedBy: 'Alex Johnson'
  }]
}, {
  id: 2,
  title: 'Prepare Financial Report',
  description: 'Compile and prepare the monthly financial report for stakeholders',
  status: 'in-progress',
  progress: 60,
  priority: 'high',
  assignee: {
    name: 'Sarah Miller',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    email: 'sarah@example.com'
  },
  created: '2023-11-14T09:15:00',
  startDate: '2023-11-15',
  dueDate: '2023-11-20',
  completedDate: null,
  paymentStatus: 'unpaid',
  statusUpdates: [{
    id: 1,
    date: '2023-11-15T11:30:00',
    status: 'in-progress',
    progress: 25,
    note: 'Started gathering financial data from all departments. Revenue section is complete.',
    updatedBy: 'Sarah Miller'
  }, {
    id: 2,
    date: '2023-11-16T16:45:00',
    status: 'in-progress',
    progress: 60,
    note: 'Completed expense analysis and working on profit projections. Need additional data from the sales team.',
    updatedBy: 'Sarah Miller'
  }]
}, {
  id: 3,
  title: 'Update Website Content',
  description: 'Update the company website with new product information and team profiles',
  status: 'pending',
  progress: 0,
  priority: 'medium',
  assignee: {
    name: 'David Chen',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    email: 'david@example.com'
  },
  created: '2023-11-13T16:45:00',
  startDate: '2023-11-20',
  dueDate: '2023-11-25',
  completedDate: null,
  paymentStatus: 'no_fee',
  statusUpdates: []
}, {
  id: 4,
  title: 'Client Onboarding Call',
  description: 'Schedule and conduct onboarding call with new client XYZ Corp',
  status: 'in-progress',
  progress: 30,
  priority: 'high',
  assignee: {
    name: 'Emily Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    email: 'emily@example.com'
  },
  created: '2023-11-12T10:30:00',
  startDate: '2023-11-13',
  dueDate: '2023-11-19',
  completedDate: null,
  paymentStatus: 'unpaid',
  statusUpdates: [{
    id: 1,
    date: '2023-11-13T13:20:00',
    status: 'in-progress',
    progress: 30,
    note: 'Call scheduled for Friday at 2pm. Preparing onboarding materials and agenda.',
    updatedBy: 'Emily Rodriguez'
  }]
}, {
  id: 5,
  title: 'Prepare Project Proposal',
  description: 'Draft proposal for the new client project including timeline and budget',
  status: 'completed',
  progress: 100,
  priority: 'medium',
  assignee: {
    name: 'Michael Wong',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    email: 'michael@example.com'
  },
  created: '2023-11-10T13:20:00',
  startDate: '2023-11-11',
  dueDate: '2023-11-15',
  completedDate: '2023-11-14',
  paymentStatus: 'paid',
  statusUpdates: [{
    id: 1,
    date: '2023-11-11T09:45:00',
    status: 'in-progress',
    progress: 30,
    note: 'Started drafting the proposal. Timeline section is complete.',
    updatedBy: 'Michael Wong'
  }, {
    id: 2,
    date: '2023-11-12T16:30:00',
    status: 'in-progress',
    progress: 70,
    note: 'Budget section completed. Working on resource allocation and deliverables.',
    updatedBy: 'Michael Wong'
  }, {
    id: 3,
    date: '2023-11-14T11:15:00',
    status: 'completed',
    progress: 100,
    note: 'Proposal completed and reviewed by the team. Ready for client presentation.',
    updatedBy: 'Michael Wong'
  }]
}, {
  id: 6,
  title: 'Review Code Pull Request',
  description: 'Review and approve the pull request for the new feature implementation',
  status: 'in-progress',
  progress: 80,
  priority: 'low',
  assignee: {
    name: 'Jessica Taylor',
    avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
    email: 'jessica@example.com'
  },
  created: '2023-11-09T15:45:00',
  startDate: '2023-11-10',
  dueDate: '2023-11-17',
  completedDate: null,
  paymentStatus: 'unpaid',
  statusUpdates: [{
    id: 1,
    date: '2023-11-10T10:20:00',
    status: 'in-progress',
    progress: 40,
    note: 'Started code review. Found a few issues with the authentication module.',
    updatedBy: 'Jessica Taylor'
  }, {
    id: 2,
    date: '2023-11-11T14:15:00',
    status: 'in-progress',
    progress: 80,
    note: 'Most issues addressed. Waiting for the developer to fix the remaining issues with error handling.',
    updatedBy: 'Jessica Taylor'
  }]
}, {
  id: 7,
  title: 'Quarterly Team Review',
  description: 'Conduct quarterly performance reviews for team members',
  status: 'completed',
  progress: 100,
  priority: 'high',
  assignee: {
    name: 'Robert Smith',
    avatar: 'https://randomuser.me/api/portraits/men/57.jpg',
    email: 'robert@example.com'
  },
  created: '2023-11-08T09:00:00',
  startDate: '2023-11-09',
  dueDate: '2023-11-12',
  completedDate: '2023-11-11',
  paymentStatus: 'no_fee',
  statusUpdates: [{
    id: 1,
    date: '2023-11-09T11:00:00',
    status: 'in-progress',
    progress: 30,
    note: 'Started performance reviews. Completed 3 out of 10 team members.',
    updatedBy: 'Robert Smith'
  }, {
    id: 2,
    date: '2023-11-10T16:30:00',
    status: 'in-progress',
    progress: 70,
    note: 'Completed 7 reviews. Scheduling final meetings for tomorrow.',
    updatedBy: 'Robert Smith'
  }, {
    id: 3,
    date: '2023-11-11T15:45:00',
    status: 'completed',
    progress: 100,
    note: 'All performance reviews completed. Summary report prepared for management.',
    updatedBy: 'Robert Smith'
  }]
}, {
  id: 8,
  title: 'Update Product Documentation',
  description: 'Update user documentation for the latest product release',
  status: 'pending',
  progress: 0,
  priority: 'medium',
  assignee: {
    name: 'Lisa Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
    email: 'lisa@example.com'
  },
  created: '2023-11-07T11:30:00',
  startDate: '2023-11-21',
  dueDate: '2023-11-28',
  completedDate: null,
  paymentStatus: 'unpaid',
  statusUpdates: []
}];
type TaskStatus = 'pending' | 'in-progress' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high';
type PaymentStatus = 'paid' | 'unpaid' | 'no_fee'; // Added payment status
interface StatusUpdate {
  id: number;
  date: string;
  status: TaskStatus;
  progress: number;
  note: string;
  updatedBy: string;
}
interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  progress: number;
  priority: TaskPriority;
  assignee: {
    name: string;
    avatar: string;
    email: string;
  };
  created: string;
  startDate: string;
  dueDate: string;
  completedDate: string | null;
  paymentStatus: PaymentStatus; // Added payment status
  statusUpdates: StatusUpdate[];
}
interface TaskStatusBadgeProps {
  status: TaskStatus;
}
const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status
}) => {
  let bgColor = '';
  let textColor = '';
  let icon = null;
  let label = '';
  switch (status) {
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      icon = <ClockIcon size={14} className="mr-1" />;
      label = 'Pending';
      break;
    case 'in-progress':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      icon = <AlertCircleIcon size={14} className="mr-1" />;
      label = 'In Progress';
      break;
    case 'completed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      icon = <CheckCircleIcon size={14} className="mr-1" />;
      label = 'Completed';
      break;
  }
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {label}
    </span>;
};
interface ProgressBarProps {
  progress: number;
}
const ProgressBar: React.FC<ProgressBarProps> = ({
  progress
}) => {
  let barColor = 'bg-blue-600';
  if (progress === 100) {
    barColor = 'bg-green-600';
  } else if (progress < 25) {
    barColor = 'bg-yellow-600';
  }
  return <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className={`h-2.5 rounded-full ${barColor}`} style={{
      width: `${progress}%`
    }}></div>
    </div>;
};
interface PriorityBadgeProps {
  priority: TaskPriority;
}
const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority
}) => {
  let bgColor = '';
  let textColor = '';
  let label = '';
  switch (priority) {
    case 'low':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      label = 'Low';
      break;
    case 'medium':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      label = 'Medium';
      break;
    case 'high':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      label = 'High';
      break;
  }
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>;
};
interface StatusUpdateModalProps {
  task: Task | null;
  onClose: () => void;
  onRequestUpdate: (taskId: number) => void;
}
const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  task,
  onClose,
  onRequestUpdate
}) => {
  if (!task) return null;
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Status Updates</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XIcon size={20} />
            </button>
          </div>
          <div className="mb-6">
            <div className="flex items-start mb-3">
              <div className="mr-3">
                <img src={task.assignee.avatar} alt={task.assignee.name} className="h-10 w-10 rounded-full" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                <p className="text-sm text-gray-600">
                  Assigned to {task.assignee.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <TaskStatusBadge status={task.status} />
              <div className="text-sm text-gray-600">
                Progress: {task.progress}%
              </div>
              <div className="text-sm text-gray-600">
                Due: {formatDateTime(task.dueDate)}
              </div>
            </div>
            <button onClick={() => onRequestUpdate(task.id)} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
              <RefreshCwIcon size={16} className="mr-2" />
              Request Status Update
            </button>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-4">Update History</h4>
            {task.statusUpdates.length > 0 ? <div className="space-y-4">
                {task.statusUpdates.slice().reverse().map(update => <div key={update.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <TaskStatusBadge status={update.status} />
                          <span className="ml-2 text-sm text-gray-600">
                            Progress: {update.progress}%
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDateTime(update.date)}
                        </span>
                      </div>
                      <p className="text-gray-800 mb-2">{update.note}</p>
                      <p className="text-xs text-gray-500">
                        Updated by {update.updatedBy}
                      </p>
                    </div>)}
              </div> : <div className="text-center py-8">
                <MessageSquareIcon size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No status updates yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Request an update from the assignee
                </p>
              </div>}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-3 flex justify-end">
          <button onClick={onClose} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>;
};
interface FilterBoxProps {
  count: number;
  label: string;
  icon: React.ReactNode;
  color: string;
  isActive: boolean;
  onClick: () => void;
}
const FilterBox: React.FC<FilterBoxProps> = ({
  count,
  label,
  icon,
  color,
  isActive,
  onClick
}) => {
  return <div onClick={onClick} className={`cursor-pointer transition-all duration-200 ${isActive ? `${color} shadow-md transform scale-105` : 'bg-white hover:bg-gray-50'} rounded-lg shadow-sm p-4 border border-gray-200`}>
      <div className="flex justify-between items-start mb-2">
        <div className={`rounded-full p-2 ${isActive ? 'bg-white bg-opacity-20' : color}`}>
          {icon}
        </div>
        <div className={`text-2xl font-bold ${isActive ? 'text-white' : 'text-gray-900'}`}>
          {count}
        </div>
      </div>
      <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-600'}`}>
        {label}
      </div>
      {!isActive && <div className="mt-2 text-xs text-blue-600">Click to filter</div>}
      {isActive && <div className="mt-2 text-xs text-white">Filtering applied</div>}
    </div>;
};
// Add new component for Payment Status Badge
interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}
const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status
}) => {
  let bgColor = '';
  let textColor = '';
  let icon = null;
  let label = '';
  switch (status) {
    case 'paid':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      icon = <CheckCircleIcon size={14} className="mr-1" />;
      label = 'Paid';
      break;
    case 'unpaid':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      icon = <DollarSignIcon size={14} className="mr-1" />;
      label = 'Unpaid';
      break;
    case 'no_fee':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      icon = <XIcon size={14} className="mr-1" />;
      label = 'No Fee';
      break;
  }
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {label}
    </span>;
};
export function TaskReport() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [sortField, setSortField] = useState<keyof Task>('created');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  // New state for the dashboard filters
  const [activeFilter, setActiveFilter] = useState<'open' | 'completed' | 'high-priority' | null>(null);
  // Count tasks for dashboard
  const openTasksCount = tasks.filter(task => task.status === 'pending' || task.status === 'in-progress').length;
  const completedTasksCount = tasks.filter(task => task.status === 'completed').length;
  const highPriorityTasksCount = tasks.filter(task => task.priority === 'high').length;
  // Handle dashboard filter clicks
  const handleOpenTasksFilter = () => {
    if (activeFilter === 'open') {
      // If already active, reset filters
      setActiveFilter(null);
      setStatusFilter('all');
    } else {
      setActiveFilter('open');
      setStatusFilter('pending'); // This will be handled specially in the filter logic
      setPriorityFilter('all');
    }
  };
  const handleCompletedTasksFilter = () => {
    if (activeFilter === 'completed') {
      // If already active, reset filters
      setActiveFilter(null);
      setStatusFilter('all');
    } else {
      setActiveFilter('completed');
      setStatusFilter('completed');
      setPriorityFilter('all');
    }
  };
  const handleHighPriorityFilter = () => {
    if (activeFilter === 'high-priority') {
      // If already active, reset filters
      setActiveFilter(null);
      setPriorityFilter('all');
    } else {
      setActiveFilter('high-priority');
      setPriorityFilter('high');
      setStatusFilter('all');
    }
  };
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  // Handle sorting
  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  // Open status update modal
  const openStatusUpdateModal = (task: Task) => {
    setSelectedTask(task);
    setIsUpdateModalOpen(true);
  };
  // Close status update modal
  const closeStatusUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedTask(null);
  };
  // Request a status update
  const requestStatusUpdate = (taskId: number) => {
    alert(`Status update requested for task #${taskId}. In a real application, this would send a notification to the assignee.`);
  };
  // Filter and sort tasks
  const filteredAndSortedTasks = tasks.filter(task => {
    // Search filter
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) && !task.description.toLowerCase().includes(searchTerm.toLowerCase()) && !task.assignee.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Special handling for "open" tasks filter
    if (activeFilter === 'open') {
      if (!(task.status === 'pending' || task.status === 'in-progress')) {
        return false;
      }
    }
    // Regular status filter (used when not filtering for "open" tasks)
    else if (statusFilter !== 'all' && task.status !== statusFilter) {
      return false;
    }
    // Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    // Special handling for date fields
    if (['created', 'startDate', 'dueDate', 'completedDate'].includes(sortField)) {
      const dateA = a[sortField as keyof Task] ? new Date(a[sortField as keyof Task] as string).getTime() : 0;
      const dateB = b[sortField as keyof Task] ? new Date(b[sortField as keyof Task] as string).getTime() : 0;
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    // Handle progress as a number
    if (sortField === 'progress') {
      return sortDirection === 'asc' ? a.progress - b.progress : b.progress - a.progress;
    }
    // Default string comparison
    const valueA = String(a[sortField as keyof Task]).toLowerCase();
    const valueB = String(b[sortField as keyof Task]).toLowerCase();
    return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSortField('created');
    setSortDirection('desc');
    setActiveFilter(null);
  };
  const renderListView = () => <div className="bg-white rounded-lg shadow overflow-hidden">
      {selectedTaskIds.length > 0 && <div className="bg-blue-50 p-3 flex items-center justify-between border-b border-blue-200">
          <div>
            <span className="text-blue-600 font-medium">
              {selectedTaskIds.length} tasks selected
            </span>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Update Status
            </button>
            <button className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <Download size={16} />
            </button>
            <button className="px-3 py-1 text-sm text-red-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50" onClick={() => setSelectedTaskIds([])}>
              Cancel
            </button>
          </div>
        </div>}
      {filteredTasks.length > 0 ? <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked={selectedTaskIds.length === filteredTasks.length && filteredTasks.length > 0} onChange={handleSelectAll} />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('title')}>
                  <div className="flex items-center">
                    Task
                    {sortField === 'title' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                  <div className="flex items-center">
                    Status
                    {sortField === 'status' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('progress')}>
                  <div className="flex items-center">
                    Progress
                    {sortField === 'progress' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('assignee')}>
                  <div className="flex items-center">
                    Assignee
                    {sortField === 'assignee' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('dueDate')}>
                  <div className="flex items-center">
                    Due Date
                    {sortField === 'dueDate' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('created')}>
                  <div className="flex items-center">
                    Created
                    {sortField === 'created' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('paymentStatus')}>
                  <div className="flex items-center">
                    Payment
                    {sortField === 'paymentStatus' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updates
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map(task => <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked={selectedTaskIds.includes(task.id.toString())} onChange={() => handleTaskSelect(task.id.toString())} onClick={e => e.stopPropagation()} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {task.title}
                      </div>
                      <div className="text-xs text-gray-500 max-w-xs truncate">
                        {task.description}
                      </div>
                      <div className="mt-1">
                        <PriorityBadge priority={task.priority} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TaskStatusBadge status={task.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full max-w-xs mr-2">
                        <ProgressBar progress={task.progress} />
                      </div>
                      <span className="text-xs text-gray-500">
                        {task.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={task.assignee.avatar} alt={task.assignee.name} className="h-8 w-8 rounded-full mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {task.assignee.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {task.assignee.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <CalendarIcon size={16} className="mr-1 text-gray-500" />
                      {formatDate(task.dueDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(task.created).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PaymentStatusBadge status={task.paymentStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => openStatusUpdateModal(task)} className="inline-flex items-center px-3 py-1 border border-blue-300 text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100">
                      <RefreshCwIcon size={14} className="mr-1" />
                      {task.statusUpdates.length > 0 ? <span>View Updates ({task.statusUpdates.length})</span> : <span>Request Update</span>}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontalIcon size={18} />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div> : <tr>
          <td colSpan={8} className="px-6 py-10 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 rounded-full p-3 mb-3">
                <SearchIcon size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No tasks found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search or filter criteria
              </p>
              {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || activeFilter !== null) && <button onClick={resetFilters} className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Reset all filters
                </button>}
            </div>
          </td>
        </tr>}
    </div>;
  return <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Task Report
              </h1>
              <p className="text-gray-600">
                View and manage all tasks in your organization
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                Create New Task
              </button>
            </div>
          </div>
          {/* Task Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <FilterBox count={openTasksCount} label="Open Tasks" icon={<InboxIcon size={20} className={activeFilter === 'open' ? 'text-blue-600' : 'text-white'} />} color="bg-blue-600" isActive={activeFilter === 'open'} onClick={handleOpenTasksFilter} />
            <FilterBox count={completedTasksCount} label="Completed Tasks" icon={<CheckCircleIcon size={20} className={activeFilter === 'completed' ? 'text-green-600' : 'text-white'} />} color="bg-green-600" isActive={activeFilter === 'completed'} onClick={handleCompletedTasksFilter} />
            <FilterBox count={highPriorityTasksCount} label="High Priority Tasks" icon={<FlagIcon size={20} className={activeFilter === 'high-priority' ? 'text-red-600' : 'text-white'} />} color="bg-red-600" isActive={activeFilter === 'high-priority'} onClick={handleHighPriorityFilter} />
          </div>
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon size={18} className="text-gray-400" />
                  </div>
                  <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search tasks, descriptions, or assignees..." />
                </div>
              </div>
              {/* Filter Button */}
              <div className="relative">
                <button onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <FilterIcon size={18} className="mr-2 text-gray-500" />
                  Filter
                  <ChevronDownIcon size={18} className="ml-2 text-gray-500" />
                </button>
                {/* Filter Dropdown Menu */}
                {isFilterMenuOpen && <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Filters
                      </h3>
                      <button onClick={() => setIsFilterMenuOpen(false)} className="text-gray-400 hover:text-gray-500">
                        <XIcon size={18} />
                      </button>
                    </div>
                    <div className="space-y-4">
                      {/* Status Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as TaskStatus | 'all')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="all">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      {/* Priority Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Priority
                        </label>
                        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as TaskPriority | 'all')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="all">All Priorities</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div className="pt-2 flex justify-between">
                        <button onClick={resetFilters} className="text-sm text-gray-600 hover:text-gray-900">
                          Reset all filters
                        </button>
                        <button onClick={() => setIsFilterMenuOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>}
              </div>
            </div>
            {/* Active filter indicators */}
            {activeFilter && <div className="mt-3 flex items-center">
                <span className="text-sm text-gray-600 mr-2">
                  Active filter:
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  {activeFilter === 'open' && 'Open Tasks'}
                  {activeFilter === 'completed' && 'Completed Tasks'}
                  {activeFilter === 'high-priority' && 'High Priority Tasks'}
                  <button onClick={resetFilters} className="ml-1 text-blue-800 hover:text-blue-900">
                    <XIcon size={14} />
                  </button>
                </span>
              </div>}
          </div>
          {/* Task Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('title')}>
                      <div className="flex items-center">
                        Task
                        {sortField === 'title' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                      <div className="flex items-center">
                        Status
                        {sortField === 'status' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('progress')}>
                      <div className="flex items-center">
                        Progress
                        {sortField === 'progress' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('assignee')}>
                      <div className="flex items-center">
                        Assignee
                        {sortField === 'assignee' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('dueDate')}>
                      <div className="flex items-center">
                        Due Date
                        {sortField === 'dueDate' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('created')}>
                      <div className="flex items-center">
                        Created
                        {sortField === 'created' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('paymentStatus')}>
                      <div className="flex items-center">
                        Payment
                        {sortField === 'paymentStatus' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updates
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedTasks.length > 0 ? filteredAndSortedTasks.map(task => <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {task.title}
                            </div>
                            <div className="text-xs text-gray-500 max-w-xs truncate">
                              {task.description}
                            </div>
                            <div className="mt-1">
                              <PriorityBadge priority={task.priority} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <TaskStatusBadge status={task.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full max-w-xs mr-2">
                              <ProgressBar progress={task.progress} />
                            </div>
                            <span className="text-xs text-gray-500">
                              {task.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img src={task.assignee.avatar} alt={task.assignee.name} className="h-8 w-8 rounded-full mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {task.assignee.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {task.assignee.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <CalendarIcon size={16} className="mr-1 text-gray-500" />
                            {formatDate(task.dueDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(task.created).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PaymentStatusBadge status={task.paymentStatus} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button onClick={() => openStatusUpdateModal(task)} className="inline-flex items-center px-3 py-1 border border-blue-300 text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100">
                            <RefreshCwIcon size={14} className="mr-1" />
                            {task.statusUpdates.length > 0 ? <span>
                                View Updates ({task.statusUpdates.length})
                              </span> : <span>Request Update</span>}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontalIcon size={18} />
                          </button>
                        </td>
                      </tr>) : <tr>
                      <td colSpan={8} className="px-6 py-10 text-center">
                        <div className="flex flex-col items-center">
                          <div className="bg-gray-100 rounded-full p-3 mb-3">
                            <SearchIcon size={24} className="text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">
                            No tasks found
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Try adjusting your search or filter criteria
                          </p>
                          {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || activeFilter !== null) && <button onClick={resetFilters} className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                              Reset all filters
                            </button>}
                        </div>
                      </td>
                    </tr>}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{' '}
                    <span className="font-medium">
                      {filteredAndSortedTasks.length}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">
                      {filteredAndSortedTasks.length}
                    </span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <ChevronUpIcon className="h-5 w-5 rotate-90" aria-hidden="true" />
                    </a>
                    <a href="#" aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      1
                    </a>
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <ChevronDownIcon className="h-5 w-5 rotate-90" aria-hidden="true" />
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          {/* Task Summary */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Task Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-md p-3">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {tasks.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                </div>
                <div className="bg-green-50 rounded-md p-3">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {tasks.filter(t => t.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="bg-yellow-50 rounded-md p-3">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">
                    {tasks.filter(t => t.status === 'in-progress').length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="bg-gray-50 rounded-md p-3">
                  <div className="text-3xl font-bold text-gray-600 mb-1">
                    {tasks.filter(t => t.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 md:col-span-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Task Completion Trend
              </h3>
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-gray-500">
                  Chart visualization would appear here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Status Update Modal */}
      {isUpdateModalOpen && <StatusUpdateModal task={selectedTask} onClose={closeStatusUpdateModal} onRequestUpdate={requestStatusUpdate} />}
    </section>;
}