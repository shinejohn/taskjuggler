import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue'),
        meta: { guest: true }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/Register.vue'),
        meta: { guest: true }
    },
    {
        path: '/',
        component: () => import('../layouts/AppLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('../views/Dashboard.vue')
            },
            {
                path: 'projects',
                name: 'projects',
                component: () => import('../views/Projects.vue')
            },
            {
                path: 'projects/:id',
                name: 'project-detail',
                component: () => import('../views/ProjectDetail.vue')
            },
            {
                path: 'projects/:projectId/tasks/:taskId',
                name: 'task-detail',
                component: () => import('../views/TaskDetail.vue')
            },
            {
                path: 'my-tasks',
                name: 'my-tasks',
                component: () => import('../views/MyTasks.vue')
            },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'login' })
    } else if (to.meta.guest && authStore.isAuthenticated) {
        next({ name: 'dashboard' })
    } else {
        next()
    }
})

export default router


