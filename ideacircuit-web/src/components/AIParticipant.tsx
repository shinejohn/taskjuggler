import React, { useState } from 'react';
import { Mic, MicOff, Bot, Activity } from 'lucide-react';

interface AIParticipantProps {
  isInMeeting: boolean;
  isSpeaking?: boolean;
  lastResponse?: string;
  onMuteToggle: (muted: boolean) => void;
  onRemove?: () => void;
}

export const AIParticipant: React.FC<AIParticipantProps> = ({
  isInMeeting,
  isSpeaking = false,
  lastResponse = '',
  onMuteToggle,
  onRemove
}) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    onMuteToggle(newMutedState);
  };

  if (!isInMeeting) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-4 m-4">
      <div className="flex items-center space-x-4">
        {/* AI Avatar */}
        <div
          className={`relative w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center ${
            isSpeaking ? 'animate-pulse ring-4 ring-blue-400' : ''
          }`}
        >
          <Bot size={40} className="text-white" />
          {isSpeaking && (
            <Activity className="absolute -top-1 -right-1 text-green-400 animate-bounce" size={20} />
          )}
        </div>

        {/* AI Info */}
        <div className="flex-1">
          <h3 className="text-white font-semibold flex items-center">
            AI Assistant
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
              isSpeaking ? 'bg-green-600' : 'bg-gray-600'
            }`}>
              {isSpeaking ? 'Speaking' : 'Listening'}
            </span>
          </h3>
          <p className="text-gray-400 text-sm">
            {isSpeaking ? 'Speaking now...' : 'Ready to assist'}
          </p>
          {lastResponse && (
            <p className="text-gray-300 text-sm mt-2 italic">
              "{lastResponse.substring(0, 80)}{lastResponse.length > 80 ? '...' : ''}"
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex space-x-2">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${
              isMuted ? 'bg-red-600' : 'bg-gray-600'
            } hover:opacity-80 transition-opacity`}
            title={isMuted ? 'Unmute AI' : 'Mute AI'}
          >
            {isMuted ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-white" />}
          </button>
          {onRemove && (
            <button
              onClick={onRemove}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIParticipant;
