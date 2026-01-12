import React, { useEffect, useState } from 'react';
import { VolumeIcon, StopCircleIcon, MicIcon } from 'lucide-react';

// Add type declarations for Speech Recognition API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
}

export const VoiceControls = ({
  isListening,
  setIsListening,
  onTranscriptUpdate,
  transcript,
  setTranscript,
  addMessage
}: {
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  onTranscriptUpdate: (text: string) => void;
  transcript: string;
  setTranscript: (text: string) => void;
  addMessage: (message: { sender: string; text: string; isAI: boolean }) => void;
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = event => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      setTranscript(text);
      onTranscriptUpdate(text);
    };
    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };
    if (isListening) {
      recognition.start();
    }
    return () => {
      recognition.stop();
    };
  }, [isListening]);
  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTranscript('');
    } else if (transcript) {
      // Add transcript to chat when stopping
      addMessage({
        sender: 'You',
        text: transcript,
        isAI: false
      });
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = `I heard you say: "${transcript}". Is there anything specific you'd like to discuss about this?`;
        addMessage({
          sender: 'AI Assistant',
          text: aiResponse,
          isAI: true
        });
        // Text-to-speech for AI response
        speakText(aiResponse);
      }, 1000);
    }
  };
  const speakText = text => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };
  return <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Voice Controls</h3>
        <div className="flex space-x-2">
          <button className={`p-2 rounded-full ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`} onClick={toggleListening} title={isListening ? 'Stop listening' : 'Start listening'}>
            <MicIcon size={18} />
          </button>
          {isSpeaking ? <button className="p-2 rounded-full bg-blue-500 text-white" onClick={stopSpeaking} title="Stop speaking">
              <StopCircleIcon size={18} />
            </button> : <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300" onClick={() => transcript && speakText(transcript)} title="Speak text" disabled={!transcript}>
              <VolumeIcon size={18} />
            </button>}
        </div>
      </div>
      <div className="bg-gray-100 rounded p-3 min-h-[60px] text-sm">
        {transcript ? transcript : isListening ? 'Listening...' : 'Click the microphone to start speaking'}
      </div>
      <div className="mt-3 flex justify-between text-xs text-gray-500">
        <span>{isListening ? 'Listening active' : 'Listening inactive'}</span>
        <span>{isSpeaking ? 'Speaking...' : 'Not speaking'}</span>
      </div>
    </div>;
};