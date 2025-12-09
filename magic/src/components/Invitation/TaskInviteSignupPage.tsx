import React, { useEffect, useState } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { TrackingParams } from './TaskInvitationPage';
import { CheckCircle, User, Mail, Lock, Phone } from 'lucide-react';
interface TaskInviteSignupPageProps {
  trackingParams: TrackingParams;
  onSignupComplete?: (trackingParams: TrackingParams) => void;
}
export function TaskInviteSignupPage({
  trackingParams,
  onSignupComplete
}: TaskInviteSignupPageProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Pre-fill email if it was included in the invitation
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const emailParam = queryParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
    const phoneParam = queryParams.get('phone');
    if (phoneParam) {
      setPhone(phoneParam);
    }
  }, []);
  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate email
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    // Validate name
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setError('');
    setStep(2);
  };
  const handleSubmitStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate password
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    // Validate password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    handleSignup();
  };
  const handleSignup = async () => {
    setLoading(true);
    try {
      // In a real app, we would make an API call to create the account
      // await api.createAccount({ name, email, phone, password })
      // Update tracking params to indicate registration is complete
      const updatedParams: TrackingParams = {
        ...trackingParams,
        step: 'registered',
        timestamp: Date.now()
      };
      // Log the registration event
      console.log('User registered', updatedParams);
      // In a real app, we would send this tracking data to the server
      // trackInvitationRegistration(updatedParams)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (onSignupComplete) {
        onSignupComplete(updatedParams);
      }
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
                  1
                </div>
                <div className="h-1 w-12 bg-blue-600"></div>
              </div>
              <div className="flex items-center">
                <div className={`${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} w-8 h-8 rounded-full flex items-center justify-center`}>
                  2
                </div>
                <div className={`h-1 w-12 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              </div>
              <div className="flex items-center">
                <div className={`${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} w-8 h-8 rounded-full flex items-center justify-center`}>
                  3
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Account Info</span>
              <span>Security</span>
              <span>View Task</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Create Your Account
                </h1>
                <p className="text-gray-600 mt-2">
                  {step === 1 ? "Let's set up your Task Juggler account to view your task" : 'Create a secure password for your account'}
                </p>
              </div>
              {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>}
              {step === 1 ? <form onSubmit={handleSubmitStep1}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={18} className="text-gray-400" />
                        </div>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your full name" required />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={18} className="text-gray-400" />
                        </div>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" required />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone size={18} className="text-gray-400" />
                        </div>
                        <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="(555) 123-4567" />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                      Continue
                    </button>
                  </div>
                </form> : <form onSubmit={handleSubmitStep2}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Create Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={18} className="text-gray-400" />
                        </div>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Minimum 8 characters" required minLength={8} />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={18} className="text-gray-400" />
                        </div>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Re-enter your password" required />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input id="terms" type="checkbox" required className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                        I agree to the{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center" disabled={loading}>
                      {loading ? <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Account...
                        </> : 'Create Account & View Task'}
                    </button>
                    <div className="text-center">
                      <button type="button" onClick={() => setStep(1)} className="text-sm text-blue-600 hover:underline">
                        Back to previous step
                      </button>
                    </div>
                  </div>
                </form>}
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}