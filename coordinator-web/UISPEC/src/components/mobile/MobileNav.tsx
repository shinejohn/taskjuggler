import React from 'react';
import { LayoutDashboard, Users, Contact, Phone, MoreHorizontal } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
export function MobileNav() {
  const location = useLocation();
  const navItems = [{
    name: 'Dashboard',
    path: '/mobile',
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
    name: 'Calls',
    path: '/calls',
    icon: Phone
  }, {
    name: 'More',
    path: '/settings',
    icon: MoreHorizontal
  }];
  return <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map(item => {
        const isActive = location.pathname === item.path;
        return <Link key={item.name} to={item.path} className={cn('flex flex-col items-center justify-center flex-1 h-full transition-colors', isActive ? 'text-[#1B4F72]' : 'text-slate-400')}>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn('text-xs mt-1 font-medium', isActive ? 'text-[#1B4F72]' : 'text-slate-500')}>
                {item.name}
              </span>
            </Link>;
      })}
      </div>
    </nav>;
}