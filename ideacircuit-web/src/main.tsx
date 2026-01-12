import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/design-system.css';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App } from './App';
import { RequireAuth } from './components/RequireAuth';
import { PresentationCall } from './pages/PresentationCall';
import { DataReportCall } from './pages/DataReportCall';
import { MarketingReportPage } from './pages/MarketingReportPage';
import { BusinessProfilePage } from './pages/BusinessProfilePage';
import { DataAnalyticsPage } from './pages/DataAnalyticsPage';
import { ClientProposalPage } from './pages/ClientProposalPage';
import { AIWorkflowPage } from './pages/AIWorkflowPage';
import { FilesPage } from './pages/FilesPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ProfilePage } from './pages/ProfilePage';
import { SchedulePage } from './pages/SchedulePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/presentation',
    element: (
      <RequireAuth>
        <PresentationCall />
      </RequireAuth>
    ),
  },
  {
    path: '/report',
    element: (
      <RequireAuth>
        <DataReportCall />
      </RequireAuth>
    ),
  },
  {
    path: '/marketing-report',
    element: (
      <RequireAuth>
        <MarketingReportPage />
      </RequireAuth>
    ),
  },
  {
    path: '/business-profile',
    element: (
      <RequireAuth>
        <BusinessProfilePage />
      </RequireAuth>
    ),
  },
  {
    path: '/data-analytics',
    element: (
      <RequireAuth>
        <DataAnalyticsPage />
      </RequireAuth>
    ),
  },
  {
    path: '/client-proposal',
    element: (
      <RequireAuth>
        <ClientProposalPage />
      </RequireAuth>
    ),
  },
  {
    path: '/ai-workflow',
    element: (
      <RequireAuth>
        <AIWorkflowPage />
      </RequireAuth>
    ),
  },
  {
    path: '/files',
    element: (
      <RequireAuth>
        <FilesPage />
      </RequireAuth>
    ),
  },
  {
    path: '/profile',
    element: (
      <RequireAuth>
        <ProfilePage />
      </RequireAuth>
    ),
  },
      {
        path: '/schedule',
        element: (
          <RequireAuth>
            <SchedulePage />
          </RequireAuth>
        ),
      },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
