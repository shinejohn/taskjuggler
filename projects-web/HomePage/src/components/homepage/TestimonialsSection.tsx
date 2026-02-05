import React from 'react';
import { Card } from '../ui/Card';
export function TestimonialsSection() {
  const testimonials = [{
    quote: 'The ability to create tasks via voice while driving between sites has completely changed how our field team operates. Nothing gets forgotten anymore.',
    name: 'Sarah Jenkins',
    title: 'Operations Director',
    company: 'BuildRight Construction'
  }, {
    quote: 'Finally, a tool that understands accountability. The Requestor/Owner model cleared up so much confusion in our distributed engineering team.',
    name: 'David Chen',
    title: 'VP of Engineering',
    company: 'TechFlow Systems'
  }, {
    quote: 'We were drowning in Slack messages. 4 Projects.ai turned that noise into structured work without us having to change our habits.',
    name: 'Elena Rodriguez',
    title: 'Product Manager',
    company: 'Streamline Digital'
  }];
  return <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Teams Love 4 Projects
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((t, index) => <Card key={index} className="p-8" hover>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full" />
                <div>
                  <div className="font-bold text-slate-900">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.title}</div>
                  <div className="text-sm text-indigo-600 font-medium">
                    {t.company}
                  </div>
                </div>
              </div>
            </Card>)}
        </div>

        <div className="border-t border-slate-200 pt-16">
          <p className="text-center text-sm font-medium text-slate-500 mb-8 uppercase tracking-widest">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 w-32 bg-slate-300 rounded" />)}
          </div>
        </div>
      </div>
    </section>;
}