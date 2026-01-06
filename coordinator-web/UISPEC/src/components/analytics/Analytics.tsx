import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, TrendingDown, Phone, CheckCircle, Clock, Star, Lightbulb } from 'lucide-react';
import { cn } from '../../lib/utils';
export function Analytics() {
  const [dateRange, setDateRange] = useState('30days');
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-heading font-bold text-[#1B4F72]">
          Analytics
        </h1>
        <div className="flex gap-3">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {[{
            id: '7days',
            label: '7 Days'
          }, {
            id: '30days',
            label: '30 Days'
          }, {
            id: '90days',
            label: '90 Days'
          }].map(range => <button key={range.id} onClick={() => setDateRange(range.id)} className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-all', dateRange === range.id ? 'bg-white text-[#1B4F72] shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
                {range.label}
              </button>)}
          </div>
          <button className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[{
        label: 'Total Calls',
        value: '2,847',
        change: '+12%',
        trend: 'up',
        icon: Phone
      }, {
        label: 'Appointments',
        value: '892',
        change: '+8%',
        trend: 'up',
        icon: CheckCircle
      }, {
        label: 'Answer Rate',
        value: '94%',
        change: '+2%',
        trend: 'up',
        icon: TrendingUp
      }, {
        label: 'Avg Duration',
        value: '2:34',
        change: '-0:15',
        trend: 'down',
        icon: Clock
      }, {
        label: 'Satisfaction',
        value: '4.7/5',
        change: '+0.2',
        trend: 'up',
        icon: Star
      }].map((metric, i) => <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-blue-50 text-[#1B4F72] rounded-lg">
                <metric.icon size={16} />
              </div>
              <span className="text-xs font-medium text-slate-500">
                {metric.label}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold text-slate-900">
                {metric.value}
              </div>
              <div className={cn('flex items-center gap-1 text-xs font-medium', metric.trend === 'up' ? 'text-green-600' : 'text-red-600')}>
                {metric.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {metric.change}
              </div>
            </div>
          </div>)}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Volume Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-[#1B4F72] mb-4">Call Volume</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[45, 52, 48, 65, 58, 72, 68, 55, 62, 70, 65, 58, 63, 75].map((height, i) => <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gradient-to-t from-[#1B4F72] to-blue-400 rounded-t-sm hover:opacity-80 transition-opacity cursor-pointer" style={{
              height: `${height}%`
            }} title={`Day ${i + 1}: ${Math.round(height * 1.5)} calls`} />
                  {i % 2 === 0 && <span className="text-[10px] text-slate-400">{i + 1}</span>}
                </div>)}
          </div>
          <div className="flex justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#1B4F72]"></div>
              <span className="text-slate-600">Total</span>
            </div>
          </div>
        </div>

        {/* Outcomes Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-[#1B4F72] mb-4">
            Outcomes Breakdown
          </h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              {/* Simple donut chart using conic-gradient */}
              <div className="w-full h-full rounded-full" style={{
              background: `conic-gradient(
                    from 0deg,
                    #10B981 0% 32%,
                    #3B82F6 32% 60%,
                    #F59E0B 60% 75%,
                    #94A3B8 75% 87%,
                    #64748B 87% 95%,
                    #E2E8F0 95% 100%
                  )`
            }}>
                <div className="absolute inset-0 m-auto w-28 h-28 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      2,847
                    </div>
                    <div className="text-xs text-slate-500">Total</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mt-4">
            {[{
            label: 'Appt Booked',
            value: '32%',
            color: 'bg-green-500'
          }, {
            label: 'Info Provided',
            value: '28%',
            color: 'bg-blue-500'
          }, {
            label: 'Transferred',
            value: '15%',
            color: 'bg-amber-500'
          }, {
            label: 'Voicemail',
            value: '12%',
            color: 'bg-slate-400'
          }, {
            label: 'No Answer',
            value: '8%',
            color: 'bg-slate-500'
          }, {
            label: 'Other',
            value: '5%',
            color: 'bg-slate-300'
          }].map((item, i) => <div key={i} className="flex items-center gap-2">
                <div className={cn('w-2 h-2 rounded-full', item.color)}></div>
                <span className="text-slate-600">
                  {item.label}:{' '}
                  <span className="font-medium text-slate-900">
                    {item.value}
                  </span>
                </span>
              </div>)}
          </div>
        </div>

        {/* Calls by Hour */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-[#1B4F72] mb-4">
            Calls by Hour
          </h3>
          <div className="h-64 flex items-end justify-between gap-1">
            {[20, 35, 55, 75, 85, 90, 80, 70, 60, 50, 40, 30].map((height, i) => <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-[#F59E0B] rounded-t hover:bg-[#D97706] transition-colors cursor-pointer" style={{
              height: `${height}%`
            }} title={`${8 + i}:00 - ${Math.round(height * 1.2)} calls`} />
                  <span className="text-[10px] text-slate-400 -rotate-45 origin-top-left mt-2">
                    {8 + i}
                  </span>
                </div>)}
          </div>
          <div className="text-center mt-6 text-xs text-slate-500">
            Peak hours: 10-11 AM
          </div>
        </div>

        {/* Coordinator Performance */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-[#1B4F72] mb-4">
            Coordinator Performance
          </h3>
          <div className="space-y-4">
            {[{
            name: 'Sally',
            calls: 1247,
            success: 89,
            color: 'bg-blue-500'
          }, {
            name: 'Ed',
            calls: 892,
            success: 94,
            color: 'bg-green-500'
          }, {
            name: 'Marcus',
            calls: 456,
            success: 87,
            color: 'bg-purple-500'
          }].map((coord, i) => <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center text-xs font-bold">
                      {coord.name.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-900">
                      {coord.name}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">
                    {coord.calls} calls •{' '}
                    <span className="font-medium text-green-600">
                      {coord.success}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', coord.color)} style={{
                width: `${coord.success}%`
              }} />
                </div>
              </div>)}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Days */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-[#1B4F72] mb-4">
            Top Performing Days
          </h3>
          <div className="space-y-3">
            {[{
            date: 'Monday, Dec 15',
            calls: 247,
            booked: 89,
            rate: 36
          }, {
            date: 'Wednesday, Dec 17',
            calls: 235,
            booked: 82,
            rate: 35
          }, {
            date: 'Friday, Dec 19',
            calls: 228,
            booked: 75,
            rate: 33
          }, {
            date: 'Tuesday, Dec 16',
            calls: 215,
            booked: 68,
            rate: 32
          }].map((day, i) => <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="font-medium text-slate-900">{day.date}</div>
                  <div className="text-xs text-slate-500">
                    {day.calls} calls • {day.booked} booked
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {day.rate}%
                  </div>
                  <div className="text-xs text-slate-500">booking rate</div>
                </div>
              </div>)}
          </div>
        </div>

        {/* Recent Trends */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-[#1B4F72] mb-4 flex items-center gap-2">
            <Lightbulb size={20} className="text-amber-500" />
            Recent Trends
          </h3>
          <div className="space-y-4">
            {[{
            insight: 'Call volume up 15% on Mondays',
            type: 'positive'
          }, {
            insight: 'Ed has highest confirmation rate at 94%',
            type: 'positive'
          }, {
            insight: 'Peak hours shifted to 10-11 AM',
            type: 'neutral'
          }, {
            insight: 'Answer rate improved 2% this week',
            type: 'positive'
          }].map((trend, i) => <div key={i} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', trend.type === 'positive' ? 'bg-green-500' : 'bg-blue-500')} />
                <p className="text-sm text-slate-700">{trend.insight}</p>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}