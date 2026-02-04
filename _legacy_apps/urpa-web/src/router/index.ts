import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/pages/LandingPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard',
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
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/pages/ForgotPassword.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/pages/ResetPassword.vue'),
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
    {
      path: '/webhooks',
      name: 'webhooks',
      component: () => import('@/pages/Webhooks.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  
  // Allow landing page and other public routes without ANY authentication checks
  if (!to.meta.requiresAuth) {
    // Only redirect fully authenticated users (both token AND user) away from landing/login/signup
    if (authStore.isAuthenticated && (to.name === 'landing' || to.name === 'login' || to.name === 'signup')) {
      return next({ name: 'dashboard' });
    }
    // For all other cases (no token, or token but no user, or other public routes), allow access
    return next();
  }
  
  // For protected routes only, check authentication
  // First, try to fetch user if we have a token but no user data
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUser();
    } catch {
      // If fetch fails, clear token and redirect to login
      await authStore.logout();
      return next({ name: 'login' });
    }
  }
  
  // Check authentication for protected routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' });
  }
  
  next();
});

export default router;

