import React, { useEffect } from 'react';
import { TrackingParams } from './TaskInvitationPage';
import { AppLayout } from '../Layout/AppLayout';
import { CheckCircle, X, Calendar, Clock, MessageSquare, ArrowRight, ChevronLeft } from 'lucide-react';
interface TaskResponsePageProps {
  response: 'accept' | 'reject';
  trackingParams: TrackingParams;
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
  onSetTimeline?: () => void;
  onViewDashboard?: () => void;
  onBackToTask?: () => void;
}
export function TaskResponsePage({
  response,
  trackingParams,
  onCreateTaskClick,
  onTaskReportClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLogoutClick,
  onSetTimeline,
  onViewDashboard,
  onBackToTask
}: TaskResponsePageProps) {
  useEffect(() => {
    // In a real app, we would send the response to the server
    console.log('Task response recorded', {
      response,
      trackingParams
    });
    // trackTaskResponse({ response, trackingParams })
  }, [response, trackingParams]);
  return <AppLayout onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {response === 'accept' ? <>
                <div className="p-6 border-b border-gray-200 text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Task Accepted!
                  </h2>
                  <p className="text-gray-600">
                    You've accepted the task "Website Redesign Project"
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Next Steps
                  </h3>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Calendar size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-gray-900">
                          Set Your Timeline
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Define when you'll start and complete this task. This
                          helps set clear expectations.
                        </p>
                        <button onClick={onSetTimeline} className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center">
                          Set Timeline
                          <ArrowRight size={16} className="ml-1" />
                        </button>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <MessageSquare size={20} className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-gray-900">
                          Communicate
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          If you have questions about the task, you can message
                          the task creator directly.
                        </p>
                        <button onClick={onChatClick} className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center">
                          Message Assignor
                          <ArrowRight size={16} className="ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-between">
                  <button onClick={onBackToTask} className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center">
                    <ChevronLeft size={16} className="mr-1" />
                    Back to Task Details
                  </button>
                  <button onClick={onViewDashboard} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm">
                    Go to Dashboard
                  </button>
                </div>
              </> : <>
                <div className="p-6 border-b border-gray-200 text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <X size={32} className="text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Task Declined
                  </h2>
                  <p className="text-gray-600">
                    You've declined the task "Website Redesign Project"
                  </p>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Provide a Reason (Optional)
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Letting the task creator know why you declined can help
                      them assign more suitable tasks in the future.
                    </p>
                    <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="I'm currently at capacity with other tasks..."></textarea>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-base font-medium text-gray-900 mb-2">
                      What Happens Next?
                    </h4>
                    <p className="text-sm text-gray-600">
                      The task creator will be notified that you've declined
                      this task. They may reassign it to someone else or reach
                      out to discuss further.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-between">
                  <button onClick={onBackToTask} className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center">
                    <ChevronLeft size={16} className="mr-1" />
                    Back to Task Details
                  </button>
                  <div className="space-x-3">
                    <button className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-md text-sm">
                      Send Feedback
                    </button>
                    <button onClick={onViewDashboard} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm">
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              </>}
          </div>
        </div>
      </div>
    </AppLayout>;
}