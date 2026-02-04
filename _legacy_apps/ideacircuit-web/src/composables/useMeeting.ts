import { ref, onMounted } from 'vue';
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
  const participants = ref<Participant[]>([]);
  const messages = ref<Message[]>([]);
  const notes = ref<NoteCategory[]>([]);
  const isConnected = ref(false);
  const meetingData = ref<any>(null);

  const initializeMeeting = async () => {
    try {
      // Get meeting data from API
      const response = await api.getMeeting(meetingId);
      meetingData.value = response.data.data || response.data;
      isConnected.value = true;
      
      // Load notes from API
      try {
        const notesResponse = await api.getNotes(meetingId);
        const notesData = notesResponse.data.data || notesResponse.data;
        if (Array.isArray(notesData)) {
          // Transform API notes to component format
          const notesByCategory: Record<string, NoteCategory> = {};
          notesData.forEach((note: any) => {
            const category = note.category || 'General';
            if (!notesByCategory[category]) {
              notesByCategory[category] = { category, items: [] };
            }
            notesByCategory[category].items.push({
              text: note.content || note.text || '',
              timestamp: note.created_at || new Date().toISOString()
            });
          });
          notes.value = Object.values(notesByCategory);
        }
      } catch (notesError) {
        console.error('Failed to load notes:', notesError);
      }
      
      // Load participants from API
      try {
        const meeting = meetingData.value;
        if (meeting?.participants && Array.isArray(meeting.participants)) {
          participants.value = meeting.participants.map((p: any) => ({
            id: p.id,
            name: p.display_name || p.name || p.guest_name || 'Unknown',
            image: p.avatar_url,
            isMuted: p.is_muted || false,
            isVideoOff: p.is_video_off || false,
            isActive: p.is_active || false
          }));
        }
      } catch (participantsError) {
        console.error('Failed to load participants:', participantsError);
      }
    } catch (error) {
      console.error('Failed to initialize meeting:', error);
    }
  };

  onMounted(() => {
    if (meetingId) {
      initializeMeeting();
    }
  });

  const addParticipant = (participant: Participant) => {
    const exists = participants.value.find((p) => p.id === participant.id);
    if (exists) {
      participants.value = participants.value.map((p) => (p.id === participant.id ? participant : p));
    } else {
      participants.value = [...participants.value, participant];
    }
  };

  const removeParticipant = (participantId: string) => {
    participants.value = participants.value.filter((p) => p.id !== participantId);
  };

  const updateParticipant = (participantId: string, updates: Partial<Participant>) => {
    participants.value = participants.value.map((p) => (p.id === participantId ? { ...p, ...updates } : p));
  };

  const addMessage = (message: Message) => {
    const newMessage: Message = {
      ...message,
      id: message.id || Date.now().toString(),
      timestamp: message.timestamp || new Date().toISOString()
    };
    messages.value = [...messages.value, newMessage];
  };

  const addNote = async (category: string, text: string) => {
    try {
      // Save note to database via API (backend expects 'content' not 'text')
      await api.addNote(meetingId, { category, content: text });
      
      // Update local state optimistically
      const categoryIndex = notes.value.findIndex((n) => n.category === category);
      if (categoryIndex >= 0) {
        const updated = [...notes.value];
        updated[categoryIndex].items.push({
          text,
          timestamp: new Date().toISOString()
        });
        notes.value = updated;
      } else {
        notes.value = [
          ...notes.value,
          {
            category,
            items: [{ text, timestamp: new Date().toISOString() }]
          }
        ];
      }
    } catch (error) {
      console.error('Failed to add note:', error);
      throw error;
    }
  };

  const addNoteCategory = (categoryName: string) => {
    const exists = notes.value.find((n) => n.category === categoryName);
    if (!exists) {
      notes.value = [...notes.value, { category: categoryName, items: [] }];
    }
  };

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

