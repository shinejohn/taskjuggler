import React, { useState } from 'react';
import { AppLayout } from '../Layout/AppLayout';
import { Calendar, Clock, CheckCircle, ArrowRight, ChevronLeft } from 'lucide-react';
interface TaskTimelinePageProps {
  taskId: string;
  taskTitle: string;
  suggestedDueDate: string;
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
  onTimelineSet?: () => void;
  onBackToTask?: () => void;
}
export function TaskTimelinePage({
  taskId,
  taskTitle,
  suggestedDueDate,
  onCreateTaskClick,
  onTaskReportClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLogoutClick,
  onTimelineSet,
  onBackToTask
}: TaskTimelinePageProps) {
  const [startDate, setStartDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [completionTime, setCompletionTime] = useState('');
  const [note, setNote] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would send this data to the server
    console.log('Timeline set', {
      taskId,
      startDate,
      startTime,
      completionDate,
      completionTime,
      note
    });
    if (onTimelineSet) {
      onTimelineSet();
    }
  };
  return <AppLayout onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Set Your Timeline
            </h1>
            <p className="mt-1 text-gray-600">
              Define when you'll start and complete this task
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                {taskTitle}
              </h2>
              <p className="text-sm text-gray-600">
                Suggested due date:{' '}
                {new Date(suggestedDueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">
                    When will you start working on this task?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar size={18} className="text-gray-400" />
                        </div>
                        <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock size={18} className="text-gray-400" />
                        </div>
                        <input type="time" id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">
                    When will you complete this task?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="completionDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Completion Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar size={18} className="text-gray-400" />
                        </div>
                        <input type="date" id="completionDate" value={completionDate} onChange={e => setCompletionDate(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="completionTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Completion Time (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock size={18} className="text-gray-400" />
                        </div>
                        <input type="time" id="completionTime" value={completionTime} onChange={e => setCompletionTime(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                    Add a note (Optional)
                  </label>
                  <textarea id="note" value={note} onChange={e => setNote(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Any additional information about your timeline..." />
                </div>
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle size={20} className="text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Why setting a timeline matters
                      </h3>
                      <p className="mt-1 text-sm text-blue-700">
                        Setting a realistic timeline helps manage expectations
                        and ensures both you and the task creator are aligned on
                        when the work will be completed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button type="button" onClick={onBackToTask} className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center">
                  <ChevronLeft size={16} className="mr-1" />
                  Back to Task
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center">
                  Set Timeline
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>;
}