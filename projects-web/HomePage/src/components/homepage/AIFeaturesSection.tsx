import React from 'react';
import { Card } from '../ui/Card';
export function AIFeaturesSection() {
  const features = [{
    emoji: '🧠',
    title: 'Smart Assignment',
    description: 'AI suggests the best owner based on skills, workload, and past performance.',
    color: 'from-purple-400 to-pink-400'
  }, {
    emoji: '✨',
    title: 'NLP Task Extraction',
    description: 'Natural language processing pulls tasks, due dates, and priorities from any message.',
    color: 'from-cyan-400 to-blue-400'
  }, {
    emoji: '📈',
    title: 'Predictive Analytics',
    description: 'Get early warnings on tasks at risk of going overdue before they become problems.',
    color: 'from-green-400 to-teal-400'
  }, {
    emoji: '💡',
    title: 'AI-Suggested Answers',
    description: 'Intelligent suggestions in Question Forum based on project history and documentation.',
    color: 'from-yellow-400 to-orange-400'
  }];
  return <section className="py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Intelligence Built In, Not Bolted On ✨
          </h2>
          <p className="text-xl text-slate-600">
            AI that actually helps—from task creation to project completion.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => <Card key={index} className={`p-6 bg-gradient-to-br ${feature.color} text-white shadow-xl`} hover>
              <div className="text-5xl mb-4">{feature.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-white/90 leading-relaxed">
                {feature.description}
              </p>
            </Card>)}
        </div>
      </div>
    </section>;
}