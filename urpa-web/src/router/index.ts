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
  ],
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  
  // Allow landing page and other public routes without authentication checks
  if (!to.meta.requiresAuth) {
    // If user is fully authenticated (has both token and user), redirect away from public routes
    if (authStore.isAuthenticated && (to.name === 'landing' || to.name === 'login' || to.name === 'signup')) {
      return next({ name: 'dashboard' });
    }
    // Otherwise, allow access to public routes
    return next();
  }
  
  // For protected routes, fetch user if we have token but no user data
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

