import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import styles
import './style.css'
// Import shared UI styles if available (commented out until we confirm path)
// import '@taskjuggler/ui/styles.css'
import './assets/css/design-system.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
