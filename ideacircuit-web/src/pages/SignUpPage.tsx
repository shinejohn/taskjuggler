import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlusIcon, EyeIcon, EyeOffIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (passwordStrength < 3) {
      setError('Please use a stronger password');
      return;
    }
    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }
    setIsLoading(true);
    
    try {
      const result = await register(formData.email, formData.password, formData.name);
      
      if (result.user) {
        navigate('/login');
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return 'Very weak';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Medium';
    if (passwordStrength === 3) return 'Strong';
    return 'Very strong';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-destructive';
    if (passwordStrength === 1) return 'bg-warning';
    if (passwordStrength === 2) return 'bg-warning';
    if (passwordStrength === 3) return 'bg-success';
    return 'bg-success';
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
          Create a new account
        </h2>
        <p className="mt-2 text-center text-body-medium text-text-secondary">
          Or{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover transition-colors duration-fast">
            sign in to your existing account
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
              <label htmlFor="name" className="block text-label font-medium text-text-primary mb-2">
                Full Name
              </label>
              <div className="mt-1">
                <input 
                  id="name" 
                  name="name" 
                  type="text" 
                  autoComplete="name" 
                  required 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="appearance-none block w-full px-4 py-3 border border-border rounded-md bg-bg-primary text-body-large text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]" 
                  placeholder="John Doe" 
                />
              </div>
            </div>
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
                  autoComplete="new-password" 
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
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-caption text-text-tertiary">
                      Password strength:
                    </div>
                    <div className={`text-caption font-medium ${
                      passwordStrength >= 3 ? 'text-success' : 'text-warning'
                    }`}>
                      {getPasswordStrengthText()}
                    </div>
                  </div>
                  <div className="h-1 w-full bg-bg-tertiary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getPasswordStrengthColor()} transition-all duration-normal`} 
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    />
                  </div>
                  <ul className="mt-2 space-y-1">
                    <li className="text-caption flex items-center text-text-secondary">
                      {/^.{8,}$/.test(formData.password) ? (
                        <CheckCircleIcon size={12} className="text-success mr-1" />
                      ) : (
                        <AlertCircleIcon size={12} className="text-text-tertiary mr-1" />
                      )}
                      At least 8 characters
                    </li>
                    <li className="text-caption flex items-center text-text-secondary">
                      {/[A-Z]/.test(formData.password) ? (
                        <CheckCircleIcon size={12} className="text-success mr-1" />
                      ) : (
                        <AlertCircleIcon size={12} className="text-text-tertiary mr-1" />
                      )}
                      At least one uppercase letter
                    </li>
                    <li className="text-caption flex items-center text-text-secondary">
                      {/[0-9]/.test(formData.password) ? (
                        <CheckCircleIcon size={12} className="text-success mr-1" />
                      ) : (
                        <AlertCircleIcon size={12} className="text-text-tertiary mr-1" />
                      )}
                      At least one number
                    </li>
                    <li className="text-caption flex items-center text-text-secondary">
                      {/[^A-Za-z0-9]/.test(formData.password) ? (
                        <CheckCircleIcon size={12} className="text-success mr-1" />
                      ) : (
                        <AlertCircleIcon size={12} className="text-text-tertiary mr-1" />
                      )}
                      At least one special character
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-label font-medium text-text-primary mb-2">
                Confirm password
              </label>
              <div className="mt-1 relative">
                <input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type={showPassword ? 'text' : 'password'} 
                  autoComplete="new-password" 
                  required 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  className="appearance-none block w-full px-4 py-3 border border-border rounded-md bg-bg-primary text-body-large text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]" 
                  placeholder="••••••••" 
                />
              </div>
              {formData.password && formData.confirmPassword && (
                <div className="mt-1 flex items-center">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircleIcon size={14} className="text-success mr-1" />
                      <span className="text-caption text-success">
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircleIcon size={14} className="text-destructive mr-1" />
                      <span className="text-caption text-destructive">
                        Passwords do not match
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center">
              <input 
                id="terms" 
                name="terms" 
                type="checkbox" 
                checked={agreeToTerms} 
                onChange={() => setAgreeToTerms(!agreeToTerms)} 
                className="h-4 w-4 text-primary focus:ring-primary border-border rounded" 
              />
              <label htmlFor="terms" className="ml-2 block text-body-small text-text-primary">
                I agree to the{' '}
                <a href="#" className="font-medium text-primary hover:text-primary-hover transition-colors duration-fast">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-primary hover:text-primary-hover transition-colors duration-fast">
                  Privacy Policy
                </a>
              </label>
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
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlusIcon size={18} className="mr-2" />
                    Create account
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
