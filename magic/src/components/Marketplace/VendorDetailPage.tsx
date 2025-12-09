import React from 'react';
import { Header } from '../Header';
import { VendorDetail } from './VendorDetail';
import { Footer } from '../Footer';
export function VendorDetailPage() {
  return <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        <VendorDetail />
      </div>
      <Footer />
    </div>;
}