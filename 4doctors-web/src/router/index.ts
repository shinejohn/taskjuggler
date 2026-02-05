import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/pages/LandingPage.vue'
import Login from '@/pages/Login.vue'
import SignUp from '@/pages/SignUp.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Scribe from '@/pages/Scribe.vue'
import Claims from '@/pages/Claims.vue'
import ClaimDetails from '@/pages/ClaimDetails.vue'
import Patients from '@/pages/Patients.vue'
import PatientChart from '@/pages/PatientChart.vue'
import Settings from '@/pages/Settings.vue'
import Schedule from '@/pages/Schedule.vue'
import ScribeReview from '@/pages/ScribeReview.vue'
import Marketplace from '@/pages/Marketplace.vue'
import DocLife from '@/pages/DocLife.vue'
import DocConnect from '@/pages/DocConnect.vue'
import ClaimCoach from '@/pages/billing/ClaimCoach.vue'
import ClinicalLedger from '@/pages/billing/Ledger.vue'
import PriorAuthDashboard from '@/pages/prior-auth/Dashboard.vue'
import URPADashboard from '@/pages/urpa/Dashboard.vue'
import URPAMarketplace from '@/pages/urpa/Marketplace.vue'
import DocBoardDashboard from '@/pages/docboard/Dashboard.vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // Patient Portal Routes
        {
            path: '/portal/login',
            name: 'portal-login',
            component: () => import('@/pages/portal/Login.vue'),
            meta: { layout: 'div' }
        },
        {
            path: '/portal',
            redirect: '/portal/dashboard',
            component: () => import('@/components/layout/PortalLayout.vue'),
            children: [
                {
                    path: 'dashboard',
                    name: 'portal-dashboard',
                    component: () => import('@/pages/portal/Dashboard.vue')
                },
                {
                    path: 'profile',
                    name: 'portal-profile',
                    component: () => import('@/pages/portal/Profile.vue')
                },
                {
                    path: 'appointments',
                    name: 'portal-appointments',
                    component: () => import('@/pages/portal/Appointments.vue')
                },
                {
                    path: 'labs',
                    name: 'portal-labs',
                    component: () => import('@/pages/portal/LabResults.vue')
                },
                {
                    path: 'prior-auth',
                    name: 'portal-prior-auth',
                    component: () => import('@/pages/portal/PriorAuth.vue')
                },
                {
                    path: 'messages',
                    name: 'portal-messages',
                    component: () => import('@/pages/portal/Messages.vue')
                }
            ]
        },
        {
            path: '/',
            name: 'landing',
            component: LandingPage,
            meta: { layout: 'div' }
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: { layout: 'div' }
        },
        {
            path: '/signup',
            name: 'signup',
            component: SignUp,
            meta: { layout: 'div' }
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            meta: { layout: MainLayout }
        },
        {
            path: '/docboard',
            name: 'docboard',
            component: DocBoardDashboard,
            meta: { layout: MainLayout }
        },
        {
            path: '/urpa',
            name: 'urpa-dashboard',
            component: URPADashboard,
            meta: { layout: MainLayout }
        },
        {
            path: '/urpa/modules',
            name: 'urpa-marketplace',
            component: URPAMarketplace,
            meta: { layout: MainLayout }
        },
        {
            path: '/urpa/builder',
            name: 'urpa-builder',
            component: () => import('@/pages/urpa/WorkflowBuilder.vue'),
            meta: { layout: MainLayout }
        },
        {
            path: '/schedule',
            name: 'schedule',
            component: Schedule,
            meta: { layout: MainLayout }
        },
        {
            path: '/scribe',
            name: 'scribe',
            component: Scribe,
            meta: { layout: MainLayout }
        },
        {
            path: '/visit/:id/review',
            name: 'visit-review',
            component: ScribeReview,
            meta: { layout: MainLayout }
        },
        // ScribeMD Live Dashboard (New)
        {
            path: '/scribemd',
            name: 'scribemd-live',
            component: () => import('@/pages/scribemd/LiveDashboardView.vue'),
            meta: { layout: 'div' }
        },
        {
            path: '/scribemd/:id',
            name: 'scribemd-visit',
            component: () => import('@/pages/scribemd/LiveDashboardView.vue'),
            meta: { layout: 'div' }
        },
        {
            path: '/scribe/phrases',
            name: 'smart-phrases',
            component: () => import('@/pages/scribe/SmartPhrases.vue'),
            meta: { layout: MainLayout }
        },
        {
            path: '/claims',
            name: 'claims',
            component: Claims,
            meta: { layout: MainLayout }
        },
        {
            path: '/claims/:id',
            name: 'claim-details',
            component: ClaimDetails,
            meta: { layout: MainLayout }
        },
        {
            path: '/billing/claimcoach',
            name: 'claimcoach',
            component: ClaimCoach,
            meta: { layout: MainLayout }
        },
        {
            path: '/billing/ledger',
            name: 'clinical-ledger',
            component: ClinicalLedger,
            meta: { layout: MainLayout }
        },
        {
            path: '/prior-auth',
            name: 'prior-auth',
            component: PriorAuthDashboard,
            meta: { layout: MainLayout }
        },
        {
            path: '/prior-auth/new',
            name: 'new-auth-request',
            component: () => import('@/pages/prior-auth/NewRequest.vue'),
            meta: { layout: MainLayout }
        },
        {
            path: '/rx',
            name: 'eprescribing',
            component: () => import('@/pages/rx/Dashboard.vue'),
            meta: { layout: MainLayout }
        },
        {
            path: '/patients',
            name: 'patients',
            component: Patients,
            meta: { layout: MainLayout }
        },
        {
            path: '/patients/:id',
            name: 'patient-chart',
            component: PatientChart,
            meta: { layout: MainLayout }
        },
        {
            path: '/settings',
            name: 'settings',
            component: Settings,
            meta: { layout: MainLayout }
        },
        // Business Mode Routes
        {
            path: '/staff',
            name: 'staff-management',
            component: () => import('@/pages/staff/StaffManagement.vue'),
            meta: { layout: MainLayout, mode: 'business' }
        },
        {
            path: '/vendors',
            name: 'vendor-management',
            component: () => import('@/pages/vendors/VendorManagement.vue'),
            meta: { layout: MainLayout, mode: 'business' }
        },
        {
            path: '/marketing',
            name: 'marketing',
            component: () => import('@/pages/marketing/Marketing.vue'),
            meta: { layout: MainLayout, mode: 'business' }
        },
        {
            path: '/cme',
            name: 'cme-tracking',
            component: () => import('@/pages/cme/CMETracking.vue'),
            meta: { layout: MainLayout, mode: 'business' }
        },
        // Practice Mode Routes
        {
            path: '/labs',
            name: 'lab-results',
            component: () => import('@/pages/labs/LabResults.vue'),
            meta: { layout: MainLayout, mode: 'practice' }
        },
        {
            path: '/referrals',
            name: 'referrals',
            component: () => import('@/pages/referrals/Referrals.vue'),
            meta: { layout: MainLayout, mode: 'practice' }
        },
        // Personal Mode Routes
        {
            path: '/travel',
            name: 'travel',
            component: () => import('@/pages/travel/Travel.vue'),
            meta: { layout: MainLayout, mode: 'personal' }
        },
        {
            path: '/goals',
            name: 'goals',
            component: () => import('@/pages/goals/Goals.vue'),
            meta: { layout: MainLayout, mode: 'personal' }
        },
        {
            path: '/social',
            name: 'social',
            component: () => import('@/pages/social/Social.vue'),
            meta: { layout: MainLayout, mode: 'personal' }
        },
        {
            path: '/files',
            name: 'files',
            component: () => import('@/pages/files/Files.vue'),
            meta: { layout: MainLayout, mode: 'personal' }
        },
        {
            path: '/setup/organization',
            name: 'org-setup',
            component: () => import('@/pages/setup/OrganizationSetup.vue'),
            meta: { layout: 'div' }
        },
        // Admin Routes
        {
            path: '/admin',
            component: () => import('@/layouts/AdminLayout.vue'),
            children: [
                {
                    path: '',
                    name: 'admin-dashboard',
                    component: () => import('@/pages/admin/AdminDashboard.vue')
                },
                {
                    path: 'users',
                    name: 'user-directory',
                    component: () => import('@/pages/setup/users/UserDirectory.vue'),
                    meta: { title: 'User Management' }
                },
                {
                    path: 'roles',
                    name: 'roles-permissions',
                    component: () => import('@/pages/setup/roles/Roles.vue'),
                    meta: { title: 'Roles & Permissions' }
                },
                {
                    path: 'audit-log',
                    name: 'audit-log',
                    component: () => import('@/pages/admin/AuditLog.vue'),
                    meta: { title: 'Audit Log' }
                }
            ]
        },
        {
            path: '/marketplace',
            name: 'marketplace',
            component: Marketplace,
            meta: { layout: MainLayout }
        },
        {
            path: '/doclife',
            name: 'doclife',
            component: DocLife,
            meta: { layout: MainLayout }
        },
        {
            path: '/docconnect',
            name: 'docconnect',
            component: DocConnect,
            meta: { layout: MainLayout }
        },
        {
            path: '/docconnect/directory',
            name: 'docconnect-directory',
            component: () => import('@/pages/docconnect/Directory.vue'),
            meta: { layout: MainLayout }
        },
        {
            path: '/docconnect/profile/:id',
            name: 'docconnect-profile',
            component: () => import('@/pages/docconnect/Profile.vue'),
            meta: { layout: MainLayout }
        },
        {
            path: '/docconnect/referrals',
            name: 'docconnect-referrals',
            component: () => import('@/pages/docconnect/Referrals.vue'),
            meta: { layout: MainLayout }
        },
        // Onboarding Route
        {
            path: '/onboarding',
            name: 'onboarding',
            component: () => import('@/pages/onboarding/OnboardingWizard.vue'),
            meta: { layout: 'div' } // No MainLayout, standalone wizard
        }
    ]
})

router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore()

    const publicPages = ['login', 'signup', 'landing', 'portal-login']
    const authRequired = !publicPages.includes(to.name as string)

    if (authRequired && !authStore.isAuthenticated) {
        return next({ name: 'login' })
    }

    if (authStore.isAuthenticated) {
        // Redirect patients to portal if they try to access main app
        if (authStore.isPatient && !to.path.startsWith('/portal')) {
            return next({ name: 'portal-dashboard' })
        }

        // Prevent non-patients from accessing portal (optional, but good for UX)
        // if (!authStore.isPatient && to.path.startsWith('/portal')) {
        //     return next({ name: 'dashboard' })
        // }
    }

    next()
})

export default router
