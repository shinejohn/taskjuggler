import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BotIcon, BarChart3Icon, TrendingUpIcon, FileTextIcon, DatabaseIcon, DownloadIcon, ShareIcon } from 'lucide-react';
import { NavigationMenu } from '../components/NavigationMenu';
import { FAESolutionBuilder } from '../components/FAESolutionBuilder';

export const DataReportCall = () => {
  const [currentView, setCurrentView] = useState<'reports' | 'fae-setup' | 'generating'>('reports');
  const [reportConfig, setReportConfig] = useState<any>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const handleFAESetup = (solution: any) => {
    setReportConfig(solution);
    setCurrentView('generating');
  };

  const generateReport = (reportType: string) => {
    setSelectedReport(reportType);
    setCurrentView('generating');
  };

  const reports = [
    { id: 'sales', name: 'Sales Performance', description: 'Revenue, conversions, and sales metrics' },
    { id: 'marketing', name: 'Marketing Analytics', description: 'Campaign performance and ROI' },
    { id: 'customer', name: 'Customer Insights', description: 'Behavior patterns and satisfaction' },
    { id: 'financial', name: 'Financial Summary', description: 'P&L, cash flow, and budget analysis' },
    { id: 'operational', name: 'Operational Metrics', description: 'Efficiency and productivity data' },
    { id: 'custom', name: 'Custom Report', description: 'Define your own report requirements' }
  ];

  // Report type to name mapping for GeneratingView
  const getReportName = (reportType: string | null): string => {
    if (!reportType) return 'Custom Report';
    const report = reports.find(r => r.id === reportType);
    return report?.name || 'Custom Report';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Reports</h1>
            <p className="text-sm text-gray-600">AI-powered analytics and insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <NavigationMenu />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'reports' && (
          <ReportsView 
            reports={reports}
            onGenerateReport={generateReport}
            onFAESetup={() => setCurrentView('fae-setup')}
          />
        )}
        
        {currentView === 'fae-setup' && (
          <FAESetupView 
            onSolutionComplete={handleFAESetup}
            onBackToReports={() => setCurrentView('reports')}
          />
        )}
        
        {currentView === 'generating' && (
          <GeneratingView 
            reportType={selectedReport}
            reportName={getReportName(selectedReport)}
            config={reportConfig}
            onBackToReports={() => setCurrentView('reports')}
          />
        )}
      </div>
    </div>
  );
};

// Reports View
interface ReportsViewProps {
  reports: Array<{ id: string; name: string; description: string }>;
  onGenerateReport: (reportType: string) => void;
  onFAESetup: () => void;
}

const ReportsView: React.FC<ReportsViewProps> = ({ reports, onGenerateReport, onFAESetup }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Reports Header */}
      <div className="bg-blue-50 border-b border-blue-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3Icon size={24} className="text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-blue-900">Available Reports</h2>
              <p className="text-sm text-blue-700">Choose a report type or create a custom one</p>
            </div>
          </div>
          <button
            onClick={onFAESetup}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <BotIcon size={16} />
            <span>FAE Custom Report</span>
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3Icon size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Last updated: 2 hours ago
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <ShareIcon size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <DownloadIcon size={16} />
                    </button>
                    <button
                      onClick={() => onGenerateReport(report.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Reports */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
            <div className="bg-white rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Q4 Sales Analysis</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Sales</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 hours ago</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Complete</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">View</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Marketing ROI Report</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">Marketing</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 day ago</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Complete</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">View</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// FAE Setup View
interface FAESetupViewProps {
  onSolutionComplete: (solution: any) => void;
  onBackToReports: () => void;
}

const FAESetupView: React.FC<FAESetupViewProps> = ({ onSolutionComplete, onBackToReports }) => {
  return (
    <div className="h-full flex flex-col">
      {/* FAE Setup Header */}
      <div className="bg-purple-50 border-b border-purple-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BotIcon size={24} className="text-purple-600" />
            <div>
              <h2 className="text-lg font-semibold text-purple-900">FAE Custom Report</h2>
              <p className="text-sm text-purple-700">Create a custom report with AI assistance</p>
            </div>
          </div>
          <button
            onClick={onBackToReports}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Reports
          </button>
        </div>
      </div>

      {/* FAE Builder */}
      <div className="flex-1 overflow-hidden">
        <FAESolutionBuilder
          userIntent="I need to create a custom data report. Help me analyze data sources, generate insights, and create visualizations."
          meetingId="report-generation"
          userId="current-user"
          onSolutionComplete={onSolutionComplete}
        />
      </div>
    </div>
  );
};

// Generating View
interface GeneratingViewProps {
  reportType: string | null;
  reportName: string;
  config: any;
  onBackToReports: () => void;
}

const GeneratingView: React.FC<GeneratingViewProps> = ({ reportType, reportName, config, onBackToReports }) => {

  return (
    <div className="h-full flex flex-col">
      {/* Generating Header */}
      <div className="bg-green-50 border-b border-green-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3Icon size={24} className="text-green-600" />
            <div>
              <h2 className="text-lg font-semibold text-green-900">Generating Report</h2>
              <p className="text-sm text-green-700">{reportName}</p>
            </div>
          </div>
          <button
            onClick={onBackToReports}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Reports
          </button>
        </div>
      </div>

      {/* Generating Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {config ? (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">FAE-Powered Report Generation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{config.selected_bots.length}</div>
                  <div className="text-sm text-gray-600">AI Bots</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{config.workflow_steps.length}</div>
                  <div className="text-sm text-gray-600">Processing Steps</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg text-gray-700 mb-4">
                  AI is analyzing data sources and generating insights
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">75% complete</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Standard Report Generation</h3>
              <div className="text-center">
                <div className="text-lg text-gray-700 mb-4">
                  Generating {reportName} using standard templates
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">50% complete</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};