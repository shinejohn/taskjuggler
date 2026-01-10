import React, { useState, useEffect } from 'react';
import { 
  MapIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  ArrowRightIcon, 
  PlayIcon, 
  PauseIcon,
  RefreshCwIcon,
  BrainIcon,
  ZapIcon,
  SettingsIcon,
  EyeIcon,
  DownloadIcon
} from 'lucide-react';

interface FlowStep {
  id: string;
  name: string;
  description: string;
  type: 'input' | 'processing' | 'output' | 'validation' | 'integration';
  status: 'pending' | 'active' | 'completed' | 'error';
  dependencies: string[];
  aiScripts: string[];
  estimatedDuration: number;
  requiredInputs: string[];
  expectedOutputs: string[];
}

interface UserFlow {
  id: string;
  name: string;
  description: string;
  steps: FlowStep[];
  currentStep: number;
  completionPercentage: number;
  status: 'draft' | 'active' | 'completed' | 'failed';
  createdAt: Date;
  lastModified: Date;
}

interface UserFlowMapperProps {
  userIntent: string;
  onFlowComplete: (flow: UserFlow) => void;
  onSolutionGenerated: (solution: any) => void;
}

export const UserFlowMapper: React.FC<UserFlowMapperProps> = ({
  userIntent,
  onFlowComplete,
  onSolutionGenerated
}) => {
  const [currentFlow, setCurrentFlow] = useState<UserFlow | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [flowValidation, setFlowValidation] = useState<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  }>({ isValid: false, issues: [], suggestions: [] });

  // Analyze user intent and generate flow
  useEffect(() => {
    if (userIntent) {
      analyzeUserIntent(userIntent);
    }
  }, [userIntent]);

  const analyzeUserIntent = async (intent: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAiInsights([]);

    try {
      // Simulate AI analysis with progress updates
      const analysisSteps = [
        "Analyzing user intent...",
        "Identifying required capabilities...",
        "Mapping data dependencies...",
        "Determining integration points...",
        "Validating solution completeness...",
        "Generating optimized flow..."
      ];

      for (let i = 0; i < analysisSteps.length; i++) {
        setAiInsights(prev => [...prev, analysisSteps[i]]);
        setAnalysisProgress((i + 1) * 16.67);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Generate flow based on intent
      const generatedFlow = await generateFlowFromIntent(intent);
      setCurrentFlow(generatedFlow);
      
      // Validate the generated flow
      const validation = await validateFlow(generatedFlow);
      setFlowValidation(validation);

    } catch (error) {
      console.error('Error analyzing user intent:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateFlowFromIntent = async (intent: string): Promise<UserFlow> => {
    // This would integrate with AI service to generate flow
    // For now, creating a template based on common patterns
    
    const flowSteps: FlowStep[] = [
      {
        id: 'intent-analysis',
        name: 'Intent Analysis',
        description: 'Parse and understand user requirements',
        type: 'processing',
        status: 'completed',
        dependencies: [],
        aiScripts: ['intent-parser', 'requirement-extractor'],
        estimatedDuration: 30,
        requiredInputs: ['user_intent'],
        expectedOutputs: ['parsed_requirements', 'capability_mapping']
      },
      {
        id: 'capability-mapping',
        name: 'Capability Mapping',
        description: 'Map requirements to available bot capabilities',
        type: 'processing',
        status: 'active',
        dependencies: ['intent-analysis'],
        aiScripts: ['capability-matcher', 'bot-selector'],
        estimatedDuration: 45,
        requiredInputs: ['parsed_requirements'],
        expectedOutputs: ['selected_bots', 'workflow_structure']
      },
      {
        id: 'workflow-design',
        name: 'Workflow Design',
        description: 'Create optimized workflow structure',
        type: 'processing',
        status: 'pending',
        dependencies: ['capability-mapping'],
        aiScripts: ['workflow-optimizer', 'dependency-resolver'],
        estimatedDuration: 60,
        requiredInputs: ['selected_bots', 'workflow_structure'],
        expectedOutputs: ['workflow_definition', 'execution_plan']
      },
      {
        id: 'integration-setup',
        name: 'Integration Setup',
        description: 'Configure integrations and data flows',
        type: 'integration',
        status: 'pending',
        dependencies: ['workflow-design'],
        aiScripts: ['integration-builder', 'api-connector'],
        estimatedDuration: 90,
        requiredInputs: ['workflow_definition'],
        expectedOutputs: ['integration_config', 'api_endpoints']
      },
      {
        id: 'validation-testing',
        name: 'Validation & Testing',
        description: 'Test solution completeness and functionality',
        type: 'validation',
        status: 'pending',
        dependencies: ['integration-setup'],
        aiScripts: ['solution-validator', 'test-generator'],
        estimatedDuration: 45,
        requiredInputs: ['integration_config'],
        expectedOutputs: ['test_results', 'validation_report']
      },
      {
        id: 'deployment',
        name: 'Deployment',
        description: 'Deploy solution to production environment',
        type: 'output',
        status: 'pending',
        dependencies: ['validation-testing'],
        aiScripts: ['deployment-manager', 'monitoring-setup'],
        estimatedDuration: 30,
        requiredInputs: ['test_results'],
        expectedOutputs: ['deployed_solution', 'monitoring_dashboard']
      }
    ];

    return {
      id: `flow-${Date.now()}`,
      name: `Solution for: ${intent.substring(0, 50)}...`,
      description: `Automated solution generation for: ${intent}`,
      steps: flowSteps,
      currentStep: 1,
      completionPercentage: 16.67,
      status: 'active',
      createdAt: new Date(),
      lastModified: new Date()
    };
  };

  const validateFlow = async (flow: UserFlow) => {
    // Simulate AI validation
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for missing dependencies
    flow.steps.forEach(step => {
      step.dependencies.forEach(depId => {
        const depStep = flow.steps.find(s => s.id === depId);
        if (!depStep) {
          issues.push(`Step "${step.name}" depends on missing step "${depId}"`);
        }
      });
    });

    // Check for circular dependencies
    const hasCircularDeps = checkCircularDependencies(flow.steps);
    if (hasCircularDeps) {
      issues.push('Circular dependencies detected in workflow');
    }

    // Check for missing inputs/outputs
    flow.steps.forEach(step => {
      if (step.requiredInputs.length === 0 && step.type !== 'input') {
        suggestions.push(`Step "${step.name}" should specify required inputs`);
      }
      if (step.expectedOutputs.length === 0 && step.type !== 'output') {
        suggestions.push(`Step "${step.name}" should specify expected outputs`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  };

  const checkCircularDependencies = (steps: FlowStep[]): boolean => {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (stepId: string): boolean => {
      if (recursionStack.has(stepId)) return true;
      if (visited.has(stepId)) return false;

      visited.add(stepId);
      recursionStack.add(stepId);

      const step = steps.find(s => s.id === stepId);
      if (step) {
        for (const dep of step.dependencies) {
          if (hasCycle(dep)) return true;
        }
      }

      recursionStack.delete(stepId);
      return false;
    };

    for (const step of steps) {
      if (hasCycle(step.id)) return true;
    }
    return false;
  };

  const executeFlow = async () => {
    if (!currentFlow) return;

    setCurrentFlow(prev => prev ? { ...prev, status: 'active' } : null);

    for (let i = 0; i < currentFlow.steps.length; i++) {
      const step = currentFlow.steps[i];
      
      // Update current step
      setCurrentFlow(prev => {
        if (!prev) return null;
        const updatedSteps = [...prev.steps];
        updatedSteps[i] = { ...step, status: 'active' };
        return {
          ...prev,
          currentStep: i,
          completionPercentage: ((i + 1) / prev.steps.length) * 100
        };
      });

      // Simulate step execution
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mark step as completed
      setCurrentFlow(prev => {
        if (!prev) return null;
        const updatedSteps = [...prev.steps];
        updatedSteps[i] = { ...step, status: 'completed' };
        return {
          ...prev,
          steps: updatedSteps,
          completionPercentage: ((i + 1) / prev.steps.length) * 100
        };
      });
    }

    // Flow completed
    setCurrentFlow(prev => prev ? { ...prev, status: 'completed' } : null);
    onFlowComplete(currentFlow);
  };

  const getStepIcon = (type: FlowStep['type']) => {
    switch (type) {
      case 'input': return <ArrowRightIcon size={16} className="text-blue-500" />;
      case 'processing': return <BrainIcon size={16} className="text-purple-500" />;
      case 'output': return <ZapIcon size={16} className="text-green-500" />;
      case 'validation': return <CheckCircleIcon size={16} className="text-yellow-500" />;
      case 'integration': return <SettingsIcon size={16} className="text-orange-500" />;
      default: return <MapIcon size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: FlowStep['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'active': return 'text-blue-600 bg-blue-100';
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
            <h1 className="text-xl font-bold text-gray-900">User Flow Mapper</h1>
            <p className="text-sm text-gray-600">AI-assisted solution generation</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => currentFlow && executeFlow()}
              disabled={!currentFlow || currentFlow.status === 'active'}
              className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              <PlayIcon size={16} />
              <span>Execute Flow</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
              <DownloadIcon size={16} />
              <span>Export</span>
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
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-2 space-y-1">
            {aiInsights.map((insight, index) => (
              <div key={index} className="text-sm text-blue-700">
                ✓ {insight}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flow Validation */}
      {flowValidation.issues.length > 0 && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <div className="flex items-start space-x-2">
            <AlertCircleIcon size={20} className="text-red-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Flow Validation Issues</h3>
              <ul className="mt-1 space-y-1">
                {flowValidation.issues.map((issue, index) => (
                  <li key={index} className="text-sm text-red-700">• {issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentFlow ? (
          <div className="space-y-4">
            {/* Flow Overview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{currentFlow.name}</h2>
                  <p className="text-sm text-gray-600">{currentFlow.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Completion</div>
                  <div className="text-lg font-bold text-gray-900">
                    {Math.round(currentFlow.completionPercentage)}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentFlow.completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Flow Steps */}
            <div className="space-y-3">
              {currentFlow.steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`border rounded-lg p-4 transition-all ${
                    step.status === 'active' ? 'border-blue-400 bg-blue-50' :
                    step.status === 'completed' ? 'border-green-400 bg-green-50' :
                    step.status === 'error' ? 'border-red-400 bg-red-50' :
                    'border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getStepIcon(step.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{step.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                            {step.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {step.estimatedDuration}s
                          </span>
                        </div>
                      </div>
                      
                      {/* AI Scripts */}
                      <div className="mt-2">
                        <div className="text-xs text-gray-500 mb-1">AI Scripts:</div>
                        <div className="flex flex-wrap gap-1">
                          {step.aiScripts.map((script, scriptIndex) => (
                            <span 
                              key={scriptIndex}
                              className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                            >
                              {script}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Dependencies */}
                      {step.dependencies.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 mb-1">Depends on:</div>
                          <div className="flex flex-wrap gap-1">
                            {step.dependencies.map((dep, depIndex) => (
                              <span 
                                key={depIndex}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {dep}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <MapIcon size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Flow Generated</h3>
              <p className="text-gray-600">Enter a user intent to generate a solution flow</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFlowMapper;



