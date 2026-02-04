<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-medium">Voice Controls</h3>
      <div class="flex space-x-2">
        <button
          :class="`p-2 rounded-full ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`"
          @click="toggleListening"
          :title="isListening ? 'Stop listening' : 'Start listening'"
        >
          <MicIcon :size="18" />
        </button>
        <button
          v-if="isSpeaking"
          class="p-2 rounded-full bg-blue-500 text-white"
          @click="stopSpeaking"
          title="Stop speaking"
        >
          <StopCircleIcon :size="18" />
        </button>
        <button
          v-else
          class="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          @click="transcript && speakText(transcript)"
          :title="'Speak text'"
          :disabled="!transcript"
        >
          <VolumeIcon :size="18" />
        </button>
      </div>
    </div>
    <div class="bg-gray-100 rounded p-3 min-h-[60px] text-sm">
      {{ transcript || (isListening ? 'Listening...' : 'Click the microphone to start speaking') }}
    </div>
    <div class="mt-3 flex justify-between text-xs text-gray-500">
      <span>{{ isListening ? 'Listening active' : 'Listening inactive' }}</span>
      <span>{{ isSpeaking ? 'Speaking...' : 'Not speaking' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { VolumeIcon, StopCircleIcon, MicIcon } from 'lucide-vue-next';

// Type declarations for Speech Recognition API
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

interface Props {
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  onTranscriptUpdate: (text: string) => void;
  transcript: string;
  setTranscript: (text: string) => void;
  addMessage: (message: { sender: string; text: string; isAI: boolean }) => void;
}

const props = defineProps<Props>();
const isSpeaking = ref(false);
let recognition: SpeechRecognition | null = null;

const toggleListening = () => {
  props.setIsListening(!props.isListening);
  if (!props.isListening) {
    props.setTranscript('');
  } else if (props.transcript) {
    // Add transcript to chat when stopping
    props.addMessage({
      sender: 'You',
      text: props.transcript,
      isAI: false
    });
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = `I heard you say: "${props.transcript}". Is there anything specific you'd like to discuss about this?`;
      props.addMessage({
        sender: 'AI Assistant',
        text: aiResponse,
        isAI: true
      });
      // Text-to-speech for AI response
      speakText(aiResponse);
    }, 1000);
  }
};

const speakText = (text: string) => {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;
  utterance.onstart = () => {
    isSpeaking.value = true;
  };
  utterance.onend = () => {
    isSpeaking.value = false;
  };
  window.speechSynthesis.speak(utterance);
};

const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    isSpeaking.value = false;
  }
};

watch(() => props.isListening, (newVal) => {
  if (!recognition) return;
  
  if (newVal) {
    recognition.start();
  } else {
    recognition.stop();
  }
});

onMounted(() => {
  // Check if browser supports speech recognition
  if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    console.error('Speech recognition not supported in this browser');
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const last = event.results.length - 1;
    const text = event.results[last][0].transcript;
    props.setTranscript(text);
    props.onTranscriptUpdate(text);
  };
  
  recognition.onend = () => {
    if (props.isListening) {
      recognition?.start();
    }
  };
  
  if (props.isListening) {
    recognition.start();
  }
});

onUnmounted(() => {
  if (recognition) {
    recognition.stop();
  }
});
</script>

