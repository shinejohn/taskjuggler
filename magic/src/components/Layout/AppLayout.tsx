import React from 'react';
import { AppSidebar } from './AppSidebar';
import { EnhancedHeader } from '../Navigation/EnhancedHeader';
import { Footer } from '../Footer';
interface AppLayoutProps {
  children: ReactNode;
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onMyTasksClick?: () => void;
  onTaskMarketClick?: () => void;
  onDoerMarketClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
  showSidebar?: boolean;
}
export function AppLayout({
  children,
  onCreateTaskClick,
  onTaskReportClick,
  onMyTasksClick,
  onTaskMarketClick,
  onDoerMarketClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLogoutClick,
  showSidebar = true
}: AppLayoutProps) {
  return <div className="flex min-h-screen bg-gray-50">
      {showSidebar && <AppSidebar onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick} />}
      <div className="flex-1 flex flex-col">
        <EnhancedHeader onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onMyTasksClick={onMyTasksClick} onTaskMarketClick={onTaskMarketClick} onDoerMarketClick={onDoerMarketClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick} isAuthenticated={true} />
        <main className={`flex-1 ${showSidebar ? 'pt-16' : 'pt-16'} pb-16 md:pb-0`}>
          {children}
        </main>
        <Footer onCreateTaskClick={onCreateTaskClick} onMyTasksClick={onMyTasksClick} onTaskMarketClick={onTaskMarketClick} onDoerMarketClick={onDoerMarketClick} onHomeClick={onHomeClick} onProfileClick={onProfileClick} onChatClick={onChatClick} isAuthenticated={true} />
      </div>
    </div>;
}