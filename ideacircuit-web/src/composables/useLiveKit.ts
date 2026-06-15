import { ref, onUnmounted } from 'vue';
import {
  Room,
  RoomEvent,
  Track,
  type RemoteParticipant,
  type LocalParticipant,
} from 'livekit-client';
import api from '@/services/api';

export interface LiveKitCredentials {
  url: string;
  token: string;
  room_name: string;
  identity: string;
}

export function useLiveKit() {
  const room = ref<Room | null>(null);
  const connected = ref(false);
  const error = ref<string | null>(null);
  const localVideoEl = ref<HTMLVideoElement | null>(null);
  const remoteVideoEls = ref<Map<string, HTMLVideoElement>>(new Map());

  async function joinMeeting(meetingId: string): Promise<LiveKitCredentials | null> {
    error.value = null;
    try {
      const response = await api.post(`/ideacircuit/meetings/${meetingId}/livekit/join`);
      const data = response.data?.data ?? response.data;
      if (!data?.url || !data?.token) {
        error.value = 'LiveKit not configured on server';
        return null;
      }
      await connect(data);
      return data as LiveKitCredentials;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to join LiveKit room';
      return null;
    }
  }

  async function connect(credentials: LiveKitCredentials): Promise<void> {
    if (room.value) {
      await disconnect();
    }

    const lkRoom = new Room({
      adaptiveStream: true,
      dynacast: true,
    });

    lkRoom.on(RoomEvent.TrackSubscribed, (track, _pub, participant) => {
      if (track.kind === Track.Kind.Video) {
        const el = remoteVideoEls.value.get(participant.identity);
        if (el) {
          track.attach(el);
        }
      }
    });

    lkRoom.on(RoomEvent.TrackUnsubscribed, (track) => {
      track.detach();
    });

    await lkRoom.connect(credentials.url, credentials.token);
    await lkRoom.localParticipant.enableCameraAndMicrophone();

    if (localVideoEl.value) {
      const videoTrack = lkRoom.localParticipant.getTrackPublication(Track.Source.Camera)?.track;
      videoTrack?.attach(localVideoEl.value);
    }

    room.value = lkRoom;
    connected.value = true;
  }

  async function disconnect(): Promise<void> {
    if (room.value) {
      room.value.disconnect();
      room.value = null;
    }
    connected.value = false;
  }

  async function endMeeting(meetingId: string): Promise<void> {
    await disconnect();
    try {
      await api.post(`/ideacircuit/meetings/${meetingId}/livekit/end`);
    } catch {
      await api.endMeeting(meetingId);
    }
  }

  function setLocalVideoElement(el: HTMLVideoElement | null): void {
    localVideoEl.value = el;
    if (el && room.value) {
      const videoTrack = room.value.localParticipant.getTrackPublication(Track.Source.Camera)?.track;
      videoTrack?.attach(el);
    }
  }

  function registerRemoteVideo(participant: RemoteParticipant | LocalParticipant, el: HTMLVideoElement): void {
    remoteVideoEls.value.set(participant.identity, el);
    participant.trackPublications.forEach((pub) => {
      if (pub.track && pub.kind === Track.Kind.Video) {
        pub.track.attach(el);
      }
    });
  }

  function setMicrophoneEnabled(enabled: boolean): void {
    room.value?.localParticipant.setMicrophoneEnabled(enabled);
  }

  function setCameraEnabled(enabled: boolean): void {
    room.value?.localParticipant.setCameraEnabled(enabled);
  }

  onUnmounted(() => {
    disconnect();
  });

  return {
    room,
    connected,
    error,
    joinMeeting,
    disconnect,
    endMeeting,
    setLocalVideoElement,
    registerRemoteVideo,
    setMicrophoneEnabled,
    setCameraEnabled,
  };
}
