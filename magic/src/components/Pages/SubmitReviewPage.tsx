import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { SubmitReviewForm } from '../Reviews/SubmitReviewForm';
export function SubmitReviewPage() {
  const handleSubmitReview = (reviewData: any) => {
    console.log('Review submitted:', reviewData);
    alert('Review submitted successfully!');
  };
  const handleCancel = () => {
    console.log('Review cancelled');
  };
  return <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <SubmitReviewForm providerName="Alex Johnson" providerImage="https://randomuser.me/api/portraits/men/32.jpg" taskTitle="Website Redesign Project" onSubmit={handleSubmitReview} onCancel={handleCancel} />
      </div>
      <Footer />
    </div>;
}