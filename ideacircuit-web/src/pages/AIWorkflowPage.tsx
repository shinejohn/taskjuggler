import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BotIcon, BarChart3Icon, TrendingUpIcon, FileTextIcon, DatabaseIcon, UsersIcon, CalendarIcon, FolderIcon, UserIcon } from 'lucide-react';
import { NavigationMenu } from '../components/NavigationMenu';
import { FAESolutionBuilder } from '../components/FAESolutionBuilder';

export const AIWorkflowPage = () => {
  const [currentView, setCurrentView] = useState<'overview' | 'fae-builder' | 'workflow'>('overview');
  const [userIntent, setUserIntent] = useState('');
  const [currentSolution, setCurrentSolution] = useState<any>(null);

  const handleIntentSubmit = (intent: string) => {
    setUserIntent(intent);
    setCurrentView('fae-builder');
  };

  const handleSolutionComplete = (solution: any) => {
    setCurrentSolution(solution);
    setCurrentView('workflow');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Workflow</h1>
            <p className="text-sm text-gray-600">Design and execute AI-powered workflows</p>
          </div>
          <div className="flex items-center space-x-4">
            <NavigationMenu />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'overview' && (
          <WorkflowOverviewView 
            onIntentSubmit={handleIntentSubmit}
            onStartWorkflow={() => setCurrentView('workflow')}
          />
        )}
        
        {currentView === 'fae-builder' && (
          <FAESolutionBuilder
            userIntent={userIntent}
            meetingId="workflow-session"
            userId="current-user"
            onSolutionComplete={handleSolutionComplete}
          />
        )}
        
        {currentView === 'workflow' && (
          <WorkflowExecutionView 
            solution={currentSolution}
            onBackToSetup={() => setCurrentView('overview')}
          />
        )}
      </div>
    </div>
  );
};

// Workflow Overview View
interface WorkflowOverviewViewProps {
  onIntentSubmit: (intent: string) => void;
  onStartWorkflow: () => void;
}

const WorkflowOverviewView: React.FC<WorkflowOverviewViewProps> = ({ 
  onIntentSubmit, 
  onStartWorkflow 
}) => {
  const [intent, setIntent] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const workflowTypes = [
    { id: 'data-pipeline', label: 'Data Pipeline', description: 'Process and analyze data streams' },
    { id: 'ml-training', label: 'ML Training', description: 'Train machine learning models' },
    { id: 'automation', label: 'Process Automation', description: 'Automate business processes' },
    { id: 'integration', label: 'System Integration', description: 'Connect different systems' },
    { id: 'custom', label: 'Custom Workflow', description: 'Define your own workflow' }
  ];

  const handleSubmit = () => {
    if (!intent.trim()) return;
    
    const fullIntent = selectedType ? 
      `[${selectedType}] ${intent}` : 
      intent;
    
    onIntentSubmit(fullIntent);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Instructions */}
      <div className="bg-purple-50 border-b border-purple-200 p-4">
        <div className="flex items-start space-x-3">
          <BarChart3Icon size={24} className="text-purple-600 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-purple-900">Design Your AI Workflow</h2>
            <p className="text-sm text-purple-700 mt-1">
              Describe your workflow requirements and let FAE create an AI-powered solution.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Workflow Type Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Workflow Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {workflowTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    selectedType === type.id 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`${selectedType === type.id ? 'text-purple-600' : 'text-gray-500'}`}>
                      <BarChart3Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{type.label}</h4>
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Intent Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Workflow Requirements</h3>
            <textarea
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="Describe your workflow requirements... For example: 'I need to process customer data, train a recommendation model, and deploy it to production'"
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
            <div className="mt-2 text-sm text-gray-600">
              Be specific about data sources, processing steps, and expected outputs.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={onStartWorkflow}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              <BarChart3Icon size={16} />
              <span>Start Basic Workflow</span>
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={!intent.trim()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md text-white font-medium ${
                intent.trim()
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <BotIcon size={16} />
              <span>Create FAE Solution</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Workflow Execution View
interface WorkflowExecutionViewProps {
  solution: any;
  onBackToSetup: () => void;
}

const WorkflowExecutionView: React.FC<WorkflowExecutionViewProps> = ({ solution, onBackToSetup }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Workflow Header */}
      <div className="bg-green-50 border-b border-green-200 p-4">
        <div className="flex items-start space-x-3">
          <BarChart3Icon size={24} className="text-green-600 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-green-900">Workflow Active</h2>
            <p className="text-sm text-green-700 mt-1">
              {solution ? 'FAE-powered workflow running' : 'Basic workflow mode'}
            </p>
          </div>
        </div>
      </div>

      {/* Workflow Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {solution ? (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">FAE Workflow Solution Active</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{solution.selected_bots.length}</div>
                  <div className="text-sm text-gray-600">AI Bots</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{solution.workflow_steps.length}</div>
                  <div className="text-sm text-gray-600">Workflow Steps</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{Math.round(solution.estimated_completion_time / 60)}</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg text-gray-700 mb-4">AI workflow is running with automated processing</div>
                <button
                  onClick={onBackToSetup}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Back to Setup
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Workflow Mode</h3>
              <div className="text-center">
                <div className="text-lg text-gray-700 mb-4">Standard workflow without AI assistance</div>
                <button
                  onClick={onBackToSetup}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Back to Setup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};