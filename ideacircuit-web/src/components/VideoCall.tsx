import React, { useState, useEffect } from 'react';
import { Presenter } from './Presenter';
import { Facilitator } from './Facilitator';
import { Participants } from './Participants';
import { NotesPanel } from './NotesPanel';
import { ChatPanel } from './ChatPanel';
import { VoiceControls } from './VoiceControls';
import { VideoIcon, MessageCircleIcon, MicIcon } from 'lucide-react';
import { NavigationMenu } from './NavigationMenu';
import { RecordButton } from './RecordButton';
import { TranscriptDownloadButton } from './TranscriptDownloadButton';
import { useMeeting } from '../hooks/useMeeting';
import { useRealtimeChat } from '../hooks/useRealtimeChat';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

interface VideoCallProps {
  meetingId?: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({ meetingId = 'current-meeting' }) => {
  const { user } = useAuth();
  const { participants, notes, addNote, addNoteCategory, isConnected } = useMeeting(meetingId);
  const { messages, sendMessage, loading: chatLoading } = useRealtimeChat(meetingId, user?.id || 'current-user');
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingData, setRecordingData] = useState(null);
  const [isFacilitatorPresent, setIsFacilitatorPresent] = useState(true);
  const [meetingDuration, setMeetingDuration] = useState(0);

  // Load notes from API
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const response = await api.getNotes(meetingId);
        const notesData = response.data.data || response.data;
        // Notes will be handled by useMeeting hook
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };
    loadNotes();
  }, [meetingId]);

  // Meeting duration timer
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setMeetingDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleAddMessage = async (text: string) => {
    try {
      await sendMessage(text);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTranscriptUpdate = (text: string) => {
    setTranscript(text);
  };

  const handleRecordingComplete = (data: any) => {
    setRecordingData(data);
  };

  const handleEndCall = async () => {
    try {
      await api.endMeeting(meetingId);
      window.location.href = '/';
    } catch (error) {
      console.error('Error ending meeting:', error);
    }
  };

  // Convert messages format for ChatPanel
  const chatMessages = messages.map(msg => ({
    sender: msg.is_ai_generated ? 'AI Assistant' : (user?.name || 'You'),
    text: msg.message_text,
    isAI: msg.is_ai_generated
  }));

  const handleChatAddMessage = async (text: string) => {
    await handleAddMessage(text);
  };

  return (
    <div className="flex flex-col h-screen bg-bg-primary">
      {/* Header */}
      <div className="glass-subtle border-b border-border p-4 flex justify-between items-center">
        <h1 className="text-headline font-semibold text-text-primary">AI-Assisted Meeting</h1>
        <div className="flex space-x-2 items-center">
          {isConnected && (
            <span className="px-3 py-1 bg-status-completed/10 text-status-completed rounded-full text-label font-medium border border-status-completed/30">
              Live
            </span>
          )}
          <span className="px-3 py-1 bg-bg-secondary text-text-secondary rounded-full text-label font-medium">
            {formatDuration(meetingDuration)}
          </span>
          <NavigationMenu />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left - Facilitator and Presenter */}
        <div className="w-1/5 p-6 flex flex-col gap-4">
          {/* Facilitator (top) */}
          <div className="h-1/3">
            <Facilitator isVisible={isFacilitatorPresent} isVideoOff={isVideoOff} />
          </div>
          {/* Presenter (middle) */}
          <div className="h-1/3">
            <Presenter isVideoOff={isVideoOff} />
          </div>
          {/* Voice Controls (bottom) */}
          <div className="flex-1">
            <VoiceControls 
              isListening={isListening} 
              setIsListening={setIsListening} 
              onTranscriptUpdate={handleTranscriptUpdate} 
              transcript={transcript} 
              setTranscript={setTranscript} 
              addMessage={(message: { sender: string; text: string; isAI: boolean }) => {
                // VoiceControls uses old message format, but we'll convert it
                handleAddMessage(message.text);
              }} 
            />
          </div>
        </div>

        {/* Middle - Notes and Chat */}
        <div className="w-3/5 border-l border-r border-border flex flex-col">
          {/* Notes Panel (Top Half) */}
          <div className="h-1/2 border-b border-border overflow-y-auto">
            <NotesPanel notes={notes} onAddNote={addNote} onAddCategory={addNoteCategory} />
          </div>
          {/* Chat (Bottom Half) */}
          <div className="h-1/2 flex flex-col">
            <ChatPanel messages={chatMessages} addMessage={handleAddMessage} />
          </div>
        </div>

        {/* Right - Participants */}
        <div className="w-1/5 bg-bg-secondary">
          <div className="p-3 glass-subtle border-b border-border font-medium text-title-medium text-text-primary">
            <span>Participants ({participants.length})</span>
          </div>
          <div className="overflow-y-auto p-2">
            <Participants participants={participants} />
          </div>
        </div>
      </div>

      {/* Footer - Controls */}
      <div className="glass-subtle border-t border-border p-4 flex justify-center items-center space-x-6">
        <button 
          className={`p-3 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-all duration-fast ${
            isMuted ? 'bg-destructive text-white' : 'bg-bg-tertiary text-text-primary hover:bg-bg-secondary'
          }`}
          onClick={() => setIsMuted(!isMuted)}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          <MicIcon size={20} />
        </button>
        <button 
          className={`p-3 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-all duration-fast ${
            isVideoOff ? 'bg-destructive text-white' : 'bg-bg-tertiary text-text-primary hover:bg-bg-secondary'
          }`}
          onClick={() => setIsVideoOff(!isVideoOff)}
          aria-label={isVideoOff ? 'Turn on video' : 'Turn off video'}
        >
          <VideoIcon size={20} />
        </button>
        <RecordButton onRecordingComplete={handleRecordingComplete} />
        <TranscriptDownloadButton sessionId={meetingId} disabled={!messages.length} />
        <button 
          className={`p-3 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-all duration-fast ${
            isChatOpen ? 'bg-primary text-white' : 'bg-bg-tertiary text-text-primary hover:bg-bg-secondary'
          }`}
          onClick={() => setIsChatOpen(!isChatOpen)}
          aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
        >
          <MessageCircleIcon size={20} />
        </button>
        <button 
          className="p-3 rounded-full min-h-[44px] bg-bg-tertiary text-text-primary hover:bg-bg-secondary transition-all duration-fast"
          onClick={() => setIsFacilitatorPresent(!isFacilitatorPresent)}
          aria-label={isFacilitatorPresent ? 'Remove Facilitator' : 'Add Facilitator'}
        >
          {isFacilitatorPresent ? 'Remove Facilitator' : 'Add Facilitator'}
        </button>
        <button 
          className="bg-destructive hover:bg-destructive/90 text-white px-5 py-3 rounded-md min-h-[44px] text-label font-medium transition-all duration-fast"
          onClick={handleEndCall}
        >
          End Call
        </button>
      </div>
    </div>
  );
};
