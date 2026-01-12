import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, XIcon, PresentationIcon, BarChart2Icon, UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <nav className="glass-subtle py-4 px-6 lg:px-12 sticky top-0 z-50 border-b border-border transition-all duration-normal">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-display-small font-bold text-primary hover:text-primary-hover transition-colors duration-fast">
              IdeaCircuit
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast">
              Features
            </a>
            <a href="#pricing" className="text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast">
              Pricing
            </a>
            <a href="#testimonials" className="text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast">
              Reviews
            </a>
            {/* Application Pages */}
            <div className="flex items-center space-x-4 border-l border-border pl-4">
              <Link 
                to="/presentation" 
                className="flex items-center space-x-1 text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast"
              >
                <PresentationIcon size={16} />
                <span>Presentation</span>
              </Link>
              <Link 
                to="/report" 
                className="flex items-center space-x-1 text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast"
              >
                <BarChart2Icon size={16} />
                <span>Reports</span>
              </Link>
              {isAuthenticated ? (
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-1 text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast"
                >
                  <UserIcon size={16} />
                  <span>Profile</span>
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1 text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast"
                >
                  <UserIcon size={16} />
                  <span>Login</span>
                </Link>
              )}
            </div>
            {!isAuthenticated && (
              <Link 
                to="/signup" 
                className="bg-primary text-white px-6 py-3 rounded-md font-medium text-label min-h-[44px] flex items-center hover:bg-primary-hover transition-colors duration-fast"
              >
                Get Started
              </Link>
            )}
          </div>
          <div className="md:hidden">
            <button 
              type="button" 
              className="text-text-secondary hover:text-text-primary focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-fast"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 glass-subtle border-t border-border pt-4">
            <div className="flex flex-col space-y-4 pb-4">
              <a 
                href="#features" 
                className="text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast" 
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast" 
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#testimonials" 
                className="text-text-secondary hover:text-primary font-medium text-body-medium transition-colors duration-fast" 
                onClick={() => setIsMenuOpen(false)}
              >
                Reviews
              </a>
              {/* Application Pages */}
              <div className="border-t border-border pt-4">
                <div className="text-caption font-semibold text-text-tertiary mb-2">Application</div>
                <Link 
                  to="/presentation" 
                  className="flex items-center space-x-2 text-text-secondary hover:text-primary font-medium text-body-medium py-2 transition-colors duration-fast" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <PresentationIcon size={16} />
                  <span>Presentation</span>
                </Link>
                <Link 
                  to="/report" 
                  className="flex items-center space-x-2 text-text-secondary hover:text-primary font-medium text-body-medium py-2 transition-colors duration-fast" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BarChart2Icon size={16} />
                  <span>Reports</span>
                </Link>
                {isAuthenticated ? (
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 text-text-secondary hover:text-primary font-medium text-body-medium py-2 transition-colors duration-fast" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon size={16} />
                    <span>Profile</span>
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-2 text-text-secondary hover:text-primary font-medium text-body-medium py-2 transition-colors duration-fast" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon size={16} />
                    <span>Login</span>
                  </Link>
                )}
              </div>
              {!isAuthenticated && (
                <Link 
                  to="/signup" 
                  className="bg-primary text-white px-6 py-3 rounded-md font-medium text-label min-h-[44px] flex items-center justify-center hover:bg-primary-hover transition-colors duration-fast" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
