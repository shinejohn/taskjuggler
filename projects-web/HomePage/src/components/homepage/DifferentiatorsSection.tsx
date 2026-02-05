import React from 'react';
import { Card } from '../ui/Card';
export function DifferentiatorsSection() {
  const features = [{
    title: 'Crystal-Clear Accountability',
    headline: 'Requestor/Owner Model',
    description: "Every task has a Requestor who defines the work and an Owner who delivers it. No more confusion about who asked for what or who's responsible.",
    badge: 'Unique to 4 Projects'
  }, {
    title: 'Every Action, Logged Forever',
    headline: 'Complete Audit Trail',
    description: 'Full compliance-ready history of every task creation, assignment, status change, and completion. Know exactly what happened and when.'
  }, {
    title: 'Your Data, Never Locked In',
    headline: 'Task Exchange Format (TEF)',
    description: 'Our open Task Exchange Format means you can export everything—tasks, history, attachments—and take it anywhere. We earn your loyalty, not trap it.',
    badge: 'Open Standard'
  }, {
    title: 'Capture Uncertainty, Find Answers',
    headline: 'Question Forum',
    description: 'Built-in forum lets teams ask questions, vote on answers, and convert decisions into tasks. AI suggests answers from your project history.'
  }];
  return <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Built Different. Works Better.
          </h2>
          <p className="text-xl text-slate-600">
            We rethought project management from first principles.
          </p>
        </div>

        <div className="space-y-16">
          {features.map((feature, index) => <div key={index} className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1 space-y-4">
                <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
                  {feature.headline}
                </span>
                <h3 className="text-3xl font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
                {feature.badge && <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-sm font-medium">
                    {feature.badge}
                  </span>}
              </div>
              <div className="flex-1 w-full">
                <Card className="h-80 w-full bg-white border border-slate-200 shadow-xl flex items-center justify-center">
                  <p className="text-slate-400 font-medium">
                    Feature Visualization
                  </p>
                </Card>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
}