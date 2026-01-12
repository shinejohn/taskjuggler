import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BotIcon, PresentationIcon, BarChart2Icon, UsersIcon, CalendarIcon, ClockIcon, MicIcon, VideoIcon, PhoneIcon } from 'lucide-react';
import { NavigationMenu } from '../components/NavigationMenu';
import { FAESolutionBuilder } from '../components/FAESolutionBuilder';

export const PresentationCall = () => {
  const [currentView, setCurrentView] = useState<'meeting' | 'fae-setup' | 'presentation'>('meeting');
  const [meetingConfig, setMeetingConfig] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const handleFAESetup = (solution: any) => {
    setMeetingConfig(solution);
    setCurrentView('presentation');
  };

  const startMeeting = () => {
    setCurrentView('meeting');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Presentation Call</h1>
            <p className="text-sm text-gray-600">AI-powered presentation meetings</p>
          </div>
          <div className="flex items-center space-x-4">
            <NavigationMenu />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'meeting' && (
          <MeetingView 
            onFAESetup={() => setCurrentView('fae-setup')}
            onStartPresentation={() => setCurrentView('presentation')}
            isRecording={isRecording}
            isMuted={isMuted}
            isVideoOn={isVideoOn}
            onToggleRecording={toggleRecording}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
          />
        )}
        
        {currentView === 'fae-setup' && (
          <FAESetupView 
            onSolutionComplete={handleFAESetup}
            onBackToMeeting={() => setCurrentView('meeting')}
          />
        )}
        
        {currentView === 'presentation' && (
          <PresentationView 
            config={meetingConfig}
            onBackToMeeting={() => setCurrentView('meeting')}
          />
        )}
      </div>
    </div>
  );
};

// Meeting View
interface MeetingViewProps {
  onFAESetup: () => void;
  onStartPresentation: () => void;
  isRecording: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  onToggleRecording: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

const MeetingView: React.FC<MeetingViewProps> = ({
  onFAESetup,
  onStartPresentation,
  isRecording,
  isMuted,
  isVideoOn,
  onToggleRecording,
  onToggleMute,
  onToggleVideo
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Meeting Controls */}
      <div className="bg-blue-50 border-b border-blue-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <PresentationIcon size={24} className="text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-blue-900">Meeting Room</h2>
              <p className="text-sm text-blue-700">Ready to start your presentation</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onFAESetup}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <BotIcon size={16} />
              <span>Setup FAE</span>
            </button>
            <button
              onClick={onStartPresentation}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <PresentationIcon size={16} />
              <span>Start Presentation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Meeting Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Video Area */}
          <div className="bg-gray-900 rounded-lg aspect-video mb-6 flex items-center justify-center">
            <div className="text-center text-white">
              <VideoIcon size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Video feed will appear here</p>
              <p className="text-sm opacity-75">Start your presentation to begin</p>
            </div>
          </div>

          {/* Meeting Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center space-x-3">
                <UsersIcon size={20} className="text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Participants</h3>
                  <p className="text-sm text-gray-600">2 connected</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center space-x-3">
                <ClockIcon size={20} className="text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Duration</h3>
                  <p className="text-sm text-gray-600">00:05:23</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center space-x-3">
                <CalendarIcon size={20} className="text-purple-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Scheduled</h3>
                  <p className="text-sm text-gray-600">Today, 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Controls</h3>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={onToggleMute}
                className={`p-3 rounded-full ${
                  isMuted ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <MicIcon size={20} />
              </button>
              <button
                onClick={onToggleVideo}
                className={`p-3 rounded-full ${
                  isVideoOn ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <VideoIcon size={20} />
              </button>
              <button
                onClick={onToggleRecording}
                className={`p-3 rounded-full ${
                  isRecording ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-current" />
              </button>
              <button className="p-3 rounded-full bg-red-600 text-white">
                <PhoneIcon size={20} />
              </button>
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
  onBackToMeeting: () => void;
}

const FAESetupView: React.FC<FAESetupViewProps> = ({ onSolutionComplete, onBackToMeeting }) => {
  return (
    <div className="h-full flex flex-col">
      {/* FAE Setup Header */}
      <div className="bg-purple-50 border-b border-purple-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BotIcon size={24} className="text-purple-600" />
            <div>
              <h2 className="text-lg font-semibold text-purple-900">FAE Presentation Setup</h2>
              <p className="text-sm text-purple-700">Configure AI assistance for your presentation</p>
            </div>
          </div>
          <button
            onClick={onBackToMeeting}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Meeting
          </button>
        </div>
      </div>

      {/* FAE Builder */}
      <div className="flex-1 overflow-hidden">
        <FAESolutionBuilder
          userIntent="I need AI assistance for my presentation meeting. Help with note-taking, analytics, and facilitation."
          meetingId="presentation-meeting"
          userId="current-user"
          onSolutionComplete={onSolutionComplete}
        />
      </div>
    </div>
  );
};

// Presentation View
interface PresentationViewProps {
  config: any;
  onBackToMeeting: () => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ config, onBackToMeeting }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Presentation Header */}
      <div className="bg-green-50 border-b border-green-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <PresentationIcon size={24} className="text-green-600" />
            <div>
              <h2 className="text-lg font-semibold text-green-900">FAE-Powered Presentation</h2>
              <p className="text-sm text-green-700">
                {config ? 'AI assistance active' : 'Presentation mode'}
              </p>
            </div>
          </div>
          <button
            onClick={onBackToMeeting}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Meeting
          </button>
        </div>
      </div>

      {/* Presentation Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {config ? (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">FAE Presentation Active</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{config.selected_bots.length}</div>
                  <div className="text-sm text-gray-600">AI Bots</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{config.workflow_steps.length}</div>
                  <div className="text-sm text-gray-600">Workflow Steps</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg text-gray-700 mb-4">
                  AI is assisting with note-taking, analytics, and facilitation
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Standard Presentation Mode</h3>
              <div className="text-center">
                <div className="text-lg text-gray-700 mb-4">
                  Presentation running without AI assistance
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};