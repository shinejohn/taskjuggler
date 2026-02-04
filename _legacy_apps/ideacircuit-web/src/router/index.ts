import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Lazy load pages
const App = () => import('@/App.vue');
const LoginPage = () => import('@/pages/LoginPage.vue');
const SignUpPage = () => import('@/pages/SignUpPage.vue');
const PresentationCall = () => import('@/pages/PresentationCall.vue');
const DataReportCall = () => import('@/pages/DataReportCall.vue');
const MarketingReportPage = () => import('@/pages/MarketingReportPage.vue');
const BusinessProfilePage = () => import('@/pages/BusinessProfilePage.vue');
const DataAnalyticsPage = () => import('@/pages/DataAnalyticsPage.vue');
const ClientProposalPage = () => import('@/pages/ClientProposalPage.vue');
const AIWorkflowPage = () => import('@/pages/AIWorkflowPage.vue');
const FilesPage = () => import('@/pages/FilesPage.vue');
const ProfilePage = () => import('@/pages/ProfilePage.vue');
const SchedulePage = () => import('@/pages/SchedulePage.vue');

// Auth guard
const requireAuth = (_to: any, _from: any, next: any) => {
  const authStore = useAuthStore();
  const isTestingMode = import.meta.env.VITE_DEV_MODE === 'true' || window.location.hostname === 'localhost';

  if (authStore.loading) {
    // Wait for auth check to complete
    return;
  }

  if (!authStore.isAuthenticated && !isTestingMode) {
    next('/login');
  } else {
    next();
  }
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: App,
    },
    {
      path: '/login',
      component: LoginPage,
    },
    {
      path: '/signup',
      component: SignUpPage,
    },
    {
      path: '/forgot-password',
      component: () => import('@/pages/ForgotPasswordPage.vue'),
    },
    {
      path: '/reset-password',
      component: () => import('@/pages/ResetPasswordPage.vue'),
    },
    {
      path: '/subscribe',
      component: () => import('@/pages/SubscribePage.vue'),
      meta: { requiresAuth: true },
      beforeEnter: requireAuth,
    },
    {
      path: '/presentation',
      component: PresentationCall,
      meta: { requiresAuth: true },
      beforeEnter: requireAuth,
    },
    {
      path: '/report',
      component: DataReportCall,
      meta: { requiresAuth: true },
      beforeEnter: requireAuth,
    },
    {
      path: '/marketing-report',
      component: MarketingReportPage,
      meta: { requiresAuth: true },
      beforeEnter: requireAuth,
    },
    {
      path: '/business-profile',
      component: BusinessProfilePage,
      meta: { requiresAuth: true },
      beforeEnter: requireAuth,
    },
    {
      path: '/data-analytics',
      component: DataAnalyticsPage,
      meta: { requiresAuth: true },
      beforeEnter: requireAuth,
    },
    {
      path: '/client-proposal',
      component: ClientProposalPage,
      meta: { requiresAuth: true },
      beforeEnter: requireAuth,
    },
    {
      path: '/ai-workflow',
      component: AIWorkflowPage,
      meta: { requiresAuth: true },
      beforeEnter: requireAuth,
    },
    {
      path: '/files',
      component: FilesPage,
      meta: { requiresAuth: true },
      beforeEnter: requireAuth,
    },
    {
      path: '/profile',
      component: ProfilePage,
      meta: { requiresAuth: true },
      beforeEnter: requireAuth,
    },
    {
      path: '/schedule',
      component: SchedulePage,
      meta: { requiresAuth: true },
      beforeEnter: requireAuth,
    },
  ],
});

export default router;

