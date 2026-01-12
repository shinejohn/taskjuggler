import React from 'react';
import { MicIcon, MicOffIcon } from 'lucide-react';

interface Participant {
  id: number | string;
  name: string;
  image?: string;
  isMuted?: boolean;
  isActive?: boolean;
}

interface ParticipantsProps {
  participants: Participant[];
}

export const Participants: React.FC<ParticipantsProps> = ({ participants }) => {
  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary text-body-medium">
        No participants yet
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2">
      {participants.map(participant => (
        <div 
          key={participant.id} 
          className="glass-standard rounded-lg shadow-1 p-2 flex items-center hover:shadow-2 transition-all duration-normal"
        >
          <div className="relative">
            <img 
              src={participant.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=007AFF&color=fff`} 
              alt={participant.name} 
              className="w-10 h-10 rounded-md object-cover" 
            />
            {participant.isActive && (
              <div className="absolute bottom-0 right-0 bg-status-completed w-2 h-2 rounded-full border-2 border-bg-primary"></div>
            )}
          </div>
          <div className="ml-2 flex-1">
            <p className="font-medium text-body-small text-text-primary">{participant.name}</p>
            <p className="text-caption text-text-secondary">
              {participant.isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div>
            {participant.isMuted ? (
              <MicOffIcon size={14} className="text-destructive" />
            ) : (
              <MicIcon size={14} className="text-text-secondary" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
