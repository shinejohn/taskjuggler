import React, { useEffect, useState, useRef } from 'react';
import { Send, Paperclip, Image, Smile, Check, CheckCheck, Clock, X, MoreVertical, ChevronLeft, AlertCircle, Calendar, FileText, Download } from 'lucide-react';
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  attachment?: {
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: string;
  };
}
interface TaskDetails {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assignee: {
    name: string;
    avatar: string;
  };
  creator: {
    name: string;
    avatar: string;
  };
}
export function TaskChat() {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: 'Hi Jessica, I just assigned you the website redesign task. Could you take a look and let me know if you have any questions?',
    sender: 'user',
    timestamp: new Date('2023-11-20T09:30:00'),
    status: 'read'
  }, {
    id: '2',
    text: 'Sure thing! I just reviewed the brief. I notice you mentioned needing a "modern look" - do you have any specific websites you like the style of?',
    sender: 'other',
    timestamp: new Date('2023-11-20T09:45:00'),
    status: 'read'
  }, {
    id: '3',
    text: 'Yes, I really like the clean design of Airbnb and Stripe. Something minimal but with personality.',
    sender: 'user',
    timestamp: new Date('2023-11-20T10:15:00'),
    status: 'read'
  }, {
    id: '4',
    text: "That's helpful! I've put together a quick mood board based on those references. What do you think?",
    sender: 'other',
    timestamp: new Date('2023-11-20T11:30:00'),
    status: 'read',
    attachment: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRlc2lnbiUyMG1vb2Rib2FyZHxlbnwwfHwwfHx8MA%3D%3D',
      name: 'moodboard-v1.jpg'
    }
  }, {
    id: '5',
    text: "This looks great! I love the color palette. I'm also attaching our brand guidelines for reference.",
    sender: 'user',
    timestamp: new Date('2023-11-20T13:45:00'),
    status: 'read',
    attachment: {
      type: 'file',
      url: '#',
      name: 'brand-guidelines-2023.pdf',
      size: '2.4 MB'
    }
  }, {
    id: '6',
    text: "Thanks for the guidelines. I'll incorporate these colors and fonts. I should have the first draft ready by Thursday. Does that timeline work for you?",
    sender: 'other',
    timestamp: new Date('2023-11-20T14:20:00'),
    status: 'read'
  }, {
    id: '7',
    text: "Thursday works perfectly. I'm excited to see what you come up with!",
    sender: 'user',
    timestamp: new Date('2023-11-20T14:25:00'),
    status: 'read'
  }]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Mock task details
  const taskDetails: TaskDetails = {
    id: 'task-123',
    title: 'Website Redesign Project',
    description: 'Complete overhaul of company website with modern design principles',
    status: 'in-progress',
    dueDate: '2023-11-30',
    assignee: {
      name: 'Jessica Reynolds',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    creator: {
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  // Simulate the other person typing after 2 seconds when the user sends a message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'user') {
      setTimeout(() => {
        setIsTyping(true);
        // Simulate a response after 3 more seconds
        setTimeout(() => {
          setIsTyping(false);
          if (lastMessage.text.toLowerCase().includes('timeline') || lastMessage.text.toLowerCase().includes('deadline')) {
            addMessage('other', "I can definitely work with that timeline. I'll make sure everything is delivered on schedule.");
          } else if (lastMessage.text.toLowerCase().includes('hello') || lastMessage.text.toLowerCase().includes('hi')) {
            addMessage('other', 'Hi there! How can I help with the website redesign task today?');
          } else {
            addMessage('other', "Thanks for the update! I'll continue working on the designs based on your feedback.");
          }
        }, 3000);
      }, 2000);
    }
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      addMessage('user', newMessage);
      setNewMessage('');
    }
  };
  const addMessage = (sender: 'user' | 'other', text: string, attachment?: Message['attachment']) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      status: 'sending',
      attachment
    };
    setMessages(prev => [...prev, newMsg]);
    // Simulate message being delivered
    setTimeout(() => {
      setMessages(prev => prev.map(msg => msg.id === newMsg.id ? {
        ...msg,
        status: 'delivered'
      } : msg));
      // Simulate message being read
      if (sender === 'user') {
        setTimeout(() => {
          setMessages(prev => prev.map(msg => msg.id === newMsg.id ? {
            ...msg,
            status: 'read'
          } : msg));
        }, 2000);
      }
    }, 1000);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const isImage = file.type.startsWith('image/');
      const attachment: Message['attachment'] = {
        type: isImage ? 'image' : 'file',
        url: isImage ? URL.createObjectURL(file) : '#',
        name: file.name,
        size: formatFileSize(file.size)
      };
      addMessage('user', isImage ? 'I sent you an image.' : `I'm sharing a file: ${file.name}`, attachment);
      setShowAttachMenu(false);
    }
  };
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };
  const renderMessageStatus = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock size={14} className="text-gray-400" />;
      case 'sent':
        return <Check size={14} className="text-gray-400" />;
      case 'delivered':
        return <Check size={14} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={14} className="text-blue-500" />;
    }
  };
  // Group messages by date
  const messagesByDate: {
    [key: string]: Message[];
  } = {};
  messages.forEach(message => {
    const dateKey = message.timestamp.toDateString();
    if (!messagesByDate[dateKey]) {
      messagesByDate[dateKey] = [];
    }
    messagesByDate[dateKey].push(message);
  });
  return <div className="flex flex-col h-screen bg-gray-50">
      {/* Task Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button className="mr-2 text-gray-600 hover:text-gray-900 md:hidden">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-shrink-0">
            <img src={taskDetails.assignee.avatar} alt={taskDetails.assignee.name} className="h-10 w-10 rounded-full" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-medium text-gray-900">
              {taskDetails.title}
            </h2>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${taskDetails.status === 'completed' ? 'bg-green-100 text-green-800' : taskDetails.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {taskDetails.status === 'in-progress' ? 'In Progress' : taskDetails.status === 'completed' ? 'Completed' : 'Pending'}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-500 flex items-center">
                <Calendar size={14} className="mr-1" />
                Due{' '}
                {new Date(taskDetails.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
              </span>
            </div>
          </div>
        </div>
        <div>
          <button className="text-gray-600 hover:text-gray-900 p-1">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
      {/* Task Details Collapsed Panel */}
      <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
        <div className="flex justify-between items-center">
          <div className="text-sm text-blue-800">
            <span className="font-medium">Task Details:</span>{' '}
            {taskDetails.description}
          </div>
          <button className="text-blue-700 hover:text-blue-900 text-sm font-medium">
            View Task
          </button>
        </div>
      </div>
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.keys(messagesByDate).map(dateKey => <div key={dateKey} className="space-y-3">
            <div className="flex justify-center">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {formatDate(new Date(dateKey))}
              </span>
            </div>
            {messagesByDate[dateKey].map(message => <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex max-w-[80%]">
                  {message.sender === 'other' && <img src={taskDetails.assignee.avatar} alt={taskDetails.assignee.name} className="h-8 w-8 rounded-full mr-2 mt-1" />}
                  <div>
                    <div className={`rounded-lg px-4 py-2 ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      {message.attachment && <div className="mt-2">
                          {message.attachment.type === 'image' ? <div className="rounded-md overflow-hidden">
                              <img src={message.attachment.url} alt="Attached image" className="max-w-full h-auto" />
                              <div className={`text-xs px-2 py-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                                {message.attachment.name}
                              </div>
                            </div> : <div className={`flex items-center rounded-md p-2 ${message.sender === 'user' ? 'bg-blue-700' : 'bg-gray-100'}`}>
                              <FileText size={24} className={message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'} />
                              <div className="ml-2 flex-1 min-w-0">
                                <div className={`text-sm font-medium truncate ${message.sender === 'user' ? 'text-white' : 'text-gray-900'}`}>
                                  {message.attachment.name}
                                </div>
                                {message.attachment.size && <div className={`text-xs ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                                    {message.attachment.size}
                                  </div>}
                              </div>
                              <button className={`p-1 rounded-full ${message.sender === 'user' ? 'text-blue-200 hover:text-white hover:bg-blue-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}>
                                <Download size={16} />
                              </button>
                            </div>}
                        </div>}
                    </div>
                    <div className={`flex items-center mt-1 text-xs text-gray-500 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.sender === 'user' && <span className="ml-1">
                          {renderMessageStatus(message.status)}
                        </span>}
                    </div>
                  </div>
                  {message.sender === 'user' && <img src={taskDetails.creator.avatar} alt={taskDetails.creator.name} className="h-8 w-8 rounded-full ml-2 mt-1" />}
                </div>
              </div>)}
          </div>)}
        {isTyping && <div className="flex justify-start">
            <div className="flex">
              <img src={taskDetails.assignee.avatar} alt={taskDetails.assignee.name} className="h-8 w-8 rounded-full mr-2" />
              <div className="bg-white border border-gray-200 text-gray-500 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{
                animationDelay: '0ms'
              }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{
                animationDelay: '300ms'
              }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{
                animationDelay: '600ms'
              }}></div>
                </div>
              </div>
            </div>
          </div>}
        <div ref={messagesEndRef} />
      </div>
      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="relative flex items-center">
          <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative" onClick={() => setShowAttachMenu(!showAttachMenu)}>
            <Paperclip size={20} />
          </button>
          {showAttachMenu && <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
              <button className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left" onClick={() => {
            fileInputRef.current?.click();
            setShowAttachMenu(false);
          }}>
                <FileText size={18} className="mr-2 text-blue-500" />
                <span>Document</span>
              </button>
              <button className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left" onClick={() => {
            fileInputRef.current?.click();
            setShowAttachMenu(false);
          }}>
                <Image size={18} className="mr-2 text-green-500" />
                <span>Image</span>
              </button>
            </div>}
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" />
          <div className="flex-1 mx-2">
            <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={1} style={{
            maxHeight: '120px',
            minHeight: '40px'
          }} />
          </div>
          <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <Smile size={20} />
          </button>
          <button className={`ml-2 p-2 rounded-full ${newMessage.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400'}`} onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send size={20} />
          </button>
        </div>
        {showEmojiPicker && <div className="absolute bottom-20 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <span className="text-sm font-medium">Emoji</span>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowEmojiPicker(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-8 gap-1">
              {['😊', '👍', '❤️', '😂', '🎉', '🔥', '👏', '😎', '🤔', '😢', '😍', '🙏', '💯', '✅', '⭐', '😀'].map(emoji => <button key={emoji} className="text-xl p-1 hover:bg-gray-100 rounded" onClick={() => {
            setNewMessage(prev => prev + emoji);
            setShowEmojiPicker(false);
          }}>
                  {emoji}
                </button>)}
            </div>
          </div>}
      </div>
    </div>;
}