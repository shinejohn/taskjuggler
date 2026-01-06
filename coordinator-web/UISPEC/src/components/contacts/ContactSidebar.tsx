import React, { useState } from 'react';
import { X, Phone, Mail, Copy, Calendar, MessageSquare, Tag, Plus, Save } from 'lucide-react';
import { cn } from '../../lib/utils';
interface ContactSidebarProps {
  contact: any;
  isOpen: boolean;
  onClose: () => void;
}
export function ContactSidebar({
  contact,
  isOpen,
  onClose
}: ContactSidebarProps) {
  const [note, setNote] = useState('');
  if (!contact) return null;
  return <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={onClose} />}

      {/* Sidebar */}
      <div className={cn('fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto', isOpen ? 'translate-x-0' : 'translate-x-full')}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-start z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1B4F72] flex items-center justify-center text-xl font-bold">
              {contact.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {contact.name}
              </h2>
              <p className="text-sm text-slate-500">
                Added {contact.lastContact}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Contact Details */}
          <section className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-slate-400" />
                <span className="font-mono text-sm font-medium text-slate-700">
                  {contact.phone}
                </span>
              </div>
              <button className="text-slate-400 hover:text-[#1B4F72]">
                <Copy size={14} />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  {contact.email}
                </span>
              </div>
              <button className="text-slate-400 hover:text-[#1B4F72]">
                <Copy size={14} />
              </button>
            </div>
          </section>

          {/* Tags */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Tag size={16} className="text-slate-400" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {contact.tags.map((tag: string) => <span key={tag} className="px-2.5 py-1 rounded-full bg-blue-50 text-[#1B4F72] text-xs font-medium border border-blue-100">
                  {tag}
                </span>)}
              <button className="px-2.5 py-1 rounded-full border border-dashed border-slate-300 text-slate-500 text-xs font-medium hover:border-[#1B4F72] hover:text-[#1B4F72] flex items-center gap-1 transition-colors">
                <Plus size={12} />
                Add
              </button>
            </div>
          </section>

          {/* Interaction Timeline */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              Interaction Timeline
            </h3>
            <div className="space-y-4 relative pl-2">
              <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

              {[{
              type: 'call',
              date: 'Today, 10:42 AM',
              desc: 'Appointment Booked',
              by: 'Sally'
            }, {
              type: 'email',
              date: 'Yesterday, 2:15 PM',
              desc: 'Confirmation Sent',
              by: 'System'
            }, {
              type: 'note',
              date: 'Dec 12, 2025',
              desc: 'Patient requested morning slots only',
              by: 'Dr. Smith'
            }].map((event, i) => <div key={i} className="relative flex gap-3">
                  <div className="relative z-10 w-3 h-3 rounded-full bg-white border-2 border-slate-300 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {event.desc}
                    </p>
                    <p className="text-xs text-slate-500">
                      {event.date} • by {event.by}
                    </p>
                  </div>
                </div>)}
            </div>
          </section>

          {/* Notes */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MessageSquare size={16} className="text-slate-400" />
              Notes
            </h3>
            <div className="relative">
              <textarea className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] min-h-[100px] text-sm resize-none" placeholder="Add a note about this contact..." value={note} onChange={e => setNote(e.target.value)} />
              <div className="flex justify-end mt-2">
                <button className="px-3 py-1.5 bg-[#1B4F72] text-white text-xs font-medium rounded-md hover:bg-[#153e5a] transition-colors flex items-center gap-1" disabled={!note}>
                  <Save size={12} />
                  Save Note
                </button>
              </div>
            </div>
          </section>

          <button className="w-full py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm transition-colors">
            View Full Profile
          </button>
        </div>
      </div>
    </>;
}