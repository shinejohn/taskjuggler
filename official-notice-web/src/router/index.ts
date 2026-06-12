import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import HomePage from '../views/HomePage.vue'
import { useAuthStore } from '../stores/auth'

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
            component: Dashboard,
            meta: { requiresAuth: true }
        },
        {
            path: '/milestones',
            name: 'milestones',
            component: () => import('../views/Milestones.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/settings/team',
            name: 'team-settings',
            component: () => import('../views/settings/TeamSettings.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/settings/billing',
            name: 'billing',
            component: () => import('../views/settings/Billing.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/areas/:id',
            name: 'area-detail',
            component: () => import('../views/documents/AreaDetail.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/documents/:id',
            name: 'document-viewer',
            component: () => import('../views/documents/DocumentViewer.vue'),
            meta: { requiresAuth: true }
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

router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requiresAuth) {
        if (!authStore.isAuthenticated && !authStore.token) {
            next('/login')
        } else if (!authStore.user && authStore.token) {
            const ok = await authStore.checkAuth()
            if (!ok) next('/login')
            else next()
        } else {
            next()
        }
    } else if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router
