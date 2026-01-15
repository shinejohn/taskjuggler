import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/pages/LandingPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/DashboardPage.vue'),
      meta: { 
        requiresAuth: true,
        permission: 'scanner:view'
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/LoginPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/auth/RegisterPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/pages/auth/ResetPasswordPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/ProfilePage.vue'),
      meta: { 
        requiresAuth: true,
        permission: 'scanner:view'
      },
    },
    {
      path: '/subscribe',
      name: 'subscribe',
      component: () => import('@/pages/SubscribePage.vue'),
      meta: { 
        requiresAuth: true,
        permission: 'scanner:view'
      },
    },
    {
      path: '/sites',
      name: 'sites',
      component: () => import('@/pages/SitesPage.vue'),
      meta: { 
        requiresAuth: true,
        permission: 'scanner:view'
      },
    },
    {
      path: '/sites/:id',
      name: 'site-detail',
      component: () => import('@/pages/SiteDetailPage.vue'),
      meta: { 
        requiresAuth: true,
        permission: 'scanner:view'
      },
    },
    {
      path: '/scans/:id',
      name: 'scan-detail',
      component: () => import('@/pages/ScanDetailPage.vue'),
      meta: { 
        requiresAuth: true,
        permission: 'scanner:view'
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/pages/SettingsPage.vue'),
      meta: { 
        requiresAuth: true,
        permission: 'scanner:view'
      },
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  
  // Allow landing page and other guest routes without ANY authentication checks
  if (to.meta.guest || !to.meta.requiresAuth) {
    // Only redirect authenticated users away from guest routes (landing/login/register)
    // Check both token AND user to ensure full authentication
    if (authStore.token && authStore.user && (to.name === 'landing' || to.name === 'login' || to.name === 'register')) {
      return next('/dashboard');
    }
    // For all other cases (no token, or token but no user, or other guest routes), allow access
    return next();
  }
  
  // For protected routes only, check authentication
  // First, try to fetch user if we have a token but no user data
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUser();
    } catch {
      // If fetch fails, clear token and redirect to login
      authStore.logout();
      const redirectPath = encodeURIComponent(to.fullPath);
      return next(`/login?redirect=${redirectPath}`);
    }
  }
  
  // Check authentication for protected routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to platform login with redirect parameter
    const redirectPath = encodeURIComponent(to.fullPath);
    return next(`/login?redirect=${redirectPath}`);
  }
  
  // Check permissions
  if (to.meta.permission && !authStore.hasPermission(to.meta.permission as string)) {
    return next('/upgrade');
  }
  
  // Check team context - ensure user has a team selected for team-scoped routes
  if (to.meta.requiresAuth && authStore.isAuthenticated && !authStore.currentTeam) {
    // If user has teams but none selected, select the first one
    if (authStore.user?.teams && authStore.user.teams.length > 0) {
      const firstTeam = authStore.user.teams[0];
      if (firstTeam) {
        authStore.setCurrentTeam(firstTeam);
      } else {
        // User has no teams, redirect to upgrade or team creation
        return next('/upgrade');
      }
    } else {
      // User has no teams, redirect to upgrade or team creation
      return next('/upgrade');
    }
  }
  
  next();
});

export default router;
