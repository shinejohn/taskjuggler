import { ref, computed, type Ref, type ComputedRef } from 'vue';

/**
 * Shared Matrix chat composable used by taskjuggler-web and urpa-web.
 *
 * matrix-js-sdk is intentionally NOT imported here — the two apps pin different
 * SDK majors (^37 vs ^41), so the SDK and the API client are injected via
 * createUseMatrix(). shared-ui only depends on the structural shapes below.
 */

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

export interface MatrixConversation {
  user: { id: string; name: string; email: string };
  last_message: { content: string; sent_at: string };
  unread_count: number;
  room_id?: string;
}

/** matrix-js-sdk event content. The index signature keeps this structurally
 *  compatible with the SDK's IContent (which the injected client returns). */
interface MatrixContentLike {
  body?: string;
  [key: string]: unknown;
}

/** Minimal surface of a matrix-js-sdk MatrixEvent we rely on. */
interface MatrixEventLike {
  getType(): string;
  getContent(): MatrixContentLike;
  getId(): string | undefined;
  getSender(): string | undefined;
  getTs(): number;
}

/** Minimal surface of a matrix-js-sdk Room we rely on. */
interface MatrixRoomLike {
  roomId: string;
  getLiveTimeline(): { getEvents(): MatrixEventLike[] };
}

/** Minimal surface of a matrix-js-sdk MatrixClient we rely on. */
interface MatrixClientLike<TEvent> {
  startClient(opts: { initialSyncLimit: number }): Promise<void>;
  stopClient(): void;
  getRoom(roomId: string): MatrixRoomLike | null;
  getUserId(): string | null;
  on(event: TEvent, handler: (event: MatrixEventLike, room: MatrixRoomLike | undefined) => void): void;
  removeListener(event: TEvent, handler: (event: MatrixEventLike, room: MatrixRoomLike | undefined) => void): void;
  sendTextMessage(roomId: string, content: string): Promise<unknown>;
}

interface CreateClientOptions {
  baseUrl: string;
  accessToken: string;
  userId?: string;
  deviceId: string;
}

interface ApiResponseLike {
  data: unknown;
}

interface ApiClientLike {
  get(url: string): Promise<ApiResponseLike>;
}

export interface UseMatrixOptions<TEvent> {
  /** HTTP client (e.g. the app's axios instance) for the Laravel /matrix endpoints. */
  api: ApiClientLike;
  /** matrix-js-sdk createClient, injected so shared-ui stays SDK-version agnostic. */
  createClient: (opts: CreateClientOptions) => MatrixClientLike<TEvent>;
  /** matrix-js-sdk RoomEvent.Timeline, injected for the same reason. */
  timelineEvent: TEvent;
  /** Device id used when the session does not supply one. */
  defaultDeviceId: string;
  /** Connect timeout in ms before falling back to legacy messaging. Defaults to 5000. */
  connectTimeoutMs?: number;
}

export interface UseMatrixReturn {
  session: Ref<MatrixSession>;
  loading: Ref<boolean>;
  isEnabled: ComputedRef<boolean>;
  isProvisioned: ComputedRef<boolean>;
  loadSession(): Promise<MatrixSession>;
  connectClient(): Promise<boolean>;
  getDirectRoom(otherUserId: string): Promise<{ room_id: string; session: MatrixSession } | null>;
  loadRoomMessages(roomId: string): Promise<MatrixChatMessage[]>;
  subscribeToRoom(roomId: string, onMessage: (message: MatrixChatMessage) => void): () => void;
  sendRoomMessage(roomId: string, content: string): Promise<void>;
  loadConversations(): Promise<MatrixConversation[]>;
  resetSession(): void;
}

