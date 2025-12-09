import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
interface Conversation {
  id: string;
  contactName: string;
  contactImage: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  taskId?: string;
  taskTitle?: string;
}
interface ConversationListProps {
  onSelectConversation: (conversationId: string) => void;
  onNewMessage: () => void;
}
export function ConversationList({
  onSelectConversation,
  onNewMessage
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  // Mock conversations data
  const conversations: Conversation[] = [{
    id: 'c1',
    contactName: 'Alex Johnson',
    contactImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: "I've completed the first phase of the website redesign. Would you like to review it?",
    timestamp: new Date(2023, 10, 17, 14, 23),
    unread: true,
    taskId: 't1',
    taskTitle: 'Website Redesign Project'
  }, {
    id: 'c2',
    contactName: 'Sarah Miller',
    contactImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: "The logo drafts are ready. I've sent you 3 options to choose from.",
    timestamp: new Date(2023, 10, 16, 9, 45),
    unread: false,
    taskId: 't2',
    taskTitle: 'Logo Design for Startup'
  }, {
    id: 'c3',
    contactName: 'David Chen',
    contactImage: 'https://randomuser.me/api/portraits/men/67.jpg',
    lastMessage: 'I have a question about the content requirements for the blog posts.',
    timestamp: new Date(2023, 10, 15, 16, 12),
    unread: true,
    taskId: 't3',
    taskTitle: 'Content Writing for Blog Series'
  }, {
    id: 'c4',
    contactName: 'Emma Wilson',
    contactImage: 'https://randomuser.me/api/portraits/women/17.jpg',
    lastMessage: "Thanks for your feedback! I'll make those revisions right away.",
    timestamp: new Date(2023, 10, 14, 11, 5),
    unread: false,
    taskId: 't4',
    taskTitle: 'Social Media Graphics'
  }, {
    id: 'c5',
    contactName: 'Michael Brown',
    contactImage: 'https://randomuser.me/api/portraits/men/22.jpg',
    lastMessage: "I've uploaded the final video edit to the shared folder.",
    timestamp: new Date(2023, 10, 13, 15, 30),
    unread: false,
    taskId: 't5',
    taskTitle: 'Promotional Video Editing'
  }];
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conversation => conversation.contactName.toLowerCase().includes(searchTerm.toLowerCase()) || conversation.taskTitle && conversation.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    onSelectConversation(conversationId);
  };
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], {
        weekday: 'short'
      });
    } else {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric'
      });
    }
  };
  return <div className="w-full h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Search messages..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex justify-between mt-4">
          <button onClick={onNewMessage} className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
            <Plus size={18} className="mr-1" />
            New Message
          </button>
          <button className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium">
            <Filter size={18} className="mr-1" />
            Filter
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? <ul className="divide-y divide-gray-200">
            {filteredConversations.map(conversation => <li key={conversation.id} className={`cursor-pointer hover:bg-gray-50 ${selectedConversation === conversation.id ? 'bg-blue-50' : ''}`} onClick={() => handleSelectConversation(conversation.id)}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <img className="h-12 w-12 rounded-full object-cover" src={conversation.contactImage} alt={conversation.contactName} />
                        {conversation.unread && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-blue-600 ring-2 ring-white"></span>}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-sm font-medium text-gray-900">
                            {conversation.contactName}
                          </h3>
                          <span className="ml-2 text-xs text-gray-500">
                            {formatTimestamp(conversation.timestamp)}
                          </span>
                        </div>
                        {conversation.taskId && <div className="mt-1">
                            <span className="text-xs text-gray-500">
                              Re: {conversation.taskTitle}
                            </span>
                          </div>}
                        <p className={`mt-1 text-sm ${conversation.unread ? 'text-gray-900 font-medium' : 'text-gray-500'} line-clamp-1`}>
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>)}
          </ul> : <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <p className="text-gray-500 mb-4">No conversations found</p>
            <button onClick={onNewMessage} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Start a New Conversation
            </button>
          </div>}
      </div>
    </div>;
}