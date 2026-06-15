<template>
  <div class="relative bg-black rounded-lg overflow-hidden aspect-video w-full">
    <!-- Remote participants grid -->
    <div
      v-if="remoteParticipants.length > 0"
      class="absolute inset-0 grid gap-1 p-1"
      :class="gridClass"
    >
      <div
        v-for="participant in remoteParticipants"
        :key="participant.identity"
        class="relative bg-gray-900 rounded overflow-hidden min-h-0"
      >
        <video
          :ref="(el) => setRemoteVideoRef(participant.identity, el as HTMLVideoElement | null)"
          autoplay
          playsinline
          class="w-full h-full object-cover"
          :aria-label="`${participant.name} video`"
        />
        <span class="absolute bottom-1 left-1 text-xs text-white bg-black/60 px-1.5 py-0.5 rounded">
          {{ participant.name }}
        </span>
      </div>
    </div>

    <!-- Local video (picture-in-picture when remotes present) -->
    <video
      ref="localVideoRef"
      autoplay
      playsinline
      muted
      :class="[
        'object-cover',
        remoteParticipants.length > 0
          ? 'absolute bottom-2 right-2 w-1/4 min-w-[80px] max-w-[160px] aspect-video rounded-lg border-2 border-white/30 z-10'
          : 'absolute inset-0 w-full h-full',
      ]"
      aria-label="Your camera"
    />

    <div
      v-if="!connected"
      class="absolute inset-0 flex items-center justify-center bg-gray-900 text-white text-sm z-20"
    >
      {{ statusText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { RoomEvent, Track, type RemoteParticipant } from 'livekit-client';
import { useLiveKit } from '@/composables/useLiveKit';

interface Props {
  meetingId: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  connected: [];
  error: [message: string];
  'remote-count': [count: number];
}>();

const {
  room,
  connected,
  error,
  joinMeeting,
  setLocalVideoElement,
  registerRemoteVideo,
  setMicrophoneEnabled,
  setCameraEnabled,
} = useLiveKit();

const localVideoRef = ref<HTMLVideoElement | null>(null);
const statusText = ref('Connecting video...');
const remoteParticipants = ref<Array<{ identity: string; name: string }>>([]);

const gridClass = computed(() => {
  const count = remoteParticipants.value.length;
  if (count <= 1) return 'grid-cols-1';
  if (count <= 4) return 'grid-cols-2';
  return 'grid-cols-3';
});

function syncRemoteParticipants(): void {
  const lkRoom = room.value;
  if (!lkRoom) {
    remoteParticipants.value = [];
    return;
  }

  remoteParticipants.value = Array.from(lkRoom.remoteParticipants.values()).map(
    (p: RemoteParticipant) => ({
      identity: p.identity,
      name: p.name || p.identity,
    })
  );
  emit('remote-count', remoteParticipants.value.length);
}

function setRemoteVideoRef(identity: string, el: HTMLVideoElement | null): void {
  const lkRoom = room.value;
  if (!el || !lkRoom) {
    return;
  }
  const participant = lkRoom.remoteParticipants.get(identity);
  if (participant) {
    registerRemoteVideo(participant, el);
  }
}

function attachRoomListeners(): void {
  const lkRoom = room.value;
  if (!lkRoom) {
    return;
  }

  syncRemoteParticipants();

  lkRoom.on(RoomEvent.ParticipantConnected, () => syncRemoteParticipants());
  lkRoom.on(RoomEvent.ParticipantDisconnected, () => syncRemoteParticipants());
  lkRoom.on(RoomEvent.TrackSubscribed, (track, _pub, participant) => {
    if (track.kind === Track.Kind.Video) {
      const el = document.querySelector<HTMLVideoElement>(
        `[aria-label="${participant.name || participant.identity} video"]`
      );
      if (el) {
        track.attach(el);
      }
    }
  });
}

onMounted(async () => {
  if (localVideoRef.value) {
    setLocalVideoElement(localVideoRef.value);
  }

  const creds = await joinMeeting(props.meetingId);
  if (creds) {
    statusText.value = '';
    attachRoomListeners();
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

watch(room, (lkRoom) => {
  if (lkRoom) {
    attachRoomListeners();
  }
});

defineExpose({
  setMicrophoneEnabled,
  setCameraEnabled,
  connected,
  remoteParticipants,
});
</script>
