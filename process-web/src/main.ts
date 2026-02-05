import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import '@taskjuggler/ui/styles.css';
import './style.css'
import './assets/css/design-system.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
