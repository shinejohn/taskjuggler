import React, { useState } from 'react';
import { Search, Filter, Plus, Phone, Calendar, Truck, Utensils, Headset, Shield, CheckCircle, TrendingUp, DollarSign, Megaphone, ClipboardList } from 'lucide-react';
import { CoordinatorCard } from '../dashboard/CoordinatorCard';
import { cn } from '../../lib/utils';
export function CoordinatorsList() {
  const [filterRole, setFilterRole] = useState('All Roles');
  const [filterStatus, setFilterStatus] = useState('All');
  // Sample data
  const coordinators = [{
    id: 1,
    name: 'Sally',
    role: 'Receptionist',
    price: '$49/mo',
    status: 'active',
    phone: '(555) 123-4567',
    stats: {
      calls: 156,
      appointments: 43,
      successRate: '94%'
    }
  }, {
    id: 2,
    name: 'Ed',
    role: 'Appointment Scheduler',
    price: '$59/mo',
    status: 'active',
    phone: '(555) 123-4568',
    stats: {
      calls: 89,
      appointments: 21,
      successRate: '88%'
    }
  }, {
    id: 3,
    name: 'Marcus',
    role: 'Support Agent',
    price: '$59/mo',
    status: 'paused',
    phone: '(555) 123-4569',
    stats: {
      calls: 245,
      appointments: 12,
      successRate: '91%'
    }
  }];
  const availableRoles = [{
    name: 'Dispatcher',
    price: '$59/mo',
    icon: Truck
  }, {
    name: 'Hostess',
    price: '$49/mo',
    icon: Utensils
  }, {
    name: 'Tip Line',
    price: '$69/mo',
    icon: Shield
  }, {
    name: 'Sales Rep',
    price: '$79/mo',
    icon: TrendingUp
  }, {
    name: 'Bill Collector',
    price: '$69/mo',
    icon: DollarSign
  }];
  return <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1B4F72]">
            Your Coordinators
          </h1>
          <p className="text-slate-500 mt-1">Manage your AI assistant team</p>
        </div>
        <button className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2">
          <Plus size={18} />
          Hire New Coordinator
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input type="text" placeholder="Search coordinators..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select className="w-full appearance-none pl-4 pr-10 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] cursor-pointer" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              <option>All Roles</option>
              <option>Inbound</option>
              <option>Outbound</option>
            </select>
            <Filter className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
          </div>

          <div className="relative flex-1 md:flex-none">
            <select className="w-full appearance-none pl-4 pr-10 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] cursor-pointer" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option>All Status</option>
              <option>Active</option>
              <option>Paused</option>
            </select>
            <Filter className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Coordinators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coordinators.map(coord => <CoordinatorCard key={coord.id} name={coord.name} role={coord.role} price={coord.price} status={coord.status as 'active' | 'paused'} phone={coord.phone} stats={coord.stats} />)}
      </div>

      {/* Available Roles Section */}
      <section className="pt-8 border-t border-slate-200">
        <h2 className="text-xl font-bold text-[#1B4F72] mb-4">
          Available Roles
        </h2>
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {availableRoles.map(role => <div key={role.name} className="min-w-[240px] bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1B4F72] flex items-center justify-center mb-3 group-hover:bg-[#1B4F72] group-hover:text-white transition-colors">
                  <role.icon size={24} />
                </div>
                <h3 className="font-bold text-slate-900">{role.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{role.price}</p>
                <button className="w-full py-2 rounded-lg border border-[#1B4F72] text-[#1B4F72] font-medium hover:bg-[#1B4F72] hover:text-white transition-colors">
                  Hire
                </button>
              </div>)}
          </div>
        </div>
      </section>
    </div>;
}