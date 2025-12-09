import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { PaymentMethodSetup } from '../Payment/PaymentMethodSetup';
export function PaymentMethodSetupPage() {
  const handleSavePaymentMethod = (paymentMethod: any) => {
    console.log('Payment method saved:', paymentMethod);
    alert('Payment method saved successfully!');
  };
  const handleCancel = () => {
    console.log('Payment method setup cancelled');
  };
  return <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <PaymentMethodSetup onSave={handleSavePaymentMethod} onCancel={handleCancel} />
      </div>
      <Footer />
    </div>;
}