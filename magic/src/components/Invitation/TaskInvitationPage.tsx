import React, { useEffect, useState } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { ArrowRight, Mail, MessageSquare, AlertTriangle, LogIn } from 'lucide-react';
interface TaskInvitationPageProps {
  onContinueToSignup?: (trackingParams: TrackingParams) => void;
  onContinueToLogin?: (trackingParams: TrackingParams) => void;
  isAuthenticated?: boolean;
  onViewTaskDirectly?: (trackingParams: TrackingParams) => void;
}
export interface TrackingParams {
  inviteId: string;
  taskId: string;
  step: 'clicked' | 'registered' | 'viewed' | 'responded';
  source: 'email' | 'sms';
  timestamp: number;
}
export function TaskInvitationPage({
  onContinueToSignup,
  onContinueToLogin,
  isAuthenticated,
  onViewTaskDirectly
}: TaskInvitationPageProps) {
  const [trackingParams, setTrackingParams] = useState<TrackingParams>({
    inviteId: '',
    taskId: '',
    step: 'clicked',
    source: 'email',
    timestamp: Date.now()
  });
  const [inviterName, setInviterName] = useState('Alex Johnson');
  const [taskTitle, setTaskTitle] = useState('Website Redesign Project');
  const [isValidInvitation, setIsValidInvitation] = useState(true);
  // Parse URL parameters on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const inviteId = queryParams.get('inviteId') || '';
    const taskId = queryParams.get('taskId') || '';
    const source = queryParams.get('source') as 'email' | 'sms' || 'email';
    // Update tracking params
    setTrackingParams({
      inviteId,
      taskId,
      step: 'clicked',
      source,
      timestamp: Date.now()
    });
    // In a real app, we would validate the invitation here
    // and fetch the task and inviter details from the server
    setIsValidInvitation(!!inviteId && !!taskId);
    // Log the click event
    console.log('Invitation clicked', {
      inviteId,
      taskId,
      source
    });
    // In a real app, we would send this tracking data to the server
    // trackInvitationClick({ inviteId, taskId, source })
    // If user is already authenticated, take them directly to the task view
    if (isAuthenticated && onViewTaskDirectly) {
      onViewTaskDirectly(trackingParams);
    }
  }, [isAuthenticated, onViewTaskDirectly]);
  const handleContinueToSignup = () => {
    if (onContinueToSignup) {
      onContinueToSignup(trackingParams);
    }
  };
  const handleContinueToLogin = () => {
    if (onContinueToLogin) {
      onContinueToLogin(trackingParams);
    }
  };
  // If user is already authenticated, they'll be redirected in the useEffect
  // This component will only render for non-authenticated users or while redirecting
  if (!isValidInvitation) {
    return <div className="w-full min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle size={32} className="text-red-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
                Invalid Invitation
              </h1>
              <p className="text-center text-gray-600 mb-6">
                This invitation link appears to be invalid or has expired.
                Please contact the person who sent you the invitation.
              </p>
              <div className="flex justify-center">
                <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md">
                  Go to Homepage
                </a>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>;
  }
  return <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-blue-100 rounded-full">
                {trackingParams.source === 'email' ? <Mail size={32} className="text-blue-600" /> : <MessageSquare size={32} className="text-blue-600" />}
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
                To view the complete task details and respond, you'll need to{' '}
                {isAuthenticated ? 'log in' : 'create a Task Juggler account'}.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <button onClick={handleContinueToSignup} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center mb-4">
                Create Account & View Task
                <ArrowRight size={18} className="ml-2" />
              </button>
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <button onClick={handleContinueToLogin} className="text-blue-600 hover:underline">
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
      <Footer />
    </div>;
}