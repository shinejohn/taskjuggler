import React, { useState, useRef } from 'react';
import { AuthLayout } from './AuthLayout';
import { Mail, Phone, MapPin, User, Lock, Upload, AlertCircle, Github, Twitter, Facebook, Linkedin } from 'lucide-react';
interface SignupPageProps {
  onSignupComplete?: () => void;
  onLoginClick?: () => void;
  hideLayout?: boolean;
}
export function SignupPage({
  onSignupComplete,
  onLoginClick,
  hideLayout = false
}: SignupPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (!profileImage) {
      setErrorMessage('Please upload a profile image');
      return;
    }
    // Here you would send the data to your backend
    console.log('Form submitted with:', {
      ...formData,
      profileImage
    });
    // Call the onSignupComplete callback if provided
    if (onSignupComplete) {
      onSignupComplete();
    } else {
      alert('Account created successfully! (This is just a demo)');
    }
  };
  const content = <>
      {errorMessage && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-start">
          <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>}
      {/* SSO Options */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Sign up with</span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-3">
          <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span className="sr-only">Sign up with Google</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
            </svg>
          </button>
          <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span className="sr-only">Sign up with Facebook</span>
            <Facebook size={20} />
          </button>
          <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span className="sr-only">Sign up with Twitter</span>
            <Twitter size={20} />
          </button>
          <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span className="sr-only">Sign up with GitHub</span>
            <Github size={20} />
          </button>
        </div>
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with email
            </span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email - Moved to top for prominence */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="you@example.com" />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            We'll use this email for account verification and notifications
          </p>
        </div>
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            {imagePreview ? <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" /> : <Upload size={30} className="text-gray-400" />}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2 text-sm text-blue-600 hover:text-blue-500">
            Upload profile picture
          </button>
        </div>
        {/* Password */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input id="password" name="password" type="password" autoComplete="new-password" required value={formData.password} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" />
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required value={formData.confirmPassword} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" />
            </div>
          </div>
        </div>
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone size={18} className="text-gray-400" />
            </div>
            <input id="phone" name="phone" type="tel" autoComplete="tel" required value={formData.phone} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="(123) 456-7890" />
          </div>
        </div>
        {/* Address */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            <MapPin size={18} className="mr-2 text-gray-400" />
            Address Information
          </h3>
          <div>
            <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input id="address.street" name="address.street" type="text" autoComplete="street-address" required value={formData.address.street} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="123 Main St" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input id="address.city" name="address.city" type="text" autoComplete="address-level2" required value={formData.address.city} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Anytown" />
            </div>
            <div>
              <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input id="address.state" name="address.state" type="text" autoComplete="address-level1" required value={formData.address.state} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="CA" />
            </div>
          </div>
          <div>
            <label htmlFor="address.zip" className="block text-sm font-medium text-gray-700">
              ZIP / Postal Code
            </label>
            <input id="address.zip" name="address.zip" type="text" autoComplete="postal-code" required value={formData.address.zip} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="12345" />
          </div>
        </div>
        <div className="pt-2">
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Create Account
          </button>
        </div>
      </form>
      {!hideLayout && <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={onLoginClick} className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </button>
          </p>
        </div>}
    </>;
  if (hideLayout) {
    return content;
  }
  return <AuthLayout title="Create your account" subtitle="Join Task Juggler and start managing your tasks efficiently">
      {content}
    </AuthLayout>;
}