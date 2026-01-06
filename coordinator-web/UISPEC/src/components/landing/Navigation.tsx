import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <nav className={cn('sticky top-0 z-50 transition-all duration-200', isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1B4F72] rounded-lg flex items-center justify-center text-white font-bold text-sm">
              4C
            </div>
            <span className="text-xl font-heading font-bold text-[#1B4F72]">
              4calls.ai
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-[#1B4F72] font-medium transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-[#1B4F72] font-medium transition-colors">
              Pricing
            </a>
            <a href="#industries" className="text-slate-600 hover:text-[#1B4F72] font-medium transition-colors">
              Industries
            </a>
            <a href="#about" className="text-slate-600 hover:text-[#1B4F72] font-medium transition-colors">
              About
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-slate-600 hover:text-[#1B4F72] font-medium transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-5 py-2 border-2 border-[#1B4F72] text-[#1B4F72] hover:bg-[#1B4F72] hover:text-white font-semibold rounded-lg transition-all duration-200">
              Sign Up
            </Link>
            <Link to="/onboarding" className="px-5 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-600">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-slate-600 hover:text-[#1B4F72] font-medium">
                Features
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-[#1B4F72] font-medium">
                Pricing
              </a>
              <a href="#industries" className="text-slate-600 hover:text-[#1B4F72] font-medium">
                Industries
              </a>
              <a href="#about" className="text-slate-600 hover:text-[#1B4F72] font-medium">
                About
              </a>
              <Link to="/login" className="text-slate-600 hover:text-[#1B4F72] font-medium">
                Login
              </Link>
              <Link to="/signup" className="px-5 py-2 border-2 border-[#1B4F72] text-[#1B4F72] font-semibold rounded-lg text-center">
                Sign Up
              </Link>
              <Link to="/onboarding" className="px-5 py-2 bg-[#F59E0B] text-white font-semibold rounded-lg text-center">
                Start Free Trial
              </Link>
            </div>
          </div>}
      </div>
    </nav>;
}