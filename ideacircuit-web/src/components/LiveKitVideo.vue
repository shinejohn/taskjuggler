<template>
  <div class="relative bg-black rounded-lg overflow-hidden aspect-video w-full">
    <video
      ref="localVideoRef"
      autoplay
      playsinline
      muted
      class="absolute inset-0 w-full h-full object-cover"
      aria-label="Your camera"
    />
    <div
      v-if="!connected"
      class="absolute inset-0 flex items-center justify-center bg-gray-900 text-white text-sm"
    >
      {{ statusText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useLiveKit } from '@/composables/useLiveKit';

interface Props {
  meetingId: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  connected: [];
  error: [message: string];
}>();

const { connected, error, joinMeeting, setLocalVideoElement, setMicrophoneEnabled, setCameraEnabled } =
  useLiveKit();

const localVideoRef = ref<HTMLVideoElement | null>(null);
const statusText = ref('Connecting video...');

onMounted(async () => {
  if (localVideoRef.value) {
    setLocalVideoElement(localVideoRef.value);
  }

  const creds = await joinMeeting(props.meetingId);
  if (creds) {
    statusText.value = '';
    emit('connected');
  } else if (error.value) {
    statusText.value = error.value;
    emit('error', error.value);
  }
});

watch(localVideoRef, (el) => {
  if (el) {
    setLocalVideoElement(el);
  }
});

defineExpose({
  setMicrophoneEnabled,
  setCameraEnabled,
  connected,
});
</script>
