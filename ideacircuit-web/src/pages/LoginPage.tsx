import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogInIcon, EyeIcon, EyeOffIcon, AlertCircleIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.user) {
        navigate('/presentation');
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-bg-secondary py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white text-title-large font-bold">
            AI
          </div>
        </div>
        <h2 className="mt-6 text-center text-display-small font-bold text-text-primary">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-body-medium text-text-secondary">
          Or{' '}
          <Link to="/signup" className="font-medium text-primary hover:text-primary-hover transition-colors duration-fast">
            create a new account
          </Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-standard py-8 px-4 shadow-2 sm:rounded-xl sm:px-10">
          {error && (
            <div className="mb-4 bg-destructive/10 border-l-4 border-destructive p-4 rounded-md">
              <div className="flex items-center">
                <AlertCircleIcon size={20} className="text-destructive mr-2" />
                <p className="text-body-small text-destructive">{error}</p>
              </div>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-label font-medium text-text-primary mb-2">
                Email address
              </label>
              <div className="mt-1">
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="appearance-none block w-full px-4 py-3 border border-border rounded-md bg-bg-primary text-body-large text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]" 
                  placeholder="you@example.com" 
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-label font-medium text-text-primary mb-2">
                Password
              </label>
              <div className="mt-1 relative">
                <input 
                  id="password" 
                  name="password" 
                  type={showPassword ? 'text' : 'password'} 
                  autoComplete="current-password" 
                  required 
                  value={formData.password} 
                  onChange={handleChange} 
                  className="appearance-none block w-full px-4 py-3 border border-border rounded-md bg-bg-primary text-body-large text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px] pr-10" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-tertiary hover:text-text-primary min-h-[44px] min-w-[44px] justify-center transition-colors duration-fast" 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  name="remember-me" 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={() => setRememberMe(!rememberMe)} 
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded" 
                />
                <label htmlFor="remember-me" className="ml-2 block text-body-small text-text-primary">
                  Remember me
                </label>
              </div>
              <div className="text-body-small">
                <a href="#" className="font-medium text-primary hover:text-primary-hover transition-colors duration-fast">
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <button 
                type="submit" 
                disabled={isLoading} 
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-1 text-label font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary min-h-[44px] transition-colors duration-fast ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogInIcon size={18} className="mr-2" />
                    Sign in
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
