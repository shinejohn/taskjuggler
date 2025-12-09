import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { EscrowPaymentScreen } from '../Payment/EscrowPaymentScreen';
export function EscrowPaymentPage() {
  const handlePaymentComplete = () => {
    console.log('Payment completed');
    alert('Payment processed successfully!');
  };
  const handleCancel = () => {
    console.log('Payment cancelled');
  };
  return <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <EscrowPaymentScreen taskId="t1" taskTitle="Website Redesign Project" providerName="Alex Johnson" providerImage="https://randomuser.me/api/portraits/men/32.jpg" amount={1500} serviceFee={75} estimatedReleaseDate={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)} onPaymentComplete={handlePaymentComplete} onCancel={handleCancel} />
      </div>
      <Footer />
    </div>;
}