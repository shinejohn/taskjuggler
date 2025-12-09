import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { Mail, Lock, AlertCircle, Github, Twitter, Facebook, Linkedin } from 'lucide-react';
interface LoginPageProps {
  onLogin?: () => void;
  redirectAfterLogin?: boolean;
  redirectParams?: any;
  onSignupClick?: () => void;
  onForgotPasswordClick?: () => void;
  hideLayout?: boolean;
}
export function LoginPage({
  onLogin,
  redirectAfterLogin,
  redirectParams,
  onSignupClick,
  onForgotPasswordClick,
  hideLayout = false
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (redirectAfterLogin && redirectParams) {
        console.log('Logging in with redirect params:', redirectParams);
      }
      if (onLogin) {
        onLogin();
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const content = <>
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <button type="button" onClick={onForgotPasswordClick} className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </button>
          </div>
        </div>
        <div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" disabled={loading}>
            {loading ? <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span> : 'Sign in'}
          </button>
        </div>
      </form>
      {/* SSO Options */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-3">
          <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span className="sr-only">Sign in with Google</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
            </svg>
          </button>
          <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span className="sr-only">Sign in with Facebook</span>
            <Facebook size={20} />
          </button>
          <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span className="sr-only">Sign in with Twitter</span>
            <Twitter size={20} />
          </button>
          <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span className="sr-only">Sign in with GitHub</span>
            <Github size={20} />
          </button>
        </div>
      </div>
      {!hideLayout && <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button onClick={onSignupClick} className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </button>
          </p>
        </div>}
    </>;
  if (hideLayout) {
    return content;
  }
  return <AuthLayout title="Sign in to Task Juggler" subtitle="Streamline your tasks and boost productivity">
      {content}
    </AuthLayout>;
}