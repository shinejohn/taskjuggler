import React from 'react';
import { UserIcon } from 'lucide-react';

interface PresenterProps {
  isVideoOff: boolean;
}

export const Presenter: React.FC<PresenterProps> = ({ isVideoOff }) => {
  return (
    <div className="bg-bg-primary rounded-lg overflow-hidden flex-1 flex items-center justify-center relative border border-border">
      {isVideoOff ? (
        <div className="flex flex-col items-center justify-center text-text-primary">
          <div className="bg-bg-tertiary p-6 rounded-full mb-2">
            <UserIcon size={64} className="text-text-secondary" />
          </div>
          <p className="text-title-large font-medium text-text-primary">AI Presenter</p>
        </div>
      ) : (
        <>
          <img 
            src="https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="AI Presenter" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute bottom-4 left-4 glass-subtle px-3 py-2 rounded-md text-label font-medium text-text-primary flex items-center shadow-1">
            <div className="w-2 h-2 rounded-full bg-status-completed mr-2"></div>
            AI Presenter
          </div>
        </>
      )}
    </div>
  );
};
