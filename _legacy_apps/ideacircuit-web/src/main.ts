import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import '@taskjuggler/ui/styles';
import './assets/css/design-system.css';
import './index.css';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount('#root');





