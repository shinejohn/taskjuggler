import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/css/design-system.css';
import './style.css';
import { registerServiceWorker } from './utils/serviceWorker';
import { trackWebVitals } from './utils/performance';
import { startStaleRequestCleanup } from './utils/requestCancellation';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount('#app');

// Register service worker for offline support
if (import.meta.env.PROD) {
  registerServiceWorker();
}

// Initialize performance monitoring
trackWebVitals();

// Start automatic cleanup of stale requests
startStaleRequestCleanup();