/** Unwrap Laravel's optional { data: ... } envelope. */
function pickData(response: ApiResponseLike): unknown {
  const body = response.data as Record<string, unknown> | null | undefined;
  if (body && typeof body === 'object' && 'data' in body && body.data != null) {
    return body.data;
  }
  return body;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Matrix connection timed out')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

/**
 * Build an app-specific useMatrix() composable. Singleton state (session, client)
 * is held in this closure so every component in an app shares one Matrix client.
 */
export function createUseMatrix<TEvent>(options: UseMatrixOptions<TEvent>): () => UseMatrixReturn {
  const { api, createClient, timelineEvent, defaultDeviceId } = options;
  const connectTimeoutMs = options.connectTimeoutMs ?? 5000;

  const session = ref<MatrixSession>({ enabled: false });
  const loading = ref(false);
  const loaded = ref(false);
  let client: MatrixClientLike<TEvent> | null = null;

  return function useMatrix(): UseMatrixReturn {
    const isEnabled = computed(() => session.value.enabled);
    const isProvisioned = computed(() => session.value.provisioned === true);

    async function loadSession(): Promise<MatrixSession> {
      if (loaded.value) {
        return session.value;
      }

      loading.value = true;
      try {
        const response = await api.get('/matrix/session');
        session.value = pickData(response) as MatrixSession;
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

    /** Connect (or reuse) the Matrix client. Returns false on timeout/failure so
     *  callers can fall back to legacy messaging instead of spinning forever. */
    async function connectClient(): Promise<boolean> {
      const current = await loadSession();
      if (!current.provisioned || !current.access_token || !current.homeserver_url) {
        return false;
      }

      if (client) {
        return true;
      }

      const newClient = createClient({
        baseUrl: current.homeserver_url,
        accessToken: current.access_token,
        userId: current.user_id,
        deviceId: current.device_id ?? defaultDeviceId,
      });

      try {
        await withTimeout(newClient.startClient({ initialSyncLimit: 20 }), connectTimeoutMs);
        client = newClient;
        return true;
      } catch {
        try {
          newClient.stopClient();
        } catch {
          // ignore — best-effort teardown of a client that never synced
        }
        return false;
      }
    }

    async function getDirectRoom(
      otherUserId: string
    ): Promise<{ room_id: string; session: MatrixSession } | null> {
      try {
        const response = await api.get(`/matrix/dm/${otherUserId}`);
        const data = pickData(response) as
          | { room_id: string; session?: MatrixSession }
          | null
          | undefined;
        if (data?.session) {
          session.value = data.session;
          loaded.value = true;
        }
        return data ? { room_id: data.room_id, session: session.value } : null;
      } catch {
        return null;
      }
    }

    async function loadRoomMessages(roomId: string): Promise<MatrixChatMessage[]> {
      const connected = await connectClient();
      if (!connected || !client) {
        return [];
      }

      const room = client.getRoom(roomId);
      if (!room) {
        return [];
      }

      return timelineToMessages(room, client.getUserId() ?? '');
    }

    function subscribeToRoom(
      roomId: string,
      onMessage: (message: MatrixChatMessage) => void
    ): () => void {
      const matrixClient = client;
      if (!matrixClient) {
        return () => undefined;
      }

      const handler = (event: MatrixEventLike, room: MatrixRoomLike | undefined): void => {
        if (!room || room.roomId !== roomId) {
          return;
        }
        if (event.getType() !== 'm.room.message') {
          return;
        }
        const content = event.getContent()?.body;
        if (!content) {
          return;
        }

        onMessage({
          id: event.getId() ?? `${Date.now()}`,
          sender_id: event.getSender() ?? '',
          content,
          created_at: new Date(event.getTs()).toISOString(),
          is_mine: event.getSender() === matrixClient.getUserId(),
        });
      };

      matrixClient.on(timelineEvent, handler);

      return () => {
        matrixClient.removeListener(timelineEvent, handler);
      };
    }

    async function sendRoomMessage(roomId: string, content: string): Promise<void> {
      const connected = await connectClient();
      if (!connected || !client) {
        throw new Error('Matrix client not connected');
      }

      await client.sendTextMessage(roomId, content);
    }

    function timelineToMessages(room: MatrixRoomLike, myUserId: string): MatrixChatMessage[] {
      return room
        .getLiveTimeline()
        .getEvents()
        .filter((event) => event.getType() === 'm.room.message')
        .map((event) => ({
          id: event.getId() ?? `${event.getTs()}`,
          sender_id: event.getSender() ?? '',
          content: event.getContent()?.body ?? '',
          created_at: new Date(event.getTs()).toISOString(),
          is_mine: event.getSender() === myUserId,
        }));
    }

    async function loadConversations(): Promise<MatrixConversation[]> {
      await loadSession();
      if (!isProvisioned.value) {
        return [];
      }

      try {
        const response = await api.get('/matrix/conversations');
        const data = pickData(response);
        return Array.isArray(data) ? (data as MatrixConversation[]) : [];
      } catch {
        return [];
      }
    }

    function resetSession(): void {
      client?.stopClient();
      client = null;
      session.value = { enabled: false };
      loaded.value = false;
    }

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
      loadConversations,
      resetSession,
    };
  };
}
