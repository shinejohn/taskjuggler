import React, { useState, useEffect } from 'react';
import { BarChartIcon, PieChartIcon, TableIcon, ChevronDownIcon, DownloadIcon, RefreshCwIcon } from 'lucide-react';
import api from '../services/api';

interface AnalyticsData {
  overview: {
    meetingCount: number;
    totalDuration: string;
    participantCount: number;
    aiAssistance: {
      questionsAnswered: number;
      actionsCompleted: number;
      notesGenerated: number;
    };
    topicDistribution: Array<{
      name: string;
      percentage: number;
    }>;
  };
  meetings: Array<{
    id: number;
    title: string;
    date: string;
    duration: string;
    participants: number;
    topics: string[];
  }>;
  insights: Array<{
    id: number;
    title: string;
    description: string;
    metric?: string;
    trend?: 'up' | 'down' | 'neutral';
    topics?: string[];
  }>;
}

export const DataReportPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/ideacircuit/analytics?timeRange=${timeRange}`);
      const analyticsData = response.data.data || response.data;
      setData(analyticsData);
    } catch (err: any) {
      console.error('Error loading analytics:', err);
      setError(err.response?.data?.message || 'Failed to load analytics data');
      // Set empty data structure on error
      setData({
        overview: {
          meetingCount: 0,
          totalDuration: '0h 0m',
          participantCount: 0,
          aiAssistance: {
            questionsAnswered: 0,
            actionsCompleted: 0,
            notesGenerated: 0
          },
          topicDistribution: []
        },
        meetings: [],
        insights: []
      });
    } finally {
      setLoading(false);
    }
  };

  const BarChart: React.FC<{ data: Array<{ name: string; percentage: number }> }> = ({ data }) => (
    <div className="mt-4 space-y-3">
      {data.map(item => (
        <div key={item.name}>
          <div className="flex justify-between text-body-medium mb-1">
            <span className="text-text-primary">{item.name}</span>
            <span className="font-medium text-text-primary">{item.percentage}%</span>
          </div>
          <div className="w-full bg-bg-tertiary rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-normal" 
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-text-secondary text-body-medium">Loading analytics...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-destructive text-body-medium mb-2">{error}</div>
          <button 
            onClick={loadAnalytics}
            className="bg-primary text-white px-5 py-3 rounded-md min-h-[44px] text-label font-medium hover:bg-primary-hover transition-colors duration-fast"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-text-secondary text-body-medium">No data available</div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Key metrics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="glass-standard rounded-lg p-6 shadow-1">
                <div className="text-text-secondary text-body-small mb-1">Total Meetings</div>
                <div className="text-display-medium font-bold text-text-primary">
                  {data.overview.meetingCount}
                </div>
              </div>
              <div className="glass-standard rounded-lg p-6 shadow-1">
                <div className="text-text-secondary text-body-small mb-1">Meeting Duration</div>
                <div className="text-display-medium font-bold text-text-primary">
                  {data.overview.totalDuration}
                </div>
              </div>
              <div className="glass-standard rounded-lg p-6 shadow-1">
                <div className="text-text-secondary text-body-small mb-1">Participants</div>
                <div className="text-display-medium font-bold text-text-primary">
                  {data.overview.participantCount}
                </div>
              </div>
              <div className="glass-standard rounded-lg p-6 shadow-1">
                <div className="text-text-secondary text-body-small mb-1">AI Assistance Rate</div>
                <div className="text-display-medium font-bold text-text-primary">93%</div>
              </div>
            </div>
            
            {/* AI Assistance breakdown */}
            <div className="glass-standard rounded-lg p-6 shadow-1">
              <h3 className="text-headline font-semibold mb-4 text-text-primary">AI Assistance</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-text-secondary text-body-small">Questions Answered</div>
                  <div className="text-title-large font-bold mt-1 text-text-primary">
                    {data.overview.aiAssistance.questionsAnswered}
                  </div>
                </div>
                <div>
                  <div className="text-text-secondary text-body-small">Actions Completed</div>
                  <div className="text-title-large font-bold mt-1 text-text-primary">
                    {data.overview.aiAssistance.actionsCompleted}
                  </div>
                </div>
                <div>
                  <div className="text-text-secondary text-body-small">Notes Generated</div>
                  <div className="text-title-large font-bold mt-1 text-text-primary">
                    {data.overview.aiAssistance.notesGenerated}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Topic Distribution */}
            <div className="glass-standard rounded-lg p-6 shadow-1">
              <h3 className="text-headline font-semibold mb-4 text-text-primary">Topic Distribution</h3>
              <BarChart data={data.overview.topicDistribution} />
            </div>
          </div>
        );

      case 'meetings':
        return (
          <div className="glass-standard rounded-lg overflow-hidden shadow-1">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-label font-medium text-text-secondary uppercase tracking-wider">
                    Meeting
                  </th>
                  <th className="px-6 py-3 text-left text-label font-medium text-text-secondary uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-label font-medium text-text-secondary uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-label font-medium text-text-secondary uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-label font-medium text-text-secondary uppercase tracking-wider">
                    Topics
                  </th>
                </tr>
              </thead>
              <tbody className="bg-bg-primary divide-y divide-border-subtle">
                {data.meetings.map(meeting => (
                  <tr key={meeting.id} className="hover:bg-bg-secondary transition-colors duration-fast">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-text-primary text-body-medium">
                        {meeting.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-body-small text-text-secondary">
                      {meeting.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-body-small text-text-secondary">
                      {meeting.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-body-small text-text-secondary">
                      {meeting.participants}
                    </td>
                    <td className="px-6 py-4 text-body-small text-text-secondary">
                      <div className="flex flex-wrap gap-1">
                        {meeting.topics.map(topic => (
                          <span key={topic} className="px-2 py-1 bg-primary-light text-primary rounded-full text-label">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'insights':
        return (
          <div className="grid grid-cols-2 gap-4">
            {data.insights.map(insight => (
              <div key={insight.id} className="glass-standard rounded-lg p-6 shadow-1">
                <h3 className="font-semibold text-headline mb-2 text-text-primary">{insight.title}</h3>
                <p className="text-body-medium text-text-secondary mb-3">{insight.description}</p>
                {insight.metric && (
                  <div className={`text-title-large font-bold ${
                    insight.trend === 'up' ? 'text-success' : 
                    insight.trend === 'down' ? 'text-destructive' : 
                    'text-text-primary'
                  }`}>
                    {insight.metric}
                  </div>
                )}
                {insight.topics && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {insight.topics.map(topic => (
                      <span key={topic} className="px-2 py-1 bg-primary-light text-primary rounded-full text-label">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return <div className="text-text-secondary text-body-medium">Select a tab to view data</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 glass-subtle border-b border-border font-medium text-title-medium text-text-primary flex justify-between items-center">
        <span>Meeting Analytics</span>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select 
              value={timeRange} 
              onChange={e => setTimeRange(e.target.value)} 
              className="appearance-none bg-bg-primary border border-border rounded-md py-2 pl-3 pr-8 text-body-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <ChevronDownIcon size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-tertiary pointer-events-none" />
          </div>
          <button 
            className="p-2 hover:bg-bg-secondary rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-fast"
            onClick={loadAnalytics}
            aria-label="Refresh"
          >
            <RefreshCwIcon size={18} className="text-text-secondary" />
          </button>
          <button 
            className="p-2 hover:bg-bg-secondary rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-fast"
            aria-label="Download"
          >
            <DownloadIcon size={18} className="text-text-secondary" />
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-bg-secondary border-b border-border">
        <div className="flex">
          <button 
            className={`px-4 py-2 text-label font-medium flex items-center min-h-[44px] transition-colors duration-fast ${
              activeTab === 'overview' 
                ? 'bg-bg-primary border-t-2 border-primary text-primary' 
                : 'hover:bg-bg-tertiary text-text-secondary'
            }`} 
            onClick={() => setActiveTab('overview')}
          >
            <BarChartIcon size={16} className="mr-2" />
            Overview
          </button>
          <button 
            className={`px-4 py-2 text-label font-medium flex items-center min-h-[44px] transition-colors duration-fast ${
              activeTab === 'meetings' 
                ? 'bg-bg-primary border-t-2 border-primary text-primary' 
                : 'hover:bg-bg-tertiary text-text-secondary'
            }`} 
            onClick={() => setActiveTab('meetings')}
          >
            <TableIcon size={16} className="mr-2" />
            Meetings
          </button>
          <button 
            className={`px-4 py-2 text-label font-medium flex items-center min-h-[44px] transition-colors duration-fast ${
              activeTab === 'insights' 
                ? 'bg-bg-primary border-t-2 border-primary text-primary' 
                : 'hover:bg-bg-tertiary text-text-secondary'
            }`} 
            onClick={() => setActiveTab('insights')}
          >
            <PieChartIcon size={16} className="mr-2" />
            Insights
          </button>
        </div>
      </div>
      
      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6 bg-bg-secondary">
        {renderTabContent()}
      </div>
    </div>
  );
};

