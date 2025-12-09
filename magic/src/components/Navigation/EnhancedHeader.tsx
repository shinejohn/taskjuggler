import React, { useEffect, useState, useRef } from 'react';
import { Menu, X, Bell, User, Users, LogOut, Settings, HelpCircle, ChevronDown, Search, MessageSquare, Home, ListChecks, PlusCircle, Calendar, Briefcase, Star, DollarSign } from 'lucide-react';
interface EnhancedHeaderProps {
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onMyTasksClick?: () => void;
  onTaskMarketClick?: () => void;
  onDoerMarketClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onLogoClick?: () => void;
  isAuthenticated?: boolean;
}
export function EnhancedHeader({
  onCreateTaskClick,
  onTaskReportClick,
  onMyTasksClick,
  onTaskMarketClick,
  onDoerMarketClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLoginClick,
  onLogoutClick,
  onLogoClick,
  isAuthenticated = true
}: EnhancedHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  // Sample notifications
  const notifications = [{
    id: 1,
    type: 'task',
    message: 'New task assigned: Website Redesign',
    time: '10 minutes ago',
    isRead: false
  }, {
    id: 2,
    type: 'message',
    message: 'Sarah Miller sent you a message',
    time: '1 hour ago',
    isRead: false
  }, {
    id: 3,
    type: 'system',
    message: 'Your task "Content Writing" is due tomorrow',
    time: '3 hours ago',
    isRead: true
  }, {
    id: 4,
    type: 'payment',
    message: 'Payment received for "Logo Design" task',
    time: '1 day ago',
    isRead: true
  }];
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };
  const handleMyTasksClick = () => {
    if (onMyTasksClick) {
      onMyTasksClick();
      setIsMenuOpen(false);
    } else {
      console.warn('My Tasks navigation handler not provided');
    }
  };
  const handleTaskMarketClick = () => {
    if (onTaskMarketClick) {
      onTaskMarketClick();
      setIsMenuOpen(false);
    } else {
      console.warn('Task Market navigation handler not provided');
    }
  };
  const handleDoerMarketClick = () => {
    if (onDoerMarketClick) {
      onDoerMarketClick();
      setIsMenuOpen(false);
    } else {
      console.warn('Doer Market navigation handler not provided');
    }
  };
  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
      setIsMenuOpen(false);
    } else {
      console.warn('Home/Dashboard navigation handler not provided');
    }
  };
  return <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={onLogoClick}>
              Task Juggler
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {isAuthenticated ? <>
                <button onClick={handleHomeClick} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  <Home size={18} className="mr-1" />
                  Dashboard
                </button>
                <button onClick={onCreateTaskClick} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  <PlusCircle size={18} className="mr-1" />
                  Create Task
                </button>
                <button onClick={onMyTasksClick} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  <ListChecks size={18} className="mr-1" />
                  My Tasks
                </button>
                <button onClick={onTaskMarketClick} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  <Briefcase size={18} className="mr-1" />
                  Task Market
                </button>
                <button onClick={onDoerMarketClick} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  <Users size={18} className="mr-1" />
                  Doer Market
                </button>
              </> : <>
                <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium">
                  How It Works
                </a>
                <a href="#use-cases" className="text-gray-700 hover:text-blue-600 font-medium">
                  Use Cases
                </a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium">
                  Testimonials
                </a>
                <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium">
                  Pricing
                </a>
              </>}
          </nav>

          {/* Search, Notifications, and Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? <>
                {/* Search */}
                <form onSubmit={handleSearch} className="relative">
                  <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 w-48 lg:w-64 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Search size={16} className="text-gray-400" />
                  </div>
                </form>

                {/* Chat */}
                <button className="flex items-center text-gray-700 hover:text-blue-600" onClick={onChatClick}>
                  <MessageSquare size={20} />
                </button>

                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <button className="flex items-center text-gray-700 hover:text-blue-600" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
                    <div className="relative">
                      <Bell size={20} />
                      {unreadNotificationsCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadNotificationsCount}
                        </span>}
                    </div>
                  </button>
                  {isNotificationsOpen && <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium text-gray-900">
                            Notifications
                          </h3>
                          <button className="text-xs text-blue-600 hover:text-blue-800">
                            Mark all as read
                          </button>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map(notification => <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${notification.isRead ? '' : 'bg-blue-50'}`}>
                            <div className="flex items-start">
                              <div className={`rounded-full p-2 mr-3 ${notification.type === 'task' ? 'bg-green-100 text-green-600' : notification.type === 'message' ? 'bg-blue-100 text-blue-600' : notification.type === 'payment' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>
                                {notification.type === 'task' && <ListChecks size={16} />}
                                {notification.type === 'message' && <MessageSquare size={16} />}
                                {notification.type === 'payment' && <DollarSign size={16} />}
                                {notification.type === 'system' && <Bell size={16} />}
                              </div>
                              <div>
                                <p className="text-sm text-gray-800">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>)}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200 text-center">
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          View all notifications
                        </button>
                      </div>
                    </div>}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                  <button className="flex items-center text-gray-700 hover:text-blue-600" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                    <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-gray-200">
                      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="h-full w-full object-cover" />
                    </div>
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  {isProfileOpen && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          Alex Johnson
                        </p>
                        <p className="text-xs text-gray-500">
                          alex@example.com
                        </p>
                      </div>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={e => {
                  e.preventDefault();
                  setIsProfileOpen(false);
                  if (onProfileClick) onProfileClick();
                }}>
                        <User size={16} className="inline mr-2" />
                        Your Profile
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings size={16} className="inline mr-2" />
                        Settings
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <HelpCircle size={16} className="inline mr-2" />
                        Help & Support
                      </a>
                      <div className="border-t border-gray-200 mt-1"></div>
                      <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100" onClick={e => {
                  e.preventDefault();
                  setIsProfileOpen(false);
                  if (onLogoutClick) onLogoutClick();
                }}>
                        <LogOut size={16} className="inline mr-2" />
                        Sign out
                      </a>
                    </div>}
                </div>
              </> : <>
                <button onClick={onLoginClick} className="text-gray-700 hover:text-blue-600 font-medium">
                  Login
                </button>
                <button onClick={onCreateTaskClick} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                  Get Started
                </button>
              </>}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:space-x-4 lg:hidden">
            {isAuthenticated && <>
                <button className="text-gray-700 hover:text-blue-600" onClick={onChatClick}>
                  <MessageSquare size={20} />
                </button>
                <button className="text-gray-700 hover:text-blue-600" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
                  <div className="relative">
                    <Bell size={20} />
                    {unreadNotificationsCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadNotificationsCount}
                      </span>}
                  </div>
                </button>
                <button className="text-gray-700 hover:text-blue-600" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                  <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-gray-200">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="h-full w-full object-cover" />
                  </div>
                </button>
              </>}
            <button className="text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && <div className="lg:hidden bg-white py-4 px-4 shadow-md">
          <div className="mb-4">
            <form onSubmit={handleSearch} className="relative">
              <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search size={16} className="text-gray-400" />
              </div>
            </form>
          </div>
          <nav className="flex flex-col space-y-4">
            {isAuthenticated ? <>
                <button onClick={() => {
            setIsMenuOpen(false);
            if (onHomeClick) onHomeClick();
          }} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  <Home size={18} className="mr-2" />
                  Dashboard
                </button>
                <button onClick={() => {
            setIsMenuOpen(false);
            if (onCreateTaskClick) onCreateTaskClick();
          }} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  <PlusCircle size={18} className="mr-2" />
                  Create Task
                </button>
                <button onClick={() => {
            setIsMenuOpen(false);
            if (onMyTasksClick) onMyTasksClick();
          }} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  <ListChecks size={18} className="mr-2" />
                  My Tasks
                </button>
                <button onClick={() => {
            setIsMenuOpen(false);
            if (onTaskMarketClick) onTaskMarketClick();
          }} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  <Briefcase size={18} className="mr-2" />
                  Task Market
                </button>
                <button onClick={() => {
            setIsMenuOpen(false);
            if (onDoerMarketClick) onDoerMarketClick();
          }} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  <Users size={18} className="mr-2" />
                  Doer Market
                </button>
                <div className="border-t border-gray-200 pt-4 mt-2">
                  <button onClick={() => {
              setIsMenuOpen(false);
              if (onProfileClick) onProfileClick();
            }} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                    <User size={18} className="mr-2" />
                    Your Profile
                  </button>
                  <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium mt-4">
                    <Settings size={18} className="mr-2" />
                    Settings
                  </button>
                  <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium mt-4">
                    <HelpCircle size={18} className="mr-2" />
                    Help & Support
                  </button>
                  <button onClick={() => {
              setIsMenuOpen(false);
              if (onLogoutClick) onLogoutClick();
            }} className="flex items-center text-red-600 hover:text-red-800 font-medium mt-4">
                    <LogOut size={18} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              </> : <>
                <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                  How It Works
                </a>
                <a href="#use-cases" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                  Use Cases
                </a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                  Testimonials
                </a>
                <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                  Pricing
                </a>
                <div className="border-t border-gray-200 pt-4 mt-2">
                  <button onClick={() => {
              setIsMenuOpen(false);
              if (onLoginClick) onLoginClick();
            }} className="text-gray-700 hover:text-blue-600 font-medium text-left">
                    Login
                  </button>
                  <button onClick={() => {
              setIsMenuOpen(false);
              if (onCreateTaskClick) onCreateTaskClick();
            }} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md w-full mt-4">
                    Get Started
                  </button>
                </div>
              </>}
          </nav>
        </div>}

      {/* Mobile Profile and Notifications Dropdown */}
      {isNotificationsOpen && <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start pt-16">
          <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Notifications
              </h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsNotificationsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {notifications.map(notification => <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${notification.isRead ? '' : 'bg-blue-50'}`}>
                  <div className="flex items-start">
                    <div className={`rounded-full p-2 mr-3 ${notification.type === 'task' ? 'bg-green-100 text-green-600' : notification.type === 'message' ? 'bg-blue-100 text-blue-600' : notification.type === 'payment' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>
                      {notification.type === 'task' && <ListChecks size={16} />}
                      {notification.type === 'message' && <MessageSquare size={16} />}
                      {notification.type === 'payment' && <DollarSign size={16} />}
                      {notification.type === 'system' && <Bell size={16} />}
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>)}
            </div>
            <div className="px-4 py-3 border-t border-gray-200 flex justify-between">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Mark all as read
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-800" onClick={() => setIsNotificationsOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>}

      {isProfileOpen && <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start pt-16">
          <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Alex Johnson
                  </h3>
                  <p className="text-sm text-gray-500">alex@example.com</p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsProfileOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <button className="w-full flex items-center text-gray-700 hover:text-blue-600 py-2" onClick={() => {
            setIsProfileOpen(false);
            if (onProfileClick) onProfileClick();
          }}>
                <User size={20} className="mr-3" />
                Your Profile
              </button>
              <button className="w-full flex items-center text-gray-700 hover:text-blue-600 py-2">
                <Settings size={20} className="mr-3" />
                Account Settings
              </button>
              <button className="w-full flex items-center text-gray-700 hover:text-blue-600 py-2">
                <HelpCircle size={20} className="mr-3" />
                Help & Support
              </button>
              <div className="border-t border-gray-200 pt-4 mt-2">
                <button className="w-full flex items-center text-red-600 hover:text-red-800 py-2" onClick={() => {
              setIsProfileOpen(false);
              if (onLogoutClick) onLogoutClick();
            }}>
                  <LogOut size={20} className="mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>}
    </header>;
}