import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/pages/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/Login.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/pages/SignUp.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/Profile.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/setup',
      name: 'setup',
      component: () => import('@/pages/SetupWizard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/subscribe',
      name: 'subscribe',
      component: () => import('@/pages/Subscribe.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/calls/:id',
      name: 'call-detail',
      component: () => import('@/pages/CallDetail.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } else if ((to.name === 'login' || to.name === 'signup') && authStore.isAuthenticated) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router;

