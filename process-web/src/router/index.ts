import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/login', 
      name: 'login', 
      component: () => import('@/pages/auth/LoginPage.vue'), 
      meta: { guest: true } 
    },
    { 
      path: '/register', 
      name: 'register', 
      component: () => import('@/pages/auth/RegisterPage.vue'), 
      meta: { guest: true } 
    },
    { 
      path: '/forgot-password', 
      name: 'forgot-password', 
      component: () => import('@/pages/auth/ForgotPasswordPage.vue'), 
      meta: { guest: true } 
    },
    { 
      path: '/reset-password', 
      name: 'reset-password', 
      component: () => import('@/pages/auth/ResetPasswordPage.vue'), 
      meta: { guest: true } 
    },
    { 
      path: '/profile', 
      name: 'profile', 
      component: () => import('@/pages/ProfilePage.vue'), 
      meta: { auth: true } 
    },
    { 
      path: '/subscribe', 
      name: 'subscribe', 
      component: () => import('@/pages/SubscribePage.vue'), 
      meta: { auth: true } 
    },
    { 
      path: '/', 
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
      meta: { guest: true }
    },
    { 
      path: '/processes', 
      name: 'processes', 
      component: () => import('@/pages/ProcessesPage.vue'), 
      meta: { auth: true } 
    },
    { 
      path: '/processes/new', 
      name: 'process-new', 
      component: () => import('@/pages/ProcessBuilderPage.vue'), 
      meta: { auth: true } 
    },
    { 
      path: '/processes/:id', 
      name: 'process-detail', 
      component: () => import('@/pages/ProcessDetailPage.vue'), 
      meta: { auth: true } 
    },
    { 
      path: '/processes/:id/edit', 
      name: 'process-edit', 
      component: () => import('@/pages/ProcessBuilderPage.vue'), 
      meta: { auth: true } 
    },
    { 
      path: '/executions', 
      name: 'executions', 
      component: () => import('@/pages/ExecutionsPage.vue'), 
      meta: { auth: true } 
    },
  ]
});

// Add auth guard (same pattern as taskjuggler-web)
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  if (authStore.token && !authStore.user) await authStore.fetchUser();
  if (to.meta.auth && !authStore.isAuthenticated) next('/login');
  else if (to.meta.guest && authStore.isAuthenticated) next('/processes');
  else next();
});

export default router;
