import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import HomePage from '../views/HomePage.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard
        },
        {
            path: '/milestones',
            name: 'milestones',
            component: () => import('../views/Milestones.vue')
        },
        {
            path: '/settings/team',
            name: 'team-settings',
            component: () => import('../views/settings/TeamSettings.vue')
        },
        {
            path: '/settings/billing',
            name: 'billing',
            component: () => import('../views/settings/Billing.vue')
        },
        {
            path: '/areas/:id',
            name: 'area-detail',
            component: () => import('../views/documents/AreaDetail.vue')
        },
        {
            path: '/documents/:id',
            name: 'document-viewer',
            component: () => import('../views/documents/DocumentViewer.vue')
        },
        {
            path: '/signing/:id',
            name: 'signing-ceremony',
            component: () => import('../features/signing/components/SigningCeremony.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/auth/Login.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/auth/Register.vue')
        },
    ]
})

export default router
