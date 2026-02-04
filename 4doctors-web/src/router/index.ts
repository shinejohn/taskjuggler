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
import ClaimCoach from '@/pages/billing/ClaimCoach.vue'
import ClinicalLedger from '@/pages/billing/Ledger.vue'
import PriorAuthDashboard from '@/pages/prior-auth/Dashboard.vue'
import URPADashboard from '@/pages/urpa/Dashboard.vue'
import URPAMarketplace from '@/pages/urpa/Marketplace.vue'
import DocBoardDashboard from '@/pages/docboard/Dashboard.vue'
import MainLayout from '@/components/layout/MainLayout.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
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
        {
            path: '/setup/organization',
            name: 'org-setup',
            component: () => import('@/pages/setup/OrganizationSetup.vue'),
            meta: { layout: 'div' }
        },
        {
            path: '/admin/users',
            name: 'user-directory',
            component: () => import('@/pages/setup/users/UserDirectory.vue'),
            meta: { layout: MainLayout }
        },
        {
            path: '/admin/roles',
            name: 'roles-permissions',
            component: () => import('@/pages/setup/roles/Roles.vue'),
            meta: { layout: MainLayout }
        }
    ]
})

export default router
