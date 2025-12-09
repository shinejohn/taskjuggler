import React from 'react';
import { AppLayout } from './Layout/AppLayout';
import { TaskCreator } from './TaskCreator';
interface TaskCreationPageProps {
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
  onTaskCreated?: () => void;
}
export function TaskCreationPage({
  onCreateTaskClick,
  onTaskReportClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLogoutClick,
  onTaskCreated
}: TaskCreationPageProps) {
  return <AppLayout onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <TaskCreator onTaskCreated={onTaskCreated} />
      </div>
    </AppLayout>;
}