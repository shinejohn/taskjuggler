import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { UseCases } from './components/UseCases';
import { Testimonials } from './components/Testimonials';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { TaskCreationPage } from './components/TaskCreationPage';
import { SignupTaskCreationPage } from './components/SignupTaskCreationPage';
import { DoerTimeline } from './components/DoerTimeline';
import { TaskReportPage } from './components/TaskReportPage';
import { LoginPage } from './components/Auth/LoginPage';
import { SignupPage } from './components/Auth/SignupPage';
import { ForgotPasswordPage } from './components/Auth/ForgotPasswordPage';
import { FriendSelectorPage } from './components/FriendGroup/FriendSelectorPage';
import { MarketplacePage } from './components/Marketplace/MarketplacePage';
import { VendorDetailPage } from './components/Marketplace/VendorDetailPage';
import { VendorProfileCreationPage } from './components/Marketplace/VendorProfileCreationPage';
import { TaskChatPage } from './components/Chat/TaskChatPage';
import { AIVendorProfileCreationPage } from './components/Marketplace/AIVendorProfileCreationPage';
import { PricingPlansPage } from './components/Pricing/PricingPlansPage';
import { ProfilePage } from './components/Profile/ProfilePage';
import { CheckoutPage } from './components/Payment/CheckoutPage';
import { PaymentSuccess } from './components/Payment/PaymentSuccess';
import { PaymentFailure } from './components/Payment/PaymentFailure';
import { Dashboard } from './components/Dashboard';
import { PageNavigator } from './components/PageNavigator';
import { InvitationRouting } from './components/Invitation/InvitationRouting';
import { HireForTaskPage } from './components/Hiring/HireForTaskPage';
import { SampleTaskInvitationPage } from './components/Invitation/SampleTaskInvitationPage';
import { TaskMarketplacePage } from './components/TaskMarketplacePage';
import { SearchBarPage } from './components/Pages/SearchBarPage';
import { SearchResultsPage } from './components/Pages/SearchResultsPage';
import { ConversationListPage } from './components/Pages/ConversationListPage';
import { MessageThreadPage } from './components/Pages/MessageThreadPage';
import { SubmitReviewPage } from './components/Pages/SubmitReviewPage';
import { PaymentMethodSetupPage } from './components/Pages/PaymentMethodSetupPage';
import { EscrowPaymentPage } from './components/Pages/EscrowPaymentPage';
import { MyTasksViewerPage } from './components/Pages/MyTasksViewerPage';
import { AuthGatePage } from './components/Auth/AuthGatePage';
import { TaskDetailPage } from './components/Pages/TaskDetailPage';
import { VendorInvoicesPage } from './components/Pages/VendorInvoicesPage';
import { UserInvoicesPage } from './components/Pages/UserInvoicesPage';
export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Change to true for testing
  const [isVendor, setIsVendor] = useState(false); // Track if user is a vendor
  const [currentPage, setCurrentPage] = useState<'landing' | 'create-task' | 'signup-task-creation' | 'task-report' | 'login' | 'signup' | 'forgot-password' | 'friend-selector' | 'marketplace' | 'vendor-detail' | 'vendor-profile-creation' | 'ai-vendor-profile-creation' | 'task-chat' | 'pricing' | 'profile' | 'checkout' | 'payment-success' | 'payment-failure' | 'dashboard' | 'task-invitation' | 'hire-for-task' | 'sample-invitation' | 'task-marketplace' | 'search-bar' | 'search-results' | 'conversation-list' | 'message-thread' | 'submit-review' | 'payment-method-setup' | 'escrow-payment' | 'my-tasks-viewer' | 'auth-gate' | 'task-detail' | 'vendor-invoices' | 'user-invoices'>('landing');
  // Store the intended destination when redirecting to auth
  const [intendedDestination, setIntendedDestination] = useState<string | null>(null);
  // List of pages that require authentication
  const protectedPages = ['create-task', 'task-report', 'friend-selector', 'marketplace', 'vendor-detail', 'task-chat', 'profile', 'dashboard', 'hire-for-task', 'task-marketplace', 'my-tasks-viewer', 'task-detail', 'user-invoices'];
  // List of pages that require vendor status
  const vendorOnlyPages = ['vendor-profile-creation', 'ai-vendor-profile-creation', 'vendor-invoices'];
  // Website navigation with auth check and vendor check
  const navigateToPageWithAuthCheck = (page: string, pageName?: string) => {
    if (protectedPages.includes(page) && !isAuthenticated) {
      // Store the intended destination and redirect to auth gate
      setIntendedDestination(page);
      setCurrentPage('auth-gate');
    } else if (vendorOnlyPages.includes(page) && !isVendor) {
      // Redirect to profile page with message to become a vendor
      // In a real app, you might show a modal or specific page explaining how to become a vendor
      alert('You need to sign up as a vendor to access this feature.');
      setCurrentPage('profile');
    } else {
      setCurrentPage(page as any);
    }
  };
  // Navigation functions
  const navigateToCreateTask = () => {
    if (isAuthenticated) {
      setCurrentPage('create-task');
    } else {
      setIntendedDestination('create-task');
      setCurrentPage('auth-gate');
    }
  };
  const handleTaskCreated = () => {
    // After task creation, navigate to the dashboard
    if (isAuthenticated) {
      navigateToDashboard();
    } else {
      // If user created a task during signup, consider them authenticated now
      setIsAuthenticated(true);
      navigateToDashboard();
    }
  };
  const navigateToHome = () => {
    setCurrentPage('landing');
  };
  const navigateToLogin = () => {
    setCurrentPage('login');
  };
  const navigateToSignup = () => {
    setCurrentPage('signup');
  };
  const navigateToForgotPassword = () => {
    setCurrentPage('forgot-password');
  };
  const navigateToPricing = () => {
    setCurrentPage('pricing');
  };
  // App navigation
  const navigateToTaskReport = () => {
    navigateToPageWithAuthCheck('task-report');
  };
  const navigateToFriendSelector = () => {
    navigateToPageWithAuthCheck('friend-selector');
  };
  const navigateToMarketplace = () => {
    navigateToPageWithAuthCheck('marketplace');
  };
  const navigateToVendorDetail = () => {
    navigateToPageWithAuthCheck('vendor-detail');
  };
  const navigateToVendorProfileCreation = () => {
    navigateToPageWithAuthCheck('vendor-profile-creation');
  };
  const navigateToAIVendorProfileCreation = () => {
    navigateToPageWithAuthCheck('ai-vendor-profile-creation');
  };
  const navigateToTaskChat = () => {
    navigateToPageWithAuthCheck('task-chat');
  };
  const navigateToProfile = () => {
    navigateToPageWithAuthCheck('profile');
  };
  const navigateToCheckout = () => {
    navigateToPageWithAuthCheck('checkout');
  };
  const navigateToPaymentSuccess = () => {
    navigateToPageWithAuthCheck('payment-success');
  };
  const navigateToPaymentFailure = () => {
    navigateToPageWithAuthCheck('payment-failure');
  };
  const navigateToDashboard = () => {
    navigateToPageWithAuthCheck('dashboard');
  };
  const navigateToTaskInvitation = () => {
    setCurrentPage('task-invitation');
  };
  const navigateToHireForTask = () => {
    navigateToPageWithAuthCheck('hire-for-task');
  };
  const navigateToSampleInvitation = () => {
    setCurrentPage('sample-invitation');
  };
  const navigateToTaskMarketplace = () => {
    navigateToPageWithAuthCheck('task-marketplace');
  };
  const navigateToMyTasksViewer = () => {
    navigateToPageWithAuthCheck('my-tasks-viewer');
  };
  const navigateToTaskDetail = () => {
    navigateToPageWithAuthCheck('task-detail');
  };
  // New navigation functions for invoices
  const navigateToVendorInvoices = () => {
    navigateToPageWithAuthCheck('vendor-invoices');
  };
  const navigateToUserInvoices = () => {
    navigateToPageWithAuthCheck('user-invoices');
  };
  // Function to toggle vendor status (for demo purposes)
  const toggleVendorStatus = () => {
    setIsVendor(!isVendor);
    alert(isVendor ? 'You are no longer registered as a vendor.' : 'You are now registered as a vendor!');
  };
  const handleLogin = () => {
    setIsAuthenticated(true);
    // If there's an intended destination, navigate there, otherwise go to dashboard
    if (intendedDestination) {
      setCurrentPage(intendedDestination as any);
      setIntendedDestination(null);
    } else {
      navigateToDashboard();
    }
  };
  const handleSignup = () => {
    setIsAuthenticated(true);
    // If there's an intended destination, navigate there, otherwise go to dashboard
    if (intendedDestination) {
      setCurrentPage(intendedDestination as any);
      setIntendedDestination(null);
    } else {
      navigateToDashboard();
    }
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    navigateToHome();
  };
  // Handle direct navigation from page navigator
  const handlePageNavigation = (page: string) => {
    navigateToPageWithAuthCheck(page);
  };
  // Modified Header component with navigation props
  const HeaderWithNavigation = () => <Header onCreateTaskClick={navigateToCreateTask} onLogoClick={navigateToHome} onLoginClick={navigateToLogin} />;
  // Render the appropriate page based on currentPage
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onSignupClick={navigateToSignup} onForgotPasswordClick={navigateToForgotPassword} />;
      case 'signup':
        return <SignupPage onSignupComplete={handleSignup} onLoginClick={navigateToLogin} />;
      case 'forgot-password':
        return <ForgotPasswordPage onBackToLogin={navigateToLogin} />;
      case 'auth-gate':
        return <AuthGatePage onLogin={handleLogin} onSignup={handleSignup} onCancel={navigateToHome} targetPageName={getPageDisplayName(intendedDestination)} message={`You need to sign in or create an account to ${intendedDestination === 'create-task' ? 'create a task' : 'access this feature'}.`} />;
      case 'dashboard':
        return isAuthenticated ? <Dashboard onCreateTaskClick={navigateToCreateTask} onTaskReportClick={navigateToTaskReport} onChatClick={navigateToTaskChat} onProfileClick={navigateToProfile} onHomeClick={navigateToHome} onLogoutClick={handleLogout} isVendor={isVendor} onVendorInvoicesClick={navigateToVendorInvoices} onUserInvoicesClick={navigateToUserInvoices} /> : <AuthGatePage onLogin={handleLogin} onSignup={handleSignup} onCancel={navigateToHome} targetPageName="Dashboard" />;
      case 'create-task':
        return isAuthenticated ? <TaskCreationPage onCreateTaskClick={navigateToCreateTask} onTaskReportClick={navigateToTaskReport} onChatClick={navigateToTaskChat} onProfileClick={navigateToProfile} onHomeClick={navigateToHome} onLogoutClick={handleLogout} onTaskCreated={handleTaskCreated} /> : <AuthGatePage onLogin={handleLogin} onSignup={handleSignup} onCancel={navigateToHome} targetPageName="Create Task" />;
      case 'task-report':
        return isAuthenticated ? <TaskReportPage onCreateTaskClick={navigateToCreateTask} onTaskReportClick={navigateToTaskReport} onChatClick={navigateToTaskChat} onProfileClick={navigateToProfile} onHomeClick={navigateToHome} onLogoutClick={handleLogout} /> : <AuthGatePage onLogin={handleLogin} onSignup={handleSignup} onCancel={navigateToHome} targetPageName="Task Report" />;
      case 'marketplace':
        return isAuthenticated ? <MarketplacePage /> : <AuthGatePage onLogin={handleLogin} onSignup={handleSignup} onCancel={navigateToHome} targetPageName="Marketplace" />;
      case 'vendor-detail':
        return isAuthenticated ? <VendorDetailPage /> : <AuthGatePage onLogin={handleLogin} onSignup={handleSignup} onCancel={navigateToHome} targetPageName="Vendor Detail" />;
      case 'vendor-profile-creation':
        return isVendor ? <VendorProfileCreationPage onCreateTaskClick={navigateToCreateTask} onTaskReportClick={navigateToTaskReport} onChatClick={navigateToTaskChat} onProfileClick={navigateToProfile} onHomeClick={navigateToHome} onLogoutClick={handleLogout} onComplete={navigateToProfile} /> : <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">
              Vendor Registration Required
            </h1>
            <p className="mb-4">
              You need to register as a vendor to access this feature.
            </p>
            <button onClick={toggleVendorStatus} className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Register as Vendor
            </button>
          </div>;
      case 'ai-vendor-profile-creation':
        return isVendor ? <AIVendorProfileCreationPage onCreateTaskClick={navigateToCreateTask} onTaskReportClick={navigateToTaskReport} onChatClick={navigateToTaskChat} onProfileClick={navigateToProfile} onHomeClick={navigateToHome} onLogoutClick={handleLogout} onComplete={navigateToProfile} /> : <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">
              Vendor Registration Required
            </h1>
            <p className="mb-4">
              You need to register as a vendor to access this feature.
            </p>
            <button onClick={toggleVendorStatus} className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Register as Vendor
            </button>
          </div>;
      case 'task-chat':
        return isAuthenticated ? <TaskChatPage onCreateTaskClick={navigateToCreateTask} onTaskReportClick={navigateToTaskReport} onChatClick={navigateToTaskChat} onProfileClick={navigateToProfile} onHomeClick={navigateToHome} onLogoutClick={handleLogout} /> : <AuthGatePage onLogin={handleLogin} onSignup={handleSignup} onCancel={navigateToHome} targetPageName="Task Chat" />;
      case 'profile':
        return isAuthenticated ? <ProfilePage onCreateTaskClick={navigateToCreateTask} onTaskReportClick={navigateToTaskReport} onChatClick={navigateToTaskChat} onProfileClick={navigateToProfile} onHomeClick={navigateToHome} onLogoutClick={handleLogout} isVendor={isVendor} onToggleVendorStatus={toggleVendorStatus} /> : <AuthGatePage onLogin={handleLogin} onSignup={handleSignup} onCancel={navigateToHome} targetPageName="Profile" />;
      case 'hire-for-task':
        return isAuthenticated ? <HireForTaskPage onCreateTaskClick={navigateToCreateTask} onTaskReportClick={navigateToTaskReport} onChatClick={navigateToTaskChat} onProfileClick={navigateToProfile} onHomeClick={navigateToHome} onLogoutClick={handleLogout} onTaskCreated={handleTaskCreated} /> : <AuthGatePage onLogin={handleLogin} onSignup={handleSignup} onCancel={navigateToHome} targetPageName="Hire For Task" />;
      case 'task-marketplace':
        return isAuthenticated ? <TaskMarketplacePage /> : <AuthGatePage onLogin={handleLogin} onSignup={handleSignup} onCancel={navigateToHome} targetPageName="Task Marketplace" />;
      case 'my-tasks-viewer':
        return isAuthenticated ? <MyTasksViewerPage isVendor={isVendor} onTaskClick={navigateToTaskDetail} onCreateTaskClick={navigateToCreateTask} /> : <AuthGatePage onLogin={handleLogin} onSignup={handleSignup} onCancel={navigateToHome} targetPageName="My Tasks" />;
      case 'task-detail':
        return isAuthenticated ? <TaskDetailPage onCreateTaskClick={navigateToCreateTask} onTaskReportClick={navigateToTaskReport} onMyTasksClick={navigateToMyTasksViewer} onTaskMarketClick={navigateToTaskMarketplace} onDoerMarketClick={navigateToMarketplace} onChatClick={navigateToTaskChat} onProfileClick={navigateToProfile} onHomeClick={navigateToHome} onLogoutClick={handleLogout} onBackToTasks={navigateToMyTasksViewer} onEditTask={taskId => console.log(`Edit task: ${taskId}`)} /> : <AuthGatePage onLogin={handleLogin} onSignup={handleSignup} onCancel={navigateToHome} targetPageName="Task Detail" />;
      // New invoice pages
      case 'vendor-invoices':
        return isVendor ? <VendorInvoicesPage onCreateTaskClick={navigateToCreateTask} onTaskReportClick={navigateToTaskReport} onChatClick={navigateToTaskChat} onProfileClick={navigateToProfile} onHomeClick={navigateToHome} onLogoutClick={handleLogout} /> : <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">
              Vendor Registration Required
            </h1>
            <p className="mb-4">
              You need to register as a vendor to access vendor invoicing.
            </p>
            <button onClick={toggleVendorStatus} className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Register as Vendor
            </button>
          </div>;
      case 'user-invoices':
        return isAuthenticated ? <UserInvoicesPage onCreateTaskClick={navigateToCreateTask} onTaskReportClick={navigateToTaskReport} onChatClick={navigateToTaskChat} onProfileClick={navigateToProfile} onHomeClick={navigateToHome} onLogoutClick={handleLogout} /> : <AuthGatePage onLogin={handleLogin} onSignup={handleSignup} onCancel={navigateToHome} targetPageName="Your Invoices" />;
      // Non-protected pages and default case
      case 'pricing':
        return <PricingPlansPage />;
      default:
        return <>
            <main>
              <Hero onGetStartedClick={navigateToCreateTask} />
              <Features />
              <HowItWorks />
              <DoerTimeline />
              <UseCases />
              <Testimonials />
              <CTA onGetStartedClick={navigateToCreateTask} />
            </main>
            <Footer />
          </>;
    }
  };
  // Helper function to get user-friendly page names
  const getPageDisplayName = (page: string | null): string => {
    if (!page) return 'this page';
    const pageNames: {
      [key: string]: string;
    } = {
      'create-task': 'Create Task',
      dashboard: 'Dashboard',
      'task-report': 'Task Report',
      marketplace: 'Marketplace',
      'vendor-detail': 'Vendor Detail',
      'task-chat': 'Task Chat',
      profile: 'Profile',
      'hire-for-task': 'Hire For Task',
      'task-marketplace': 'Task Marketplace',
      'my-tasks-viewer': 'My Tasks',
      'vendor-invoices': 'Vendor Invoices',
      'user-invoices': 'Your Invoices'
    };
    return pageNames[page] || page.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  return <>
      {currentPage === 'login' || currentPage === 'signup' || currentPage === 'forgot-password' ? <>
          {renderCurrentPage()}
          <PageNavigator onNavigate={handlePageNavigation} currentPage={currentPage} />
        </> : currentPage === 'auth-gate' ? <>
          <HeaderWithNavigation />
          {renderCurrentPage()}
          <PageNavigator onNavigate={handlePageNavigation} currentPage={currentPage} />
        </> : <>
          <HeaderWithNavigation />
          {renderCurrentPage()}
          <PageNavigator onNavigate={handlePageNavigation} currentPage={currentPage} isVendor={isVendor} />
        </>}
    </>;
}