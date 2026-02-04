<template>
  <div class="relative">
    <Button
      @click="toggleRecording"
      :disabled="recordingStatus === 'processing'"
      :variant="isRecording ? 'destructive' : 'secondary'"
      size="icon"
      :class="`rounded-full min-h-[44px] min-w-[44px] ${
        isRecording ? 'animate-pulse' : ''
      }`"
    >
      <LoaderIcon v-if="recordingStatus === 'processing'" :size="20" class="animate-spin" />
      <StopCircleIcon v-else-if="isRecording" :size="20" />
      <MicIcon v-else :size="20" />
    </Button>
    <Badge
      v-if="isRecording"
      variant="destructive"
      class="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
    >
      {{ formatTime(recordingTime) }}
    </Badge>
    <Badge
      v-if="recordingStatus === 'complete'"
      variant="default"
      class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white whitespace-nowrap"
    >
      Recording saved
    </Badge>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { StopCircleIcon, LoaderIcon, MicIcon } from 'lucide-vue-next';
import { Button, Badge } from '@/components/ui';

interface Props {
  onRecordingComplete?: (data: { duration: number; date: string; filename: string }) => void;
}

const props = defineProps<Props>();

const isRecording = ref(false);
const recordingTime = ref(0);
const recordingStatus = ref<'idle' | 'recording' | 'processing' | 'complete'>('idle');

let interval: ReturnType<typeof setInterval> | null = null;

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const toggleRecording = () => {
  if (isRecording.value) {
    isRecording.value = false;
    recordingStatus.value = 'processing';
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    setTimeout(() => {
      recordingStatus.value = 'complete';
      if (props.onRecordingComplete) {
        props.onRecordingComplete({
          duration: recordingTime.value,
          date: new Date().toISOString(),
          filename: `recording-${new Date().toISOString().substring(0, 10)}.mp4`
        });
      }
    }, 2000);
  } else {
    recordingTime.value = 0;
    isRecording.value = true;
    recordingStatus.value = 'recording';
  }
};

watch(isRecording, (recording) => {
  if (recording) {
    interval = setInterval(() => {
      recordingTime.value++;
    }, 1000);
  } else if (interval) {
    clearInterval(interval);
    interval = null;
  }
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
});
</script>

