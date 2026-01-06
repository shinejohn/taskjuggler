import React, { useState } from 'react';
import { Plus, MoreVertical, User, CheckCircle, Clock, AlertTriangle, Check, X, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';
export function TeamMembers() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('member');
  const teamMembers = [{
    name: 'Jane Doe',
    email: 'jane@abc.com',
    role: 'owner',
    status: 'active',
    lastActive: 'Now',
    isYou: true
  }, {
    name: 'John Smith',
    email: 'john@abc.com',
    role: 'admin',
    status: 'active',
    lastActive: '2 hours ago',
    isYou: false
  }, {
    name: 'Sarah Johnson',
    email: 'sarah@abc.com',
    role: 'member',
    status: 'active',
    lastActive: 'Yesterday',
    isYou: false
  }, {
    name: 'Pending',
    email: 'mike@abc.com',
    role: 'member',
    status: 'invited',
    lastActive: '—',
    isYou: false
  }];
  const permissions = [{
    name: 'View Dashboard',
    owner: true,
    admin: true,
    member: true
  }, {
    name: 'Manage Coordinators',
    owner: true,
    admin: true,
    member: 'view'
  }, {
    name: 'View Contacts',
    owner: true,
    admin: true,
    member: true
  }, {
    name: 'Edit Contacts',
    owner: true,
    admin: true,
    member: false
  }, {
    name: 'View Call History',
    owner: true,
    admin: true,
    member: true
  }, {
    name: 'Access Recordings',
    owner: true,
    admin: true,
    member: false
  }, {
    name: 'Manage Campaigns',
    owner: true,
    admin: true,
    member: false
  }, {
    name: 'Billing & Subscription',
    owner: true,
    admin: false,
    member: false
  }, {
    name: 'Team Management',
    owner: true,
    admin: true,
    member: false
  }, {
    name: 'API Access',
    owner: true,
    admin: true,
    member: false
  }];
  const activityLog = [{
    user: 'Jane Doe',
    action: 'updated Business Profile',
    time: '2 hours ago'
  }, {
    user: 'John Smith',
    action: 'created campaign "January Follow-ups"',
    time: 'Yesterday'
  }, {
    user: 'Sarah Johnson',
    action: 'viewed call recording #4521',
    time: '2 days ago'
  }, {
    user: 'Mike',
    action: 'invited to team by Jane Doe',
    time: '3 days ago'
  }];
  const getRoleBadge = (role: string) => {
    const styles = {
      owner: 'bg-purple-50 text-purple-700 border-purple-200',
      admin: 'bg-blue-50 text-blue-700 border-blue-200',
      member: 'bg-slate-100 text-slate-600 border-slate-200'
    };
    return styles[role as keyof typeof styles];
  };
  return <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1B4F72]">
            Team Members
          </h1>
          <p className="text-slate-500 mt-1">
            Manage who has access to your Coordinator account
          </p>
        </div>
        <button onClick={() => setShowInviteModal(true)} className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2">
          <Plus size={18} />
          Invite Team Member
        </button>
      </div>

      {/* Current Plan Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">
              You're on the Business plan with 5 team seats
            </h3>
            <p className="text-sm text-slate-600">3 of 5 seats used</p>
          </div>
          <a href="#" className="text-sm font-medium text-[#1B4F72] hover:underline">
            Upgrade for more seats →
          </a>
        </div>
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <div className="h-full bg-[#1B4F72] rounded-full transition-all duration-500" style={{
          width: '60%'
        }} />
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Team Members</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Member</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Last Active</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamMembers.map((member, i) => <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {member.name}{' '}
                          {member.isYou && <span className="text-slate-400">(You)</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{member.email}</td>
                  <td className="px-6 py-4">
                    <span className={cn('inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize', getRoleBadge(member.role))}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {member.status === 'active' ? <span className="inline-flex items-center gap-1.5 text-green-600 text-xs font-medium">
                        <CheckCircle size={14} />
                        Active
                      </span> : <span className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-medium">
                        <Clock size={14} />
                        Invited
                      </span>}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {member.lastActive}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!member.isYou && <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100">
                        <MoreVertical size={16} />
                      </button>}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles & Permissions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Roles & Permissions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">
                  Permission
                </th>
                <th className="text-center py-3 px-4 font-medium text-purple-700">
                  Owner
                </th>
                <th className="text-center py-3 px-4 font-medium text-blue-700">
                  Admin
                </th>
                <th className="text-center py-3 px-4 font-medium text-slate-700">
                  Member
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissions.map((perm, i) => <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-600">{perm.name}</td>
                  <td className="py-3 px-4 text-center">
                    {perm.owner === true ? <Check size={18} className="inline text-green-600" /> : perm.owner === 'view' ? <span className="text-xs text-slate-500">View only</span> : <X size={18} className="inline text-slate-300" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {perm.admin === true ? <Check size={18} className="inline text-green-600" /> : perm.admin === 'view' ? <span className="text-xs text-slate-500">View only</span> : <X size={18} className="inline text-slate-300" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {perm.member === true ? <Check size={18} className="inline text-green-600" /> : perm.member === 'view' ? <span className="text-xs text-slate-500">View only</span> : <X size={18} className="inline text-slate-300" />}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Activity Log</h2>
          <a href="#" className="text-sm font-medium text-[#1B4F72] hover:underline">
            View full activity log →
          </a>
        </div>
        <div className="space-y-3">
          {activityLog.map((activity, i) => <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center text-xs font-bold flex-shrink-0">
                {activity.user.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700">
                  <span className="font-medium">{activity.user}</span>{' '}
                  {activity.action}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
              </div>
            </div>)}
        </div>
      </div>

      {/* Transfer Ownership */}
      <div className="bg-white rounded-xl border-2 border-red-200 shadow-sm p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Transfer Ownership
            </h2>
            <p className="text-sm text-slate-600">
              Transfer account ownership to another admin. This action cannot be
              undone.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select new owner
            </label>
            <select className="w-full max-w-md px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white">
              <option>John Smith (Admin)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm with password
            </label>
            <input type="password" placeholder="Enter your password" className="w-full max-w-md px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
          </div>
          <button className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition-colors">
            Transfer Ownership
          </button>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Invite Team Member
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Send an invitation to join your team
                </p>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input type="email" placeholder="colleague@company.com" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role
                </label>
                <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white">
                  <option value="admin">
                    Admin - Full access except billing
                  </option>
                  <option value="member">
                    Member - Limited access, view only
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Personal Message{' '}
                  <span className="text-slate-400">(optional)</span>
                </label>
                <textarea rows={3} placeholder="Add a personal note to the invitation..." className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-800 font-medium mb-1">
                  Permissions Preview:
                </p>
                <p className="text-xs text-blue-700">
                  {selectedRole === 'admin' ? 'Full access to all features except billing and subscription management.' : 'View-only access to dashboard, contacts, and call history. Cannot edit or manage resources.'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowInviteModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button className="flex-1 px-4 py-2.5 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-semibold rounded-lg shadow-sm transition-colors">
                Send Invitation
              </button>
            </div>
          </div>
        </div>}
    </div>;
}