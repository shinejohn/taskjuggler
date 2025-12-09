import React from 'react';
import { Header } from '../Header';
import { FriendSelector } from './FriendSelector';
import { Footer } from '../Footer';
export function FriendSelectorPage() {
  return <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        <FriendSelector />
      </div>
      <Footer />
    </div>;
}