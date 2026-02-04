<template>
  <div class="h-full flex flex-col">
    <!-- Meeting Controls -->
    <div class="bg-blue-50 border-b border-blue-200 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <PresentationIcon :size="24" class="text-blue-600" />
          <div>
            <h2 class="text-lg font-semibold text-blue-900">Meeting Room</h2>
            <p class="text-sm text-blue-700">Ready to start your presentation</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="$emit('ai-setup')"
            class="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <BotIcon :size="16" />
            <span>Setup AI</span>
          </button>
          <button
            @click="$emit('start-presentation')"
            class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PresentationIcon :size="16" />
            <span>Start Presentation</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Meeting Content -->
    <div class="flex-1 p-6">
      <div class="max-w-6xl mx-auto">
        <!-- Video Area -->
        <div class="bg-gray-900 rounded-lg aspect-video mb-6 flex items-center justify-center">
          <div class="text-center text-white">
            <VideoIcon :size="48" class="mx-auto mb-4 opacity-50" />
            <p class="text-lg">Video feed will appear here</p>
            <p class="text-sm opacity-75">Start your presentation to begin</p>
          </div>
        </div>

        <!-- Meeting Info -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-white rounded-lg border p-4">
            <div class="flex items-center space-x-3">
              <UsersIcon :size="20" class="text-blue-600" />
              <div>
                <h3 class="font-semibold text-gray-900">Participants</h3>
                <p class="text-sm text-gray-600">2 connected</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg border p-4">
            <div class="flex items-center space-x-3">
              <ClockIcon :size="20" class="text-green-600" />
              <div>
                <h3 class="font-semibold text-gray-900">Duration</h3>
                <p class="text-sm text-gray-600">00:05:23</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg border p-4">
            <div class="flex items-center space-x-3">
              <CalendarIcon :size="20" class="text-purple-600" />
              <div>
                <h3 class="font-semibold text-gray-900">Scheduled</h3>
                <p class="text-sm text-gray-600">Today, 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Control Panel -->
        <div class="bg-white rounded-lg border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Meeting Controls</h3>
          <div class="flex items-center justify-center space-x-4">
            <button
              @click="$emit('toggle-mute')"
              :class="`p-3 rounded-full ${isMuted ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`"
            >
              <MicIcon :size="20" />
            </button>
            <button
              @click="$emit('toggle-video')"
              :class="`p-3 rounded-full ${isVideoOn ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`"
            >
              <VideoIcon :size="20" />
            </button>
            <button
              @click="$emit('toggle-recording')"
              :class="`p-3 rounded-full ${isRecording ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`"
            >
              <div class="w-5 h-5 rounded-full bg-current" />
            </button>
            <button class="p-3 rounded-full bg-red-600 text-white">
              <PhoneIcon :size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PresentationIcon,
  BotIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  MicIcon,
  VideoIcon,
  PhoneIcon
} from 'lucide-vue-next';

defineProps<{
  isRecording: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
}>();

defineEmits<{
  'ai-setup': [];
  'start-presentation': [];
  'toggle-recording': [];
  'toggle-mute': [];
  'toggle-video': [];
}>();
</script>

