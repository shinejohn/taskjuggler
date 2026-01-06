import React, { useState } from 'react';
import { Save, Upload, X, Plus, Copy, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
export function BusinessProfile() {
  const [sameAsPhysical, setSameAsPhysical] = useState(true);
  const [businessHours, setBusinessHours] = useState([{
    day: 'Monday',
    open: true,
    start: '09:00',
    end: '17:00'
  }, {
    day: 'Tuesday',
    open: true,
    start: '09:00',
    end: '17:00'
  }, {
    day: 'Wednesday',
    open: true,
    start: '09:00',
    end: '17:00'
  }, {
    day: 'Thursday',
    open: true,
    start: '09:00',
    end: '17:00'
  }, {
    day: 'Friday',
    open: true,
    start: '09:00',
    end: '17:00'
  }, {
    day: 'Saturday',
    open: false,
    start: '09:00',
    end: '17:00'
  }, {
    day: 'Sunday',
    open: false,
    start: '09:00',
    end: '17:00'
  }]);
  const [services, setServices] = useState(['Teeth Cleaning', 'Root Canal', 'Whitening', 'Dental Exam']);
  return <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#1B4F72]">
            Business Profile
          </h1>
          <p className="text-slate-500 mt-1">
            This information helps your Coordinators represent your business
            accurately
          </p>
        </div>
        <button className="px-5 py-2.5 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input type="text" defaultValue="ABC Dental Practice" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Business Type/Industry
            </label>
            <select className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white">
              <option>Dental Practice</option>
              <option>Plumbing</option>
              <option>Restaurant</option>
              <option>Legal Services</option>
              <option>Medical Office</option>
              <option>Auto Repair</option>
              <option>Salon & Spa</option>
              <option>Real Estate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Year Established
            </label>
            <input type="number" defaultValue="2015" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Business Description
            </label>
            <textarea rows={3} defaultValue="We provide comprehensive dental care for the whole family in a comfortable, modern environment." className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Number of Employees
            </label>
            <select className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white">
              <option>1-5</option>
              <option>6-10</option>
              <option>11-25</option>
              <option>26-50</option>
              <option>50+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Primary Phone
            </label>
            <input type="tel" defaultValue="(555) 123-4567" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Secondary Phone <span className="text-slate-400">(optional)</span>
            </label>
            <input type="tel" placeholder="(555) 234-5678" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input type="email" defaultValue="contact@abcdental.com" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Website URL
            </label>
            <input type="url" defaultValue="https://abcdental.com" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold text-slate-900 mb-3 mt-2">
              Physical Address
            </h3>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Street Address
            </label>
            <input type="text" defaultValue="123 Main Street" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Suite/Unit <span className="text-slate-400">(optional)</span>
            </label>
            <input type="text" placeholder="Suite 200" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              City
            </label>
            <input type="text" defaultValue="Tampa" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              State
            </label>
            <select className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white">
              <option>FL</option>
              <option>CA</option>
              <option>NY</option>
              <option>TX</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ZIP Code
            </label>
            <input type="text" defaultValue="33602" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={sameAsPhysical} onChange={e => setSameAsPhysical(e.target.checked)} className="rounded border-slate-300 text-[#1B4F72] focus:ring-[#1B4F72]" />
              <span className="text-sm text-slate-600">
                Mailing address same as physical address
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Business Hours</h2>
          <button className="text-sm text-[#1B4F72] hover:underline font-medium flex items-center gap-1">
            <Copy size={14} />
            Copy to all weekdays
          </button>
        </div>
        <div className="space-y-3">
          {businessHours.map((day, i) => <div key={i} className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-3 font-medium text-slate-700">
                {day.day}
              </div>
              <div className="col-span-2">
                <button onClick={() => {
              const newHours = [...businessHours];
              newHours[i].open = !newHours[i].open;
              setBusinessHours(newHours);
            }} className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', day.open ? 'bg-[#1B4F72]' : 'bg-slate-200')}>
                  <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', day.open ? 'translate-x-6' : 'translate-x-1')} />
                </button>
              </div>
              {day.open ? <>
                  <div className="col-span-3">
                    <input type="time" value={day.start} className="w-full px-2 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
                  </div>
                  <div className="col-span-1 text-center text-slate-400">
                    to
                  </div>
                  <div className="col-span-3">
                    <input type="time" value={day.end} className="w-full px-2 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]" />
                  </div>
                </> : <div className="col-span-7 text-sm text-slate-400">Closed</div>}
            </div>)}
        </div>
      </div>

      {/* Services Offered */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Services Offered
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          These help your Coordinator answer "What services do you offer?"
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {services.map((service, i) => <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#1B4F72] rounded-full text-sm font-medium">
              {service}
              <button onClick={() => setServices(services.filter((_, idx) => idx !== i))} className="hover:text-red-600">
                <X size={14} />
              </button>
            </div>)}
          <button className="inline-flex items-center gap-1 px-3 py-1.5 border-2 border-dashed border-slate-300 text-slate-600 rounded-full text-sm font-medium hover:border-[#1B4F72] hover:text-[#1B4F72] transition-colors">
            <Plus size={14} />
            Add service
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
        <p className="text-sm text-slate-500">
          Last updated: Jan 2, 2026 at 3:45 PM
        </p>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-colors">
            Discard Changes
          </button>
          <button className="px-5 py-2.5 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>;
}