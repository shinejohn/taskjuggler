import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // For testing purposes, allow access without authentication
  const isTestingMode = import.meta.env.VITE_DEV_MODE === 'true' || window.location.hostname === 'localhost';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isTestingMode) {
    return <Navigate to="/login" replace />;
  }

  // Show testing mode indicator
  if (isTestingMode && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-orange-700">
                <strong>Testing Mode:</strong> Authentication bypassed for development. 
                <a href="/login" className="underline ml-1">Login normally</a>
              </p>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

