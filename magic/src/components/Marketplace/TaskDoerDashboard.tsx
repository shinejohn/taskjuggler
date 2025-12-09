import React, { useState } from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, Briefcase, FileText, Clock, DollarSign, Star, CheckCircle, AlertTriangle, Users, PlusCircle, MessageSquare, ChevronRight, Filter, Search, Bell, Settings, MoreHorizontal, ChevronDown, User, ArrowUpRight, X, Check, Edit, Calendar, ExternalLink } from 'lucide-react';
type TaskStatus = 'pending-start' | 'in-progress' | 'in-review' | 'completed' | 'cancelled';
type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';
interface Task {
  id: string;
  title: string;
  category: string;
  clientName: string;
  clientImage: string;
  status: TaskStatus;
  deadline: string;
  price: number;
  isHourly: boolean;
  estimatedHours?: number;
  progress: number;
  description: string;
}
interface Proposal {
  id: string;
  taskId: string;
  taskTitle: string;
  taskCategory: string;
  clientName: string;
  clientImage: string;
  status: ProposalStatus;
  amount: number;
  isHourly: boolean;
  estimatedHours?: number;
  submittedDate: string;
  expiresDate?: string;
}
interface ScheduledTask {
  id: string;
  title: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: TaskStatus;
}
export function TaskDoerDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'proposals' | 'calendar'>('overview');
  const [taskFilter, setTaskFilter] = useState<TaskStatus | 'all'>('all');
  const [proposalFilter, setProposalFilter] = useState<ProposalStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  // Mock data for tasks
  const tasks: Task[] = [{
    id: 't1',
    title: 'Website Redesign for Small Business',
    category: 'Web Development',
    clientName: 'Emily Watson',
    clientImage: 'https://randomuser.me/api/portraits/women/45.jpg',
    status: 'in-progress',
    deadline: '2023-12-15',
    price: 1500,
    isHourly: false,
    progress: 65,
    description: 'Redesign the company website to be mobile responsive with modern design elements. Includes homepage, about page, services, and contact forms.'
  }, {
    id: 't2',
    title: 'E-commerce Product Photography',
    category: 'Photography',
    clientName: 'Michael Torres',
    clientImage: 'https://randomuser.me/api/portraits/men/42.jpg',
    status: 'pending-start',
    deadline: '2023-11-30',
    price: 45,
    isHourly: true,
    estimatedHours: 8,
    progress: 0,
    description: 'Professional product photography for 20 items for an online store. White background, multiple angles per product.'
  }, {
    id: 't3',
    title: 'Social Media Content Creation',
    category: 'Marketing',
    clientName: 'Sarah Chen',
    clientImage: 'https://randomuser.me/api/portraits/women/33.jpg',
    status: 'in-review',
    deadline: '2023-11-25',
    price: 350,
    isHourly: false,
    progress: 100,
    description: 'Create 10 social media posts including graphics and captions for Instagram and Facebook.'
  }, {
    id: 't4',
    title: 'Logo Design for Tech Startup',
    category: 'Graphic Design',
    clientName: 'David Kim',
    clientImage: 'https://randomuser.me/api/portraits/men/45.jpg',
    status: 'completed',
    deadline: '2023-11-10',
    price: 500,
    isHourly: false,
    progress: 100,
    description: 'Design a modern, minimalist logo for a new tech startup in the AI space. Includes multiple formats and color variations.'
  }];
  // Mock data for proposals
  const proposals: Proposal[] = [{
    id: 'p1',
    taskId: 'pt1',
    taskTitle: 'Mobile App UI Design',
    taskCategory: 'UI/UX Design',
    clientName: 'Lisa Martinez',
    clientImage: 'https://randomuser.me/api/portraits/women/22.jpg',
    status: 'pending',
    amount: 1200,
    isHourly: false,
    submittedDate: '2023-11-15',
    expiresDate: '2023-11-22'
  }, {
    id: 'p2',
    taskId: 'pt2',
    taskTitle: 'WordPress Website Development',
    taskCategory: 'Web Development',
    clientName: 'Robert Johnson',
    clientImage: 'https://randomuser.me/api/portraits/men/52.jpg',
    status: 'accepted',
    amount: 60,
    isHourly: true,
    estimatedHours: 20,
    submittedDate: '2023-11-10'
  }, {
    id: 'p3',
    taskId: 'pt3',
    taskTitle: 'Product Landing Page',
    taskCategory: 'Web Development',
    clientName: 'Jennifer Wilson',
    clientImage: 'https://randomuser.me/api/portraits/women/17.jpg',
    status: 'rejected',
    amount: 400,
    isHourly: false,
    submittedDate: '2023-11-05'
  }, {
    id: 'p4',
    taskId: 'pt4',
    taskTitle: 'Database Optimization',
    taskCategory: 'Technology',
    clientName: 'Alex Johnson',
    clientImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'withdrawn',
    amount: 75,
    isHourly: true,
    estimatedHours: 8,
    submittedDate: '2023-10-28'
  }];
  // Mock data for scheduled tasks
  const scheduledTasks: ScheduledTask[] = [{
    id: 'st1',
    title: 'Website Redesign - Client Meeting',
    clientName: 'Emily Watson',
    date: '2023-11-20',
    startTime: '10:00',
    endTime: '11:00',
    status: 'in-progress'
  }, {
    id: 'st2',
    title: 'E-commerce Photography Session',
    clientName: 'Michael Torres',
    date: '2023-11-21',
    startTime: '13:00',
    endTime: '17:00',
    status: 'pending-start'
  }, {
    id: 'st3',
    title: 'Social Media Content Review',
    clientName: 'Sarah Chen',
    date: '2023-11-22',
    startTime: '14:30',
    endTime: '15:30',
    status: 'in-review'
  }, {
    id: 'st4',
    title: 'Mobile App UI Design - Work Session',
    clientName: 'Lisa Martinez',
    date: '2023-11-23',
    startTime: '09:00',
    endTime: '12:00',
    status: 'pending-start'
  }, {
    id: 'st5',
    title: 'WordPress Development - Client Demo',
    clientName: 'Robert Johnson',
    date: '2023-11-24',
    startTime: '15:00',
    endTime: '16:00',
    status: 'pending-start'
  }];
  // Filter tasks based on status and search query
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = taskFilter === 'all' || task.status === taskFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.category.toLowerCase().includes(searchQuery.toLowerCase()) || task.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  // Filter proposals based on status and search query
  const filteredProposals = proposals.filter(proposal => {
    const matchesStatus = proposalFilter === 'all' || proposal.status === proposalFilter;
    const matchesSearch = proposal.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) || proposal.taskCategory.toLowerCase().includes(searchQuery.toLowerCase()) || proposal.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  const getStatusColor = (status: TaskStatus | ProposalStatus) => {
    switch (status) {
      case 'pending-start':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-review':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusLabel = (status: TaskStatus | ProposalStatus) => {
    switch (status) {
      case 'pending-start':
        return 'Pending Start';
      case 'in-progress':
        return 'In Progress';
      case 'in-review':
        return 'In Review';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'withdrawn':
        return 'Withdrawn';
      default:
        return status;
    }
  };
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const getDaysUntilDeadline = (deadlineString: string) => {
    const deadline = new Date(deadlineString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
    }
  };
  const messageClient = (clientName: string) => {
    // In a real app, this would open a chat with the client
    console.log(`Message client: ${clientName}`);
  };
  const withdrawProposal = (proposalId: string) => {
    // In a real app, this would call an API to withdraw the proposal
    console.log(`Withdraw proposal: ${proposalId}`);
  };
  const viewTaskDetails = (taskId: string) => {
    setSelectedTask(taskId);
  };
  const viewProposalDetails = (proposalId: string) => {
    setSelectedProposal(proposalId);
  };
  const closeTaskDetails = () => {
    setSelectedTask(null);
  };
  const closeProposalDetails = () => {
    setSelectedProposal(null);
  };
  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };
  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };
  const today = () => {
    setCurrentDate(new Date());
  };
  // Generate days for the week view
  const weekDays = [...Array(7)].map((_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - date.getDay() + i);
    return date;
  });
  // Get tasks for the current week
  const weekTasks = scheduledTasks.filter(task => {
    const taskDate = new Date(task.date);
    return weekDays.some(day => day.getDate() === taskDate.getDate() && day.getMonth() === taskDate.getMonth() && day.getFullYear() === taskDate.getFullYear());
  });
  // Calculate earnings
  const totalEarnings = tasks.filter(task => task.status === 'completed').reduce((sum, task) => {
    if (task.isHourly && task.estimatedHours) {
      return sum + task.price * task.estimatedHours;
    }
    return sum + task.price;
  }, 0);
  // Calculate average rating (mock data)
  const averageRating = 4.8;
  return <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Task Doer Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
              <Bell size={24} />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                3
              </span>
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Settings size={24} />
            </button>
            <div className="flex items-center">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="h-10 w-10 rounded-full object-cover" />
              <div className="ml-3 hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  Alex Johnson
                </p>
                <p className="text-xs text-gray-500">Web Developer</p>
              </div>
            </div>
          </div>
        </div>
        {/* Dashboard Overview Stats */}
        {activeTab === 'overview' && <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active Tasks
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {tasks.filter(t => t.status === 'in-progress' || t.status === 'pending-start').length}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase size={24} className="text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="h-2.5 rounded-full bg-blue-600" style={{
                width: '75%'
              }}></div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  75% of tasks in progress
                </p>
              </div>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Pending Proposals
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {proposals.filter(p => p.status === 'pending').length}
                  </p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FileText size={24} className="text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium flex items-center">
                  <ArrowUpRight size={16} className="mr-1" />
                  {proposals.filter(p => p.status === 'accepted').length}{' '}
                  accepted
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-red-600 font-medium">
                  {proposals.filter(p => p.status === 'rejected').length}{' '}
                  rejected
                </span>
              </div>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    This Week's Earnings
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    ${totalEarnings}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign size={24} className="text-green-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                From{' '}
                {tasks.filter(task => task.status === 'completed').length}{' '}
                completed tasks
              </div>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Client Satisfaction
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {averageRating}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star size={24} className="text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'} fill={i < Math.floor(averageRating) ? 'currentColor' : 'none'} />)}
                <span className="ml-2 text-sm text-gray-600">
                  Based on{' '}
                  {tasks.filter(task => task.status === 'completed').length}{' '}
                  reviews
                </span>
              </div>
            </div>
          </div>}
        {/* Quick Actions */}
        {activeTab === 'overview' && <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <Search size={20} className="text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">
                    Find New Tasks
                  </span>
                </div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <PlusCircle size={20} className="text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900">
                    Create Proposal
                  </span>
                </div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <MessageSquare size={20} className="text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-900">
                    Message Clients
                  </span>
                </div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <CalendarIcon size={20} className="text-yellow-600" />
                  </div>
                  <span className="font-medium text-gray-900">
                    Update Availability
                  </span>
                </div>
              </button>
            </div>
          </div>}
        {/* Task List Preview (Overview Tab) */}
        {activeTab === 'overview' && <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                My Active Tasks
              </h2>
              <button onClick={() => setActiveTab('tasks')} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                View All
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.filter(task => task.status === 'in-progress' || task.status === 'pending-start').slice(0, 3).map(task => <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {task.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {task.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img src={task.clientImage} alt={task.clientName} className="h-8 w-8 rounded-full object-cover" />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {task.clientName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(task.status)}`}>
                            {getStatusLabel(task.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(task.deadline)}
                          {getDaysUntilDeadline(task.deadline) <= 3 && <span className="ml-2 text-red-600 font-medium">
                              ({getDaysUntilDeadline(task.deadline)} days left)
                            </span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="h-2.5 rounded-full bg-blue-600" style={{
                      width: `${task.progress}%`
                    }}></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {task.progress}% complete
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => viewTaskDetails(task.id)} className="text-blue-600 hover:text-blue-800 mr-3">
                            View
                          </button>
                          <button onClick={() => messageClient(task.clientName)} className="text-green-600 hover:text-green-800">
                            Message
                          </button>
                        </td>
                      </tr>)}
                </tbody>
              </table>
            </div>
          </div>}
        {/* Tab Navigation */}
        <div className="bg-white shadow-sm rounded-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button className={`px-6 py-4 text-sm font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('overview')}>
                <div className="flex items-center">
                  <LayoutDashboard size={18} className="mr-2" />
                  Overview
                </div>
              </button>
              <button className={`px-6 py-4 text-sm font-medium ${activeTab === 'tasks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('tasks')}>
                <div className="flex items-center">
                  <Briefcase size={18} className="mr-2" />
                  My Tasks
                </div>
              </button>
              <button className={`px-6 py-4 text-sm font-medium ${activeTab === 'proposals' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('proposals')}>
                <div className="flex items-center">
                  <FileText size={18} className="mr-2" />
                  Proposals
                </div>
              </button>
              <button className={`px-6 py-4 text-sm font-medium ${activeTab === 'calendar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('calendar')}>
                <div className="flex items-center">
                  <CalendarIcon size={18} className="mr-2" />
                  Calendar
                </div>
              </button>
            </nav>
          </div>
        </div>
        {/* Tasks Tab Content */}
        {activeTab === 'tasks' && !selectedTask && <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <h2 className="text-lg font-medium text-gray-900 mb-4 md:mb-0">
                  My Tasks
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                    <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                  <div className="relative">
                    <select className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={taskFilter} onChange={e => setTaskFilter(e.target.value as TaskStatus | 'all')}>
                      <option value="all">All Statuses</option>
                      <option value="pending-start">Pending Start</option>
                      <option value="in-progress">In Progress</option>
                      <option value="in-review">In Review</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Filter size={18} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {filteredTasks.length > 0 ? <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Task
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deadline
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTasks.map(task => <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {task.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {task.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img src={task.clientImage} alt={task.clientName} className="h-8 w-8 rounded-full object-cover" />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {task.clientName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(task.status)}`}>
                            {getStatusLabel(task.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(task.deadline)}
                          {getDaysUntilDeadline(task.deadline) <= 3 && task.status !== 'completed' && <span className="ml-2 text-red-600 font-medium">
                                ({getDaysUntilDeadline(task.deadline)} days
                                left)
                              </span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${task.price}
                          {task.isHourly ? '/hr' : ''}
                          {task.isHourly && task.estimatedHours && <div className="text-xs text-gray-500">
                              Est. ${task.price * task.estimatedHours} total
                            </div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className={`h-2.5 rounded-full ${task.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'}`} style={{
                      width: `${task.progress}%`
                    }}></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {task.progress}% complete
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => viewTaskDetails(task.id)} className="text-blue-600 hover:text-blue-800 mr-3">
                            View
                          </button>
                          <button onClick={() => messageClient(task.clientName)} className="text-green-600 hover:text-green-800">
                            Message
                          </button>
                        </td>
                      </tr>)}
                  </tbody>
                </table> : <div className="py-12 text-center">
                  <p className="text-gray-500 text-lg">
                    No tasks match your criteria
                  </p>
                  {taskFilter !== 'all' || searchQuery !== '' ? <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium" onClick={() => {
              setTaskFilter('all');
              setSearchQuery('');
            }}>
                      Clear all filters
                    </button> : <p className="mt-2 text-gray-500">
                      Start by finding tasks in the marketplace
                    </p>}
                </div>}
            </div>
          </div>}
        {/* Task Details */}
        {activeTab === 'tasks' && selectedTask && <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <button onClick={closeTaskDetails} className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  <ChevronLeft size={16} className="mr-1" /> Back to Tasks
                </button>
                <div className="flex space-x-2">
                  <button onClick={() => messageClient(tasks.find(t => t.id === selectedTask)?.clientName || '')} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
                    <MessageSquare size={18} className="mr-2" />
                    Message Client
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                    <Edit size={18} className="mr-2" />
                    Update Progress
                  </button>
                </div>
              </div>
            </div>
            {tasks.filter(task => task.id === selectedTask).map(task => <div key={task.id} className="p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {task.title}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {task.category}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusLabel(task.status)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-3">
                            Task Description
                          </h3>
                          <p className="text-gray-700">{task.description}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-3">
                            Progress
                          </h3>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                            <div className={`h-2.5 rounded-full ${task.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'}`} style={{
                      width: `${task.progress}%`
                    }}></div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{task.progress}% complete</span>
                            <span>Target: 100%</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-3">
                            Milestones
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center p-3 border border-gray-200 rounded-md">
                              <div className="p-1 bg-green-100 rounded-full mr-3">
                                <Check size={16} className="text-green-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  Initial consultation
                                </p>
                                <p className="text-sm text-gray-500">
                                  Completed on Nov 10, 2023
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center p-3 border border-gray-200 rounded-md">
                              <div className="p-1 bg-green-100 rounded-full mr-3">
                                <Check size={16} className="text-green-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  Initial design concepts
                                </p>
                                <p className="text-sm text-gray-500">
                                  Completed on Nov 15, 2023
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center p-3 border border-gray-200 rounded-md bg-blue-50">
                              <div className="p-1 bg-blue-100 rounded-full mr-3">
                                <Clock size={16} className="text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  Development phase
                                </p>
                                <p className="text-sm text-gray-500">
                                  In progress (65% complete)
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center p-3 border border-gray-200 rounded-md">
                              <div className="p-1 bg-gray-100 rounded-full mr-3">
                                <Clock size={16} className="text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  Testing & revisions
                                </p>
                                <p className="text-sm text-gray-500">
                                  Not started
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center p-3 border border-gray-200 rounded-md">
                              <div className="p-1 bg-gray-100 rounded-full mr-3">
                                <Clock size={16} className="text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  Final delivery
                                </p>
                                <p className="text-sm text-gray-500">
                                  Not started
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-3">
                            Communication History
                          </h3>
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                              <div className="flex items-center">
                                <img src={task.clientImage} alt={task.clientName} className="h-8 w-8 rounded-full object-cover" />
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">
                                    {task.clientName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Yesterday at 3:45 PM
                                  </p>
                                </div>
                              </div>
                              <p className="mt-2 text-sm text-gray-700">
                                How is the development coming along? Looking
                                forward to seeing the progress.
                              </p>
                            </div>
                            <div className="p-4 border-b border-gray-200 bg-blue-50">
                              <div className="flex items-center">
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="You" className="h-8 w-8 rounded-full object-cover" />
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">
                                    You
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Yesterday at 4:12 PM
                                  </p>
                                </div>
                              </div>
                              <p className="mt-2 text-sm text-gray-700">
                                It's going well! I've completed the main pages
                                and am now working on the responsive design.
                                I'll share screenshots tomorrow.
                              </p>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center">
                                <img src={task.clientImage} alt={task.clientName} className="h-8 w-8 rounded-full object-cover" />
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">
                                    {task.clientName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Yesterday at 4:30 PM
                                  </p>
                                </div>
                              </div>
                              <p className="mt-2 text-sm text-gray-700">
                                Sounds great! Looking forward to seeing them.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Task Details
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Client</p>
                            <div className="flex items-center mt-1">
                              <img src={task.clientImage} alt={task.clientName} className="h-8 w-8 rounded-full object-cover" />
                              <p className="ml-2 text-sm font-medium text-gray-900">
                                {task.clientName}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Deadline</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(task.deadline)}
                            </p>
                            {getDaysUntilDeadline(task.deadline) <= 3 && task.status !== 'completed' && <p className="text-xs text-red-600 font-medium mt-1">
                                  {getDaysUntilDeadline(task.deadline)} days
                                  remaining
                                </p>}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="text-sm font-medium text-gray-900">
                              ${task.price}
                              {task.isHourly ? '/hr' : ''}
                              {task.isHourly && task.estimatedHours && <span className="text-gray-500">
                                  {' '}
                                  · Est. ${task.price * task.estimatedHours}{' '}
                                  total
                                </span>}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Payment Status
                            </p>
                            <div className="flex items-center mt-1">
                              <div className="p-1 bg-yellow-100 rounded-full">
                                <Clock size={14} className="text-yellow-600" />
                              </div>
                              <p className="ml-2 text-sm font-medium text-gray-900">
                                50% paid (deposit)
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Next Payment
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              $
                              {task.isHourly && task.estimatedHours ? task.price * task.estimatedHours * 0.5 : task.price * 0.5}{' '}
                              upon completion
                            </p>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 mt-6 pt-6">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">
                            Upcoming Deadlines
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <div className="p-1.5 bg-blue-100 rounded-lg mr-3">
                                <CalendarIcon size={16} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Design Review
                                </p>
                                <p className="text-xs text-gray-500">
                                  Nov 25, 2023
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="p-1.5 bg-blue-100 rounded-lg mr-3">
                                <CalendarIcon size={16} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Final Delivery
                                </p>
                                <p className="text-xs text-gray-500">
                                  Dec 15, 2023
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 mt-6 pt-6">
                          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
                            <Edit size={18} className="mr-2" />
                            Update Task Progress
                          </button>
                          <button className="w-full mt-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center">
                            <MessageSquare size={18} className="mr-2" />
                            Message Client
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)}
          </div>}
        {/* Proposals Tab Content */}
        {activeTab === 'proposals' && !selectedProposal && <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <h2 className="text-lg font-medium text-gray-900 mb-4 md:mb-0">
                  My Proposals
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                    <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Search proposals..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                  <div className="relative">
                    <select className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={proposalFilter} onChange={e => setProposalFilter(e.target.value as ProposalStatus | 'all')}>
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="withdrawn">Withdrawn</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Filter size={18} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {filteredProposals.length > 0 ? <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Task
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProposals.map(proposal => <tr key={proposal.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {proposal.taskTitle}
                          </div>
                          <div className="text-sm text-gray-500">
                            {proposal.taskCategory}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img src={proposal.clientImage} alt={proposal.clientName} className="h-8 w-8 rounded-full object-cover" />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {proposal.clientName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(proposal.status)}`}>
                            {getStatusLabel(proposal.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${proposal.amount}
                          {proposal.isHourly ? '/hr' : ''}
                          {proposal.isHourly && proposal.estimatedHours && <div className="text-xs text-gray-500">
                              Est. ${proposal.amount * proposal.estimatedHours}{' '}
                              total
                            </div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(proposal.submittedDate)}
                          <div className="text-xs">
                            {getTimeAgo(proposal.submittedDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => viewProposalDetails(proposal.id)} className="text-blue-600 hover:text-blue-800 mr-3">
                            View
                          </button>
                          {proposal.status === 'pending' && <button onClick={() => withdrawProposal(proposal.id)} className="text-red-600 hover:text-red-800">
                              Withdraw
                            </button>}
                        </td>
                      </tr>)}
                  </tbody>
                </table> : <div className="py-12 text-center">
                  <p className="text-gray-500 text-lg">
                    No proposals match your criteria
                  </p>
                  {proposalFilter !== 'all' || searchQuery !== '' ? <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium" onClick={() => {
              setProposalFilter('all');
              setSearchQuery('');
            }}>
                      Clear all filters
                    </button> : <p className="mt-2 text-gray-500">
                      Start by submitting proposals to tasks in the marketplace
                    </p>}
                </div>}
            </div>
          </div>}
        {/* Calendar Tab Content */}
        {activeTab === 'calendar' && <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <h2 className="text-lg font-medium text-gray-900 mb-4 md:mb-0">
                  My Calendar
                </h2>
                <div className="flex items-center space-x-4">
                  <button onClick={previousWeek} className="p-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={today} className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm">
                    Today
                  </button>
                  <button onClick={nextWeek} className="p-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                    <ChevronRight size={18} />
                  </button>
                  <div className="text-sm font-medium text-gray-900">
                    {currentDate.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
                  </div>
                  <div className="flex border border-gray-300 rounded overflow-hidden">
                    <button className={`px-3 py-1 text-sm ${calendarView === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`} onClick={() => setCalendarView('week')}>
                      Week
                    </button>
                    <button className={`px-3 py-1 text-sm ${calendarView === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`} onClick={() => setCalendarView('month')}>
                      Month
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {calendarView === 'week' && <div className="p-6">
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {weekDays.map((day, index) => <div key={index} className={`text-center py-2 ${day.toDateString() === new Date().toDateString() ? 'bg-blue-100 rounded-lg font-bold text-blue-800' : ''}`}>
                      <div className="text-sm font-medium text-gray-900">
                        {day.toLocaleDateString('en-US', {
                  weekday: 'short'
                })}
                      </div>
                      <div className="text-lg">{day.getDate()}</div>
                    </div>)}
                </div>
                <div className="grid grid-cols-7 gap-2 border-t border-gray-200 pt-2">
                  {weekDays.map((day, dayIndex) => {
              const dayTasks = weekTasks.filter(task => {
                const taskDate = new Date(task.date);
                return day.getDate() === taskDate.getDate() && day.getMonth() === taskDate.getMonth() && day.getFullYear() === taskDate.getFullYear();
              });
              return <div key={dayIndex} className="min-h-[400px] border-r border-gray-200 last:border-r-0">
                        {dayTasks.length > 0 ? <div className="space-y-2 p-1">
                            {dayTasks.map(task => {
                    const startHour = parseInt(task.startTime.split(':')[0]);
                    // Calculate position based on time
                    const topPosition = (startHour - 8) * 40 + 10; // Starting from 8am
                    const duration = parseInt(task.endTime.split(':')[0]) - startHour;
                    const height = duration * 40 - 10;
                    return <div key={task.id} style={{
                      top: `${topPosition}px`,
                      height: `${height}px`
                    }} className={`p-2 rounded-md text-xs ${task.status === 'in-progress' ? 'bg-yellow-100 border-l-4 border-yellow-500' : task.status === 'in-review' ? 'bg-purple-100 border-l-4 border-purple-500' : 'bg-blue-100 border-l-4 border-blue-500'}`}>
                                  <div className="font-medium truncate">
                                    {task.title}
                                  </div>
                                  <div className="text-gray-600 truncate">
                                    {task.startTime} - {task.endTime}
                                  </div>
                                  <div className="text-gray-600 truncate">
                                    {task.clientName}
                                  </div>
                                </div>;
                  })}
                          </div> : <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                            No tasks
                          </div>}
                      </div>;
            })}
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
                    <ExternalLink size={18} className="mr-2" />
                    Sync with External Calendar
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                    <Calendar size={18} className="mr-2" />
                    Set Availability
                  </button>
                </div>
              </div>}
            {calendarView === 'month' && <div className="p-6">
                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="text-sm font-medium text-gray-700 py-2">
                        {day}
                      </div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {[...Array(35)].map((_, index) => {
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), index - currentDate.getDay() + 1);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isToday = date.toDateString() === new Date().toDateString();
              const dayTasks = scheduledTasks.filter(task => {
                const taskDate = new Date(task.date);
                return date.getDate() === taskDate.getDate() && date.getMonth() === taskDate.getMonth() && date.getFullYear() === taskDate.getFullYear();
              });
              return <div key={index} className={`min-h-[100px] border border-gray-200 p-1 ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'} ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}>
                        <div className={`text-right text-sm p-1 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isToday ? 'font-bold text-blue-600' : ''}`}>
                          {date.getDate()}
                        </div>
                        <div className="mt-1">
                          {dayTasks.slice(0, 2).map(task => <div key={task.id} className={`mb-1 p-1 rounded text-xs truncate ${task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : task.status === 'in-review' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                              {task.title}
                            </div>)}
                          {dayTasks.length > 2 && <div className="text-xs text-gray-500 text-center">
                              +{dayTasks.length - 2} more
                            </div>}
                        </div>
                      </div>;
            })}
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
                    <ExternalLink size={18} className="mr-2" />
                    Sync with External Calendar
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                    <Calendar size={18} className="mr-2" />
                    Set Availability
                  </button>
                </div>
              </div>}
          </div>}
      </div>
    </div>;
}