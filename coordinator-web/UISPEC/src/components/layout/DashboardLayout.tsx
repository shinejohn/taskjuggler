import React from 'react';
import { LayoutDashboard, Users, Contact, Calendar, Phone, Megaphone, BarChart3, Bell, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
interface DashboardLayoutProps {
  children: React.ReactNode;
}
export function DashboardLayout({
  children
}: DashboardLayoutProps) {
  const location = useLocation();
  const navItems = [{
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard
  }, {
    name: 'Coordinators',
    path: '/coordinators',
    icon: Users
  }, {
    name: 'Contacts',
    path: '/contacts',
    icon: Contact
  }, {
    name: 'Calendar',
    path: '/calendar',
    icon: Calendar
  }, {
    name: 'Calls',
    path: '/calls',
    icon: Phone
  }, {
    name: 'Campaigns',
    path: '/campaigns',
    icon: Megaphone
  }, {
    name: 'Analytics',
    path: '/analytics',
    icon: BarChart3
  }];
  return <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Nav */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/dashboard" className="text-2xl font-heading font-bold text-[#1B4F72] flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#1B4F72] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    4C
                  </div>
                  4calls.ai
                </Link>
              </div>
              <nav className="hidden md:ml-8 md:flex md:space-x-1 h-full">
                {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return <Link key={item.name} to={item.path} className={cn('inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium h-full transition-colors', isActive ? 'border-[#1B4F72] text-[#1B4F72] bg-blue-50/30' : 'border-transparent text-slate-500 hover:text-[#1B4F72] hover:border-slate-300')}>
                      <item.icon size={16} className="mr-2" />
                      {item.name}
                    </Link>;
              })}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-[#1B4F72] transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>

              <div className="relative group">
                <button className="flex items-center gap-2 focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300 overflow-hidden">
                    <User size={20} className="text-slate-500" />
                  </div>
                </button>
                {/* Dropdown would go here */}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        {children}
      </main>
    </div>;
}