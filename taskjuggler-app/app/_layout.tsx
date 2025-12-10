import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';
import '../global.css';
import { useAuthStore } from '../stores/auth';
import { registerForPushNotificationsAsync, addNotificationReceivedListener, addNotificationResponseReceivedListener } from '../utils/notifications';
import * as Notifications from 'expo-notifications';

export default function RootLayout() {
  const { isAuthenticated, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    initialize();
    
    // Register for push notifications
    registerForPushNotificationsAsync().then(async token => {
      if (token) {
        console.log('Push notification token:', token);
        try {
          // Send token to backend API
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          const storedToken = await AsyncStorage.getItem('token');
          if (storedToken) {
            const api = require('../utils/api').default;
            const platform = Platform.OS === 'ios' ? 'ios' : 'android';
            await api.post('/auth/push-token', {
              push_token: token,
              platform: platform,
            });
            console.log('Push token registered with backend');
          }
        } catch (error) {
          console.error('Failed to register push token:', error);
        }
      }
    });

    // Listen for notifications received while app is foregrounded
    notificationListener.current = addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen for user tapping on notifications
    responseListener.current = addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      const data = response.notification.request.content.data;
      
      // Navigate to relevant screen based on notification data
      if (data?.task_id) {
        router.push(`/tasks/${data.task_id}`);
      } else if (data?.inbox_id) {
        router.push('/inbox');
      } else if (data?.type === 'task_created' || data?.type === 'task_assigned') {
        router.push('/tasks');
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ title: 'Register', headerShown: false }} />
        <Stack.Screen name="tasks/[id]" options={{ title: 'Task Details', presentation: 'modal' }} />
        <Stack.Screen name="tasks/new" options={{ title: 'Create Task', presentation: 'modal' }} />
        <Stack.Screen name="routing" options={{ title: 'Routing Rules' }} />
        <Stack.Screen name="team" options={{ title: 'Team Management' }} />
        <Stack.Screen name="channels" options={{ title: 'Channels' }} />
        <Stack.Screen name="marketplace" options={{ title: 'Marketplace' }} />
      </Stack>
      <Toast />
    </>
  );
}
