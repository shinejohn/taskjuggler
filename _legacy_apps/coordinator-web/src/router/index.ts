import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/pages/LandingPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/LoginPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/auth/RegisterPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/pages/auth/ResetPasswordPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/ProfilePage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/subscribe',
      name: 'subscribe',
      component: () => import('@/pages/SubscribePage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/pages/onboarding/OnboardingPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/dashboard/DashboardPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/coordinators',
      name: 'coordinators',
      component: () => import('@/pages/coordinators/CoordinatorsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/coordinators/:id',
      name: 'coordinator-detail',
      component: () => import('@/pages/coordinators/CoordinatorDetailPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('@/pages/contacts/ContactsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/appointments',
      name: 'appointments',
      component: () => import('@/pages/appointments/AppointmentsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/calls',
      name: 'calls',
      component: () => import('@/pages/calls/CallsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/pages/appointments/AppointmentsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('@/pages/analytics/AnalyticsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/billing',
      name: 'billing',
      component: () => import('@/pages/billing/BillingPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/campaigns',
      name: 'campaigns',
      component: () => import('@/pages/campaigns/CampaignsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/pages/settings/SettingsPage.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  
  // Landing page is always accessible
  if (to.path === '/') {
    next();
    return;
  }
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;

