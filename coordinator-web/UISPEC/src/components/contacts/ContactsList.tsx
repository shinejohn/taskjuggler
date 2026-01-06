import React, { useState } from 'react';
import { Search, Filter, Plus, Upload, MoreVertical, ChevronLeft, ChevronRight, ArrowUpDown, Trash2, Tag, Download, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ContactSidebar } from './ContactSidebar';
export function ContactsList() {
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [viewContact, setViewContact] = useState<any>(null);
  // Mock data
  const contacts = [{
    id: 1,
    name: 'John Smith',
    phone: '(555) 234-5678',
    email: 'john@email.com',
    tags: ['VIP', 'Dental'],
    lastContact: '2 hours ago',
    coordinator: 'Sally'
  }, {
    id: 2,
    name: 'Sarah Johnson',
    phone: '(555) 345-6789',
    email: 'sarah@email.com',
    tags: ['New Patient'],
    lastContact: 'Yesterday',
    coordinator: 'Ed'
  }, {
    id: 3,
    name: 'Mike Brown',
    phone: '(555) 456-7890',
    email: 'mike@email.com',
    tags: ['Follow-up'],
    lastContact: '3 days ago',
    coordinator: 'Sally'
  }, {
    id: 4,
    name: 'Emily Davis',
    phone: '(555) 567-8901',
    email: 'emily@email.com',
    tags: ['VIP'],
    lastContact: '1 week ago',
    coordinator: 'Marcus'
  }, {
    id: 5,
    name: 'Robert Taylor',
    phone: '(555) 678-9012',
    email: 'robert@email.com',
    tags: ['Dental'],
    lastContact: '2 weeks ago',
    coordinator: 'Ed'
  }, {
    id: 6,
    name: 'Jennifer Lee',
    phone: '(555) 789-0123',
    email: 'jen@email.com',
    tags: [],
    lastContact: '1 month ago',
    coordinator: 'Sally'
  }, {
    id: 7,
    name: 'David Miller',
    phone: '(555) 890-1234',
    email: 'david@email.com',
    tags: ['New Patient'],
    lastContact: '1 month ago',
    coordinator: 'Ed'
  }, {
    id: 8,
    name: 'Lisa Wong',
    phone: '(555) 901-2345',
    email: 'lisa@email.com',
    tags: ['VIP', 'Dental'],
    lastContact: '2 months ago',
    coordinator: 'Sally'
  }, {
    id: 9,
    name: 'James Wilson',
    phone: '(555) 012-3456',
    email: 'james@email.com',
    tags: [],
    lastContact: '2 months ago',
    coordinator: 'Marcus'
  }, {
    id: 10,
    name: 'Patricia Moore',
    phone: '(555) 123-4560',
    email: 'pat@email.com',
    tags: ['Follow-up'],
    lastContact: '3 months ago',
    coordinator: 'Ed'
  }];
  const toggleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(c => c.id));
    }
  };
  const toggleSelect = (id: number) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(c => c !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };
  return <div className="space-y-6 relative min-h-screen pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1B4F72]">
            Contacts
          </h1>
          <p className="text-slate-500 mt-1">1,284 total contacts</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Upload size={18} />
            Import
          </button>
          <button className="px-4 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <Plus size={18} />
            Add Contact
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input type="text" placeholder="Search contacts by name, phone, email..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {['Status', 'Source', 'Tags', 'Last Contact'].map(filter => <div key={filter} className="relative">
              <select className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] cursor-pointer hover:bg-slate-50">
                <option>{filter}: All</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
              <Filter className="absolute right-2.5 top-2 text-slate-400 pointer-events-none" size={12} />
            </div>)}
          <button className="text-sm text-slate-400 hover:text-[#1B4F72] ml-auto">
            Clear filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 w-10">
                  <input type="checkbox" className="rounded border-slate-300 text-[#1B4F72] focus:ring-[#1B4F72]" checked={selectedContacts.length === contacts.length} onChange={toggleSelectAll} />
                </th>
                <th className="px-6 py-3 cursor-pointer hover:text-[#1B4F72] group">
                  <div className="flex items-center gap-1">
                    Name{' '}
                    <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100" />
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer hover:text-[#1B4F72] group">
                  <div className="flex items-center gap-1">
                    Phone{' '}
                    <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100" />
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer hover:text-[#1B4F72] group">
                  <div className="flex items-center gap-1">
                    Email{' '}
                    <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100" />
                  </div>
                </th>
                <th className="px-6 py-3">Tags</th>
                <th className="px-6 py-3 cursor-pointer hover:text-[#1B4F72] group">
                  <div className="flex items-center gap-1">
                    Last Contact{' '}
                    <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100" />
                  </div>
                </th>
                <th className="px-6 py-3">Coordinator</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.map(contact => <tr key={contact.id} className={cn('hover:bg-slate-50 transition-colors cursor-pointer', selectedContacts.includes(contact.id) ? 'bg-blue-50/30' : '')} onClick={() => setViewContact(contact)}>
                  <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-slate-300 text-[#1B4F72] focus:ring-[#1B4F72]" checked={selectedContacts.includes(contact.id)} onChange={() => toggleSelect(contact.id)} />
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                        {contact.name.charAt(0)}
                      </div>
                      {contact.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                    {contact.phone}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{contact.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map(tag => <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                          {tag}
                        </span>)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {contact.lastContact}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-50 text-[#1B4F72] flex items-center justify-center text-[10px] font-bold">
                        {contact.coordinator.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-600">
                        {contact.coordinator}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                    <button className="p-1 text-slate-400 hover:text-[#1B4F72] rounded hover:bg-slate-100">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">Showing 1-10 of 1,284</span>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedContacts.length > 0 && <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1B4F72] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-6 animate-in slide-in-from-bottom-10 z-30">
          <span className="font-medium">
            {selectedContacts.length} contacts selected
          </span>
          <div className="h-4 w-px bg-white/20"></div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 hover:bg-white/10 rounded-md transition-colors flex items-center gap-2 text-sm">
              <Trash2 size={16} /> Delete
            </button>
            <button className="px-3 py-1.5 hover:bg-white/10 rounded-md transition-colors flex items-center gap-2 text-sm">
              <Tag size={16} /> Add Tag
            </button>
            <button className="px-3 py-1.5 hover:bg-white/10 rounded-md transition-colors flex items-center gap-2 text-sm">
              <Download size={16} /> Export
            </button>
          </div>
          <button onClick={() => setSelectedContacts([])} className="ml-2 p-1 hover:bg-white/10 rounded-full">
            <X size={16} />
          </button>
        </div>}

      {/* Sidebar */}
      <ContactSidebar contact={viewContact} isOpen={!!viewContact} onClose={() => setViewContact(null)} />
    </div>;
}