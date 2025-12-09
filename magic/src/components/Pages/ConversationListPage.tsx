import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { ConversationList } from '../Messaging/ConversationList';
export function ConversationListPage() {
  const handleSelectConversation = (conversationId: string) => {
    console.log(`Selected conversation: ${conversationId}`);
  };
  const handleNewMessage = () => {
    console.log('Starting new message');
  };
  return <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Conversations
          </h1>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{
          height: '600px'
        }}>
            <ConversationList onSelectConversation={handleSelectConversation} onNewMessage={handleNewMessage} />
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}