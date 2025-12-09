import React from 'react';
import { MessageSquareIcon, CalendarIcon, MapPinIcon, BellIcon, BrainIcon, UsersIcon } from 'lucide-react';
export function Features() {
  const features = [{
    icon: <MessageSquareIcon size={24} className="text-blue-600" />,
    title: 'Clear Accountability',
    description: 'Every task has a Requestor and Owner/Do-er with defined roles and expectations.'
  }, {
    icon: <CalendarIcon size={24} className="text-blue-600" />,
    title: 'Do-er Controls Timeline',
    description: 'Do-ers set their own start dates and completion times for realistic commitments.'
  }, {
    icon: <MapPinIcon size={24} className="text-blue-600" />,
    title: 'Context-Rich Tasks',
    description: 'Include addresses with maps, phone numbers, and email contacts in every task.'
  }, {
    icon: <BellIcon size={24} className="text-blue-600" />,
    title: 'Smart Reminders',
    description: 'AI-optimized notifications ensure nothing falls through the cracks.'
  }, {
    icon: <BrainIcon size={24} className="text-blue-600" />,
    title: 'AI-Powered Assistant',
    description: 'Converts emails, texts, and voice messages into structured tasks automatically.'
  }, {
    icon: <UsersIcon size={24} className="text-blue-600" />,
    title: 'Seamless Collaboration',
    description: 'Send tasks to anyone using just their email or phone number.'
  }];
  return <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Features That Make Task Management Effortless
          </h2>
          <p className="text-xl text-gray-700">
            Task Juggler combines powerful features with intuitive design to
            transform how you collaborate.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4 bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>)}
        </div>
      </div>
    </section>;
}