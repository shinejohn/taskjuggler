import React, { useState } from 'react';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';
interface AuthGatePageProps {
  onLogin?: () => void;
  onSignup?: () => void;
  onCancel?: () => void;
  message?: string;
  redirectAfterAuth?: () => void;
  targetPageName?: string;
}
export function AuthGatePage({
  onLogin,
  onSignup,
  onCancel,
  message = 'You need to sign in or create an account to access this feature.',
  redirectAfterAuth,
  targetPageName = 'this page'
}: AuthGatePageProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const handleLogin = () => {
    if (onLogin) onLogin();
    if (redirectAfterAuth) redirectAfterAuth();
  };
  const handleSignup = () => {
    if (onSignup) onSignup();
    if (redirectAfterAuth) redirectAfterAuth();
  };
  const handleSwitchToSignup = () => {
    setActiveTab('signup');
  };
  const handleSwitchToLogin = () => {
    setActiveTab('login');
  };
  return <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Auth gate message */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <div className="bg-white py-4 px-6 shadow rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-gray-700">{message}</p>
            {onCancel && <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700">
                Cancel
              </button>}
          </div>
        </div>
      </div>
      {/* Tab navigation */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white shadow rounded-lg">
          <div className="flex border-b border-gray-200">
            <button onClick={() => setActiveTab('login')} className={`w-1/2 py-4 px-6 text-center font-medium text-sm rounded-tl-lg ${activeTab === 'login' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-50 text-gray-500 hover:text-gray-700'}`}>
              Sign In
            </button>
            <button onClick={() => setActiveTab('signup')} className={`w-1/2 py-4 px-6 text-center font-medium text-sm rounded-tr-lg ${activeTab === 'signup' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-50 text-gray-500 hover:text-gray-700'}`}>
              Create Account
            </button>
          </div>
          <div className="p-6">
            {activeTab === 'login' ? <LoginPage onLogin={handleLogin} onSignupClick={handleSwitchToSignup} hideLayout={true} /> : <div>
                <SignupPage onSignupComplete={handleSignup} onLoginClick={handleSwitchToLogin} hideLayout={true} />
              </div>}
          </div>
        </div>
      </div>
    </div>;
}