import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface Participant {
  id: string;
  name: string;
  image?: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isActive: boolean;
}

interface Message {
  id?: string;
  sender: string;
  text: string;
  timestamp?: string;
  isAI?: boolean;
}

interface NoteCategory {
  category: string;
  items: { text: string; timestamp?: string }[];
}

export const useMeeting = (meetingId: string) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<NoteCategory[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [meetingData, setMeetingData] = useState<any>(null);

  useEffect(() => {
    if (meetingId) {
      initializeMeeting();
    }
  }, [meetingId]);

  const initializeMeeting = async () => {
    try {
      // Get meeting data from API
      const response = await api.getMeeting(meetingId);
      setMeetingData(response.data);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to initialize meeting:', error);
    }
  };

  const addParticipant = useCallback((participant: Participant) => {
    setParticipants((prev) => {
      const exists = prev.find((p) => p.id === participant.id);
      if (exists) {
        return prev.map((p) => (p.id === participant.id ? participant : p));
      }
      return [...prev, participant];
    });
  }, []);

  const removeParticipant = useCallback((participantId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== participantId));
  }, []);

  const updateParticipant = useCallback((participantId: string, updates: Partial<Participant>) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === participantId ? { ...p, ...updates } : p))
    );
  }, []);

  const addMessage = useCallback((message: Message) => {
    const newMessage: Message = {
      ...message,
      id: message.id || Date.now().toString(),
      timestamp: message.timestamp || new Date().toISOString()
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const addNote = useCallback((category: string, text: string) => {
    setNotes((prev) => {
      const categoryIndex = prev.findIndex((n) => n.category === category);
      if (categoryIndex >= 0) {
        const updated = [...prev];
        updated[categoryIndex].items.push({
          text,
          timestamp: new Date().toISOString()
        });
        return updated;
      } else {
        return [
          ...prev,
          {
            category,
            items: [{ text, timestamp: new Date().toISOString() }]
          }
        ];
      }
    });
  }, []);

  const addNoteCategory = useCallback((categoryName: string) => {
    setNotes((prev) => {
      const exists = prev.find((n) => n.category === categoryName);
      if (!exists) {
        return [...prev, { category: categoryName, items: [] }];
      }
      return prev;
    });
  }, []);

  return {
    participants,
    messages,
    notes,
    isConnected,
    meetingData,
    addParticipant,
    removeParticipant,
    updateParticipant,
    addMessage,
    addNote,
    addNoteCategory
  };
};

