import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { CoordinatorsList } from './components/coordinators/CoordinatorsList';
import { CoordinatorDetail } from './components/coordinators/CoordinatorDetail';
import { ContactsList } from './components/contacts/ContactsList';
import { CalendarView } from './components/calendar/CalendarView';
import { CallHistory } from './components/calls/CallHistory';
import { CampaignsList } from './components/campaigns/CampaignsList';
import { Analytics } from './components/analytics/Analytics';
import { Billing } from './components/billing/Billing';
import { Settings } from './components/settings/Settings';
import { MobileDashboard } from './components/mobile/MobileDashboard';
export function App() {
  return <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Onboarding Route - Standalone layout */}
        <Route path="/onboarding" element={<OnboardingWizard />} />

        {/* Mobile Route - Standalone mobile layout */}
        <Route path="/mobile" element={<MobileDashboard />} />

        {/* Dashboard Routes - Wrapped in DashboardLayout */}
        <Route path="/dashboard" element={<DashboardLayout>
              <Dashboard />
            </DashboardLayout>} />

        <Route path="/coordinators" element={<DashboardLayout>
              <CoordinatorsList />
            </DashboardLayout>} />

        <Route path="/coordinators/:id" element={<DashboardLayout>
              <CoordinatorDetail />
            </DashboardLayout>} />

        <Route path="/contacts" element={<DashboardLayout>
              <ContactsList />
            </DashboardLayout>} />

        <Route path="/calendar" element={<DashboardLayout>
              <CalendarView />
            </DashboardLayout>} />

        <Route path="/calls" element={<DashboardLayout>
              <CallHistory />
            </DashboardLayout>} />

        <Route path="/campaigns" element={<DashboardLayout>
              <CampaignsList />
            </DashboardLayout>} />

        <Route path="/analytics" element={<DashboardLayout>
              <Analytics />
            </DashboardLayout>} />

        <Route path="/billing" element={<DashboardLayout>
              <Billing />
            </DashboardLayout>} />

        <Route path="/settings" element={<DashboardLayout>
              <Settings />
            </DashboardLayout>} />

        {/* Placeholder routes for other nav items */}
        <Route path="*" element={<DashboardLayout>
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Coming Soon
                </h2>
                <p className="text-slate-500">
                  This page is under construction.
                </p>
              </div>
            </DashboardLayout>} />
      </Routes>
    </Router>;
}