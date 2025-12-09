import React, { Fragment } from 'react';
import { Check, X } from 'lucide-react';
interface PlanComparisonProps {
  planType: 'individual' | 'team' | 'provider';
}
export function PlanComparison({
  planType
}: PlanComparisonProps) {
  const individualFeatures = [{
    category: 'Task Management',
    features: [{
      name: 'Open personal tasks',
      free: '5 maximum',
      pro: 'Unlimited'
    }, {
      name: 'Marketplace task requests',
      free: 'Unlimited',
      pro: 'Unlimited'
    }, {
      name: 'Task organization',
      free: 'Basic',
      pro: 'Advanced'
    }, {
      name: 'Task templates',
      free: false,
      pro: true
    }, {
      name: 'Task attachments',
      free: '5MB per task',
      pro: '100MB per task'
    }]
  }, {
    category: 'AI Features',
    features: [{
      name: 'AI task optimization',
      free: false,
      pro: true
    }, {
      name: 'AI task prioritization',
      free: false,
      pro: true
    }, {
      name: 'Smart deadline suggestions',
      free: false,
      pro: true
    }, {
      name: 'AI task organization',
      free: false,
      pro: true
    }]
  }, {
    category: 'Productivity',
    features: [{
      name: 'Time tracking',
      free: false,
      pro: true
    }, {
      name: 'Productivity analytics',
      free: false,
      pro: true
    }, {
      name: 'Calendar integrations',
      free: false,
      pro: true
    }, {
      name: 'Notifications',
      free: 'Basic email',
      pro: 'Advanced (email, push, SMS)'
    }, {
      name: 'Offline access',
      free: false,
      pro: true
    }]
  }, {
    category: 'Marketplace',
    features: [{
      name: 'Marketplace access',
      free: true,
      pro: true
    }, {
      name: 'Priority matching',
      free: false,
      pro: true
    }, {
      name: 'Preferred pricing',
      free: false,
      pro: true
    }]
  }, {
    category: 'Support',
    features: [{
      name: 'Support',
      free: 'Community',
      pro: 'Email support'
    }, {
      name: 'Onboarding',
      free: 'Self-service',
      pro: 'Guided setup'
    }]
  }];
  const renderCheckOrX = (value: boolean | string) => {
    if (value === true) {
      return <Check size={20} className="mx-auto text-green-500" />;
    }
    if (value === false) {
      return <X size={20} className="mx-auto text-red-500" />;
    }
    return <span className="text-sm text-gray-900">{value}</span>;
  };
  return <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                Feature
              </th>
              <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                Personal Free
              </th>
              <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                Personal Pro
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {individualFeatures.map((category, categoryIndex) => <Fragment key={categoryIndex}>
                <tr className="bg-gray-100">
                  <td colSpan={3} className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    {category.category}
                  </td>
                </tr>
                {category.features.map((feature, featureIndex) => <tr key={`${categoryIndex}-${featureIndex}`} className={featureIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {feature.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {renderCheckOrX(feature.free)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {renderCheckOrX(feature.pro)}
                    </td>
                  </tr>)}
              </Fragment>)}
          </tbody>
        </table>
      </div>
    </div>;
}