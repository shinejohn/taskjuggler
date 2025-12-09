import React, { useState } from 'react';
import { UserInfoSection } from './UserInfoSection';
import { SubscriptionSection } from './SubscriptionSection';
import { VendorSettingsSection } from './VendorSettingsSection';
import { User, CreditCard, Bell, Lock, HelpCircle, LogOut, Users, ShoppingBag } from 'lucide-react';
import { AppLayout } from '../Layout/AppLayout';
import { InviteFriendsPage } from '../Auth/InviteFriendsPage';
interface ProfilePageProps {
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
  isVendor?: boolean;
  onToggleVendorStatus?: () => void;
}
export function ProfilePage({
  onCreateTaskClick,
  onTaskReportClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLogoutClick,
  isVendor = false,
  onToggleVendorStatus = () => {}
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'notifications' | 'security' | 'help' | 'invite-friends' | 'vendor-settings'>('profile');
  // Navigation functions for vendor profile pages
  const navigateToVendorProfileCreation = () => {
    // This would typically use a router in a real app
    window.location.href = '#/vendor-profile-creation';
  };
  const navigateToAIVendorProfileCreation = () => {
    // This would typically use a router in a real app
    window.location.href = '#/ai-vendor-profile-creation';
  };
  // Mock user data
  const userData = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105'
    },
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
  };
  // Mock subscription data
  const subscriptionData = {
    plan: 'Personal Pro',
    status: 'active',
    billingPeriod: 'monthly',
    price: 8,
    nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    paymentMethod: {
      type: 'credit_card',
      last4: '4242',
      brand: 'Visa',
      expiryDate: '04/25'
    },
    invoices: [{
      id: 'INV-001',
      date: '2023-06-15',
      amount: 8,
      status: 'paid'
    }, {
      id: 'INV-002',
      date: '2023-07-15',
      amount: 8,
      status: 'paid'
    }, {
      id: 'INV-003',
      date: '2023-08-15',
      amount: 8,
      status: 'paid'
    }]
  };
  return <AppLayout onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick}>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex md:gap-8">
            {/* Sidebar */}
            <div className="md:w-64 flex-shrink-0 mb-8 md:mb-0">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center">
                    <img src={userData.profileImage} alt={userData.name} className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {userData.name}
                      </h3>
                      <p className="text-sm text-gray-600">{userData.email}</p>
                    </div>
                  </div>
                </div>
                <nav className="p-4">
                  <ul className="space-y-1">
                    <li>
                      <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <User size={18} className={`mr-3 ${activeTab === 'profile' ? 'text-blue-700' : 'text-gray-500'}`} />
                        Profile Information
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setActiveTab('vendor-settings')} className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'vendor-settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <ShoppingBag size={18} className={`mr-3 ${activeTab === 'vendor-settings' ? 'text-blue-700' : 'text-gray-500'}`} />
                        Vendor Settings
                        {isVendor && <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                            Active
                          </span>}
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setActiveTab('subscription')} className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'subscription' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <CreditCard size={18} className={`mr-3 ${activeTab === 'subscription' ? 'text-blue-700' : 'text-gray-500'}`} />
                        Subscription & Billing
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setActiveTab('invite-friends')} className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'invite-friends' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <Users size={18} className={`mr-3 ${activeTab === 'invite-friends' ? 'text-blue-700' : 'text-gray-500'}`} />
                        Invite Friends
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <Bell size={18} className={`mr-3 ${activeTab === 'notifications' ? 'text-blue-700' : 'text-gray-500'}`} />
                        Notifications
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setActiveTab('security')} className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <Lock size={18} className={`mr-3 ${activeTab === 'security' ? 'text-blue-700' : 'text-gray-500'}`} />
                        Security
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setActiveTab('help')} className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'help' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <HelpCircle size={18} className={`mr-3 ${activeTab === 'help' ? 'text-blue-700' : 'text-gray-500'}`} />
                        Help & Support
                      </button>
                    </li>
                  </ul>
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <button onClick={onLogoutClick} className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">
                      <LogOut size={18} className="mr-3 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                </nav>
              </div>
            </div>
            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {activeTab === 'profile' && <UserInfoSection userData={userData} />}
                {activeTab === 'subscription' && <SubscriptionSection subscriptionData={subscriptionData} />}
                {activeTab === 'vendor-settings' && <VendorSettingsSection isVendor={isVendor} onToggleVendorStatus={onToggleVendorStatus} onNavigateToVendorProfileCreation={() => window.location.href = '#/vendor-profile-creation'} onNavigateToAIVendorProfileCreation={() => window.location.href = '#/ai-vendor-profile-creation'} />}
                {activeTab === 'invite-friends' && <div className="p-0">
                    <InviteFriendsPage userName={userData.name.split(' ')[0]} onComplete={() => setActiveTab('profile')} onSkip={() => setActiveTab('profile')} />
                  </div>}
                {activeTab === 'notifications' && <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Notification Preferences
                    </h2>
                    <p className="text-gray-600">
                      Notification settings coming soon.
                    </p>
                  </div>}
                {activeTab === 'security' && <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Security Settings
                    </h2>
                    <p className="text-gray-600">
                      Security settings coming soon.
                    </p>
                  </div>}
                {activeTab === 'help' && <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Help & Support
                    </h2>
                    <p className="text-gray-600">
                      Support options coming soon.
                    </p>
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>;
}