import React from 'react';
import { LayoutDashboard, PlusCircle, ListChecks, MessageSquare, User, LogOut } from 'lucide-react';
interface AppSidebarProps {
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
}
export function AppSidebar({
  onCreateTaskClick,
  onTaskReportClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLogoutClick
}: AppSidebarProps) {
  return <aside className="w-20 md:w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="text-xl font-bold text-blue-600 cursor-pointer flex items-center" onClick={onHomeClick}>
          <span className="hidden md:inline">Task Juggler</span>
          <span className="md:hidden">TJ</span>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <button onClick={onHomeClick} className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700">
          <LayoutDashboard size={20} className="flex-shrink-0" />
          <span className="ml-3 hidden md:inline">Dashboard</span>
        </button>
        <button onClick={onCreateTaskClick} className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700">
          <PlusCircle size={20} className="flex-shrink-0" />
          <span className="ml-3 hidden md:inline">Create Task</span>
        </button>
        <button onClick={onTaskReportClick} className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700">
          <ListChecks size={20} className="flex-shrink-0" />
          <span className="ml-3 hidden md:inline">Task Reports</span>
        </button>
        <button onClick={onChatClick} className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700">
          <MessageSquare size={20} className="flex-shrink-0" />
          <span className="ml-3 hidden md:inline">Messages</span>
        </button>
        <button onClick={onProfileClick} className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700">
          <User size={20} className="flex-shrink-0" />
          <span className="ml-3 hidden md:inline">Profile</span>
        </button>
      </nav>
      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button onClick={onLogoutClick} className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700">
          <LogOut size={20} className="flex-shrink-0" />
          <span className="ml-3 hidden md:inline">Logout</span>
        </button>
      </div>
    </aside>;
}