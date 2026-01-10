import React, { useState } from 'react';
import { Presenter } from '../components/Presenter';
import { Facilitator } from '../components/Facilitator';
import { Participants } from '../components/Participants';
import { DataAnalyticsPanel } from '../components/DataAnalyticsPanel';
import { ExpandableChat } from '../components/ExpandableChat';
import { VoiceControls } from '../components/VoiceControls';
import { VideoIcon, MessageCircleIcon, MicIcon } from 'lucide-react';
import { NavigationMenu } from '../components/NavigationMenu';
export const DataAnalyticsPage = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isFacilitatorPresent, setIsFacilitatorPresent] = useState(true);
  const [messages, setMessages] = useState([{
    sender: 'AI Assistant',
    text: 'Welcome to the data analytics dashboard. How can I help you interpret this information?',
    isAI: true
  }, {
    sender: 'You',
    text: 'What are the key insights from the revenue analysis?',
    isAI: false
  }, {
    sender: 'AI Assistant',
    text: "The revenue analysis shows strong growth at 18.7% YoY, exceeding the industry average of 12.3%. Gross margins have improved from 62% to 68%, and there's a significant opportunity for expansion in the Asia Pacific region which currently represents only 13% of revenue despite being 28% of the global market.",
    isAI: true
  }]);
  const addMessage = message => {
    setMessages([...messages, message]);
  };
  const handleTranscriptUpdate = text => {
    setTranscript(text);
  };
  const participants = [{
    id: 1,
    name: 'John Doe',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }, {
    id: 2,
    name: 'Jane Smith',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }, {
    id: 3,
    name: 'Alex Johnson',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }];
  return <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">AI-Assisted Data Analytics</h1>
        <div className="flex space-x-2 items-center">
          <span className="px-3 py-1 bg-green-600 rounded-full text-sm">
            Live
          </span>
          <span className="px-3 py-1 bg-gray-600 rounded-full text-sm">
            00:15:32
          </span>
          <NavigationMenu />
        </div>
      </div>
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left - Facilitator and Presenter */}
        <div className="w-1/5 p-4 flex flex-col">
          {/* Facilitator (top) */}
          <div className="h-1/3 mb-2">
            <Facilitator isVisible={isFacilitatorPresent} isVideoOff={isVideoOff} />
          </div>
          {/* Presenter (middle) */}
          <div className="h-1/3 mb-2">
            <Presenter isVideoOff={isVideoOff} />
          </div>
          {/* Voice Controls (bottom) */}
          <div className="flex-1">
            <VoiceControls isListening={isListening} setIsListening={setIsListening} onTranscriptUpdate={handleTranscriptUpdate} transcript={transcript} setTranscript={setTranscript} addMessage={addMessage} />
          </div>
        </div>
        {/* Middle - Data Analytics */}
        <div className="w-3/5 border-l border-r border-gray-300 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <DataAnalyticsPanel />
          </div>
          {/* Expandable Chat */}
          <ExpandableChat messages={messages} addMessage={addMessage} defaultExpanded={false} />
        </div>
        {/* Right - Participants */}
        <div className="w-1/5 bg-gray-50">
          <div className="p-3 bg-gray-200 font-medium">
            <span>Participants ({participants.length})</span>
          </div>
          <div className="overflow-y-auto">
            <Participants participants={participants} />
          </div>
        </div>
      </div>
      {/* Footer - Controls */}
      <div className="bg-gray-800 text-white p-4 flex justify-center items-center space-x-6">
        <button className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'}`} onClick={() => setIsMuted(!isMuted)}>
          <MicIcon size={20} />
        </button>
        <button className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'}`} onClick={() => setIsVideoOff(!isVideoOff)}>
          <VideoIcon size={20} />
        </button>
        <button className={`p-3 rounded-full ${isChatOpen ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'}`} onClick={() => setIsChatOpen(!isChatOpen)}>
          <MessageCircleIcon size={20} />
        </button>
        <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-500" onClick={() => setIsFacilitatorPresent(!isFacilitatorPresent)}>
          {isFacilitatorPresent ? 'Remove Facilitator' : 'Add Facilitator'}
        </button>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-medium">
          End Call
        </button>
      </div>
    </div>;
};