import React from 'react';
import { Outlet } from 'react-router-dom';

export const MeetingLayout: React.FC = () => {
  return (
    <div className="h-screen bg-gray-900 overflow-hidden">
      <Outlet />
    </div>
  );
};

