import React from 'react';
import { Header } from '../Header';
import { AIVendorProfileCreation } from './AIVendorProfileCreation';
import { Footer } from '../Footer';
export function AIVendorProfileCreationPage() {
  return <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        <AIVendorProfileCreation />
      </div>
      <Footer />
    </div>;
}