import React, { useEffect, useState, useRef } from 'react';
import { SendIcon } from 'lucide-react';

interface Message {
  sender: string;
  text: string;
  isAI: boolean;
}

interface ChatPanelProps {
  messages: Message[];
  addMessage: (text: string) => void | Promise<void>;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, addMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await addMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 glass-subtle border-b border-border font-medium text-title-medium text-text-primary">
        Chat
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-text-secondary text-body-medium">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[80%] rounded-lg px-4 py-2 shadow-1 ${
                message.isAI 
                  ? 'bg-bg-secondary text-text-primary' 
                  : 'bg-primary text-white'
              }`}>
                <p className="text-caption font-medium mb-1 opacity-80">
                  {message.sender}
                </p>
                <p className="text-body-medium">{message.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t border-border glass-subtle">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            className="flex-1 border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]" 
            placeholder="Type a message..." 
            value={newMessage} 
            onChange={e => setNewMessage(e.target.value)} 
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()} 
          />
          <button 
            className="bg-primary text-white px-4 py-3 rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-primary-hover transition-colors duration-fast"
            onClick={handleSendMessage}
            aria-label="Send message"
          >
            <SendIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
