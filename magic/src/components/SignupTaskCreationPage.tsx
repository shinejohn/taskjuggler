import React from 'react';
import { TaskCreator } from './TaskCreator';
import { Header } from './Header';
import { Footer } from './Footer';
interface SignupTaskCreationPageProps {
  onTaskCreated?: () => void;
}
export function SignupTaskCreationPage({
  onTaskCreated
}: SignupTaskCreationPageProps) {
  return <div className="w-full min-h-screen bg-gray-50">
      <Header onCreateTaskClick={() => {}} // This is already the task creation page
    onLogoClick={() => window.history.back()} // Go back to home
    onLoginClick={() => window.location.href = '/login'} // Navigate to login
    />
      <div className="pt-24 pb-16">
        <TaskCreator isSignupFlow={true} onTaskCreated={onTaskCreated} />
      </div>
      <Footer />
    </div>;
}