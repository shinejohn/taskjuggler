import React, { useState, useEffect } from 'react';
import { 
  BotIcon, 
  WorkflowIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  PlayIcon, 
  SettingsIcon,
  BrainIcon,
  ZapIcon,
  UsersIcon,
  BarChart3Icon,
  FileTextIcon,
  TargetIcon,
  ArrowRightIcon,
  RefreshCwIcon,
  EyeIcon,
  DownloadIcon
} from 'lucide-react';

// Mock API service for development/testing
class MockApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  async post(endpoint: string, data: any) {
    console.log(`[MOCK API] POST ${endpoint}:`, data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock responses based on endpoint
    if (endpoint.includes('/bots/meeting-orchestrator-bot')) {
      return {
        data: {
          success: true,
          execution_id: `mock-exec-${Date.now()}`,
          result: {
            team_results: {
              'meeting-facilitator': { status: 'completed', output: 'Meeting facilitated successfully' },
              'notes-bot': { status: 'completed', output: 'Notes captured and organized' },
              'analytics-bot': { status: 'completed', output: 'Analytics generated' }
            },
            fae_team: 'meeting-facilitation-team'
          }
        }
      };
    }
    
    if (endpoint.includes('/scripts/templates')) {
      return {
        data: [
          { id: 'sales-discovery', name: 'Sales Discovery Script', description: 'Qualify leads and gather requirements' },
          { id: 'meeting-facilitation', name: 'Meeting Facilitation Script', description: 'Guide meeting flow and capture notes' },
          { id: 'presentation', name: 'Presentation Script', description: 'Present content and handle Q&A' }
        ]
      };
    }
    
    if (endpoint.includes('/meetings/') && endpoint.includes('/scripts/')) {
      return {
        data: {
          success: true,
          execution_id: `mock-script-${Date.now()}`,
          message: 'Script executed successfully'
        }
      };
    }
    
    // Default mock response
    return {
      data: {
        success: true,
        message: 'Mock API response',
        data: data
      }
    };
  }

