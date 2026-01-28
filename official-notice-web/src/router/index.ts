import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: Dashboard
        },
        {
            path: '/documents/:id',
            name: 'document-viewer',
            component: () => import('../views/documents/DocumentViewer.vue') // Lazy load
        },
    ]
})

export default router
