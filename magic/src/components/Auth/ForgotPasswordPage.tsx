import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { Mail, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
interface ForgotPasswordPageProps {
  onBackToLogin?: () => void;
}
export function ForgotPasswordPage({
  onBackToLogin
}: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // In a real app, this would be an API call to request a password reset
      // await api.requestPasswordReset({ email })
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Show success message
      setIsSubmitted(true);
    } catch (err) {
      setError('There was a problem with your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return <AuthLayout title={isSubmitted ? 'Check your email' : 'Reset your password'} subtitle={isSubmitted ? "We've sent you instructions to reset your password" : "Enter your email and we'll send you a link to reset your password"}>
      {isSubmitted ? <div className="space-y-6">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <p className="text-center text-gray-600 mb-4">
              We've sent an email to <strong>{email}</strong> with a link to
              reset your password.
            </p>
            <p className="text-center text-gray-500 text-sm">
              If you don't see the email, check your spam folder or make sure
              you entered the correct email address.
            </p>
          </div>
          <div>
            <button type="button" onClick={onBackToLogin} className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Return to login
            </button>
          </div>
        </div> : <>
          {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" disabled={loading}>
                {loading ? <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span> : 'Send reset link'}
              </button>
            </div>
          </form>
          <div className="mt-6">
            <button type="button" onClick={onBackToLogin} className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <ArrowLeft size={16} className="mr-2" />
              Back to login
            </button>
          </div>
        </>}
    </AuthLayout>;
}