  async get(endpoint: string) {
    console.log(`[MOCK API] GET ${endpoint}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (endpoint.includes('/meetings/') && endpoint.includes('/scripts/progress')) {
      return {
        data: {
          active: true,
          progress: {
            current_step: 2,
            total_steps: 5,
            percentage: 40,
            current_question: 'What are your main business challenges?',
            completed_questions: ['Company name', 'Industry']
          }
        }
      };
    }
    
    // Default mock response
    return {
      data: {
        success: true,
        message: 'Mock GET response'
      }
    };
  }
}

// Use mock API in development
const api = new MockApiService();

interface BotCapability {
  id: string;
  name: string;
  description: string;
  category: string;
  capabilities: string[];
  polly_enabled: boolean;
  polly_voice?: string;
  fae_engagements: string[];
  estimated_duration: number;
}

interface UserRequirement {
  id: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'mapped' | 'implemented';
  mapped_bots: string[];
  mapped_workflows: string[];
}

interface SolutionPlan {
  id: string;
  name: string;
  description: string;
  requirements: UserRequirement[];
  selected_bots: BotCapability[];
  workflow_steps: WorkflowStep[];
  estimated_completion_time: number;
  status: 'draft' | 'ready' | 'executing' | 'completed';
  execution_id?: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  bot_id: string;
  action: string;
  dependencies: string[];
  status: 'pending' | 'running' | 'completed' | 'error';
  result?: any;
}

interface FAESolutionBuilderProps {
  userIntent: string;
  meetingId?: string;
  userId: string;
  onSolutionComplete: (solution: SolutionPlan) => void;
}

export const FAESolutionBuilder: React.FC<FAESolutionBuilderProps> = ({
  userIntent,
  meetingId,
  userId,
  onSolutionComplete
}) => {
  const [availableBots, setAvailableBots] = useState<BotCapability[]>([]);
  const [currentSolution, setCurrentSolution] = useState<SolutionPlan | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'executing' | 'completed'>('idle');

  // Load available bots from FAE registry
  useEffect(() => {
    loadAvailableBots();
  }, []);

  // Analyze user intent when provided
  useEffect(() => {
    if (userIntent) {
      analyzeUserIntent(userIntent);
    }
  }, [userIntent]);

  const loadAvailableBots = async () => {
    try {
      // Mock bot configurations - in production this would call FAE registry
      const bots: BotCapability[] = [
        {
          id: 'meeting-facilitator',
          name: 'Meeting Facilitator Bot',
          description: 'Orchestrates meeting flow and guides participants with voice interaction',
          category: 'orchestration',
          capabilities: ['orchestrate', 'speak', 'facilitate'],
          polly_enabled: true,
          polly_voice: 'Joanna',
          fae_engagements: ['meeting-facilitation-workflow', 'engagement-monitor-agent', 'agenda-manager-agent'],
          estimated_duration: 300
        },
        {
          id: 'sales-discovery',
          name: 'Sales Discovery Bot',
          description: 'Qualifies leads and asks discovery questions with voice interaction',
          category: 'sales',
          capabilities: ['qualify', 'question', 'speak'],
          polly_enabled: true,
          polly_voice: 'Matthew',
          fae_engagements: ['sales-discovery-workflow', 'sales-qualification-agent', 'proposal-generator-agent'],
          estimated_duration: 600
        },
        {
          id: 'presenter',
          name: 'AI Presenter Bot',
          description: 'Presents content and handles Q&A with voice interaction',
          category: 'presentation',
          capabilities: ['present', 'speak', 'interactive'],
          polly_enabled: true,
          polly_voice: 'Joanna',
          fae_engagements: ['presentation-workflow', 'slide-manager-agent', 'interactive-poller-agent'],
          estimated_duration: 900
        },
        {
          id: 'notes',
          name: 'Notes Bot',
          description: 'Captures and organizes meeting notes',
          category: 'productivity',
          capabilities: ['capture', 'organize', 'summarize'],
          polly_enabled: false,
          fae_engagements: ['notes-extraction-workflow', 'action-item-extractor-agent'],
          estimated_duration: 180
        },
        {
          id: 'analytics',
          name: 'Analytics Bot',
          description: 'Analyzes meeting data and generates insights',
          category: 'analytics',
          capabilities: ['analyze', 'metrics', 'insights'],
          polly_enabled: false,
          fae_engagements: ['analytics-workflow', 'engagement-scorer-agent', 'sentiment-analyzer-agent'],
          estimated_duration: 240
        },
        {
          id: 'proposals',
          name: 'Proposals Bot',
          description: 'Generates business proposals',
          category: 'sales',
          capabilities: ['generate', 'format', 'export'],
          polly_enabled: false,
          fae_engagements: ['proposal-workflow', 'proposal-customizer-agent'],
          estimated_duration: 300
        }
      ];
      setAvailableBots(bots);
    } catch (error) {
      console.error('Failed to load available bots:', error);
    }
  };

  const analyzeUserIntent = async (intent: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate AI analysis with progress updates
      const analysisSteps = [
        "Parsing user requirements...",
        "Matching capabilities to available bots...",
        "Designing workflow sequence...",
        "Validating solution completeness...",
        "Generating execution plan..."
      ];

      for (let i = 0; i < analysisSteps.length; i++) {
        setAnalysisProgress((i + 1) * 20);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Generate solution based on intent
      const solution = await generateSolutionFromIntent(intent);
      setCurrentSolution(solution);

    } catch (error) {
      console.error('Error analyzing user intent:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSolutionFromIntent = async (intent: string): Promise<SolutionPlan> => {
    // Map user intent to requirements and bot capabilities
    const requirements = parseRequirementsFromIntent(intent);
    const selectedBots = matchBotsToRequirements(requirements);
    const workflowSteps = generateWorkflowSteps(selectedBots, requirements);

    return {
      id: `solution-${Date.now()}`,
      name: `Solution for: ${intent.substring(0, 50)}...`,
      description: `Automated solution using FAE bots for: ${intent}`,
      requirements,
      selected_bots: selectedBots,
      workflow_steps: workflowSteps,
      estimated_completion_time: calculateTotalTime(workflowSteps),
      status: 'draft'
    };
  };

  const parseRequirementsFromIntent = (intent: string): UserRequirement[] => {
    const requirements: UserRequirement[] = [];
    const intentLower = intent.toLowerCase();

    // Sales-related requirements
    if (intentLower.includes('sales') || intentLower.includes('qualify') || intentLower.includes('prospect')) {
      requirements.push({
        id: 'sales-qualification',
        description: 'Qualify leads and gather prospect information',
        category: 'sales',
        priority: 'high',
        status: 'pending',
        mapped_bots: ['sales-discovery'],
        mapped_workflows: ['sales-discovery-workflow']
      });
    }

    // Meeting facilitation requirements
    if (intentLower.includes('meeting') || intentLower.includes('facilitate') || intentLower.includes('guide')) {
      requirements.push({
        id: 'meeting-facilitation',
        description: 'Facilitate meeting flow and guide participants',
        category: 'orchestration',
        priority: 'high',
        status: 'pending',
        mapped_bots: ['meeting-facilitator'],
        mapped_workflows: ['meeting-facilitation-workflow']
      });
    }

    // Presentation requirements
    if (intentLower.includes('present') || intentLower.includes('demo') || intentLower.includes('show')) {
      requirements.push({
        id: 'presentation',
        description: 'Present content and handle interactive Q&A',
        category: 'presentation',
        priority: 'medium',
        status: 'pending',
        mapped_bots: ['presenter'],
        mapped_workflows: ['presentation-workflow']
      });
    }

    // Note-taking requirements
    if (intentLower.includes('notes') || intentLower.includes('capture') || intentLower.includes('record')) {
      requirements.push({
        id: 'note-capture',
        description: 'Capture and organize meeting notes and action items',
        category: 'productivity',
        priority: 'medium',
        status: 'pending',
        mapped_bots: ['notes'],
        mapped_workflows: ['notes-extraction-workflow']
      });
    }

    // Analytics requirements
    if (intentLower.includes('analyze') || intentLower.includes('insights') || intentLower.includes('metrics')) {
      requirements.push({
        id: 'analytics',
        description: 'Analyze meeting data and generate insights',
        category: 'analytics',
        priority: 'low',
        status: 'pending',
        mapped_bots: ['analytics'],
        mapped_workflows: ['analytics-workflow']
      });
    }

    // Proposal generation requirements
    if (intentLower.includes('proposal') || intentLower.includes('quote') || intentLower.includes('estimate')) {
      requirements.push({
        id: 'proposal-generation',
        description: 'Generate business proposals and quotes',
        category: 'sales',
        priority: 'high',
        status: 'pending',
        mapped_bots: ['proposals'],
        mapped_workflows: ['proposal-workflow']
      });
    }

    return requirements;
  };

  const matchBotsToRequirements = (requirements: UserRequirement[]): BotCapability[] => {
    const selectedBotIds = new Set<string>();
    requirements.forEach(req => {
      req.mapped_bots.forEach(botId => selectedBotIds.add(botId));
    });

    return availableBots.filter(bot => selectedBotIds.has(bot.id));
  };

  const generateWorkflowSteps = (bots: BotCapability[], requirements: UserRequirement[]): WorkflowStep[] => {
    const steps: WorkflowStep[] = [];
    let stepId = 1;

    // Generate steps based on bot capabilities and requirements
    bots.forEach(bot => {
      const botRequirements = requirements.filter(req => req.mapped_bots.includes(bot.id));
      
      botRequirements.forEach(req => {
        steps.push({
          id: `step-${stepId++}`,
          name: `${bot.name} - ${req.description}`,
          description: `Execute ${bot.name} for ${req.description}`,
          bot_id: bot.id,
          action: 'execute_fae_workflow',
          dependencies: [],
          status: 'pending'
        });
      });
    });

    return steps;
  };

  const calculateTotalTime = (steps: WorkflowStep[]): number => {
    return steps.reduce((total, step) => {
      const bot = availableBots.find(b => b.id === step.bot_id);
      return total + (bot?.estimated_duration || 0);
    }, 0);
  };

  const executeSolution = async () => {
    if (!currentSolution || !meetingId) return;

    setExecutionStatus('executing');
    setCurrentSolution(prev => prev ? { ...prev, status: 'executing' } : null);

    try {
      // Execute each workflow step
      for (let i = 0; i < currentSolution.workflow_steps.length; i++) {
        const step = currentSolution.workflow_steps[i];
        
        // Update step status
        setCurrentSolution(prev => {
          if (!prev) return null;
          const updatedSteps = [...prev.workflow_steps];
          updatedSteps[i] = { ...step, status: 'running' };
          return { ...prev, workflow_steps: updatedSteps };
        });

        // Execute the step via FAE orchestrator (using mock API)
        const result = await executeFAEStep(step, meetingId, userId);
        
        // Update step with result
        setCurrentSolution(prev => {
          if (!prev) return null;
          const updatedSteps = [...prev.workflow_steps];
          updatedSteps[i] = { 
            ...step, 
            status: result.success ? 'completed' : 'error',
            result: result
          };
          return { ...prev, workflow_steps: updatedSteps };
        });

        // Small delay between steps
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Mark solution as completed
      setCurrentSolution(prev => prev ? { ...prev, status: 'completed' } : null);
      setExecutionStatus('completed');
      onSolutionComplete(currentSolution);

    } catch (error) {
      console.error('Error executing solution:', error);
      setExecutionStatus('idle');
    }
  };

  const executeFAEStep = async (step: WorkflowStep, meetingId: string, userId: string) => {
    try {
      // Call the appropriate FAE orchestrator based on bot type
      const bot = availableBots.find(b => b.id === step.bot_id);
      if (!bot) throw new Error(`Bot ${step.bot_id} not found`);

      // Determine the FAE engagement to execute
      const faeEngagement = bot.fae_engagements[0]; // Use first engagement for now
      
      const payload = {
        action: 'execute_fae_workflow',
        meeting_id: meetingId,
        user_id: userId,
        engagement_id: faeEngagement,
        input_data: {
          step_id: step.id,
          step_description: step.description,
          bot_capabilities: bot.capabilities
        }
      };

      // Call the meeting orchestrator bot (using mock API)
      const response = await api.post('/bots/meeting-orchestrator-bot', payload);
      
      // Handle different response types
      const responseData = response.data as any;
      
      return {
        success: responseData.success || false,
        execution_id: responseData.execution_id || `mock-exec-${Date.now()}`,
        result: responseData.result || {},
        fae_engagement: faeEngagement
      };

    } catch (error) {
      console.error(`Error executing step ${step.id}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  const getBotIcon = (category: string) => {
    switch (category) {
      case 'orchestration': return <WorkflowIcon size={20} className="text-blue-500" />;
      case 'sales': return <TargetIcon size={20} className="text-green-500" />;
      case 'presentation': return <FileTextIcon size={20} className="text-purple-500" />;
      case 'productivity': return <CheckCircleIcon size={20} className="text-orange-500" />;
      case 'analytics': return <BarChart3Icon size={20} className="text-red-500" />;
      default: return <BotIcon size={20} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">FAE Solution Builder</h1>
            <p className="text-sm text-gray-600">Map user needs to FAE orchestrator APIs</p>
            <div className="mt-1 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
              🔧 MOCK MODE - Using simulated API responses
            </div>
          </div>
          <div className="flex space-x-2">
            {currentSolution && currentSolution.status === 'draft' && (
              <button
                onClick={executeSolution}
                disabled={!meetingId}
                className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                <PlayIcon size={16} />
                <span>Execute Solution</span>
              </button>
            )}
            <button className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
              <DownloadIcon size={16} />
              <span>Export Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center space-x-3">
            <RefreshCwIcon size={20} className="text-blue-600 animate-spin" />
            <div className="flex-1">
              <div className="flex justify-between text-sm text-blue-800 mb-1">
                <span>Analyzing user intent...</span>
                <span>{analysisProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentSolution ? (
          <div className="space-y-6">
            {/* Solution Overview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{currentSolution.name}</h2>
                  <p className="text-sm text-gray-600">{currentSolution.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Estimated Time</div>
                  <div className="text-lg font-bold text-gray-900">
                    {Math.round(currentSolution.estimated_completion_time / 60)} min
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <BotIcon size={16} className="mr-1" />
                  {currentSolution.selected_bots.length} bots
                </span>
                <span className="flex items-center">
                  <WorkflowIcon size={16} className="mr-1" />
                  {currentSolution.workflow_steps.length} steps
                </span>
                <span className="flex items-center">
                  <TargetIcon size={16} className="mr-1" />
                  {currentSolution.requirements.length} requirements
                </span>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">User Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentSolution.requirements.map((req) => (
                  <div key={req.id} className="border rounded-lg p-3 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{req.description}</h4>
                        <p className="text-sm text-gray-600 capitalize">{req.category}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        req.priority === 'high' ? 'bg-red-100 text-red-800' :
                        req.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {req.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Bots */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected FAE Bots</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentSolution.selected_bots.map((bot) => (
                  <div key={bot.id} className="border rounded-lg p-3 bg-white">
                    <div className="flex items-start space-x-3">
                      {getBotIcon(bot.category)}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{bot.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{bot.description}</p>
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 mb-1">Capabilities:</div>
                          <div className="flex flex-wrap gap-1">
                            {bot.capabilities.map((cap, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {cap}
                              </span>
                            ))}
                          </div>
                        </div>
                        {bot.polly_enabled && (
                          <div className="mt-2 text-xs text-green-600">
                            ✓ Voice enabled ({bot.polly_voice})
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Steps */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Execution Plan</h3>
              <div className="space-y-3">
                {currentSolution.workflow_steps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`border rounded-lg p-4 transition-all ${
                      step.status === 'running' ? 'border-blue-400 bg-blue-50' :
                      step.status === 'completed' ? 'border-green-400 bg-green-50' :
                      step.status === 'error' ? 'border-red-400 bg-red-50' :
                      'border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{step.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                            {step.status}
                          </span>
                        </div>
                        
                        {/* Step Details */}
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Bot:</span> {step.bot_id} | 
                          <span className="font-medium ml-2">Action:</span> {step.action}
                        </div>

                        {/* Step Result */}
                        {step.result && (
                          <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                            <div className="font-medium text-gray-700">Execution Result:</div>
                            <pre className="text-xs text-gray-600 mt-1">
                              {JSON.stringify(step.result, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <BrainIcon size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Solution Generated</h3>
              <p className="text-gray-600">Enter a user intent to generate a FAE solution</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAESolutionBuilder;