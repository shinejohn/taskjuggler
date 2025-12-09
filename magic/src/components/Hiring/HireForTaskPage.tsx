import React from 'react';
import { AppLayout } from '../Layout/AppLayout';
import { TaskHiringForm } from './TaskHiringForm';
interface HireForTaskPageProps {
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
  onTaskCreated?: () => void;
}
export function HireForTaskPage({
  onCreateTaskClick,
  onTaskReportClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLogoutClick,
  onTaskCreated
}: HireForTaskPageProps) {
  return <AppLayout onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create a Task</h1>
            <p className="mt-2 text-lg text-gray-600">
              Delegate tasks to professionals or send simple requests to family
              and friends
            </p>
          </div>
          <TaskHiringForm onTaskCreated={onTaskCreated} />
        </div>
      </div>
    </AppLayout>;
}