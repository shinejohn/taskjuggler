import { ref, computed, onUnmounted } from 'vue';
import {
  createClient,
  RoomEvent,
  type MatrixClient,
  type Room,
  type MatrixEvent,
} from 'matrix-js-sdk';
import api from '@/utils/api';

export interface MatrixSession {
  enabled: boolean;
  provisioned?: boolean;
  homeserver_url?: string;
  user_id?: string;
  access_token?: string;
  device_id?: string;
}

export interface MatrixChatMessage {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_mine: boolean;
}

const session = ref<MatrixSession>({ enabled: false });
const loading = ref(false);
const loaded = ref(false);
let client: MatrixClient | null = null;

export function useMatrix() {
  const isEnabled = computed(() => session.value.enabled);
  const isProvisioned = computed(() => session.value.provisioned === true);

  async function loadSession(): Promise<MatrixSession> {
    if (loaded.value) {
      return session.value;
    }

    loading.value = true;
    try {
      const response = await api.get('/matrix/session');
      const data = response.data?.data ?? response.data;
      session.value = data as MatrixSession;
      loaded.value = true;
      return session.value;
    } catch {
      session.value = { enabled: false };
      loaded.value = true;
      return session.value;
    } finally {
      loading.value = false;
    }
  }

  async function connectClient(): Promise<MatrixClient | null> {
    const current = await loadSession();
    if (!current.provisioned || !current.access_token || !current.homeserver_url) {
      return null;
    }

    if (client) {
      return client;
    }

    client = createClient({
      baseUrl: current.homeserver_url,
      accessToken: current.access_token,
      userId: current.user_id,
      deviceId: current.device_id ?? 'fibonacco-web',
    });

    await client.startClient({ initialSyncLimit: 20 });
    return client;
  }

  async function getDirectRoom(otherUserId: string): Promise<{
    room_id: string;
    session: MatrixSession;
  } | null> {
    try {
      const response = await api.get(`/matrix/dm/${otherUserId}`);
      const data = response.data?.data ?? response.data;
      if (data?.session) {
        session.value = data.session;
        loaded.value = true;
      }
      return data;
    } catch {
      return null;
    }
  }

  async function loadRoomMessages(roomId: string): Promise<MatrixChatMessage[]> {
    const matrixClient = await connectClient();
    if (!matrixClient) {
      return [];
    }

    const room = matrixClient.getRoom(roomId);
    if (!room) {
      return [];
    }

    return timelineToMessages(room, matrixClient.getUserId() ?? '');
  }

  function subscribeToRoom(
    roomId: string,
    onMessage: (message: MatrixChatMessage) => void
  ): () => void {
    const matrixClient = client;
    if (!matrixClient) {
      return () => undefined;
    }

    const handler = (_event: MatrixEvent, room: Room | undefined) => {
      if (!room || room.roomId !== roomId) {
        return;
      }
      if (_event.getType() !== 'm.room.message') {
        return;
      }
      const content = _event.getContent()?.body;
      if (!content) {
        return;
      }

      onMessage({
        id: _event.getId() ?? `${Date.now()}`,
        sender_id: _event.getSender() ?? '',
        content,
        created_at: new Date(_event.getTs()).toISOString(),
        is_mine: _event.getSender() === matrixClient.getUserId(),
      });
    };

    matrixClient.on(RoomEvent.Timeline, handler);

    return () => {
      matrixClient.removeListener(RoomEvent.Timeline, handler);
    };
  }

  async function sendRoomMessage(roomId: string, content: string): Promise<void> {
    const matrixClient = await connectClient();
    if (!matrixClient) {
      throw new Error('Matrix client not connected');
    }

    await matrixClient.sendTextMessage(roomId, content);
  }

  function timelineToMessages(room: Room, myUserId: string): MatrixChatMessage[] {
    const timeline = room.getLiveTimeline().getEvents();

    return timeline
      .filter((event) => event.getType() === 'm.room.message')
      .map((event) => ({
        id: event.getId() ?? `${event.getTs()}`,
        sender_id: event.getSender() ?? '',
        content: event.getContent()?.body ?? '',
        created_at: new Date(event.getTs()).toISOString(),
        is_mine: event.getSender() === myUserId,
      }));
  }

  function resetSession(): void {
    client?.stopClient();
    client = null;
    session.value = { enabled: false };
    loaded.value = false;
  }

  onUnmounted(() => {
    // Keep client alive across navigations; call resetSession on logout
  });

  return {
    session,
    loading,
    isEnabled,
    isProvisioned,
    loadSession,
    connectClient,
    getDirectRoom,
    loadRoomMessages,
    subscribeToRoom,
    sendRoomMessage,
    resetSession,
  };
}
