import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
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
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/dashboard/DashboardPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/pages/tasks/TasksPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/tasks/:id',
      name: 'task-detail',
      component: () => import('@/pages/tasks/TaskDetailPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/inbox',
      name: 'inbox',
      component: () => import('@/pages/inbox/InboxPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/routing',
      name: 'routing',
      component: () => import('@/pages/routing/RulesPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/team',
      name: 'team',
      component: () => import('@/pages/team/TeamPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/channels',
      name: 'channels',
      component: () => import('@/pages/channels/ChannelsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: () => import('@/pages/marketplace/MarketplacePage.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
