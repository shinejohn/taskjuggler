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
  
  // Fetch user if we have token but no user data
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }
  
  // Check authentication
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
  
  // Guest routes - redirect authenticated users away
  if (to.meta.guest && authStore.isAuthenticated) {
    return next('/dashboard');
  }
  
  next();
});

export default router;
