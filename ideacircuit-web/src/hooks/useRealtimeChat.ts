import { useEffect, useState } from 'react';
import api from '../services/api';
import { useWebSocket } from './useWebSocket';

export interface Message {
  id: string;
  meeting_id: string;
  participant_id?: string;
  user_id?: string;
  message_text: string;
  message_type: string;
  is_ai_generated: boolean;
  created_at: string;
}

export const useRealtimeChat = (meetingId: string, participantId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial messages from API
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await api.getMessages(meetingId);
        const messageData = response.data.data || response.data;
        setMessages(Array.isArray(messageData) ? messageData : []);
      } catch (error) {
        console.error('Error loading messages:', error);
        // Set empty array on error
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    if (meetingId) {
      loadMessages();
    }
  }, [meetingId]);

  // WebSocket connection for real-time messages
  const { isConnected, sendMessage: sendWebSocketMessage } = useWebSocket({
    url: `${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/ws/meetings/${meetingId}/chat`,
    onMessage: (data: any) => {
      if (data.type === 'message' && data.message) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(msg => msg.id === data.message.id)) {
            return prev;
          }
          return [...prev, data.message];
        });
      }
    },
    onConnect: () => {
      console.log('WebSocket connected for chat');
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected for chat');
    }
  });

  const send = async (text: string) => {
    try {
      // Send message via API
      const response = await api.sendMessage(meetingId, {
        text,
        participant_id: participantId
      });

      const newMessage = response.data.data || response.data;
      
      // Add message to local state optimistically
      if (newMessage) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(msg => msg.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
      }

      // Also send via WebSocket if connected
      if (isConnected) {
        sendWebSocketMessage({
          type: 'message',
          meeting_id: meetingId,
          participant_id: participantId,
          text
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return {
    messages,
    sendMessage: send,
    loading,
    isConnected
  };
};
