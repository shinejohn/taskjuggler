import React from 'react';
import { EnhancedHeader } from '../Navigation/EnhancedHeader';
import { Footer } from '../Footer';
interface MainLayoutProps {
  children: ReactNode;
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onMyTasksClick?: () => void;
  onTaskMarketClick?: () => void;
  onDoerMarketClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onLogoClick?: () => void;
  isAuthenticated?: boolean;
  showFooter?: boolean;
}
export function MainLayout({
  children,
  onCreateTaskClick,
  onTaskReportClick,
  onMyTasksClick,
  onTaskMarketClick,
  onDoerMarketClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLoginClick,
  onLogoutClick,
  onLogoClick,
  isAuthenticated = false,
  showFooter = true
}: MainLayoutProps) {
  return <div className="flex flex-col min-h-screen bg-white">
      <EnhancedHeader onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onMyTasksClick={onMyTasksClick} onTaskMarketClick={onTaskMarketClick} onDoerMarketClick={onDoerMarketClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLoginClick={onLoginClick} onLogoutClick={onLogoutClick} onLogoClick={onLogoClick} isAuthenticated={isAuthenticated} />
      <main className="flex-1 pt-16 pb-16 md:pb-0">{children}</main>
      {showFooter && <Footer onCreateTaskClick={onCreateTaskClick} onMyTasksClick={onMyTasksClick} onTaskMarketClick={onTaskMarketClick} onDoerMarketClick={onDoerMarketClick} onHomeClick={onHomeClick} onProfileClick={onProfileClick} onChatClick={onChatClick} isAuthenticated={isAuthenticated} />}
    </div>;
}