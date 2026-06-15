import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform, Linking } from 'react-native';
import Toast from 'react-native-toast-message';
import '../global.css';
import { useAuthStore } from '../stores/auth';
import { useModulesStore } from '../stores/modules';
import {
  registerForPushNotificationsAsync,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
} from '../utils/notifications';
import * as Notifications from 'expo-notifications';
import api from '../utils/api';

export default function RootLayout() {
  const { isAuthenticated, initialize, enabledModules } = useAuthStore();
  const setEnabledModuleIds = useModulesStore((s) => s.setEnabledModuleIds);
  const segments = useSegments();
  const router = useRouter();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (enabledModules.length > 0) {
      setEnabledModuleIds(enabledModules);
    }
  }, [enabledModules, setEnabledModuleIds]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    registerForPushNotificationsAsync().then(async (token) => {
      if (!token) {
        return;
      }

      try {
        const platform = Platform.OS === 'ios' ? 'ios' : 'android';
        await api.post('/auth/push-token', {
          push_token: token,
          platform,
        });
      } catch {
        // Push token registration failed — non-critical
      }
    });
  }, [isAuthenticated]);

  useEffect(() => {
    const handleDeepLink = (url: string) => {
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;

        if (path.startsWith('/tasks/')) {
          const taskId = path.split('/tasks/')[1];
          if (taskId) {
            router.push(`/tasks/${taskId}`);
          }
        } else if (path === '/inbox' || path.startsWith('/inbox/')) {
          router.push('/inbox');
        } else if (path === '/tasks') {
          router.push('/tasks');
        }
      } catch {
        // Invalid deep link URL — ignore
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    notificationListener.current = addNotificationReceivedListener(() => {
      // Notification received in foreground — no action needed
    });

    responseListener.current = addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        if (data?.task_id) {
          router.push(`/tasks/${data.task_id}`);
        } else if (data?.inbox_id) {
          router.push('/inbox');
        } else if (
          data?.type === 'task_created' ||
          data?.type === 'task_assigned'
        ) {
          router.push('/tasks');
        }
      }
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(
          responseListener.current
        );
      }
      subscription.remove();
    };
  }, [router]);

  useEffect(() => {
    const inAuthGroup = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, router]);

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/login"
          options={{ title: 'Login', headerShown: false }}
        />
        <Stack.Screen
          name="auth/register"
          options={{ title: 'Register', headerShown: false }}
        />
        <Stack.Screen
          name="tasks/[id]"
          options={{ title: 'Task Details', presentation: 'modal' }}
        />
        <Stack.Screen
          name="tasks/new"
          options={{ title: 'Create Task', presentation: 'modal' }}
        />
        <Stack.Screen name="routing" options={{ title: 'Routing Rules' }} />
        <Stack.Screen name="team" options={{ title: 'Team Management' }} />
        <Stack.Screen name="channels" options={{ title: 'Channels' }} />
        <Stack.Screen name="marketplace" options={{ title: 'Marketplace' }} />
      </Stack>
      <Toast />
    </>
  );
}
