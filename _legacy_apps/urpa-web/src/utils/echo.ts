import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<'pusher'>;
  }
}

window.Pusher = Pusher;

let echoInstance: Echo<'pusher'> | null = null;

export function initializeEcho(token: string): void {
  // Disconnect existing instance if any
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }

  const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
  if (!pusherKey) {
    console.warn('VITE_PUSHER_APP_KEY not set, real-time features disabled');
    return;
  }

  try {
    echoInstance = new Echo({
      broadcaster: 'pusher',
      key: pusherKey,
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'us2',
      forceTLS: true,
      authEndpoint: `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    window.Echo = echoInstance;
  } catch (error) {
    console.error('Failed to initialize Echo:', error);
    echoInstance = null;
  }
}

export function getEcho(): Echo<'pusher'> {
  if (!echoInstance) {
    throw new Error('Echo not initialized. Call initializeEcho(token) first.');
  }
  return echoInstance;
}

export function disconnectEcho(): void {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
  if (window.Echo) {
    (window as any).Echo = undefined;
  }
}

