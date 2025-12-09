import React, { useState } from 'react';
import { Menu, X, Home, Clipboard, ListChecks, MessageSquare, User, LogOut, PlusCircle } from 'lucide-react';
interface AppNavigationProps {
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
}
export function AppNavigation({
  onCreateTaskClick,
  onTaskReportClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLogoutClick
} = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={onHomeClick}>
            Task Juggler
          </span>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <button onClick={onHomeClick} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
            <Home size={18} className="mr-1" />
            Dashboard
          </button>
          <button onClick={onCreateTaskClick} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
            <PlusCircle size={18} className="mr-1" />
            Create Task
          </button>
          <button onClick={onTaskReportClick} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
            <ListChecks size={18} className="mr-1" />
            Task Report
          </button>
          <button onClick={onChatClick} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
            <MessageSquare size={18} className="mr-1" />
            Messages
          </button>
          <button onClick={onProfileClick} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
            <User size={18} className="mr-1" />
            Profile
          </button>
          <button onClick={onLogoutClick} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
            <LogOut size={18} className="mr-1" />
            Logout
          </button>
        </nav>
        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && <div className="md:hidden bg-white py-4 px-4 shadow-md">
          <nav className="flex flex-col space-y-4">
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
          if (onTaskReportClick) onTaskReportClick();
        }} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
              <ListChecks size={18} className="mr-2" />
              Task Report
            </button>
            <button onClick={() => {
          setIsMenuOpen(false);
          if (onChatClick) onChatClick();
        }} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
              <MessageSquare size={18} className="mr-2" />
              Messages
            </button>
            <button onClick={() => {
          setIsMenuOpen(false);
          if (onProfileClick) onProfileClick();
        }} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
              <User size={18} className="mr-2" />
              Profile
            </button>
            <button onClick={() => {
          setIsMenuOpen(false);
          if (onLogoutClick) onLogoutClick();
        }} className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </nav>
        </div>}
    </header>;
}