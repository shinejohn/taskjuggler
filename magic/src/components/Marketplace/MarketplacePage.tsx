import React, { useState } from 'react';
import { Header } from '../Header';
import { TaskMarketplace } from './TaskMarketplace';
import { ProviderBrowse } from './ProviderBrowse';
import { ProviderDetail } from './ProviderDetail';
import { TaskDoerDashboard } from './TaskDoerDashboard';
import { Footer } from '../Footer';
export function MarketplacePage() {
  const [currentView, setCurrentView] = useState<'task-marketplace' | 'provider-browse' | 'provider-detail' | 'doer-dashboard'>('provider-browse');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const viewProviderDetail = (providerId: string) => {
    setSelectedProviderId(providerId);
    setCurrentView('provider-detail');
  };
  const backToProviderBrowse = () => {
    setCurrentView('provider-browse');
  };
  const switchToTaskMarketplace = () => {
    setCurrentView('task-marketplace');
  };
  const switchToDoerDashboard = () => {
    setCurrentView('doer-dashboard');
  };
  return <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        {currentView === 'task-marketplace' && <TaskMarketplace />}
        {currentView === 'provider-browse' && <ProviderBrowse />}
        {currentView === 'provider-detail' && selectedProviderId && <ProviderDetail providerId={selectedProviderId} onBack={backToProviderBrowse} />}
        {currentView === 'doer-dashboard' && <TaskDoerDashboard />}
        {/* View Switcher - This would be more elegantly integrated in a real app */}
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-2 flex flex-col space-y-2">
            <button onClick={switchToTaskMarketplace} className={`px-4 py-2 text-sm rounded ${currentView === 'task-marketplace' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Task Marketplace
            </button>
            <button onClick={backToProviderBrowse} className={`px-4 py-2 text-sm rounded ${currentView === 'provider-browse' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Provider Browse
            </button>
            <button onClick={switchToDoerDashboard} className={`px-4 py-2 text-sm rounded ${currentView === 'doer-dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Doer Dashboard
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}