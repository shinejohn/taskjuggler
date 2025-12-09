import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { MessageThread } from '../Messaging/MessageThread';
export function MessageThreadPage() {
  return <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Message Thread
          </h1>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{
          height: '700px'
        }}>
            <MessageThread conversationId="c1" currentUserId="user1" />
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}