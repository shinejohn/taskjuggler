import React from 'react';
import { X, Calendar, Clock, Phone, Mail, User, CheckCircle, AlertCircle, XCircle, Play } from 'lucide-react';
import { cn } from '../../lib/utils';
interface AppointmentModalProps {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
}
export function AppointmentModal({
  appointment,
  isOpen,
  onClose
}: AppointmentModalProps) {
  if (!isOpen || !appointment) return null;
  return <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-in fade-in duration-200" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg pointer-events-auto animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex justify-between items-start p-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium', appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' : appointment.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600')}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1B4F72] text-xs font-medium">
                  {appointment.type}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {appointment.name}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Time */}
            <div className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                <Clock size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-900">
                  {appointment.time} - {appointment.endTime}
                </div>
                <div className="text-sm text-slate-500">
                  Wednesday, Dec 15, 2025
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-slate-400" />
                  <span className="font-medium text-slate-700">
                    (555) 234-5678
                  </span>
                </div>
                <button className="text-xs font-medium text-[#1B4F72] hover:underline">
                  Call
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-slate-400" />
                  <span className="font-medium text-slate-700">
                    john@email.com
                  </span>
                </div>
                <button className="text-xs font-medium text-[#1B4F72] hover:underline">
                  Email
                </button>
              </div>
            </div>

            {/* Coordinator & Booking Info */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-xs">
                  {appointment.coordinator.charAt(0)}
                </div>
                <div>
                  <div className="text-slate-500 text-xs">Booked by</div>
                  <div className="font-medium text-slate-900">
                    {appointment.coordinator}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-slate-500 text-xs">Booked on</div>
                <div className="font-medium text-slate-900">
                  Dec 12 at 2:34 PM
                </div>
              </div>
            </div>

            {/* Recording Link */}
            <button className="flex items-center gap-2 text-sm font-medium text-[#1B4F72] hover:underline">
              <Play size={14} fill="currentColor" />
              Listen to booking call
            </button>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-100 flex flex-wrap gap-3">
            <button className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
              <CheckCircle size={18} />
              Confirm
            </button>
            <button className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
              Reschedule
            </button>
            <button className="py-2.5 px-4 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors" title="Cancel Appointment">
              <XCircle size={18} />
            </button>
            <button className="py-2.5 px-4 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors" title="Mark No-Show">
              <AlertCircle size={18} />
            </button>
          </div>
        </div>
      </div>
    </>;
}