<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 p-4">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Presentation Call</h1>
          <p class="text-sm text-gray-600">AI-powered presentation meetings</p>
        </div>
        <div class="flex items-center space-x-4">
          <NavigationMenu />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden">
      <MeetingView
        v-if="currentView === 'meeting'"
        @ai-setup="currentView = 'ai-setup'"
        @start-presentation="currentView = 'presentation'"
        :is-recording="isRecording"
        :is-muted="isMuted"
        :is-video-on="isVideoOn"
        @toggle-recording="toggleRecording"
        @toggle-mute="toggleMute"
        @toggle-video="toggleVideo"
      />
      
      <AISetupView
        v-else-if="currentView === 'ai-setup'"
        @solution-complete="handleAISetup"
        @back-to-meeting="currentView = 'meeting'"
      />
      
      <PresentationView
        v-else-if="currentView === 'presentation'"
        :config="meetingConfig"
        @back-to-meeting="currentView = 'meeting'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavigationMenu from '@/components/NavigationMenu.vue';
import AISolutionBuilder from '@/components/AISolutionBuilder.vue';
import MeetingView from './PresentationCall/MeetingView.vue';
import AISetupView from './PresentationCall/AISetupView.vue';
import PresentationView from './PresentationCall/PresentationView.vue';

const currentView = ref<'meeting' | 'ai-setup' | 'presentation'>('meeting');
const meetingConfig = ref<any>(null);
const isRecording = ref(false);
const isMuted = ref(false);
const isVideoOn = ref(true);

const handleAISetup = (solution: any) => {
  meetingConfig.value = solution;
  currentView.value = 'presentation';
};

const toggleRecording = () => {
  isRecording.value = !isRecording.value;
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;
};

const toggleVideo = () => {
  isVideoOn.value = !isVideoOn.value;
};
</script>
