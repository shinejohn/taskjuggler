import React, { useState } from 'react';
import { Card } from '../ui/Card';
export function ProductViewsSection() {
  const [activeTab, setActiveTab] = useState('list');
  const tabs = [{
    id: 'list',
    label: 'List View'
  }, {
    id: 'kanban',
    label: 'Kanban Board'
  }, {
    id: 'gantt',
    label: 'Gantt Chart'
  }, {
    id: 'calendar',
    label: 'Calendar'
  }, {
    id: 'dashboard',
    label: 'Dashboard'
  }];
  return <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            See Your Work, Your Way
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {tab.label}
            </button>)}
        </div>

        <Card className="w-full aspect-[16/9] bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-slate-500">
              Interactive mockup of the{' '}
              {tabs.find(t => t.id === activeTab)?.label.toLowerCase()}{' '}
              interface
            </p>
          </div>
        </Card>
      </div>
    </section>;
}