import React from 'react';
import { Mail, MessageSquare, ArrowRight, LogIn } from 'lucide-react';
export function SampleTaskInvitationPage() {
  // Sample data
  const inviterName = 'Alex Johnson';
  const taskTitle = 'Website Redesign Project';
  const inviteId = 'sample-invite-123';
  const taskId = 'sample-task-456';
  return <div className="w-full min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Task Juggler</h1>
            </div>
            <div>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Help
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <Mail size={32} className="text-blue-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
              You've Been Invited to a Task
            </h1>
            <p className="text-center text-gray-600 mb-6">
              <span className="font-medium">{inviterName}</span> has invited you
              to work on a task in Task Juggler.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="font-medium text-gray-900 mb-2">
                Task: {taskTitle}
              </h2>
              <p className="text-gray-600 text-sm">
                This is a collaborative project to redesign the company website
                with modern design principles. We need to update the homepage,
                about page, and contact page with new branding guidelines.
              </p>
              <div className="mt-3 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Due Date:</span>
                  <span>December 15, 2023</span>
                </div>
                <div className="flex items-center mt-1">
                  <span className="font-medium mr-2">Priority:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    High
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center mb-4">
                Create Account & View Task
                <ArrowRight size={18} className="ml-2" />
              </button>
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <button className="text-blue-600 hover:underline">
                  Log in
                </button>
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-lg mx-auto mt-8 text-center">
          <p className="text-sm text-gray-500">
            Task Juggler helps you manage and track tasks with clear
            accountability.
          </p>
        </div>
      </div>
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-center text-gray-500">
            &copy; 2023 Task Juggler. All rights reserved.
          </p>
        </div>
      </footer>
    </div>;
}