import React, { useEffect, useState, Fragment } from 'react';
import { Calendar, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Clock, DollarSign, Download, Filter, Grid, List, MessageSquare, MoreHorizontal, PlusCircle, Search, SlidersHorizontal, Star, User, X, Edit, FileText, AlertCircle, CheckSquare, PauseCircle, RotateCcw, XCircle, ArrowUpRight, ArrowUp, ArrowDown, Calendar as CalendarIcon, Clock as ClockIcon, Trash, Upload, Send, CheckSquare as CheckSquareIcon, Paperclip, ExternalLink, Flag, CreditCard, Users, BarChart2, Clipboard, Lock, Unlock, FileText as FileTextIcon, AlertTriangle, UserPlus, UserCheck } from 'lucide-react';
// Task status types
type Priority = 'low' | 'medium' | 'high';
type TaskStatus = 'not_started' | 'in_progress' | 'paused' | 'in_review' | 'revision_requested' | 'completed' | 'cancelled' | 'pending_acceptance' | 'declined';
// Task interface
interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: string;
  priority?: Priority;
  client: {
    id: string;
    name: string;
    avatar: string;
  };
  doer?: {
    id: string;
    name: string;
    avatar: string;
  };
  startDate: string | null;
  dueDate: string;
  price: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'no_fee';
  progress: number;
  isUrgent: boolean;
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
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
  proposalSentDate?: string;
  clientLastViewed?: string;
  estimatedHours?: number;
  loggedHours?: number;
  milestones?: Array<{
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }>;
  paymentHistory?: Array<{
    id: string;
    amount: number;
    date: string;
    status: 'pending' | 'completed' | 'failed';
    method: string;
  }>;
  progressUpdates?: Array<{
    id: string;
    date: string;
    description: string;
    progressPercent: number;
    hoursLogged: number;
  }>;
}
// Generate mock data
const generateMockTasks = (): Task[] => {
  const statuses: TaskStatus[] = ['not_started', 'in_progress', 'paused', 'in_review', 'revision_requested', 'completed', 'cancelled', 'pending_acceptance', 'declined'];
  const categories = ['Web Development', 'Graphic Design', 'Content Writing', 'Digital Marketing', 'Video Editing', 'Translation', 'Data Entry', 'Virtual Assistant'];
  const clients = [{
    id: 'c1',
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  }, {
    id: 'c2',
    name: 'Sarah Miller',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  }, {
    id: 'c3',
    name: 'David Chen',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
  }, {
    id: 'c4',
    name: 'Emily Watson',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
  }, {
    id: 'c5',
    name: 'Michael Torres',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
  }];
  const doers = [{
    id: 'd1',
    name: 'Emily Watson',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
  }, {
    id: 'd2',
    name: 'Michael Torres',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
  }, {
    id: 'd3',
    name: 'David Chen',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
  }, {
    id: 'd4',
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  }, {
    id: 'd5',
    name: 'Sarah Miller',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  }];
  // Helper to generate random date within a range
  const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
  };
  const now = new Date();
  const pastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const tasks: Task[] = [];
  for (let i = 1; i <= 30; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const dueDate = randomDate(now, nextMonth);
    const startDate = status === 'not_started' || status === 'pending_acceptance' ? null : randomDate(pastMonth, now);
    const client = clients[Math.floor(Math.random() * clients.length)];
    const doer = i % 3 === 0 ? doers[Math.floor(Math.random() * doers.length)] : undefined;
    const priority: Priority = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as Priority;
    const paymentStatuses = ['pending', 'partial', 'paid', 'no_fee'];
    const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)] as 'pending' | 'partial' | 'paid' | 'no_fee';
    const task: Task = {
      id: `TASK-${1000 + i}`,
      title: `Task ${i}: ${categories[Math.floor(Math.random() * categories.length)]} Project`,
      description: `This is a detailed description for task ${i}. It includes all the requirements and specifications needed to complete the task successfully.`,
      status,
      category: categories[Math.floor(Math.random() * categories.length)],
      priority,
      client,
      doer,
      startDate,
      dueDate,
      price: Math.floor(Math.random() * 1000) + 100,
      paymentStatus,
      progress: status === 'completed' ? 100 : Math.floor(Math.random() * 100),
      isUrgent: Math.random() > 0.8,
      attachments: [{
        id: `att-${i}-1`,
        name: `document-${i}.pdf`,
        type: 'pdf',
        url: '#'
      }],
      activity: [{
        id: `act-${i}-1`,
        type: 'status_change',
        content: `Task status changed to ${status}`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
        user: {
          id: 'u1',
          name: 'You',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          isClient: false
        }
      }, {
        id: `act-${i}-2`,
        type: 'message',
        content: 'Just checking in on the progress. How is it going?',
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)).toISOString(),
        user: {
          id: client.id,
          name: client.name,
          avatar: client.avatar,
          isClient: true
        }
      }],
      estimatedHours: Math.floor(Math.random() * 40) + 5,
      loggedHours: Math.floor(Math.random() * 30),
      paymentHistory: [{
        id: `payment-${i}-1`,
        amount: Math.floor(Math.random() * 300) + 100,
        date: randomDate(pastMonth, now),
        status: 'completed',
        method: 'Credit Card'
      }, {
        id: `payment-${i}-2`,
        amount: Math.floor(Math.random() * 300) + 100,
        date: randomDate(pastMonth, now),
        status: 'pending',
        method: 'Bank Transfer'
      }],
      progressUpdates: [{
        id: `progress-${i}-1`,
        date: randomDate(pastMonth, now),
        description: 'Started initial research and planning phase.',
        progressPercent: 25,
        hoursLogged: 5
      }, {
        id: `progress-${i}-2`,
        date: randomDate(pastMonth, now),
        description: 'Completed first draft of deliverables.',
        progressPercent: 50,
        hoursLogged: 8
      }]
    };
    // Add proposal-specific fields for pending tasks
    if (status === 'pending_acceptance') {
      task.proposalSentDate = randomDate(pastMonth, now);
      task.clientLastViewed = Math.random() > 0.5 ? randomDate(new Date(task.proposalSentDate), now) : undefined;
    }
    // Add milestones for some tasks
    if (Math.random() > 0.5) {
      task.milestones = [{
        id: `ms-${i}-1`,
        title: 'Initial Design',
        dueDate: randomDate(now, new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)),
        completed: Math.random() > 0.5
      }, {
        id: `ms-${i}-2`,
        title: 'Client Review',
        dueDate: randomDate(now, new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)),
        completed: false
      }, {
        id: `ms-${i}-3`,
        title: 'Final Delivery',
        dueDate: randomDate(now, new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000)),
        completed: false
      }];
    }
    tasks.push(task);
  }
  return tasks;
};
// Helper components
const StatusBadge: React.FC<{
  status: TaskStatus;
}> = ({
  status
}) => {
  const getStatusInfo = (status: TaskStatus) => {
    switch (status) {
      case 'not_started':
        return {
          label: 'Not Started',
          color: 'bg-blue-100 text-blue-800'
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          color: 'bg-green-100 text-green-800'
        };
      case 'paused':
        return {
          label: 'Paused',
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'in_review':
        return {
          label: 'In Review',
          color: 'bg-purple-100 text-purple-800'
        };
      case 'revision_requested':
        return {
          label: 'Revision Requested',
          color: 'bg-orange-100 text-orange-800'
        };
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-gray-100 text-gray-800'
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: 'bg-red-100 text-red-800'
        };
      case 'pending_acceptance':
        return {
          label: 'Pending Acceptance',
          color: 'bg-orange-100 text-orange-800'
        };
      case 'declined':
        return {
          label: 'Declined',
          color: 'bg-red-100 text-red-800'
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };
  const {
    label,
    color
  } = getStatusInfo(status);
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>;
};
const CategoryBadge: React.FC<{
  category: string;
}> = ({
  category
}) => {
  return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      {category}
    </span>;
};
const PriorityBadge: React.FC<{
  priority?: Priority;
}> = ({
  priority
}) => {
  if (!priority) return null;
  const getPriorityInfo = (priority: Priority) => {
    switch (priority) {
      case 'low':
        return {
          label: 'Low Priority',
          color: 'bg-gray-100 text-gray-800'
        };
      case 'medium':
        return {
          label: 'Medium Priority',
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'high':
        return {
          label: 'High Priority',
          color: 'bg-red-100 text-red-800'
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };
  const {
    label,
    color
  } = getPriorityInfo(priority);
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>;
};
const ProgressBar: React.FC<{
  progress: number;
  status: TaskStatus;
}> = ({
  progress,
  status
}) => {
  const getColorClass = () => {
    if (status === 'completed') return 'bg-green-500';
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-orange-500';
    if (progress < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  return <div className="w-full bg-gray-200 rounded-full h-2">
      <div className={`h-2 rounded-full ${getColorClass()}`} style={{
      width: `${progress}%`
    }}></div>
    </div>;
};
const PaymentStatusIcon: React.FC<{
  status: 'pending' | 'partial' | 'paid' | 'no_fee';
}> = ({
  status
}) => {
  switch (status) {
    case 'paid':
      return <CheckCircle size={16} className="text-green-500" />;
    case 'partial':
      return <PauseCircle size={16} className="text-orange-500" />;
    case 'pending':
      return <Clock size={16} className="text-gray-500" />;
    case 'no_fee':
      return <XCircle size={16} className="text-gray-400" />;
    default:
      return null;
  }
};
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
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
// Main component
export function MyTasksViewer() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'card' | 'calendar'>('list');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  // Task detail modal active tab state
  const [activeTaskDetailTab, setActiveTaskDetailTab] = useState<'overview' | 'progress' | 'messages' | 'payment' | 'reassign'>('overview');
  // Additional modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showAcceptProposalModal, setShowAcceptProposalModal] = useState(false);
  const [showTimeLogModal, setShowTimeLogModal] = useState(false);
  const [showMoreActionsModal, setShowMoreActionsModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  // Form states for modals
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [messageText, setMessageText] = useState('');
  const [timeLogHours, setTimeLogHours] = useState(0);
  const [timeLogMinutes, setTimeLogMinutes] = useState(0);
  const [timeLogDescription, setTimeLogDescription] = useState('');
  const [timeLogDate, setTimeLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  // Filter states
  const [statusFilters, setStatusFilters] = useState<TaskStatus[]>([]);
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | 'this_week' | 'this_month' | 'custom'>('all');
  const [customDateRange, setCustomDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [clientFilter, setClientFilter] = useState<string[]>([]);
  const [doerFilter, setDoerFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{
    min: number | null;
    max: number | null;
  }>({
    min: null,
    max: null
  });
  const [searchQuery, setSearchQuery] = useState('');
  // View type state (clients or doers)
  const [viewType, setViewType] = useState<'all' | 'clients' | 'doers'>('all');
  // Sort state
  const [sortOption, setSortOption] = useState<string>('deadline_asc');
  // Load mock data
  useEffect(() => {
    setTasks(generateMockTasks());
  }, []);
  // Count tasks by status for tabs and summary cards
  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(t => t.status === 'in_progress').length,
    pending: tasks.filter(t => t.status === 'pending_acceptance').length,
    scheduled: tasks.filter(t => t.status === 'not_started').length,
    in_review: tasks.filter(t => t.status === 'in_review').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    declined: tasks.filter(t => t.status === 'declined').length
  };
  // Calculate total earnings this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const totalEarningsThisMonth = tasks.filter(task => {
    if (task.status !== 'completed') return false;
    const completedDate = new Date(task.activity.find(a => a.type === 'status_change' && a.content.includes('completed'))?.timestamp || '');
    return completedDate.getMonth() === currentMonth && completedDate.getFullYear() === currentYear;
  }).reduce((sum, task) => sum + task.price, 0);
  // Calculate completed this week
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const completedThisWeek = tasks.filter(task => {
    if (task.status !== 'completed') return false;
    const completedDate = new Date(task.activity.find(a => a.type === 'status_change' && a.content.includes('completed'))?.timestamp || '');
    return completedDate >= startOfWeek;
  }).length;
  // Filter tasks based on active tab and filters
  const getFilteredTasks = () => {
    let filtered = [...tasks];
    // Filter by view type (clients or doers)
    if (viewType === 'clients') {
      filtered = filtered.filter(t => !t.doer); // Tasks where I'm the doer (client is someone else)
    } else if (viewType === 'doers') {
      filtered = filtered.filter(t => t.doer); // Tasks where someone else is the doer
    }
    // Filter by tab
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'active':
          filtered = filtered.filter(t => t.status === 'in_progress');
          break;
        case 'pending':
          filtered = filtered.filter(t => t.status === 'pending_acceptance');
          break;
        case 'scheduled':
          filtered = filtered.filter(t => t.status === 'not_started');
          break;
        case 'in_review':
          filtered = filtered.filter(t => t.status === 'in_review');
          break;
        case 'completed':
          filtered = filtered.filter(t => t.status === 'completed');
          break;
        case 'declined':
          filtered = filtered.filter(t => t.status === 'declined');
          break;
      }
    }
    // Apply status filters
    if (statusFilters.length > 0) {
      filtered = filtered.filter(t => statusFilters.includes(t.status));
    }
    // Apply date range filter
    if (dateRangeFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay());
      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const last30DaysStart = new Date(today);
      last30DaysStart.setDate(today.getDate() - 30);
      switch (dateRangeFilter) {
        case 'today':
          filtered = filtered.filter(t => {
            const dueDate = new Date(t.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            return dueDate.getTime() === today.getTime();
          });
          break;
        case 'this_week':
          filtered = filtered.filter(t => {
            const dueDate = new Date(t.dueDate);
            return dueDate >= thisWeekStart;
          });
          break;
        case 'this_month':
          filtered = filtered.filter(t => {
            const dueDate = new Date(t.dueDate);
            return dueDate >= thisMonthStart;
          });
          break;
        case 'custom':
          if (customDateRange) {
            const startDate = new Date(customDateRange.start);
            const endDate = new Date(customDateRange.end);
            filtered = filtered.filter(t => {
              const dueDate = new Date(t.dueDate);
              return dueDate >= startDate && dueDate <= endDate;
            });
          }
          break;
      }
    }
    // Apply category filter
    if (categoryFilter.length > 0) {
      filtered = filtered.filter(t => categoryFilter.includes(t.category));
    }
    // Apply client filter
    if (clientFilter.length > 0) {
      filtered = filtered.filter(t => clientFilter.includes(t.client.id));
    }
    // Apply doer filter
    if (doerFilter.length > 0) {
      filtered = filtered.filter(t => t.doer && doerFilter.includes(t.doer.id));
    }
    // Apply price range filter
    if (priceRange.min !== null) {
      filtered = filtered.filter(t => t.price >= (priceRange.min || 0));
    }
    if (priceRange.max !== null) {
      filtered = filtered.filter(t => t.price <= (priceRange.max || Infinity));
    }
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query) || t.client.name.toLowerCase().includes(query) || t.doer && t.doer.name.toLowerCase().includes(query) || t.id.toLowerCase().includes(query));
    }
    // Apply sort
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'deadline_asc':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'deadline_desc':
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case 'newest_first':
          return new Date(b.startDate || b.dueDate).getTime() - new Date(a.startDate || a.dueDate).getTime();
        case 'oldest_first':
          return new Date(a.startDate || a.dueDate).getTime() - new Date(b.startDate || b.dueDate).getTime();
        case 'highest_price':
          return b.price - a.price;
        case 'lowest_price':
          return a.price - b.price;
        case 'client_name':
          return a.client.name.localeCompare(b.client.name);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
    return filtered;
  };
  const filteredTasks = getFilteredTasks();
  // Get the selected task
  const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null;
  // Handler functions
  const handleTaskClick = (taskId: string) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
    }
  };
  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskIds(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };
  const handleSelectAll = () => {
    if (selectedTaskIds.length === filteredTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map(t => t.id));
    }
  };
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? {
      ...task,
      status: newStatus,
      activity: [{
        id: `act-${Date.now()}`,
        type: 'status_change',
        content: `Task status changed to ${newStatus}`,
        timestamp: new Date().toISOString(),
        user: {
          id: 'u1',
          name: 'You',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          isClient: false
        }
      }, ...task.activity]
    } : task));
    setShowStatusUpdateModal(false);
  };
  const handleViewTaskDetails = (taskId: string) => {
    setSelectedTaskId(taskId);
    setActiveTaskDetailTab('overview');
  };
  const handleCloseTaskDetails = () => {
    setSelectedTaskId(null);
  };
  const handleClearFilters = () => {
    setStatusFilters([]);
    setDateRangeFilter('all');
    setCustomDateRange(null);
    setCategoryFilter([]);
    setClientFilter([]);
    setDoerFilter([]);
    setPriceRange({
      min: null,
      max: null
    });
    setSearchQuery('');
    setViewType('all');
  };
  // View type handlers
  const handleViewTypeChange = (type: 'all' | 'clients' | 'doers') => {
    setViewType(type);
  };
  // New handler functions for the action buttons
  const handleReportTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowReportModal(true);
  };
  const handlePayTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowPayModal(true);
  };
  const handleCloseTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowCloseModal(true);
  };
  const handleMessageClient = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowMessageModal(true);
  };
  const handleSubmitReport = () => {
    if (selectedTaskId && reportReason) {
      // Add a report activity to the task
      setTasks(prevTasks => prevTasks.map(task => task.id === selectedTaskId ? {
        ...task,
        activity: [{
          id: `act-${Date.now()}`,
          type: 'note',
          content: `Reported task: ${reportReason}${reportDescription ? ` - ${reportDescription}` : ''}`,
          timestamp: new Date().toISOString(),
          user: {
            id: 'u1',
            name: 'You',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            isClient: false
          }
        }, ...task.activity]
      } : task));
      setReportReason('');
      setReportDescription('');
      setShowReportModal(false);
    }
  };
  const handleSubmitPayment = () => {
    if (selectedTaskId && paymentAmount) {
      const amount = parseFloat(paymentAmount);
      if (isNaN(amount) || amount <= 0) return;
      // Add a payment to the task
      setTasks(prevTasks => prevTasks.map(task => task.id === selectedTaskId ? {
        ...task,
        paymentStatus: 'partial',
        paymentHistory: [{
          id: `payment-${Date.now()}`,
          amount,
          date: new Date().toISOString(),
          status: 'completed',
          method: paymentMethod === 'credit_card' ? 'Credit Card' : 'Bank Transfer'
        }, ...(task.paymentHistory || [])],
        activity: [{
          id: `act-${Date.now()}`,
          type: 'note',
          content: `Payment of ${formatCurrency(amount)} made via ${paymentMethod === 'credit_card' ? 'Credit Card' : 'Bank Transfer'}`,
          timestamp: new Date().toISOString(),
          user: {
            id: 'u1',
            name: 'You',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            isClient: false
          }
        }, ...task.activity]
      } : task));
      setPaymentAmount('');
      setPaymentMethod('credit_card');
      setShowPayModal(false);
    }
  };
  const handleCloseTaskConfirm = () => {
    if (selectedTaskId) {
      // Mark the task as completed
      setTasks(prevTasks => prevTasks.map(task => task.id === selectedTaskId ? {
        ...task,
        status: 'completed',
        progress: 100,
        activity: [{
          id: `act-${Date.now()}`,
          type: 'status_change',
          content: 'Task marked as completed and closed',
          timestamp: new Date().toISOString(),
          user: {
            id: 'u1',
            name: 'You',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            isClient: false
          }
        }, ...task.activity]
      } : task));
      setShowCloseModal(false);
    }
  };
  const handleSendMessage = () => {
    if (selectedTaskId && messageText.trim()) {
      // Add a message to the task
      setTasks(prevTasks => prevTasks.map(task => task.id === selectedTaskId ? {
        ...task,
        activity: [{
          id: `act-${Date.now()}`,
          type: 'message',
          content: messageText,
          timestamp: new Date().toISOString(),
          user: {
            id: 'u1',
            name: 'You',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            isClient: false
          }
        }, ...task.activity]
      } : task));
      setMessageText('');
      setShowMessageModal(false);
      // If message was sent from task detail modal, switch to messages tab
      if (selectedTask) {
        setActiveTaskDetailTab('messages');
      }
    }
  };
  const handleAcceptProposal = () => {
    if (selectedTaskId) {
      // Change task status from pending_acceptance to in_progress
      setTasks(prevTasks => prevTasks.map(task => task.id === selectedTaskId ? {
        ...task,
        status: 'in_progress',
        startDate: new Date().toISOString(),
        activity: [{
          id: `act-${Date.now()}`,
          type: 'status_change',
          content: 'Proposal accepted, task started',
          timestamp: new Date().toISOString(),
          user: {
            id: 'u1',
            name: 'You',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            isClient: false
          }
        }, ...task.activity]
      } : task));
      setShowAcceptProposalModal(false);
    }
  };
  const handleLogTime = () => {
    if (selectedTaskId && (timeLogHours > 0 || timeLogMinutes > 0)) {
      const totalHours = timeLogHours + timeLogMinutes / 60;
      // Add time log to the task
      setTasks(prevTasks => prevTasks.map(task => task.id === selectedTaskId ? {
        ...task,
        loggedHours: (task.loggedHours || 0) + totalHours,
        activity: [{
          id: `act-${Date.now()}`,
          type: 'note',
          content: `Logged ${timeLogHours}h ${timeLogMinutes}m${timeLogDescription ? ` - ${timeLogDescription}` : ''}`,
          timestamp: new Date().toISOString(),
          user: {
            id: 'u1',
            name: 'You',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            isClient: false
          }
        }, ...task.activity],
        progressUpdates: [{
          id: `progress-${Date.now()}`,
          date: timeLogDate || new Date().toISOString(),
          description: timeLogDescription || 'Time logged',
          progressPercent: task.progress,
          hoursLogged: totalHours
        }, ...(task.progressUpdates || [])]
      } : task));
      setTimeLogHours(0);
      setTimeLogMinutes(0);
      setTimeLogDescription('');
      setTimeLogDate(new Date().toISOString().split('T')[0]);
      setShowTimeLogModal(false);
    }
  };
  const handleReassignTask = () => {
    if (selectedTaskId) {
      // In a real app, this would open a reassignment flow
      // For now, just add an activity note
      setTasks(prevTasks => prevTasks.map(task => task.id === selectedTaskId ? {
        ...task,
        activity: [{
          id: `act-${Date.now()}`,
          type: 'note',
          content: 'Task reassignment initiated',
          timestamp: new Date().toISOString(),
          user: {
            id: 'u1',
            name: 'You',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            isClient: false
          }
        }, ...task.activity]
      } : task));
      setShowReassignModal(false);
    }
  };
  // Get unique categories and clients for filters
  const uniqueCategories = Array.from(new Set(tasks.map(t => t.category)));
  const uniqueClients = Array.from(new Set(tasks.map(t => t.client.id))).map(clientId => tasks.find(t => t.client.id === clientId)?.client).filter(Boolean) as {
    id: string;
    name: string;
    avatar: string;
  }[];
  // Get unique doers for filters
  const uniqueDoers = Array.from(new Set(tasks.filter(t => t.doer).map(t => t.doer?.id))).map(doerId => tasks.find(t => t.doer?.id === doerId)?.doer).filter(Boolean) as {
    id: string;
    name: string;
    avatar: string;
  }[];
  // Render functions
  const renderSummaryCards = () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
        <p className="text-sm text-gray-500 font-medium">Active Tasks</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">
          {taskCounts.active}
        </p>
        <p className="text-xs text-gray-500 mt-2">Currently in progress</p>
      </div>
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
        <p className="text-sm text-gray-500 font-medium">Pending Acceptance</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">
          {taskCounts.pending}
        </p>
        <p className="text-xs text-gray-500 mt-2">Awaiting client response</p>
      </div>
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
        <p className="text-sm text-gray-500 font-medium">Completed This Week</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">
          {completedThisWeek}
        </p>
        <p className="text-xs text-gray-500 mt-2">Tasks finished this week</p>
      </div>
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
        <p className="text-sm text-gray-500 font-medium">Earnings This Month</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">
          {formatCurrency(totalEarningsThisMonth)}
        </p>
        <p className="text-xs text-gray-500 mt-2">From completed tasks</p>
      </div>
    </div>;
  const renderTabs = () => <div className="bg-white rounded-lg shadow mb-6 overflow-x-auto">
      <div className="flex border-b border-gray-200 min-w-max">
        <button className={`px-4 py-3 text-sm font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('all')}>
          All Tasks{' '}
          <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">
            {taskCounts.all}
          </span>
        </button>
        <button className={`px-4 py-3 text-sm font-medium ${activeTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('active')}>
          Active{' '}
          <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">
            {taskCounts.active}
          </span>
        </button>
        <button className={`px-4 py-3 text-sm font-medium ${activeTab === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('pending')}>
          Pending{' '}
          <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">
            {taskCounts.pending}
          </span>
        </button>
        <button className={`px-4 py-3 text-sm font-medium ${activeTab === 'scheduled' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('scheduled')}>
          Scheduled{' '}
          <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">
            {taskCounts.scheduled}
          </span>
        </button>
        <button className={`px-4 py-3 text-sm font-medium ${activeTab === 'in_review' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('in_review')}>
          In Review{' '}
          <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">
            {taskCounts.in_review}
          </span>
        </button>
        <button className={`px-4 py-3 text-sm font-medium ${activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('completed')}>
          Completed{' '}
          <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">
            {taskCounts.completed}
          </span>
        </button>
        <button className={`px-4 py-3 text-sm font-medium ${activeTab === 'declined' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('declined')}>
          Declined{' '}
          <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">
            {taskCounts.declined}
          </span>
        </button>
      </div>
    </div>;
  // New View Type Selector
  const renderViewTypeSelector = () => <div className="bg-white rounded-lg shadow mb-6 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">View Tasks By</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className={`border rounded-lg p-4 cursor-pointer transition-all ${viewType === 'clients' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`} onClick={() => handleViewTypeChange('clients')}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${viewType === 'clients' ? 'bg-blue-100' : 'bg-gray-100'} mr-3`}>
              <User size={20} className={viewType === 'clients' ? 'text-blue-600' : 'text-gray-500'} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Clients</h4>
              <p className="text-sm text-gray-500">
                Tasks where you're the doer
              </p>
            </div>
          </div>
        </div>
        <div className={`border rounded-lg p-4 cursor-pointer transition-all ${viewType === 'doers' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`} onClick={() => handleViewTypeChange('doers')}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${viewType === 'doers' ? 'bg-blue-100' : 'bg-gray-100'} mr-3`}>
              <UserPlus size={20} className={viewType === 'doers' ? 'text-blue-600' : 'text-gray-500'} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Do-ers</h4>
              <p className="text-sm text-gray-500">
                Tasks where others work for you
              </p>
            </div>
          </div>
        </div>
      </div>
      {viewType !== 'all' && <div className="mt-4 flex justify-end">
          <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center" onClick={() => handleViewTypeChange('all')}>
            <X size={16} className="mr-1" />
            Clear view filter
          </button>
        </div>}
    </div>;
  const renderFilterBar = () => <div className="bg-white rounded-lg shadow mb-6 p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <button className="flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={16} className="mr-2" />
            Filters
            {(statusFilters.length > 0 || dateRangeFilter !== 'all' || categoryFilter.length > 0 || clientFilter.length > 0 || doerFilter.length > 0 || priceRange.min !== null || priceRange.max !== null) && <span className="ml-1 w-5 h-5 flex items-center justify-center text-xs text-white bg-blue-600 rounded-full">
                {statusFilters.length + (dateRangeFilter !== 'all' ? 1 : 0) + categoryFilter.length + clientFilter.length + doerFilter.length + (priceRange.min !== null || priceRange.max !== null ? 1 : 0)}
              </span>}
          </button>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <select className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md appearance-none" value={sortOption} onChange={e => setSortOption(e.target.value)}>
              <option value="deadline_asc">Deadline (Soonest First)</option>
              <option value="deadline_desc">Deadline (Latest First)</option>
              <option value="newest_first">Newest First</option>
              <option value="oldest_first">Oldest First</option>
              <option value="highest_price">Highest Price</option>
              <option value="lowest_price">Lowest Price</option>
              <option value="client_name">Client Name (A-Z)</option>
              <option value="status">Status</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SlidersHorizontal size={16} className="text-gray-400" />
            </div>
          </div>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`} onClick={() => setViewMode('list')} title="List View">
              <List size={20} />
            </button>
            <button className={`p-2 ${viewMode === 'card' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`} onClick={() => setViewMode('card')} title="Card View">
              <Grid size={20} />
            </button>
            <button className={`p-2 ${viewMode === 'calendar' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`} onClick={() => setViewMode('calendar')} title="Calendar View">
              <Calendar size={20} />
            </button>
          </div>
        </div>
      </div>
      {showFilters && <div className="mt-4 border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="space-y-2">
              {['not_started', 'in_progress', 'paused', 'in_review', 'revision_requested', 'completed', 'cancelled', 'pending_acceptance', 'declined'].map(status => <div key={status} className="flex items-center">
                  <input type="checkbox" id={`status-${status}`} className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked={statusFilters.includes(status as TaskStatus)} onChange={e => {
              if (e.target.checked) {
                setStatusFilters([...statusFilters, status as TaskStatus]);
              } else {
                setStatusFilters(statusFilters.filter(s => s !== status));
              }
            }} />
                  <label htmlFor={`status-${status}`} className="ml-2 text-sm text-gray-700">
                    <StatusBadge status={status as TaskStatus} />
                  </label>
                </div>)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="space-y-2">
              {[{
            value: 'all',
            label: 'All Dates'
          }, {
            value: 'today',
            label: 'Today'
          }, {
            value: 'this_week',
            label: 'This Week'
          }, {
            value: 'this_month',
            label: 'This Month'
          }, {
            value: 'custom',
            label: 'Custom Range'
          }].map(option => <div key={option.value} className="flex items-center">
                  <input type="radio" id={`date-${option.value}`} name="date-range" className="h-4 w-4 text-blue-600 border-gray-300" checked={dateRangeFilter === option.value} onChange={() => setDateRangeFilter(option.value as any)} />
                  <label htmlFor={`date-${option.value}`} className="ml-2 text-sm text-gray-700">
                    {option.label}
                  </label>
                </div>)}
              {dateRangeFilter === 'custom' && <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Start Date
                    </label>
                    <input type="date" className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md" value={customDateRange?.start || ''} onChange={e => setCustomDateRange({
                ...(customDateRange || {
                  end: new Date().toISOString().split('T')[0]
                }),
                start: e.target.value
              })} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      End Date
                    </label>
                    <input type="date" className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md" value={customDateRange?.end || ''} onChange={e => setCustomDateRange({
                ...(customDateRange || {
                  start: new Date().toISOString().split('T')[0]
                }),
                end: e.target.value
              })} />
                  </div>
                </div>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {uniqueCategories.map(category => <div key={category} className="flex items-center">
                  <input type="checkbox" id={`category-${category}`} className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked={categoryFilter.includes(category)} onChange={e => {
              if (e.target.checked) {
                setCategoryFilter([...categoryFilter, category]);
              } else {
                setCategoryFilter(categoryFilter.filter(c => c !== category));
              }
            }} />
                  <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                    {category}
                  </label>
                </div>)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {uniqueClients.map(client => <div key={client.id} className="flex items-center">
                  <input type="checkbox" id={`client-${client.id}`} className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked={clientFilter.includes(client.id)} onChange={e => {
              if (e.target.checked) {
                setClientFilter([...clientFilter, client.id]);
              } else {
                setClientFilter(clientFilter.filter(c => c !== client.id));
              }
            }} />
                  <label htmlFor={`client-${client.id}`} className="ml-2 text-sm text-gray-700 flex items-center">
                    <img src={client.avatar} alt={client.name} className="w-5 h-5 rounded-full mr-1" />
                    {client.name}
                  </label>
                </div>)}
            </div>
          </div>
          {/* New Do-er filter section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Do-er
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {uniqueDoers.map(doer => <div key={doer.id} className="flex items-center">
                  <input type="checkbox" id={`doer-${doer.id}`} className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked={doerFilter.includes(doer.id)} onChange={e => {
              if (e.target.checked) {
                setDoerFilter([...doerFilter, doer.id]);
              } else {
                setDoerFilter(doerFilter.filter(d => d !== doer.id));
              }
            }} />
                  <label htmlFor={`doer-${doer.id}`} className="ml-2 text-sm text-gray-700 flex items-center">
                    <img src={doer.avatar} alt={doer.name} className="w-5 h-5 rounded-full mr-1" />
                    {doer.name}
                  </label>
                </div>)}
              {uniqueDoers.length === 0 && <div className="text-sm text-gray-500 italic">
                  No do-ers assigned to tasks yet
                </div>}
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Min Price
                </label>
                <input type="number" className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md" placeholder="Min" value={priceRange.min !== null ? priceRange.min : ''} onChange={e => setPriceRange({
              ...priceRange,
              min: e.target.value === '' ? null : Number(e.target.value)
            })} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Max Price
                </label>
                <input type="number" className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md" placeholder="Max" value={priceRange.max !== null ? priceRange.max : ''} onChange={e => setPriceRange({
              ...priceRange,
              max: e.target.value === '' ? null : Number(e.target.value)
            })} />
              </div>
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-4 flex justify-end">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800" onClick={handleClearFilters}>
              Clear All Filters
            </button>
          </div>
        </div>}
    </div>;
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
                <th scope="col" className="px-3 py-3 text-left">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked={selectedTaskIds.length === filteredTasks.length && filteredTasks.length > 0} onChange={handleSelectAll} />
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {viewType === 'doers' ? 'Do-er' : 'Client'}
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map(task => {
            const daysRemaining = getDaysRemaining(task.dueDate);
            const isOverdue = daysRemaining < 0;
            const isUrgent = daysRemaining <= 3 && !isOverdue && task.status !== 'completed';
            // Determine status bar color
            let statusBarColor = 'bg-gray-400';
            if (task.status === 'in_progress') statusBarColor = 'bg-green-500';else if (task.status === 'pending_acceptance') statusBarColor = 'bg-orange-500';else if (task.status === 'not_started') statusBarColor = 'bg-blue-500';else if (task.status === 'in_review') statusBarColor = 'bg-yellow-500';else if (task.status === 'completed') statusBarColor = 'bg-gray-500';else if (isOverdue) statusBarColor = 'bg-red-500';
            // Determine whether to show client or doer
            const personToShow = viewType === 'doers' ? task.doer : task.client;
            return <Fragment key={task.id}>
                    <tr className={`hover:bg-gray-50 ${expandedTaskId === task.id ? 'bg-gray-50' : ''}`}>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked={selectedTaskIds.includes(task.id)} onChange={() => handleTaskSelect(task.id)} onClick={e => e.stopPropagation()} />
                        </div>
                      </td>
                      <td className="px-3 py-4 cursor-pointer" onClick={() => handleTaskClick(task.id)}>
                        <div className="flex items-start">
                          <div className={`w-1 self-stretch ${statusBarColor} rounded-full mr-3`}></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {task.title}
                            </div>
                            <div className="flex items-center space-x-2">
                              <CategoryBadge category={task.category} />
                              <div className="text-xs text-gray-400">
                                {task.id}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap" onClick={() => handleTaskClick(task.id)}>
                        <div>
                          <StatusBadge status={task.status} />
                          {task.status === 'in_progress' && <div className="mt-2 w-24">
                              <ProgressBar progress={task.progress} status={task.status} />
                              <div className="text-xs text-gray-500 mt-1">
                                {task.progress}% Complete
                              </div>
                            </div>}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap" onClick={() => handleTaskClick(task.id)}>
                        <div className="text-sm text-gray-900">
                          {task.startDate && <div className="flex items-center text-xs text-gray-500 mb-1">
                              <span className="font-medium">Started:</span>
                              <span className="ml-1">
                                {formatDate(task.startDate)}
                              </span>
                            </div>}
                          <div className="flex items-center">
                            <span className="font-medium text-xs">Due:</span>
                            <span className={`ml-1 text-sm ${isOverdue ? 'text-red-600 font-medium' : isUrgent ? 'text-orange-600 font-medium' : 'text-gray-900'}`}>
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                          {task.status !== 'completed' && <div className={`text-xs mt-1 ${isOverdue ? 'text-red-600 font-medium' : isUrgent ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                              {isOverdue ? `Overdue by ${Math.abs(daysRemaining)} days` : `${daysRemaining} days remaining`}
                            </div>}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap" onClick={() => handleTaskClick(task.id)}>
                        {personToShow ? <div className="flex items-center">
                            <img src={personToShow.avatar} alt={personToShow.name} className="w-6 h-6 rounded-full mr-2" />
                            <div className="text-sm text-gray-900">
                              {personToShow.name}
                            </div>
                          </div> : <div className="text-sm text-gray-500 italic">
                            {viewType === 'doers' ? 'No do-er assigned' : 'No client'}
                          </div>}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap" onClick={() => handleTaskClick(task.id)}>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(task.price)}
                          </span>
                          <span className="ml-2">
                            <PaymentStatusIcon status={task.paymentStatus} />
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-800" onClick={() => handleViewTaskDetails(task.id)}>
                            View
                          </button>
                          <button className="text-green-600 hover:text-green-800" onClick={e => {
                      e.stopPropagation();
                      handleMessageClient(task.id);
                    }}>
                            <MessageSquare size={16} />
                          </button>
                          <div className="relative inline-block text-left">
                            <button className="text-gray-500 hover:text-gray-700" onClick={e => {
                        e.stopPropagation();
                        // Show dropdown with more actions
                        setSelectedTaskId(task.id);
                        setShowMoreActionsModal(true);
                      }}>
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    {expandedTaskId === task.id && <tr className="bg-gray-50">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="border-t border-gray-200 pt-4">
                            <div className="text-sm text-gray-700 mb-4">
                              {task.description}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
                                  Recent Activity
                                </h4>
                                <div className="space-y-3">
                                  {task.activity.slice(0, 2).map(activity => <div key={activity.id} className="flex items-start">
                                      <img src={activity.user.avatar} alt={activity.user.name} className="w-6 h-6 rounded-full mr-2" />
                                      <div>
                                        <div className="text-xs">
                                          <span className="font-medium">
                                            {activity.user.name}
                                          </span>
                                          <span className="text-gray-500 ml-1">
                                            {new Date(activity.timestamp).toLocaleDateString()}{' '}
                                            at{' '}
                                            {new Date(activity.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                          </span>
                                        </div>
                                        <div className="text-sm">
                                          {activity.content}
                                        </div>
                                      </div>
                                    </div>)}
                                </div>
                              </div>
                              {task.milestones && <div>
                                  <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
                                    Milestones
                                  </h4>
                                  <div className="space-y-2">
                                    {task.milestones.map(milestone => <div key={milestone.id} className="flex items-center">
                                        {milestone.completed ? <CheckCircle size={16} className="text-green-500 mr-2" /> : <Circle size={16} className="text-gray-300 mr-2" />}
                                        <div>
                                          <div className="text-sm">
                                            {milestone.title}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            Due: {formatDate(milestone.dueDate)}
                                          </div>
                                        </div>
                                      </div>)}
                                  </div>
                                </div>}
                              <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
                                  Quick Actions
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200" onClick={() => handleViewTaskDetails(task.id)}>
                                    View Details
                                  </button>
                                  <button className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200" onClick={() => handleMessageClient(task.id)}>
                                    Message
                                  </button>
                                  <button className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200" onClick={() => handlePayTask(task.id)}>
                                    Pay
                                  </button>
                                  <button className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200" onClick={() => handleReportTask(task.id)}>
                                    Report
                                  </button>
                                  <button className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200" onClick={() => handleCloseTask(task.id)}>
                                    Close
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" onClick={() => handleViewTaskDetails(task.id)}>
                                View Full Details
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>}
                  </Fragment>;
          })}
            </tbody>
          </table>
        </div> : <div className="py-12 text-center">
          <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
            <FileText size={48} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {statusFilters.length > 0 || dateRangeFilter !== 'all' || categoryFilter.length > 0 || clientFilter.length > 0 || doerFilter.length > 0 || priceRange.min !== null || priceRange.max !== null || viewType !== 'all' || searchQuery ? <>
                No tasks match your current filters. Try adjusting your filters
                to see more results.
                <button className="block mx-auto mt-4 text-blue-600 hover:text-blue-800 font-medium" onClick={handleClearFilters}>
                  Clear All Filters
                </button>
              </> : <>
                You don't have any tasks yet. Browse the marketplace to find
                work or create proposals.
                <button className="block mx-auto mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Browse Marketplace
                </button>
              </>}
          </p>
        </div>}
    </div>;
  const renderCardView = () => <div>
      {filteredTasks.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTasks.map(task => {
        const daysRemaining = getDaysRemaining(task.dueDate);
        const isOverdue = daysRemaining < 0;
        const isUrgent = daysRemaining <= 3 && !isOverdue && task.status !== 'completed';
        // Determine status bar color
        let statusBarColor = 'bg-gray-400';
        if (task.status === 'in_progress') statusBarColor = 'bg-green-500';else if (task.status === 'pending_acceptance') statusBarColor = 'bg-orange-500';else if (task.status === 'not_started') statusBarColor = 'bg-blue-500';else if (task.status === 'in_review') statusBarColor = 'bg-yellow-500';else if (task.status === 'completed') statusBarColor = 'bg-gray-500';else if (isOverdue) statusBarColor = 'bg-red-500';
        // Determine whether to show client or doer
        const personToShow = viewType === 'doers' ? task.doer : task.client;
        return <div key={task.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                <div className={`h-1 ${statusBarColor}`}></div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <CategoryBadge category={task.category} />
                    {(isUrgent || isOverdue) && <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${isOverdue ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                        <AlertCircle size={12} className="mr-1" />
                        {isOverdue ? 'Overdue' : 'Urgent'}
                      </span>}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600" onClick={() => handleViewTaskDetails(task.id)}>
                    {task.title}
                  </h3>
                  <div className="flex items-center mb-3">
                    {personToShow ? <>
                        <img src={personToShow.avatar} alt={personToShow.name} className="w-6 h-6 rounded-full mr-2" />
                        <span className="text-sm text-gray-700">
                          {viewType === 'doers' ? 'Do-er: ' : 'Client: '}
                          {personToShow.name}
                        </span>
                      </> : <span className="text-sm text-gray-500 italic">
                        {viewType === 'doers' ? 'No do-er assigned' : 'No client'}
                      </span>}
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="mb-4">
                    {task.status === 'in_progress' ? <div>
                        <ProgressBar progress={task.progress} status={task.status} />
                        <div className="text-xs text-gray-500 mt-1">
                          {task.progress}% Complete
                        </div>
                      </div> : task.status === 'pending_acceptance' ? <div className="text-sm text-orange-600 flex items-center">
                        <Clock size={14} className="mr-1" />
                        Awaiting Response
                        {task.clientLastViewed && <span className="ml-1 text-xs text-gray-500">
                            (viewed{' '}
                            {new Date(task.clientLastViewed).toLocaleDateString()}
                            )
                          </span>}
                      </div> : task.status === 'not_started' ? <div className="text-sm text-blue-600 flex items-center">
                        <Calendar size={14} className="mr-1" />
                        Starts{' '}
                        {task.startDate ? formatDate(task.startDate) : 'when accepted'}
                      </div> : <StatusBadge status={task.status} />}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                        Due {formatDate(task.dueDate)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {task.loggedHours !== undefined ? <span>
                          {task.loggedHours}/{task.estimatedHours} hrs
                        </span> : <span>Est. {task.estimatedHours} hrs</span>}
                    </div>
                    <div className="flex items-center">
                      <DollarSign size={14} className="mr-1" />
                      <span>{formatCurrency(task.price)}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <button className={`px-3 py-1.5 text-sm font-medium rounded-md ${task.status === 'pending_acceptance' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : task.status === 'not_started' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : task.status === 'in_progress' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => handleViewTaskDetails(task.id)}>
                      {task.status === 'pending_acceptance' ? 'View Proposal' : task.status === 'not_started' ? 'Start Task' : task.status === 'in_progress' ? 'Continue' : task.status === 'in_review' ? 'View Submission' : 'View Details'}
                    </button>
                    <div className="flex gap-2">
                      <button className="p-1.5 text-blue-500 hover:text-blue-700 rounded-md hover:bg-gray-100" onClick={() => handleMessageClient(task.id)} title="Message">
                        <MessageSquare size={16} />
                      </button>
                      <button className="p-1.5 text-green-500 hover:text-green-700 rounded-md hover:bg-gray-100" onClick={() => handlePayTask(task.id)} title="Pay">
                        <DollarSign size={16} />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100" onClick={() => {
                  setSelectedTaskId(task.id);
                  setShowMoreActionsModal(true);
                }} title="More Options">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>;
      })}
        </div> : <div className="bg-white rounded-lg shadow py-12 text-center">
          <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
            <FileText size={48} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {statusFilters.length > 0 || dateRangeFilter !== 'all' || categoryFilter.length > 0 || clientFilter.length > 0 || doerFilter.length > 0 || priceRange.min !== null || priceRange.max !== null || viewType !== 'all' || searchQuery ? <>
                No tasks match your current filters. Try adjusting your filters
                to see more results.
                <button className="block mx-auto mt-4 text-blue-600 hover:text-blue-800 font-medium" onClick={handleClearFilters}>
                  Clear All Filters
                </button>
              </> : <>
                You don't have any tasks yet. Browse the marketplace to find
                work or create proposals.
                <button className="block mx-auto mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Browse Marketplace
                </button>
              </>}
          </p>
        </div>}
    </div>;
  const renderCalendarView = () => {
    // Generate days for a simple calendar view
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0-6, 0 is Sunday
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    // Group tasks by date
    const tasksByDate: Record<string, Task[]> = {};
    filteredTasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const dateKey = `${dueDate.getFullYear()}-${dueDate.getMonth()}-${dueDate.getDate()}`;
      if (!tasksByDate[dateKey]) {
        tasksByDate[dateKey] = [];
      }
      tasksByDate[dateKey].push(task);
    });
    return <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {today.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })}
          </h3>
          <div className="flex space-x-2">
            <button className="p-1 border border-gray-300 rounded text-gray-500 hover:bg-gray-50">
              <ChevronLeft size={18} />
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
              Today
            </button>
            <button className="p-1 border border-gray-300 rounded text-gray-500 hover:bg-gray-50">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-center border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => <div key={i} className="py-2 text-sm font-medium text-gray-500">
              {day}
            </div>)}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="border-b border-r border-gray-200 bg-gray-50" />;
          }
          const date = new Date(currentYear, currentMonth, day);
          const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          const tasksForDay = tasksByDate[dateKey] || [];
          const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
          return <div key={`day-${day}`} className={`border-b border-r border-gray-200 p-1 min-h-[100px] ${isToday ? 'bg-blue-50' : ''}`}>
                <div className={`text-right p-1 text-sm ${isToday ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                  {day}
                </div>
                <div className="space-y-1 max-h-[80px] overflow-y-auto">
                  {tasksForDay.map(task => {
                // Determine task color based on status
                let bgColor = 'bg-gray-100';
                let textColor = 'text-gray-800';
                if (task.status === 'in_progress') {
                  bgColor = 'bg-green-100';
                  textColor = 'text-green-800';
                } else if (task.status === 'pending_acceptance') {
                  bgColor = 'bg-orange-100';
                  textColor = 'text-orange-800';
                } else if (task.status === 'not_started') {
                  bgColor = 'bg-blue-100';
                  textColor = 'text-blue-800';
                } else if (task.status === 'in_review') {
                  bgColor = 'bg-yellow-100';
                  textColor = 'text-yellow-800';
                } else if (task.status === 'completed') {
                  bgColor = 'bg-gray-100';
                  textColor = 'text-gray-800';
                }
                // Determine whether to show client or doer
                const personToShow = viewType === 'doers' ? task.doer : task.client;
                return <div key={task.id} className={`p-1 rounded text-xs ${bgColor} ${textColor} cursor-pointer hover:opacity-90`} onClick={() => handleViewTaskDetails(task.id)}>
                        <div className="flex items-center justify-between">
                          <span className="truncate">{task.title}</span>
                          {personToShow && <div className="w-5 h-5 rounded-full flex items-center justify-center bg-white text-xs">
                              {personToShow.name.charAt(0)}
                            </div>}
                        </div>
                      </div>;
              })}
                </div>
              </div>;
        })}
        </div>
      </div>;
  };
  // Task detail modal tabs content
  const renderTaskDetailOverviewTab = () => {
    if (!selectedTask) return null;
    return <div>
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            Description
          </h2>
          <p className="text-gray-700 whitespace-pre-line">
            {selectedTask.description}
          </p>
        </div>
        {selectedTask.milestones && <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">
              Milestones
            </h2>
            <div className="space-y-3">
              {selectedTask.milestones.map(milestone => <div key={milestone.id} className={`p-3 border rounded-md ${milestone.completed ? 'bg-green-50 border-green-200' : 'border-gray-200'}`}>
                  <div className="flex items-center">
                    <div className={`p-1 rounded-full ${milestone.completed ? 'bg-green-100' : 'bg-gray-100'} mr-3`}>
                      {milestone.completed ? <CheckCircle size={16} className="text-green-600" /> : <Clock size={16} className="text-gray-400" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {milestone.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        Due: {formatDate(milestone.dueDate)}
                      </div>
                    </div>
                    {!milestone.completed && <button className="ml-auto text-sm text-blue-600 hover:text-blue-800">
                        Mark Complete
                      </button>}
                  </div>
                </div>)}
            </div>
          </div>}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            Files & Attachments
          </h2>
          {selectedTask.attachments.length > 0 ? <div className="space-y-2">
              {selectedTask.attachments.map(attachment => <div key={attachment.id} className="flex items-center p-2 border border-gray-200 rounded-md">
                  <div className="p-2 bg-gray-100 rounded-md mr-3">
                    <FileText size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {attachment.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {attachment.type.toUpperCase()}
                    </div>
                  </div>
                  <button className="ml-auto text-blue-600 hover:text-blue-800">
                    <Download size={16} />
                  </button>
                </div>)}
            </div> : <div className="text-sm text-gray-500">
              No files attached to this task.
            </div>}
          <div className="mt-4">
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              <Upload size={16} className="mr-1" />
              Upload Files
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            Activity Timeline
          </h2>
          <div className="space-y-4">
            {selectedTask.activity.slice(0, 5).map((activity, index) => <div key={activity.id} className="flex">
                <div className="mr-3 relative">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    {activity.type === 'status_change' && <CheckSquareIcon size={16} className="text-blue-600" />}
                    {activity.type === 'message' && <MessageSquare size={16} className="text-blue-600" />}
                    {activity.type === 'file' && <Paperclip size={16} className="text-blue-600" />}
                    {activity.type === 'note' && <FileText size={16} className="text-blue-600" />}
                  </div>
                  {index < selectedTask.activity.slice(0, 5).length - 1 && <div className="absolute top-8 bottom-0 left-4 w-0.5 bg-gray-200"></div>}
                </div>
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-medium">{activity.user.name}</span>
                    <span className="text-gray-500 ml-1">
                      {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                      {new Date(activity.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                    </span>
                  </div>
                  <div className="mt-1 text-gray-700">{activity.content}</div>
                  {activity.type === 'message' && <button className="mt-1 text-sm text-blue-600 hover:text-blue-800">
                      Reply
                    </button>}
                </div>
              </div>)}
          </div>
        </div>
      </div>;
  };
  const renderTaskDetailProgressTab = () => {
    if (!selectedTask) return null;
    return <div>
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            Overall Progress
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Task Completion
              </span>
              <span className="text-sm font-medium text-gray-700">
                {selectedTask.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div className="h-2.5 rounded-full bg-blue-600" style={{
              width: `${selectedTask.progress}%`
            }}></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-500">Estimated Hours</div>
                <div className="text-lg font-medium text-gray-900">
                  {selectedTask.estimatedHours || 0}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Hours Logged</div>
                <div className="text-lg font-medium text-gray-900">
                  {selectedTask.loggedHours || 0}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Remaining</div>
                <div className="text-lg font-medium text-gray-900">
                  {Math.max(0, (selectedTask.estimatedHours || 0) - (selectedTask.loggedHours || 0))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium text-gray-900">
              Progress Updates
            </h2>
            <button onClick={() => setShowTimeLogModal(true)} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              <PlusCircle size={16} className="mr-1" />
              Log Time & Progress
            </button>
          </div>
          {selectedTask.progressUpdates && selectedTask.progressUpdates.length > 0 ? <div className="space-y-4">
              {selectedTask.progressUpdates.map(update => <div key={update.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <BarChart2 size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Progress Update
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(update.date)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {update.progressPercent}% Complete
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    {update.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <ClockIcon size={14} className="mr-1" />
                    <span>{update.hoursLogged} hours logged</span>
                  </div>
                </div>)}
            </div> : <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <BarChart2 size={36} className="mx-auto text-gray-400 mb-2" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                No progress updates yet
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Log your first progress update to track your work
              </p>
              <button onClick={() => setShowTimeLogModal(true)} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Log Time & Progress
              </button>
            </div>}
        </div>
        {selectedTask.milestones && <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">
              Milestones Progress
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="space-y-4">
                {selectedTask.milestones.map((milestone, index) => <div key={milestone.id} className="flex items-center">
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${milestone.completed ? 'bg-green-100' : 'bg-gray-200'}`}>
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      {index < selectedTask.milestones!.length - 1 && <div className={`absolute top-8 left-4 w-0.5 h-6 ${milestone.completed ? 'bg-green-400' : 'bg-gray-300'}`}></div>}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {milestone.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            Due: {formatDate(milestone.dueDate)}
                          </div>
                        </div>
                        {milestone.completed ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} className="mr-1" />
                            Completed
                          </span> : <button className="text-sm text-blue-600 hover:text-blue-800">
                            Mark Complete
                          </button>}
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>}
      </div>;
  };
  const renderTaskDetailMessagesTab = () => {
    if (!selectedTask) return null;
    // Filter messages from activity
    const messages = selectedTask.activity.filter(act => act.type === 'message');
    return <div className="h-full flex flex-col">
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-4">
            <img src={selectedTask.client.avatar} alt={selectedTask.client.name} className="w-10 h-10 rounded-full" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {selectedTask.client.name}
              </div>
              <div className="text-xs text-gray-500">Client</div>
            </div>
            <button className="ml-auto px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
              View Profile
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
          {messages.length > 0 ? <div className="space-y-4">
              {messages.map(message => <div key={message.id} className={`flex ${message.user.isClient ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs sm:max-w-md rounded-lg p-3 ${message.user.isClient ? 'bg-white border border-gray-200' : 'bg-blue-100'}`}>
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
            </div> : <div className="text-center py-12">
              <MessageSquare size={36} className="mx-auto text-gray-400 mb-2" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                No messages yet
              </h3>
              <p className="text-xs text-gray-500">
                Start the conversation with your client
              </p>
            </div>}
        </div>
        <div className="relative">
          <textarea placeholder="Type your message here..." rows={3} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={messageText} onChange={e => setMessageText(e.target.value)}></textarea>
          <div className="absolute bottom-2 right-2 flex space-x-1">
            <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100">
              <Paperclip size={16} />
            </button>
            <button className={`inline-flex items-center p-1.5 rounded-full shadow-sm ${messageText.trim() ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-gray-400 bg-gray-200'}`} onClick={handleSendMessage} disabled={!messageText.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>;
  };
  const renderTaskDetailPaymentTab = () => {
    if (!selectedTask) return null;
    return <div>
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            Payment Summary
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-500">Total Budget</div>
                <div className="text-lg font-medium text-gray-900">
                  {formatCurrency(selectedTask.price)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Payment Status</div>
                <div className="flex items-center">
                  <PaymentStatusIcon status={selectedTask.paymentStatus} />
                  <span className="ml-1 text-sm font-medium text-gray-900">
                    {selectedTask.paymentStatus === 'paid' ? 'Paid in full' : selectedTask.paymentStatus === 'partial' ? 'Partially paid' : selectedTask.paymentStatus === 'no_fee' ? 'No fee required' : 'Payment pending'}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Hourly Rate</div>
                <div className="text-lg font-medium text-gray-900">
                  {selectedTask.paymentStatus === 'no_fee' ? 'N/A' : formatCurrency(Math.round(selectedTask.price / (selectedTask.estimatedHours || 1)))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium text-gray-900">
              Payment History
            </h2>
            {selectedTask.paymentStatus !== 'no_fee' && <button onClick={() => setShowPayModal(true)} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                <PlusCircle size={16} className="mr-1" />
                Make Payment
              </button>}
          </div>
          {selectedTask.paymentStatus !== 'no_fee' ? selectedTask.paymentHistory && selectedTask.paymentHistory.length > 0 ? <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Method
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Receipt
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedTask.paymentHistory.map(payment => <tr key={payment.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatDate(payment.date)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {payment.method}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Download size={16} />
                          </button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div> : <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <CreditCard size={36} className="mx-auto text-gray-400 mb-2" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  No payments yet
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Make your first payment to get started
                </p>
                <button onClick={() => setShowPayModal(true)} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Make Payment
                </button>
              </div> : <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <CheckCircle size={36} className="mx-auto text-green-500 mb-2" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                No Fee Required
              </h3>
              <p className="text-xs text-gray-500">
                This task doesn't require any payment
              </p>
            </div>}
        </div>
        {selectedTask.paymentStatus !== 'no_fee' && <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">
              Payment Methods
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-md mr-3">
                    <CreditCard size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Credit Card
                    </div>
                    <div className="text-xs text-gray-500">
                      Visa ending in 4242
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">Default</div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                + Add Payment Method
              </button>
            </div>
          </div>}
      </div>;
  };
  const renderTaskDetailReassignTab = () => {
    if (!selectedTask) return null;
    return <div>
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            Task Assignment
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                <img src={selectedTask.client.avatar} alt={selectedTask.client.name} className="w-12 h-12 rounded-full" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  Currently assigned to:
                </div>
                <div className="text-lg font-medium text-gray-900">You</div>
                <div className="text-xs text-gray-500">
                  Since{' '}
                  {formatDate(selectedTask.startDate || selectedTask.dueDate)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            Reassignment Options
          </h2>
          <div className="space-y-4">
            <button onClick={() => setShowReassignModal(true)} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-md mr-3">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    Find a New Freelancer
                  </div>
                  <div className="text-xs text-gray-500">
                    Reassign this task to another freelancer
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
            <button onClick={() => setShowReassignModal(true)} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-md mr-3">
                  <User size={20} className="text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    Invite Someone
                  </div>
                  <div className="text-xs text-gray-500">
                    Invite someone specific to take over this task
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-md mr-3">
                  <XCircle size={20} className="text-red-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    Abandon Task
                  </div>
                  <div className="text-xs text-gray-500">
                    Release this task and mark it as available
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            Important Notes
          </h2>
          <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="flex items-start">
              <AlertCircle size={20} className="text-yellow-600 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">
                    Reassigning a task has important consequences:
                  </span>
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>You'll no longer have access to this task</li>
                  <li>Any progress you've made will be transferred</li>
                  <li>The client will be notified of the change</li>
                  <li>Payment arrangements may need to be adjusted</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>;
  };
  const renderTaskDetailModal = () => {
    if (!selectedTaskId) return null;
    const task = tasks.find(t => t.id === selectedTaskId);
    if (!task) return null;
    const daysRemaining = getDaysRemaining(task.dueDate);
    const isOverdue = daysRemaining < 0;
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <button className="text-gray-500 hover:text-gray-700 flex items-center" onClick={handleCloseTaskDetails}>
              <ChevronLeft size={20} className="mr-1" />
              <span>Back to Tasks</span>
            </button>
            <button className="text-gray-500 hover:text-gray-700" onClick={handleCloseTaskDetails}>
              <X size={20} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {task.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={task.status} />
                  <CategoryBadge category={task.category} />
                  {task.priority && <PriorityBadge priority={task.priority} />}
                  <span className="text-sm text-gray-500">{task.id}</span>
                </div>
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <img src={task.client.avatar} alt={task.client.name} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {task.client.name}
                  </div>
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    View Profile
                  </button>
                </div>
                <button className="ml-4 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200" onClick={() => {
                setShowMessageModal(true);
              }}>
                  Contact
                </button>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-4 mb-6">
              <div className="flex space-x-1 overflow-x-auto">
                <button className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTaskDetailTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTaskDetailTab('overview')}>
                  Overview
                </button>
                <button className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTaskDetailTab === 'progress' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTaskDetailTab('progress')}>
                  Progress
                </button>
                <button className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTaskDetailTab === 'messages' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTaskDetailTab('messages')}>
                  Messages
                </button>
                <button className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTaskDetailTab === 'payment' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTaskDetailTab('payment')}>
                  Payment
                </button>
                <button className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTaskDetailTab === 'reassign' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTaskDetailTab('reassign')}>
                  Reassign
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                {/* Tab content */}
                {activeTaskDetailTab === 'overview' && renderTaskDetailOverviewTab()}
                {activeTaskDetailTab === 'progress' && renderTaskDetailProgressTab()}
                {activeTaskDetailTab === 'messages' && renderTaskDetailMessagesTab()}
                {activeTaskDetailTab === 'payment' && renderTaskDetailPaymentTab()}
                {activeTaskDetailTab === 'reassign' && renderTaskDetailReassignTab()}
              </div>
              <div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Task Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500">Status</div>
                      <div className="flex items-center justify-between mt-1">
                        <StatusBadge status={task.status} />
                        <button className="text-xs text-blue-600 hover:text-blue-800" onClick={() => setShowStatusUpdateModal(true)}>
                          Update
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Due Date</div>
                      <div className={`text-sm font-medium mt-1 ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatDate(task.dueDate)}
                        {task.status !== 'completed' && <span className="block text-xs mt-0.5">
                            {isOverdue ? `Overdue by ${Math.abs(daysRemaining)} days` : `${daysRemaining} days remaining`}
                          </span>}
                      </div>
                    </div>
                    {task.startDate && <div>
                        <div className="text-xs text-gray-500">Start Date</div>
                        <div className="text-sm font-medium text-gray-900 mt-1">
                          {formatDate(task.startDate)}
                        </div>
                      </div>}
                    <div>
                      <div className="text-xs text-gray-500">Price</div>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {task.paymentStatus === 'no_fee' ? 'No Fee' : formatCurrency(task.price)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">
                        Payment Status
                      </div>
                      <div className="flex items-center text-sm font-medium text-gray-900 mt-1">
                        <PaymentStatusIcon status={task.paymentStatus} />
                        <span className="ml-1">
                          {task.paymentStatus === 'paid' ? 'Paid in full' : task.paymentStatus === 'partial' ? 'Partially paid' : task.paymentStatus === 'no_fee' ? 'No fee required' : 'Payment pending'}
                        </span>
                      </div>
                    </div>
                    {task.estimatedHours !== undefined && <div>
                        <div className="text-xs text-gray-500">
                          Time Estimate
                        </div>
                        <div className="text-sm font-medium text-gray-900 mt-1">
                          {task.estimatedHours} hours
                          {task.loggedHours !== undefined && <span className="text-xs text-gray-500 ml-1">
                              ({task.loggedHours} logged)
                            </span>}
                        </div>
                      </div>}
                    {task.doer && <div>
                        <div className="text-xs text-gray-500">Do-er</div>
                        <div className="flex items-center text-sm font-medium text-gray-900 mt-1">
                          <img src={task.doer.avatar} alt={task.doer.name} className="w-5 h-5 rounded-full mr-1" />
                          <span>{task.doer.name}</span>
                        </div>
                      </div>}
                  </div>
                </div>
                <div className="space-y-3">
                  {task.status === 'pending_acceptance' && <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center justify-center" onClick={() => setShowAcceptProposalModal(true)}>
                      <CheckCircle size={16} className="mr-2" />
                      Accept Proposal
                    </button>}
                  {task.status === 'not_started' && <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center" onClick={() => handleStatusChange(task.id, 'in_progress')}>
                      <Play size={16} className="mr-2" />
                      Start Task
                    </button>}
                  {task.status === 'in_progress' && <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center" onClick={() => handleStatusChange(task.id, 'in_review')}>
                      <CheckSquare size={16} className="mr-2" />
                      Submit for Review
                    </button>}
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center" onClick={() => setShowMessageModal(true)}>
                    <MessageSquare size={16} className="mr-2" />
                    Message Client
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center" onClick={() => setShowTimeLogModal(true)}>
                    <Clock size={16} className="mr-2" />
                    Log Time
                  </button>
                  <div className="relative">
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center" onClick={() => setShowMoreActionsModal(true)}>
                      <MoreHorizontal size={16} className="mr-2" />
                      More Actions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>;
  };
  // Render modals
  const renderStatusUpdateModal = () => {
    if (!showStatusUpdateModal) return null;
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Update Task Status
            </h3>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowStatusUpdateModal(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <div className="space-y-2">
                {['not_started', 'in_progress', 'paused', 'in_review', 'completed'].map(status => <div key={status} className="flex items-center">
                    <input type="radio" id={`update-status-${status}`} name="update-status" className="h-4 w-4 text-blue-600 border-gray-300" />
                    <label htmlFor={`update-status-${status}`} className="ml-2 text-sm text-gray-700">
                      <StatusBadge status={status as TaskStatus} />
                    </label>
                  </div>)}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress Update
              </label>
              <div className="flex items-center mb-2">
                <span className="text-sm text-gray-500 mr-2">0%</span>
                <input type="range" min="0" max="100" step="5" className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" defaultValue="50" />
                <span className="text-sm text-gray-500 ml-2">100%</span>
              </div>
              <div className="text-sm text-gray-500">Current progress: 50%</div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Note
              </label>
              <textarea className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" rows={3} placeholder="Add a note about this status update..."></textarea>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Attachments
                </label>
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  Add Files
                </button>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <div className="text-sm text-gray-500">
                  Drag and drop files here, or click to select files
                </div>
              </div>
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
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium" onClick={() => handleStatusChange(selectedTaskId || '', 'in_progress')}>
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>;
  };
  // Report task modal
  const renderReportModal = () => {
    if (!showReportModal) return null;
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Report Issue</h3>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowReportModal(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Type
              </label>
              <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" value={reportReason} onChange={e => setReportReason(e.target.value)}>
                <option value="">Select an issue type...</option>
                <option value="client_communication">
                  Client Communication Issues
                </option>
                <option value="payment_dispute">Payment Dispute</option>
                <option value="scope_creep">Scope Creep</option>
                <option value="technical_issue">Technical Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" rows={5} placeholder="Describe the issue in detail..." value={reportDescription} onChange={e => setReportDescription(e.target.value)}></textarea>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Supporting Evidence (Optional)
                </label>
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  Add Files
                </button>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <div className="text-sm text-gray-500">
                  Drag and drop screenshots or files here
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium" onClick={() => setShowReportModal(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium" onClick={handleSubmitReport} disabled={!reportReason}>
                Submit Report
              </button>
            </div>
          </div>
        </div>
      </div>;
  };
  // Pay task modal
  const renderPayModal = () => {
    if (!showPayModal) return null;
    const task = tasks.find(t => t.id === selectedTaskId);
    const remainingAmount = task ? task.price - (task.paymentHistory?.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0) || 0) : 0;
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Make Payment</h3>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowPayModal(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex justify-between">
                <div>
                  <div className="text-sm text-gray-500">Total Budget</div>
                  <div className="text-lg font-medium text-gray-900">
                    {formatCurrency(task?.price || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Remaining</div>
                  <div className="text-lg font-medium text-gray-900">
                    {formatCurrency(remainingAmount)}
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input type="text" className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="0.00" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
              </div>
              <div className="mt-1 flex justify-between">
                <button className="text-xs text-blue-600 hover:text-blue-800" onClick={() => setPaymentAmount(remainingAmount.toString())}>
                  Pay full amount
                </button>
                <button className="text-xs text-blue-600 hover:text-blue-800" onClick={() => setPaymentAmount((remainingAmount / 2).toFixed(2))}>
                  Pay half
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="radio" id="payment-credit-card" name="payment-method" className="h-4 w-4 text-blue-600 border-gray-300" checked={paymentMethod === 'credit_card'} onChange={() => setPaymentMethod('credit_card')} />
                  <label htmlFor="payment-credit-card" className="ml-2 text-sm text-gray-700 flex items-center">
                    <CreditCard size={16} className="mr-1" />
                    Credit Card (Visa ending in 4242)
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="payment-bank-transfer" name="payment-method" className="h-4 w-4 text-blue-600 border-gray-300" checked={paymentMethod === 'bank_transfer'} onChange={() => setPaymentMethod('bank_transfer')} />
                  <label htmlFor="payment-bank-transfer" className="ml-2 text-sm text-gray-700 flex items-center">
                    <Clipboard size={16} className="mr-1" />
                    Bank Transfer
                  </label>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note (Optional)
              </label>
              <textarea className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" rows={2} placeholder="Add a note for this payment..."></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium" onClick={() => setShowPayModal(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium" onClick={handleSubmitPayment} disabled={!paymentAmount || isNaN(parseFloat(paymentAmount)) || parseFloat(paymentAmount) <= 0}>
                Make Payment
              </button>
            </div>
          </div>
        </div>
      </div>;
  };
  // Close task modal
  const renderCloseModal = () => {
    if (!showCloseModal) return null;
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Close Task</h3>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowCloseModal(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    Mark task as completed?
                  </h4>
                  <p className="text-sm text-gray-500">
                    This will close the task and finalize all work.
                  </p>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <div className="flex">
                  <AlertTriangle size={20} className="text-yellow-600 mr-2" />
                  <div className="text-sm text-yellow-800">
                    Make sure all work is complete and you've received final
                    payment before closing this task.
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Closing Notes (Optional)
              </label>
              <textarea className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" rows={3} placeholder="Add any final notes about the completed work..."></textarea>
            </div>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input type="checkbox" id="request-review" className="h-4 w-4 text-blue-600 border-gray-300 rounded" defaultChecked />
                <label htmlFor="request-review" className="ml-2 text-sm text-gray-700">
                  Request client review
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="notify-client-close" className="h-4 w-4 text-blue-600 border-gray-300 rounded" defaultChecked />
                <label htmlFor="notify-client-close" className="ml-2 text-sm text-gray-700">
                  Notify client that task is closed
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium" onClick={() => setShowCloseModal(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium" onClick={handleCloseTaskConfirm}>
                Complete & Close
              </button>
            </div>
          </div>
        </div>
      </div>;
  };
  // Message modal
  const renderMessageModal = () => {
    if (!showMessageModal) return null;
    const task = tasks.find(t => t.id === selectedTaskId);
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Message Client
            </h3>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowMessageModal(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="mb-4 flex items-center">
              <img src={task?.client.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'} alt={task?.client.name || 'Client'} className="w-10 h-10 rounded-full mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  To: {task?.client.name || 'Client'}
                </div>
                <div className="text-xs text-gray-500">
                  Re: {task?.title || 'Task'}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" rows={5} placeholder="Type your message here..." value={messageText} onChange={e => setMessageText(e.target.value)}></textarea>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Attachments (Optional)
                </label>
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  Add Files
                </button>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                <div className="text-sm text-gray-500">
                  Drag and drop files here
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium" onClick={() => setShowMessageModal(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium" onClick={handleSendMessage} disabled={!messageText.trim()}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>;
  };
  // Accept proposal modal
  const renderAcceptProposalModal = () => {
    if (!showAcceptProposalModal) return null;
    const task = tasks.find(t => t.id === selectedTaskId);
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Accept Proposal
            </h3>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowAcceptProposalModal(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <CheckCircle size={24} className="text-orange-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    Accept this proposal?
                  </h4>
                  <p className="text-sm text-gray-500">
                    This will begin the task and create a contract.
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Task Budget
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(task?.price || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Estimated Completion
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(task?.dueDate || '')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Estimated Hours
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {task?.estimatedHours || 0} hours
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input type="checkbox" id="agree-terms" className="h-4 w-4 text-blue-600 border-gray-300 rounded" defaultChecked />
                <label htmlFor="agree-terms" className="ml-2 text-sm text-gray-700">
                  I agree to the terms of service and scope of work
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="authorize-payment" className="h-4 w-4 text-blue-600 border-gray-300 rounded" defaultChecked />
                <label htmlFor="authorize-payment" className="ml-2 text-sm text-gray-700">
                  I authorize the initial payment to be processed
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium" onClick={() => setShowAcceptProposalModal(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm font-medium" onClick={handleAcceptProposal}>
                Accept & Start Task
              </button>
            </div>
          </div>
        </div>
      </div>;
  };
  // Time log modal
  const renderTimeLogModal = () => {
    if (!showTimeLogModal) return null;
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Log Time</h3>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowTimeLogModal(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input type="date" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={timeLogDate} onChange={e => setTimeLogDate(e.target.value)} />
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours
                </label>
                <input type="number" min="0" max="24" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={timeLogHours} onChange={e => setTimeLogHours(parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minutes
                </label>
                <input type="number" min="0" max="59" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={timeLogMinutes} onChange={e => setTimeLogMinutes(parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" rows={3} placeholder="What did you work on?" value={timeLogDescription} onChange={e => setTimeLogDescription(e.target.value)}></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress Update (%)
              </label>
              <div className="flex items-center">
                <input type="range" min="0" max="100" step="5" className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mr-2" defaultValue="50" />
                <span className="text-sm font-medium w-8 text-center">50%</span>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium" onClick={() => setShowTimeLogModal(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium" onClick={handleLogTime} disabled={timeLogHours === 0 && timeLogMinutes === 0}>
                Log Time
              </button>
            </div>
          </div>
        </div>
      </div>;
  };
  // More actions modal
  const renderMoreActionsModal = () => {
    if (!showMoreActionsModal) return null;
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">More Actions</h3>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowMoreActionsModal(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="p-2">
            <button className="w-full flex items-center p-3 hover:bg-gray-50 text-left" onClick={() => {
            setShowMoreActionsModal(false);
            setShowReportModal(true);
          }}>
              <Flag size={20} className="text-red-500 mr-3" />
              <span className="text-sm">Report Issue</span>
            </button>
            <button className="w-full flex items-center p-3 hover:bg-gray-50 text-left" onClick={() => {
            setShowMoreActionsModal(false);
            setShowPayModal(true);
          }}>
              <CreditCard size={20} className="text-blue-500 mr-3" />
              <span className="text-sm">Process Payment</span>
            </button>
            <button className="w-full flex items-center p-3 hover:bg-gray-50 text-left" onClick={() => {
            setShowMoreActionsModal(false);
            setActiveTaskDetailTab('reassign');
          }}>
              <Users size={20} className="text-purple-500 mr-3" />
              <span className="text-sm">Reassign Task</span>
            </button>
            <button className="w-full flex items-center p-3 hover:bg-gray-50 text-left" onClick={() => {
            setShowMoreActionsModal(false);
            setShowCloseModal(true);
          }}>
              <Lock size={20} className="text-green-500 mr-3" />
              <span className="text-sm">Close Task</span>
            </button>
            <button className="w-full flex items-center p-3 hover:bg-gray-50 text-left" onClick={() => {
            setShowMoreActionsModal(false);
            // In a real app, this would generate a PDF or open a print dialog
            alert('Generating task report...');
          }}>
              <FileTextIcon size={20} className="text-gray-500 mr-3" />
              <span className="text-sm">Export Task Report</span>
            </button>
          </div>
        </div>
      </div>;
  };
  // Reassign modal
  const renderReassignModal = () => {
    if (!showReassignModal) return null;
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Reassign Task</h3>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowReassignModal(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reassignment Type
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="radio" id="reassign-marketplace" name="reassign-type" className="h-4 w-4 text-blue-600 border-gray-300" defaultChecked />
                  <label htmlFor="reassign-marketplace" className="ml-2 text-sm text-gray-700">
                    Post to Marketplace
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="reassign-invite" name="reassign-type" className="h-4 w-4 text-blue-600 border-gray-300" />
                  <label htmlFor="reassign-invite" className="ml-2 text-sm text-gray-700">
                    Invite Specific Person
                  </label>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Reassignment
              </label>
              <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option>Select a reason...</option>
                <option>No longer available</option>
                <option>Skill mismatch</option>
                <option>Schedule conflict</option>
                <option>Client request</option>
                <option>Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Handover Notes
              </label>
              <textarea className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" rows={3} placeholder="Add notes for the next person who will work on this task..."></textarea>
            </div>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input type="checkbox" id="transfer-files" className="h-4 w-4 text-blue-600 border-gray-300 rounded" defaultChecked />
                <label htmlFor="transfer-files" className="ml-2 text-sm text-gray-700">
                  Transfer all files and progress
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="notify-client-reassign" className="h-4 w-4 text-blue-600 border-gray-300 rounded" defaultChecked />
                <label htmlFor="notify-client-reassign" className="ml-2 text-sm text-gray-700">
                  Notify client about reassignment
                </label>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <div className="flex">
                <AlertTriangle size={20} className="text-yellow-600 mr-2" />
                <div className="text-sm text-yellow-800">
                  This action cannot be undone. Once reassigned, you will no
                  longer have access to this task.
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium" onClick={() => setShowReassignModal(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium" onClick={handleReassignTask}>
                Reassign Task
              </button>
            </div>
          </div>
        </div>
      </div>;
  };
  return <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          My Tasks
        </h1>
        {renderSummaryCards()}
        {renderTabs()}
        {renderViewTypeSelector()}
        {renderFilterBar()}
        {viewMode === 'list' && renderListView()}
        {viewMode === 'card' && renderCardView()}
        {viewMode === 'calendar' && renderCalendarView()}
        {renderTaskDetailModal()}
        {renderStatusUpdateModal()}
        {renderReportModal()}
        {renderPayModal()}
        {renderCloseModal()}
        {renderMessageModal()}
        {renderAcceptProposalModal()}
        {renderTimeLogModal()}
        {renderMoreActionsModal()}
        {renderReassignModal()}
        {/* Floating Action Button (Mobile) */}
        <div className="md:hidden fixed bottom-6 right-6">
          <button className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700">
            <PlusCircle size={24} />
          </button>
        </div>
      </div>
    </div>;
}
// Helper component for the Circle icon
const Circle = ({
  size,
  className
}: {
  size: number;
  className: string;
}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
  </svg>;
// Helper component for the Play icon
const Play = ({
  size,
  className
}: {
  size: number;
  className: string;
}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>;