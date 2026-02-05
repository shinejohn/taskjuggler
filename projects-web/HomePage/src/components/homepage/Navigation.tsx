import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navLinks = [{
    name: 'Product',
    href: '#product'
  }, {
    name: 'Features',
    href: '#features'
  }, {
    name: 'Pricing',
    href: '#pricing'
  }, {
    name: 'Resources',
    href: '#resources'
  }, {
    name: 'Enterprise',
    href: '#enterprise'
  }];
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50' : 'bg-white/80 backdrop-blur-xl'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-slate-900">
              4 Projects
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map(link => <a key={link.name} href={link.href} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                {link.name}
              </a>)}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a href="#signin" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Sign In
            </a>
            <Button size="sm">Start Free</Button>
          </div>
        </div>
      </div>
    </nav>;
}