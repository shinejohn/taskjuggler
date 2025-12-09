import React, { useEffect, useState, useRef } from 'react';
import { Paperclip, Send, Mic, Video, Phone, MoreVertical, CheckCircle, DollarSign, Clock, ArrowRight, Image, File, X } from 'lucide-react';
interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'file' | 'voice';
    url: string;
    name?: string;
    size?: string;
    duration?: string;
  }[];
  status?: 'sent' | 'delivered' | 'read';
}
interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'in-review' | 'completed';
  dueDate: Date;
  budget: string;
}
interface Contact {
  id: string;
  name: string;
  image: string;
  isOnline: boolean;
}
interface MessageThreadProps {
  conversationId: string;
  currentUserId: string;
  onBack?: () => void;
}
export function MessageThread({
  conversationId,
  currentUserId,
  onBack
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Mock data
  const contact: Contact = {
    id: 'user2',
    name: 'Alex Johnson',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    isOnline: true
  };
  const task: Task = {
    id: 't1',
    title: 'Website Redesign Project',
    status: 'in-progress',
    dueDate: new Date(2023, 11, 15),
    budget: '$1,500'
  };
  const messages: Message[] = [{
    id: 'm1',
    senderId: 'user2',
    content: "Hi there! I'm starting work on your website redesign project today.",
    timestamp: new Date(2023, 10, 17, 9, 30),
    status: 'read'
  }, {
    id: 'm2',
    senderId: currentUserId,
    content: 'Great! Do you have any questions about the requirements?',
    timestamp: new Date(2023, 10, 17, 9, 35),
    status: 'read'
  }, {
    id: 'm3',
    senderId: 'user2',
    content: 'Yes, could you clarify what you want for the homepage hero section?',
    timestamp: new Date(2023, 10, 17, 9, 42),
    status: 'read'
  }, {
    id: 'm4',
    senderId: currentUserId,
    content: "I was thinking of a full-width image with a text overlay. I've attached a reference image.",
    timestamp: new Date(2023, 10, 17, 10, 5),
    attachments: [{
      type: 'image',
      url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      name: 'hero-reference.jpg',
      size: '1.2 MB'
    }],
    status: 'read'
  }, {
    id: 'm5',
    senderId: 'user2',
    content: "That looks good! I'll work on some mockups based on this. I've also created a project timeline document for your review.",
    timestamp: new Date(2023, 10, 17, 10, 30),
    attachments: [{
      type: 'file',
      url: '#',
      name: 'project-timeline.pdf',
      size: '540 KB'
    }],
    status: 'read'
  }, {
    id: 'm6',
    senderId: 'user2',
    content: "Here's a quick voice note explaining my approach to the design.",
    timestamp: new Date(2023, 10, 17, 11, 15),
    attachments: [{
      type: 'voice',
      url: '#',
      duration: '0:45'
    }],
    status: 'read'
  }, {
    id: 'm7',
    senderId: currentUserId,
    content: "Thanks for the detailed explanation. I've reviewed the timeline and it looks good to proceed.",
    timestamp: new Date(2023, 10, 17, 13, 20),
    status: 'delivered'
  }, {
    id: 'm8',
    senderId: 'user2',
    content: "I've completed the first phase of the website redesign. Would you like to review it?",
    timestamp: new Date(2023, 10, 17, 14, 23),
    status: 'sent'
  }];
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages]);
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    // In a real app, this would send the message to the server
    console.log('Sending message:', newMessage);
    setNewMessage('');
    setShowAttachmentOptions(false);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would use the Web Audio API to record voice
  };
  const initiateVideoCall = () => {
    // In a real app, this would initiate a video call
    alert('Video call functionality would be implemented here');
  };
  const initiateAudioCall = () => {
    // In a real app, this would initiate an audio call
    alert('Audio call functionality would be implemented here');
  };
  const updateTaskStatus = (status: Task['status']) => {
    // In a real app, this would update the task status
    console.log('Updating task status to:', status);
  };
  const releasePayment = () => {
    // In a real app, this would initiate payment release
    alert('Payment release functionality would be implemented here');
  };
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'in-review':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const isMyMessage = (senderId: string) => senderId === currentUserId;
  return <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          {onBack && <button onClick={onBack} className="mr-2 text-gray-500 hover:text-gray-700">
              <ArrowRight size={20} className="transform rotate-180" />
            </button>}
          <img src={contact.image} alt={contact.name} className="h-10 w-10 rounded-full object-cover" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">
              {contact.name}
            </h3>
            <div className="flex items-center">
              <span className={`h-2 w-2 rounded-full ${contact.isOnline ? 'bg-green-500' : 'bg-gray-300'} mr-1`}></span>
              <span className="text-xs text-gray-500">
                {contact.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={initiateAudioCall} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <Phone size={20} />
          </button>
          <button onClick={initiateVideoCall} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <Video size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
      {/* Task Context */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-500">CURRENT TASK</span>
            <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
          </div>
          <div className="flex items-center">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
              {task.status.replace('-', ' ').charAt(0).toUpperCase() + task.status.replace('-', ' ').slice(1)}
            </span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-xs text-gray-600">
              Due: {task.dueDate.toLocaleDateString()}
            </span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-xs text-gray-600">{task.budget}</span>
          </div>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map(message => <div key={message.id} className={`flex ${isMyMessage(message.senderId) ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md ${isMyMessage(message.senderId) ? 'bg-blue-600 text-white rounded-l-lg rounded-br-lg' : 'bg-white text-gray-900 border border-gray-200 rounded-r-lg rounded-bl-lg'} px-4 py-3 shadow-sm`}>
                <p className="text-sm">{message.content}</p>
                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment, index) => <div key={index}>
                        {attachment.type === 'image' && <div className="mt-2">
                            <img src={attachment.url} alt="Attachment" className="max-w-full rounded-md" />
                            <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
                              <span>{attachment.name}</span>
                              <span>{attachment.size}</span>
                            </div>
                          </div>}
                        {attachment.type === 'file' && <div className={`flex items-center p-2 rounded-md ${isMyMessage(message.senderId) ? 'bg-blue-700' : 'bg-gray-100'}`}>
                            <File size={24} className={isMyMessage(message.senderId) ? 'text-blue-200' : 'text-blue-600'} />
                            <div className="ml-2 flex-1 truncate">
                              <div className={`font-medium text-xs ${isMyMessage(message.senderId) ? 'text-white' : 'text-gray-900'}`}>
                                {attachment.name}
                              </div>
                              <div className={`text-xs ${isMyMessage(message.senderId) ? 'text-blue-200' : 'text-gray-500'}`}>
                                {attachment.size}
                              </div>
                            </div>
                            <button className={`ml-2 p-1 rounded-full ${isMyMessage(message.senderId) ? 'text-white hover:bg-blue-800' : 'text-blue-600 hover:bg-gray-200'}`}>
                              <ArrowRight size={16} />
                            </button>
                          </div>}
                        {attachment.type === 'voice' && <div className={`flex items-center p-2 rounded-md ${isMyMessage(message.senderId) ? 'bg-blue-700' : 'bg-gray-100'}`}>
                            <div className={`p-1 rounded-full ${isMyMessage(message.senderId) ? 'bg-blue-800' : 'bg-blue-100'}`}>
                              <Mic size={16} className={isMyMessage(message.senderId) ? 'text-white' : 'text-blue-600'} />
                            </div>
                            <div className={`ml-2 text-xs ${isMyMessage(message.senderId) ? 'text-white' : 'text-gray-900'}`}>
                              Voice message ({attachment.duration})
                            </div>
                            <button className={`ml-auto p-1 rounded-full ${isMyMessage(message.senderId) ? 'text-white hover:bg-blue-800' : 'text-blue-600 hover:bg-gray-200'}`}>
                              <ArrowRight size={16} />
                            </button>
                          </div>}
                      </div>)}
                  </div>}
                <div className={`mt-1 text-xs ${isMyMessage(message.senderId) ? 'text-blue-200' : 'text-gray-500'} text-right`}>
                  {formatMessageTime(message.timestamp)}
                  {isMyMessage(message.senderId) && message.status && <span className="ml-1">
                      {message.status === 'read' && '✓✓'}
                      {message.status === 'delivered' && '✓✓'}
                      {message.status === 'sent' && '✓'}
                    </span>}
                </div>
              </div>
            </div>)}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Task Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-wrap justify-between items-center">
        <div className="flex space-x-2 mb-2 sm:mb-0">
          <button onClick={() => updateTaskStatus('in-progress')} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm flex items-center">
            <Clock size={16} className="mr-1" />
            Mark In Progress
          </button>
          <button onClick={() => updateTaskStatus('in-review')} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-md text-sm flex items-center">
            <CheckCircle size={16} className="mr-1" />
            Request Review
          </button>
        </div>
        <div>
          <button onClick={releasePayment} className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm flex items-center">
            <DollarSign size={16} className="mr-1" />
            Release Payment
          </button>
        </div>
      </div>
      {/* Message Input */}
      <div className="px-4 py-3 border-t border-gray-200">
        {showAttachmentOptions && <div className="mb-2 p-2 bg-gray-50 rounded-md flex space-x-3">
            <button className="p-2 bg-blue-100 text-blue-700 rounded-md flex flex-col items-center">
              <Image size={20} />
              <span className="text-xs mt-1">Image</span>
            </button>
            <button className="p-2 bg-green-100 text-green-700 rounded-md flex flex-col items-center">
              <File size={20} />
              <span className="text-xs mt-1">File</span>
            </button>
            <button onClick={() => setShowAttachmentOptions(false)} className="ml-auto p-1 text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>}
        <div className="flex items-end">
          <button onClick={() => setShowAttachmentOptions(!showAttachmentOptions)} className="p-2 text-gray-500 hover:text-gray-700">
            <Paperclip size={20} />
          </button>
          <div className="flex-1 mx-2">
            <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="Type a message..." rows={1} value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} />
          </div>
          {newMessage.trim() ? <button onClick={handleSendMessage} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
              <Send size={20} />
            </button> : <button onClick={toggleRecording} className={`p-2 rounded-full ${isRecording ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              <Mic size={20} />
            </button>}
        </div>
      </div>
    </div>;
}