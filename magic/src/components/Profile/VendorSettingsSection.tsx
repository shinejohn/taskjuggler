import React from 'react';
import { ShoppingBag, Edit, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
interface VendorSettingsProps {
  isVendor: boolean;
  onToggleVendorStatus: () => void;
  onNavigateToVendorProfileCreation: () => void;
  onNavigateToAIVendorProfileCreation: () => void;
}
export function VendorSettingsSection({
  isVendor,
  onToggleVendorStatus,
  onNavigateToVendorProfileCreation,
  onNavigateToAIVendorProfileCreation
}: VendorSettingsProps) {
  return <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Vendor Settings</h2>
      </div>
      {!isVendor ? <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-3">
              <ShoppingBag className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Become a Vendor
              </h3>
              <p className="text-gray-600 mb-4">
                Sign up to offer your services on our platform. As a vendor, you
                can create a professional profile, list your services, and
                receive task requests from clients.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    Create a professional vendor profile
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    List your services and set your own rates
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    Access to vendor-specific tools and analytics
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    Receive payments securely through our platform
                  </p>
                </div>
              </div>
              <button onClick={onToggleVendorStatus} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center">
                <ShoppingBag size={18} className="mr-2" />
                Sign Up as Vendor
              </button>
            </div>
          </div>
        </div> : <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-800 font-medium">
                You are registered as a vendor
              </p>
              <p className="text-green-700 text-sm">
                You can now create and manage your vendor profile and services.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Edit size={20} className="mr-2 text-blue-500" />
                Manage Vendor Profile
              </h3>
              <p className="text-gray-600 mb-4">
                Create or edit your professional vendor profile, add your
                skills, portfolio, and services.
              </p>
              <button onClick={onNavigateToVendorProfileCreation} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center">
                <ExternalLink size={16} className="mr-2" />
                Edit Vendor Profile
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <AlertCircle size={20} className="mr-2 text-purple-500" />
                AI-Assisted Profile Creation
              </h3>
              <p className="text-gray-600 mb-4">
                Let our AI help you create a professional vendor profile based
                on your skills and experience.
              </p>
              <button onClick={onNavigateToAIVendorProfileCreation} className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md flex items-center">
                <ExternalLink size={16} className="mr-2" />
                Use AI Assistant
              </button>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Vendor Status</h4>
                <p className="text-sm text-gray-600">
                  You can opt out of being a vendor at any time
                </p>
              </div>
              <button onClick={onToggleVendorStatus} className="text-red-600 hover:text-red-800 text-sm font-medium">
                Deactivate Vendor Account
              </button>
            </div>
          </div>
        </div>}
    </div>;
}