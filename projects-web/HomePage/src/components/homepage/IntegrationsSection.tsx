import React from 'react';
export function IntegrationsSection() {
  const partners = ['Slack', 'Microsoft Teams', 'Twilio', 'Zapier', 'Google Workspace', 'Microsoft 365', 'GitHub', 'Jira'];
  return <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Works With Your Stack
        </h2>
        <p className="text-xl text-slate-600 mb-12">
          Plus our open API and TEF standard connect to anything.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {partners.map((partner, index) => <div key={index} className="flex items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all duration-300">
              <span className="text-lg font-bold text-slate-400">
                {partner}
              </span>
            </div>)}
        </div>
      </div>
    </section>;
}