import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
interface HeaderProps {
  onCreateTaskClick?: () => void;
  onLogoClick?: () => void;
  onLoginClick?: () => void;
}
export function Header({
  onCreateTaskClick,
  onLogoClick,
  onLoginClick
} = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleGetStartedClick = () => {
    if (onCreateTaskClick) {
      onCreateTaskClick();
    }
  };
  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };
  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    }
  };
  return <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={handleLogoClick}>
            Task Juggler
          </span>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium">
            How It Works
          </a>
          <a href="#use-cases" className="text-gray-700 hover:text-blue-600 font-medium">
            Use Cases
          </a>
          <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium">
            Testimonials
          </a>
          <button className="text-gray-700 hover:text-blue-600 font-medium" onClick={handleLoginClick}>
            Login
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md" onClick={handleGetStartedClick}>
            Get Started
          </button>
        </nav>
        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && <div className="md:hidden bg-white py-4 px-4 shadow-md">
          <nav className="flex flex-col space-y-4">
            <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>
              How It Works
            </a>
            <a href="#use-cases" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>
              Use Cases
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>
              Testimonials
            </a>
            <button className="text-gray-700 hover:text-blue-600 font-medium text-left" onClick={() => {
          setIsMenuOpen(false);
          if (onLoginClick) onLoginClick();
        }}>
              Login
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md w-full" onClick={() => {
          setIsMenuOpen(false);
          if (onCreateTaskClick) onCreateTaskClick();
        }}>
              Get Started
            </button>
          </nav>
        </div>}
    </header>;
}