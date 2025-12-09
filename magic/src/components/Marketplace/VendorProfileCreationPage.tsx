import React from 'react';
import { VendorProfileCreation } from './VendorProfileCreation';
import { AppLayout } from '../Layout/AppLayout';
interface VendorProfileCreationPageProps {
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
  onComplete?: () => void;
}
export function VendorProfileCreationPage({
  onCreateTaskClick,
  onTaskReportClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLogoutClick,
  onComplete
}: VendorProfileCreationPageProps) {
  const handleProfileCreated = () => {
    if (onComplete) {
      onComplete();
    }
  };
  return <AppLayout onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick}>
      <VendorProfileCreation onComplete={handleProfileCreated} />
    </AppLayout>;
}