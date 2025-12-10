import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform, Linking } from 'react-native';
import Toast from 'react-native-toast-message';
import '../global.css';
import { useAuthStore } from '../stores/auth';
import { registerForPushNotificationsAsync, addNotificationReceivedListener, addNotificationResponseReceivedListener } from '../utils/notifications';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

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
          const storedToken = await AsyncStorage.getItem('token');
          if (storedToken) {
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

    // Handle deep linking
    const handleDeepLink = (url: string) => {
      console.log('Deep link received:', url);
      // Parse URL: taskjuggler://tasks/123 or taskjuggler://inbox
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
      } catch (error) {
        console.error('Error parsing deep link:', error);
      }
    };

    // Handle initial URL (if app was opened via deep link)
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Listen for deep links while app is running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };

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
