import React, { useState, Component } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
interface PageNavigatorProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}
export function PageNavigator({
  onNavigate,
  currentPage
}: PageNavigatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCommonComponents, setShowCommonComponents] = useState(false);
  return <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 z-50">
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-700 hover:text-blue-600 flex items-center">
          {isExpanded ? <>
              <ChevronUp size={16} className="mr-1" />
              <span className="text-sm font-medium">Collapse</span>
            </> : <>
              <ChevronDown size={16} className="mr-1" />
              <span className="text-sm font-medium">Expand</span>
            </>}
        </button>
        <button onClick={() => setShowCommonComponents(!showCommonComponents)} className="text-sm text-blue-600 hover:text-blue-800 ml-4">
          {showCommonComponents ? 'Show Main Pages' : 'Show Components'}
        </button>
      </div>
      {isExpanded && <div className="flex flex-col space-y-2 max-h-80 overflow-y-auto">
          {showCommonComponents ?
      // Common Components Section
      <>
              <div className="text-xs font-semibold text-gray-500 uppercase mt-2 mb-1 px-2">
                Search
              </div>
              <button onClick={() => onNavigate('search-bar')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'search-bar' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Search Bar
              </button>
              <button onClick={() => onNavigate('search-results')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'search-results' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Search Results
              </button>
              <div className="text-xs font-semibold text-gray-500 uppercase mt-2 mb-1 px-2">
                Messaging
              </div>
              <button onClick={() => onNavigate('conversation-list')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'conversation-list' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Conversation List
              </button>
              <button onClick={() => onNavigate('message-thread')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'message-thread' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Message Thread
              </button>
              <div className="text-xs font-semibold text-gray-500 uppercase mt-2 mb-1 px-2">
                Reviews
              </div>
              <button onClick={() => onNavigate('submit-review')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'submit-review' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Submit Review
              </button>
              <div className="text-xs font-semibold text-gray-500 uppercase mt-2 mb-1 px-2">
                Payment
              </div>
              <button onClick={() => onNavigate('payment-method-setup')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'payment-method-setup' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Payment Method Setup
              </button>
              <button onClick={() => onNavigate('escrow-payment')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'escrow-payment' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Escrow Payment
              </button>
              <button onClick={() => onNavigate('vendor-invoices')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'vendor-invoices' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Vendor Invoices
              </button>
              <button onClick={() => onNavigate('user-invoices')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'user-invoices' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                User Invoices
              </button>
              <div className="text-xs font-semibold text-gray-500 uppercase mt-2 mb-1 px-2">
                Task Management
              </div>
              <button onClick={() => onNavigate('my-tasks-viewer')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'my-tasks-viewer' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                My Tasks Viewer
              </button>
              <button onClick={() => onNavigate('task-detail')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'task-detail' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Task Detail
              </button>
            </> :
      // Main Pages Section
      <>
              <button onClick={() => onNavigate('landing')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'landing' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Landing
              </button>
              <button onClick={() => onNavigate('dashboard')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Dashboard
              </button>
              <button onClick={() => onNavigate('create-task')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'create-task' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Create Task
              </button>
              <button onClick={() => onNavigate('hire-for-task')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'hire-for-task' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Hire For Task
              </button>
              <button onClick={() => onNavigate('task-marketplace')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'task-marketplace' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Task Marketplace
              </button>
              <button onClick={() => onNavigate('task-report')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'task-report' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Task Report
              </button>
              <button onClick={() => onNavigate('task-detail')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'task-detail' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Task Detail
              </button>
              <button onClick={() => onNavigate('task-chat')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'task-chat' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Task Chat
              </button>
              <button onClick={() => onNavigate('profile')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'profile' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Profile
              </button>
              <button onClick={() => onNavigate('login')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'login' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Login
              </button>
              <button onClick={() => onNavigate('signup')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'signup' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Signup
              </button>
              <button onClick={() => onNavigate('pricing')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'pricing' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Pricing
              </button>
              <button onClick={() => onNavigate('task-invitation')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'task-invitation' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Task Invitation
              </button>
              <button onClick={() => onNavigate('sample-invitation')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'sample-invitation' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Sample Invitation
              </button>
              <button onClick={() => onNavigate('marketplace')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'marketplace' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Marketplace
              </button>
              <button onClick={() => onNavigate('vendor-detail')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'vendor-detail' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Vendor Detail
              </button>
              <button onClick={() => onNavigate('my-tasks-viewer')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'my-tasks-viewer' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                My Tasks Viewer
              </button>
              <button onClick={() => onNavigate('forgot-password')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'forgot-password' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Forgot Password
              </button>
              <button onClick={() => onNavigate('vendor-invoices')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'vendor-invoices' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Vendor Invoices
              </button>
              <button onClick={() => onNavigate('user-invoices')} className={`px-3 py-1 rounded-md text-sm ${currentPage === 'user-invoices' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                User Invoices
              </button>
            </>}
        </div>}
    </div>;
}