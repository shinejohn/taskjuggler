<template>
  <div class="h-full min-h-[120px]">
    <LiveKitVideo
      v-if="meetingId"
      ref="liveKitRef"
      :meeting-id="meetingId"
      @connected="$emit('connected')"
      @error="(msg) => $emit('error', msg)"
    />
    <Presenter v-else :is-video-off="isVideoOff" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LiveKitVideo from './LiveKitVideo.vue';
import Presenter from './Presenter.vue';

interface Props {
  meetingId: string | null;
  isVideoOff?: boolean;
}

withDefaults(defineProps<Props>(), {
  isVideoOff: false,
});

defineEmits<{
  connected: [];
  error: [message: string];
}>();

const liveKitRef = ref<InstanceType<typeof LiveKitVideo> | null>(null);

defineExpose({
  setMicrophoneEnabled: (enabled: boolean) => liveKitRef.value?.setMicrophoneEnabled(enabled),
  setCameraEnabled: (enabled: boolean) => liveKitRef.value?.setCameraEnabled(enabled),
});
</script>
