import React from 'react';
import { X, AlertTriangle, Zap, ChartBar } from 'lucide-react';
interface UpgradePromptProps {
  trigger: 'task-limit' | 'ai-features' | 'productivity' | 'collaboration';
  onClose: () => void;
  onUpgrade: () => void;
}
export function UpgradePrompt({
  trigger,
  onClose,
  onUpgrade
}: UpgradePromptProps) {
  const getPromptContent = () => {
    switch (trigger) {
      case 'task-limit':
        return {
          icon: <AlertTriangle size={24} className="text-yellow-500" />,
          title: "You have 5 open tasks - that's your limit!",
          description: 'Need to create more tasks? Complete some existing ones or upgrade to Personal Pro for unlimited tasks.',
          features: ['Unlimited open tasks', 'AI task prioritization and optimization', 'Advanced productivity features'],
          primaryButton: 'Upgrade Now - $8/month',
          secondaryButton: 'Complete existing tasks first'
        };
      case 'ai-features':
        return {
          icon: <Zap size={24} className="text-purple-500" />,
          title: 'Want AI to help organize your tasks?',
          description: 'Personal Pro includes powerful AI features to boost your productivity.',
          features: ['AI task prioritization (focus on what matters)', 'Smart deadline suggestions', 'Automated task organization'],
          primaryButton: 'Get AI Features - Upgrade',
          secondaryButton: 'Continue manual management'
        };
      case 'productivity':
        return {
          icon: <ChartBar size={24} className="text-blue-500" />,
          title: 'Curious about your productivity patterns?',
          description: 'Unlock detailed analytics and insights with Personal Pro.',
          features: ['Detailed productivity analytics', 'Time tracking across all tasks', 'Custom productivity reports', 'Calendar integration for better planning'],
          primaryButton: 'See My Productivity Stats - Upgrade',
          secondaryButton: 'Maybe later'
        };
      case 'collaboration':
        return {
          icon: <Users size={24} className="text-green-500" />,
          title: 'Sharing tasks with others?',
          description: 'Team plans enable seamless collaboration and shared resources.',
          features: ['Real team collaboration', 'Shared marketplace budget ($50/month included)', 'Team project management'],
          primaryButton: 'Start Team Trial',
          secondaryButton: 'Invite team members to see features'
        };
      default:
        return {
          icon: <Zap size={24} className="text-blue-500" />,
          title: 'Upgrade to unlock premium features',
          description: 'Get more out of TaskJuggler with our premium plans.',
          features: ['Unlimited tasks', 'AI-powered features', 'Advanced analytics'],
          primaryButton: 'Upgrade Now',
          secondaryButton: 'Maybe later'
        };
    }
  };
  const content = getPromptContent();
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <div className="flex items-center">
            {content.icon}
            <h3 className="text-lg font-semibold text-gray-900 ml-2">
              {content.title}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-4">
          <p className="text-gray-600 mb-4">{content.description}</p>
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
            <h4 className="font-medium text-blue-800 mb-2">
              Personal Pro includes:
            </h4>
            <ul className="space-y-2">
              {content.features.map((feature, index) => <li key={index} className="flex items-start">
                  <Check size={18} className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-blue-800">{feature}</span>
                </li>)}
            </ul>
          </div>
          <div className="flex flex-col space-y-3">
            <button onClick={onUpgrade} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
              {content.primaryButton}
            </button>
            <button onClick={onClose} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md">
              {content.secondaryButton}
            </button>
          </div>
        </div>
      </div>
    </div>;
}
import { Users, Check } from 'lucide-react';