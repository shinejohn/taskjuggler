import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavigationMenu } from '../components/NavigationMenu';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">IdeaCircuit</h1>
        <NavigationMenu />
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

