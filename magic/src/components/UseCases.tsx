import React, { useState } from 'react';
import { BriefcaseIcon, HomeIcon, HeartPulseIcon, UsersIcon, CodeIcon } from 'lucide-react';
export function UseCases() {
  const [activeTab, setActiveTab] = useState('professional');
  const tabs = [{
    id: 'professional',
    label: 'Professional Services',
    icon: <BriefcaseIcon size={20} />
  }, {
    id: 'home',
    label: 'Home Services',
    icon: <HomeIcon size={20} />
  }, {
    id: 'healthcare',
    label: 'Healthcare',
    icon: <HeartPulseIcon size={20} />
  }, {
    id: 'personal',
    label: 'Personal',
    icon: <UsersIcon size={20} />
  }, {
    id: 'api',
    label: 'API Integration',
    icon: <CodeIcon size={20} />
  }];
  const content = {
    professional: {
      title: 'Professional Services',
      description: 'Streamline client communications and deliverables with clear accountability.',
      steps: ['Attorney emails task to client: "Review and sign retainer agreement"', 'Client receives task and sets completion date: "Friday 5pm"', 'AI sends smart reminders as deadline approaches', 'Client completes task and attorney is automatically notified', 'Attorney sends follow-up task: "Schedule consultation"', 'AI handles scheduling conflicts and confirms appointment'],
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    home: {
      title: 'Home Services',
      description: 'Coordinate repairs and maintenance with complete clarity on timing and location.',
      steps: ['Homeowner texts plumber: "My bathroom is leaking"', 'Plumber receives task with map link to home address', 'Plumber sets start date: "Tuesday 2pm" and completion: "Tuesday 4pm"', 'Homeowner gets automatic notification of scheduled time', 'Plumber updates: "Running 30 mins late" with one tap', 'Work completed and invoice sent through the platform'],
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    healthcare: {
      title: 'Healthcare',
      description: 'Improve patient experience with clear appointment scheduling and follow-up.',
      steps: ['Receptionist creates task for patient: "Schedule follow-up appointment"', 'Doctor sends task to patient: "Complete pre-visit questionnaire"', 'Patient sets completion date: "Day before appointment"', 'AI reminds patient based on their chosen timeline', 'System sends appointment reminder with clinic location', 'AI schedules follow-up based on visit notes'],
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    personal: {
      title: 'Friends & Family',
      description: 'Coordinate personal tasks and events without the confusion.',
      steps: ['Parent sends voice message: "Can someone pick up groceries?"', 'Teen accepts task and sets timeline: "After school, 4pm"', 'AI creates task with store address automatically included', 'Parent sees updated timeline in real-time', '"Help me move this weekend" sent to multiple friends', 'Each sets their available times and AI coordinates best time'],
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    },
    api: {
      title: 'API Integration',
      description: 'Connect Task Juggler to your existing systems for seamless workflow.',
      steps: ['CRM system creates task via API: "Follow up with lead"', 'Sales rep receives task and sets timeline: "Tomorrow 10am"', 'Requestor notified of timeline through webhook', 'AI monitors progress and updates CRM automatically', 'Dispatch system sends service calls with customer info', 'Technician sets arrival window and customer is notified'],
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    }
  };
  const activeContent = content[activeTab as keyof typeof content];
  return <section id="use-cases" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Task Juggler in Action
          </h2>
          <p className="text-xl text-gray-700">
            See how Task Juggler transforms workflows across different
            scenarios.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center mb-8 gap-2">
            {tabs.map(tab => <button key={tab.id} className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => setActiveTab(tab.id)}>
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>)}
          </div>
          {/* Content */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gray-300 relative">
                  <img src={activeContent.image} alt={activeContent.title} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="md:w-1/2 p-6 md:p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {activeContent.title}
                </h3>
                <p className="text-gray-700 mb-6">
                  {activeContent.description}
                </p>
                <ol className="space-y-3">
                  {activeContent.steps.map((step, index) => <li key={index} className="flex">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>)}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}