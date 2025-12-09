import React, { useEffect, useState } from 'react';
import { UserIcon, UsersIcon, PlusIcon, SearchIcon, FilterIcon, ArrowRightIcon, CheckCircleIcon, ClockIcon, XCircleIcon, CalendarIcon } from 'lucide-react';
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate: string;
  clientName?: string;
  doerName?: string;
  isVendorTask?: boolean;
}
interface MyTasksViewerPageProps {
  onCreateTaskClick?: () => void;
  onTaskClick?: (taskId: string) => void;
  isVendor?: boolean; // Flag to indicate if the user is a vendor
}
export function MyTasksViewerPage({
  onCreateTaskClick,
  onTaskClick,
  isVendor = false // Default to false - user is not a vendor unless specified
}: MyTasksViewerPageProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'doers' | 'clients'>('doers');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  useEffect(() => {
    // In a real app, this would be an API call to fetch tasks
    const fetchTasks = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock data
        const mockTasks: Task[] = [{
          id: '1',
          title: 'Website Redesign',
          description: 'Redesign the company website with modern UI/UX principles',
          status: 'in_progress',
          dueDate: '2023-12-15',
          doerName: 'Alex Johnson',
          isVendorTask: false
        }, {
          id: '2',
          title: 'Content Creation for Blog',
          description: 'Create 5 blog posts about industry trends',
          status: 'pending',
          dueDate: '2023-12-20',
          doerName: 'Sarah Miller',
          isVendorTask: false
        }, {
          id: '3',
          title: 'Social Media Strategy',
          description: 'Develop a comprehensive social media strategy for Q1',
          status: 'completed',
          dueDate: '2023-11-30',
          doerName: 'Michael Wong',
          isVendorTask: false
        }, {
          id: '4',
          title: 'Logo Design for Client',
          description: 'Design a new logo for ABC Corp',
          status: 'in_progress',
          dueDate: '2023-12-10',
          clientName: 'David Chen',
          isVendorTask: true
        }, {
          id: '5',
          title: 'Marketing Materials',
          description: 'Create brochures and flyers for upcoming event',
          status: 'pending',
          dueDate: '2023-12-25',
          clientName: 'Emily Rodriguez',
          isVendorTask: true
        }, {
          id: '6',
          title: 'Website Maintenance',
          description: 'Monthly website updates and security patches',
          status: 'completed',
          dueDate: '2023-11-28',
          clientName: 'Robert Kim',
          isVendorTask: true
        }];
        setTasks(mockTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);
  const filteredTasks = tasks.filter(task => {
    // Filter by search query
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase());
    // Filter by status
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    // Filter by view type (doers or clients)
    const matchesViewType = activeView === 'doers' && !task.isVendorTask || activeView === 'clients' && task.isVendorTask;
    return matchesSearch && matchesStatus && matchesViewType;
  });
  const handleTaskClick = (taskId: string) => {
    if (onTaskClick) {
      onTaskClick(taskId);
    }
  };
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon size={16} className="text-yellow-500" />;
      case 'in_progress':
        return <ArrowRightIcon size={16} className="text-blue-500" />;
      case 'completed':
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case 'cancelled':
        return <XCircleIcon size={16} className="text-red-500" />;
      default:
        return null;
    }
  };
  return <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        {onCreateTaskClick && <button onClick={onCreateTaskClick} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
            <PlusIcon size={16} className="mr-2" />
            Create New Task
          </button>}
      </div>

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">View Tasks By</h2>
        </div>
        <div className="p-4 flex space-x-4">
          <button onClick={() => setActiveView('doers')} className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center ${activeView === 'doers' ? 'bg-blue-50 border border-blue-200 text-blue-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
            <UsersIcon size={20} className="mr-2" />
            <div className="text-left">
              <div className="font-medium">Do-ers</div>
              <div className="text-sm text-gray-500">
                Tasks where others work for you
              </div>
            </div>
          </button>
          {/* Only show the Clients button if the user is a vendor */}
          {isVendor && <button onClick={() => setActiveView('clients')} className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center ${activeView === 'clients' ? 'bg-blue-50 border border-blue-200 text-blue-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
              <UserIcon size={20} className="mr-2" />
              <div className="text-left">
                <div className="font-medium">Clients</div>
                <div className="text-sm text-gray-500">
                  Tasks where you're the doer
                </div>
              </div>
            </button>}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input type="text" placeholder="Search tasks..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative inline-block text-left">
              <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={statusFilter || ''} onChange={e => setStatusFilter(e.target.value || null)}>
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            {(searchQuery || statusFilter) && <button onClick={() => {
            setSearchQuery('');
            setStatusFilter(null);
          }} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                Clear Filters
              </button>}
          </div>
        </div>

        {loading ? <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div> : filteredTasks.length === 0 ? <div className="p-8 text-center">
            <p className="text-gray-500">
              {searchQuery || statusFilter ? 'No tasks match your filters.' : activeView === 'clients' && isVendor ? "You don't have any client tasks yet." : "You don't have any tasks yet."}
            </p>
            {onCreateTaskClick && <button onClick={onCreateTaskClick} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                <PlusIcon size={16} className="mr-2" />
                Create New Task
              </button>}
          </div> : <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeView === 'doers' ? 'Assigned To' : 'Client'}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map(task => <tr key={task.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleTaskClick(task.id)}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {task.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {task.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {activeView === 'doers' ? task.doerName || 'Unassigned' : task.clientName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(task.status)}`}>
                        {getStatusIcon(task.status)}
                        <span className="ml-1 capitalize">
                          {task.status.replace('_', ' ')}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon size={16} className="mr-1 text-gray-400" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        View
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>}
      </div>
    </div>;
}