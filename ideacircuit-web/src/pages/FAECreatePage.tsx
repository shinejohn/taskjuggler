import React, { useState } from 'react';
import { 
  BotIcon, 
  WorkflowIcon, 
  BrainIcon, 
  MessageSquareIcon,
  PlayIcon,
  SettingsIcon,
  UsersIcon,
  BarChart3Icon,
  FileTextIcon,
  TargetIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  AlertCircleIcon
} from 'lucide-react';
import { FAESolutionBuilder } from '../components/FAESolutionBuilder';

interface FAECreatePageProps {
  userId: string;
  meetingId?: string;
}

export const FAECreatePage: React.FC<FAECreatePageProps> = ({ userId, meetingId }) => {
  const [currentView, setCurrentView] = useState<'intent' | 'solution' | 'execution'>('intent');
  const [userIntent, setUserIntent] = useState('');
  const [currentSolution, setCurrentSolution] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleIntentSubmit = (intent: string) => {
    setUserIntent(intent);
    setCurrentView('solution');
  };

  const handleSolutionComplete = (solution: any) => {
    setCurrentSolution(solution);
    setCurrentView('execution');
  };

  const handleStartExecution = () => {
    setIsExecuting(true);
    // Execution will be handled by FAESolutionBuilder
  };

  const getViewIcon = (view: string) => {
    switch (view) {
      case 'intent': return <BrainIcon size={20} className="text-blue-500" />;
      case 'solution': return <WorkflowIcon size={20} className="text-purple-500" />;
      case 'execution': return <PlayIcon size={20} className="text-green-500" />;
      default: return <BotIcon size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create FAE Solution</h1>
            <p className="text-sm text-gray-600">Map user needs to FAE orchestrator APIs and Lambda processes</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Meeting: {meetingId || 'Not specified'}
            </div>
            <div className="text-sm text-gray-600">
              User: {userId}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mt-4 flex items-center space-x-4">
          {[
            { id: 'intent', label: 'Define Intent', active: currentView === 'intent' },
            { id: 'solution', label: 'Generate Solution', active: currentView === 'solution' },
            { id: 'execution', label: 'Execute Solution', active: currentView === 'execution' }
          ].map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                step.active ? 'bg-blue-100 text-blue-800' : 'text-gray-500'
              }`}>
                {getViewIcon(step.id)}
                <span className="text-sm font-medium">{step.label}</span>
              </div>
              {index < 2 && (
                <ArrowRightIcon size={16} className="text-gray-400 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'intent' && (
          <IntentCaptureView 
            onIntentSubmit={handleIntentSubmit}
            userId={userId}
            meetingId={meetingId}
          />
        )}
        
        {currentView === 'solution' && (
          <FAESolutionBuilder
            userIntent={userIntent}
            meetingId={meetingId}
            userId={userId}
            onSolutionComplete={handleSolutionComplete}
          />
        )}
        
        {currentView === 'execution' && currentSolution && (
          <ExecutionView 
            solution={currentSolution}
            userId={userId}
            meetingId={meetingId}
          />
        )}
      </div>
    </div>
  );
};

// Intent Capture View
interface IntentCaptureViewProps {
  onIntentSubmit: (intent: string) => void;
  userId: string;
  meetingId?: string;
}

const IntentCaptureView: React.FC<IntentCaptureViewProps> = ({ 
  onIntentSubmit, 
  userId, 
  meetingId 
}) => {
  const [intent, setIntent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'sales', label: 'Sales & Discovery', icon: <TargetIcon size={20} />, description: 'Qualify leads, generate proposals, sales processes' },
    { id: 'meeting', label: 'Meeting Facilitation', icon: <UsersIcon size={20} />, description: 'Guide meetings, manage agendas, facilitate discussions' },
    { id: 'presentation', label: 'Presentations', icon: <FileTextIcon size={20} />, description: 'Create presentations, handle Q&A, interactive demos' },
    { id: 'productivity', label: 'Productivity', icon: <CheckCircleIcon size={20} />, description: 'Note-taking, action items, task management' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3Icon size={20} />, description: 'Data analysis, insights, performance metrics' },
    { id: 'custom', label: 'Custom Solution', icon: <SettingsIcon size={20} />, description: 'Define your own specific requirements' }
  ];

  const handleSubmit = async () => {
    if (!intent.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Add category context to intent
      const fullIntent = selectedCategory ? 
        `[${selectedCategory}] ${intent}` : 
        intent;
      
      onIntentSubmit(fullIntent);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Instructions */}
      <div className="bg-blue-50 border-b border-blue-200 p-4">
        <div className="flex items-start space-x-3">
          <BrainIcon size={24} className="text-blue-600 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Define Your Solution Intent</h2>
            <p className="text-sm text-blue-700 mt-1">
              Describe what you want to accomplish. The FAE system will map your needs to the appropriate bots and workflows.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Category Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Solution Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    selectedCategory === category.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`${selectedCategory === category.id ? 'text-blue-600' : 'text-gray-500'}`}>
                      {category.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{category.label}</h4>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Intent Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Describe Your Intent</h3>
            <textarea
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="Describe what you want to accomplish... For example: 'I need to qualify leads for our new product launch and generate proposals for qualified prospects'"
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="mt-2 text-sm text-gray-600">
              Be specific about your goals, target audience, and expected outcomes.
            </div>
          </div>

          {/* Context Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Context Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700">User ID</div>
                <div className="text-sm text-gray-600">{userId}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700">Meeting ID</div>
                <div className="text-sm text-gray-600">{meetingId || 'Not specified'}</div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!intent.trim() || isSubmitting}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md text-white font-medium ${
                intent.trim() && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <BrainIcon size={16} />
                  <span>Generate Solution</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Execution View
interface ExecutionViewProps {
  solution: any;
  userId: string;
  meetingId?: string;
}

const ExecutionView: React.FC<ExecutionViewProps> = ({ solution, userId, meetingId }) => {
  const [executionStatus, setExecutionStatus] = useState<'ready' | 'executing' | 'completed'>('ready');

  const handleStartExecution = () => {
    setExecutionStatus('executing');
    // Execution logic would be handled by FAESolutionBuilder
  };

  return (
    <div className="h-full flex flex-col">
      {/* Execution Header */}
      <div className="bg-green-50 border-b border-green-200 p-4">
        <div className="flex items-start space-x-3">
          <PlayIcon size={24} className="text-green-600 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-green-900">Solution Ready for Execution</h2>
            <p className="text-sm text-green-700 mt-1">
              Your solution has been mapped to FAE bots and workflows. Ready to execute.
            </p>
          </div>
        </div>
      </div>

      {/* Execution Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Solution Summary */}
          <div className="bg-white rounded-lg border p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Solution Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{solution.selected_bots.length}</div>
                <div className="text-sm text-gray-600">FAE Bots</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{solution.workflow_steps.length}</div>
                <div className="text-sm text-gray-600">Workflow Steps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.round(solution.estimated_completion_time / 60)}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
            </div>
          </div>

          {/* Execution Controls */}
          <div className="text-center">
            <button
              onClick={handleStartExecution}
              disabled={executionStatus !== 'ready'}
              className={`px-8 py-4 rounded-lg text-white font-medium text-lg ${
                executionStatus === 'ready'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {executionStatus === 'ready' && (
                <>
                  <PlayIcon size={20} className="inline mr-2" />
                  Execute Solution
                </>
              )}
              {executionStatus === 'executing' && (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline mr-2"></div>
                  Executing...
                </>
              )}
              {executionStatus === 'completed' && (
                <>
                  <CheckCircleIcon size={20} className="inline mr-2" />
                  Solution Completed
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAECreatePage;



