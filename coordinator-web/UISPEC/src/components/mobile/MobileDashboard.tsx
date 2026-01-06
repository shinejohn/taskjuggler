import React from 'react';
import { Menu, Bell, User, Phone, UserPlus, Calendar, Megaphone, TrendingUp, TrendingDown, CheckCircle, Clock } from 'lucide-react';
import { MobileNav } from './MobileNav';
import { cn } from '../../lib/utils';
export function MobileDashboard() {
  return <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button className="p-2 -ml-2 text-slate-600">
            <Menu size={24} />
          </button>
          <div className="text-lg font-heading font-bold text-[#1B4F72]">
            4calls.ai
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <User size={16} className="text-slate-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Greeting Section */}
      <div className="px-4 py-6 bg-gradient-to-br from-[#1B4F72] to-[#2563EB] text-white">
        <h1 className="text-2xl font-bold mb-1">Good morning! ☀️</h1>
        <p className="text-blue-100">Here's your daily summary</p>
      </div>

      {/* Metrics Carousel */}
      <div className="px-4 -mt-6 mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {[{
          label: 'Calls Today',
          value: '23',
          change: '+12%',
          trend: 'up',
          icon: Phone,
          color: 'bg-blue-500'
        }, {
          label: 'Appointments',
          value: '7',
          change: '+3',
          trend: 'up',
          icon: Calendar,
          color: 'bg-green-500'
        }, {
          label: 'No-shows',
          value: '1',
          change: '-2',
          trend: 'down',
          icon: Clock,
          color: 'bg-amber-500'
        }].map((metric, i) => <div key={i} className="flex-shrink-0 w-40 bg-white rounded-xl p-4 shadow-sm border border-slate-100 snap-start">
              <div className={cn('inline-flex p-2 rounded-lg mb-3', metric.color, 'bg-opacity-10')}>
                <metric.icon size={20} className={metric.color.replace('bg-', 'text-')} />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {metric.value}
              </div>
              <div className="text-xs text-slate-500 mb-2">{metric.label}</div>
              <div className={cn('flex items-center gap-1 text-xs font-medium', metric.trend === 'up' ? 'text-green-600' : 'text-red-600')}>
                {metric.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {metric.change}
              </div>
            </div>)}
        </div>
      </div>

      {/* Active Coordinators */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-3">
          Active Coordinators
        </h2>
        <div className="space-y-3">
          {[{
          name: 'Sally',
          role: 'Receptionist',
          calls: 15,
          status: 'active'
        }, {
          name: 'Ed',
          role: 'Scheduler',
          calls: 8,
          status: 'active'
        }, {
          name: 'Marcus',
          role: 'Confirmer',
          calls: 0,
          status: 'paused'
        }].map((coord, i) => <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 active:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold">
                    {coord.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      {coord.name}
                      <span className={cn('w-2 h-2 rounded-full', coord.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-slate-300')} />
                    </div>
                    <div className="text-sm text-slate-500">{coord.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-900">
                    {coord.calls}
                  </div>
                  <div className="text-xs text-slate-500">calls today</div>
                </div>
              </div>
            </div>)}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {[{
          label: 'Test Call',
          icon: Phone,
          color: 'bg-blue-50 text-blue-600'
        }, {
          label: 'Add Contact',
          icon: UserPlus,
          color: 'bg-purple-50 text-purple-600'
        }, {
          label: 'Calendar',
          icon: Calendar,
          color: 'bg-green-50 text-green-600'
        }, {
          label: 'Campaign',
          icon: Megaphone,
          color: 'bg-amber-50 text-amber-600'
        }].map((action, i) => <button key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 active:bg-slate-50 transition-colors">
              <div className={cn('inline-flex p-3 rounded-lg mb-2', action.color)}>
                <action.icon size={24} />
              </div>
              <div className="font-medium text-slate-900 text-sm">
                {action.label}
              </div>
            </button>)}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-3">
          Recent Activity
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-100">
          {[{
          time: '2:34 PM',
          desc: 'Sally booked appointment with John Smith',
          icon: CheckCircle,
          color: 'text-green-500'
        }, {
          time: '1:15 PM',
          desc: 'Ed confirmed reservation for Sarah',
          icon: CheckCircle,
          color: 'text-green-500'
        }, {
          time: '11:30 AM',
          desc: 'Marcus sent follow-up to Mike Brown',
          icon: Phone,
          color: 'text-blue-500'
        }, {
          time: '10:05 AM',
          desc: 'Sally transferred call to front desk',
          icon: Phone,
          color: 'text-amber-500'
        }].map((activity, i) => <div key={i} className="p-4 flex gap-3 active:bg-slate-50 transition-colors">
              <div className={cn('flex-shrink-0 mt-0.5', activity.color)}>
                <activity.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 leading-relaxed">
                  {activity.desc}
                </p>
                <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
              </div>
            </div>)}
        </div>
      </div>

      {/* Bottom Navigation */}
      <MobileNav />
    </div>;
}