import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
// Import Tailwind CSS first to ensure base styles are loaded
import './style.css';
// Import design system overrides
import './assets/css/design-system.css';
import { useAuthStore } from './stores/auth';
import { initializeEcho } from './utils/echo';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize Echo and real-time listeners after auth store is available
const authStore = useAuthStore();

async function initializeRealtime() {
  if (!authStore.token || !import.meta.env.VITE_PUSHER_APP_KEY) {
    return;
  }

  try {
    // Initialize Echo with token
    initializeEcho(authStore.token);
    
    // Fetch user if not already loaded
    if (!authStore.user) {
      await authStore.fetchUser();
    }
    
    // Setup real-time listeners if authenticated
    if (authStore.isAuthenticated && authStore.user) {
      const { useActivitiesStore } = await import('./stores/activities');
      const { usePhoneStore } = await import('./stores/phone');
      const activitiesStore = useActivitiesStore();
      const phoneStore = usePhoneStore();
      
      activitiesStore.setupRealtimeListeners();
      phoneStore.setupRealtimeListeners();
    }
  } catch (error) {
    // Silently fail - real-time is optional
    console.warn('Failed to initialize real-time features:', error);
  }
}

// Initialize real-time features
initializeRealtime();

app.mount('#app');
