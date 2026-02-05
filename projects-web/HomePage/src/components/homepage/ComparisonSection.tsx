import React from 'react';
export function ComparisonSection() {
  const features = [{
    name: 'Voice Task Creation',
    us: true,
    others: [false, false, false, false]
  }, {
    name: 'SMS Integration',
    us: true,
    others: [false, false, false, false]
  }, {
    name: 'Task Exchange Format',
    us: true,
    others: [false, false, false, false]
  }, {
    name: 'Question Forum',
    us: true,
    others: [false, false, false, false]
  }, {
    name: 'Requestor/Owner Model',
    us: true,
    others: [false, false, true, false]
  }, {
    name: 'Complete Audit Trail',
    us: true,
    others: [true, true, true, true]
  }];
  const competitors = ['Asana', 'Monday', 'Jira', 'Wrike'];
  return <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Why Teams Switch to 4 Projects
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr>
                <th className="p-4 text-left text-slate-500 font-medium">
                  Feature
                </th>
                <th className="p-4 text-center bg-indigo-50 rounded-t-xl">
                  <span className="text-indigo-600 font-bold text-lg">
                    4 Projects
                  </span>
                </th>
                {competitors.map(comp => <th key={comp} className="p-4 text-center text-slate-500 font-medium">
                    {comp}
                  </th>)}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => <tr key={index} className="border-b border-slate-200">
                  <td className="p-4 text-slate-900 font-medium">
                    {feature.name}
                  </td>
                  <td className="p-4 text-center bg-indigo-50">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        ✓
                      </div>
                    </div>
                  </td>
                  {feature.others.map((val, i) => <td key={i} className="p-4 text-center text-slate-400">
                      {val ? '✓' : '—'}
                    </td>)}
                </tr>)}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-12">
          <p className="text-xl font-medium text-slate-900">
            Stop fighting your tools. Start shipping your work.
          </p>
        </div>
      </div>
    </section>;
}