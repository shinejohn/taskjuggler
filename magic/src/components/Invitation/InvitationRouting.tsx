import React, { useEffect, useState } from 'react';
import { TaskInvitationPage, TrackingParams } from './TaskInvitationPage';
import { TaskInviteSignupPage } from './TaskInviteSignupPage';
import { TaskViewPage } from './TaskViewPage';
import { TaskResponsePage } from './TaskResponsePage';
import { TaskTimelinePage } from './TaskTimelinePage';
import { LoginPage } from '../Auth/LoginPage';
interface InvitationRoutingProps {
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
  onViewDashboard?: () => void;
  isAuthenticated?: boolean;
}
export function InvitationRouting({
  onCreateTaskClick,
  onTaskReportClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLogoutClick,
  onViewDashboard,
  isAuthenticated = false
}: InvitationRoutingProps) {
  // Track the current step in the invitation flow
  const [currentStep, setCurrentStep] = useState<'invitation' | 'signup' | 'login' | 'view' | 'response' | 'timeline'>('invitation');
  // Store tracking parameters throughout the flow
  const [trackingParams, setTrackingParams] = useState<TrackingParams>({
    inviteId: '',
    taskId: '',
    step: 'clicked',
    source: 'email',
    timestamp: Date.now()
  });
  // Store the user's response to the task
  const [taskResponse, setTaskResponse] = useState<'accept' | 'reject' | null>(null);
  // Effect to skip to task view if already authenticated
  useEffect(() => {
    if (isAuthenticated && currentStep === 'invitation') {
      // If user is already authenticated and on the invitation page,
      // automatically move them to the task view
      setCurrentStep('view');
    }
  }, [isAuthenticated, currentStep]);
  // Handle continuing to signup
  const handleContinueToSignup = (params: TrackingParams) => {
    setTrackingParams(params);
    setCurrentStep('signup');
  };
  // Handle continuing to login
  const handleContinueToLogin = (params: TrackingParams) => {
    setTrackingParams(params);
    setCurrentStep('login');
  };
  // Handle signup completion
  const handleSignupComplete = (params: TrackingParams) => {
    setTrackingParams(params);
    setCurrentStep('view');
  };
  // Handle login completion
  const handleLoginComplete = () => {
    // Update tracking params to indicate user is registered
    const updatedParams: TrackingParams = {
      ...trackingParams,
      step: 'registered',
      timestamp: Date.now()
    };
    setTrackingParams(updatedParams);
    setCurrentStep('view');
  };
  // Handle viewing task directly (for already authenticated users)
  const handleViewTaskDirectly = (params: TrackingParams) => {
    setTrackingParams({
      ...params,
      step: 'viewed',
      timestamp: Date.now()
    });
    setCurrentStep('view');
  };
  // Handle task response (accept or reject)
  const handleTaskResponse = (response: 'accept' | 'reject', params: TrackingParams) => {
    setTaskResponse(response);
    setTrackingParams(params);
    setCurrentStep('response');
  };
  // Handle setting timeline
  const handleSetTimeline = () => {
    setCurrentStep('timeline');
  };
  // Handle back to task
  const handleBackToTask = () => {
    setCurrentStep('view');
  };
  // Handle timeline set
  const handleTimelineSet = () => {
    setCurrentStep('response');
  };
  // Render the appropriate component based on the current step
  switch (currentStep) {
    case 'invitation':
      return <TaskInvitationPage onContinueToSignup={handleContinueToSignup} onContinueToLogin={handleContinueToLogin} isAuthenticated={isAuthenticated} onViewTaskDirectly={handleViewTaskDirectly} />;
    case 'signup':
      return <TaskInviteSignupPage trackingParams={trackingParams} onSignupComplete={handleSignupComplete} />;
    case 'login':
      return <LoginPage onLogin={handleLoginComplete} redirectAfterLogin={true} redirectParams={trackingParams} />;
    case 'view':
      return <TaskViewPage trackingParams={trackingParams} onRespond={handleTaskResponse} onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick} />;
    case 'response':
      return <TaskResponsePage response={taskResponse || 'accept'} trackingParams={trackingParams} onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick} onSetTimeline={handleSetTimeline} onViewDashboard={onViewDashboard} onBackToTask={handleBackToTask} />;
    case 'timeline':
      return <TaskTimelinePage taskId={trackingParams.taskId} taskTitle="Website Redesign Project" suggestedDueDate="2023-12-15" onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick} onTimelineSet={handleTimelineSet} onBackToTask={handleBackToTask} />;
    default:
      return <TaskInvitationPage onContinueToSignup={handleContinueToSignup} onContinueToLogin={handleContinueToLogin} />;
  }
}