import React, { useState } from 'react';
import { AppLayout } from '../Layout/AppLayout';
import { VendorProfile } from './VendorProfile';
interface VendorProfilePageProps {
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
  onNavigateToVendorInvoices?: () => void;
}
export function VendorProfilePage({
  onCreateTaskClick,
  onTaskReportClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLogoutClick,
  onNavigateToVendorInvoices = () => {}
}: VendorProfilePageProps) {
  // These handlers would navigate to the appropriate pages in a real app
  const handleEditProfile = () => {
    console.log('Navigate to edit profile page');
    // In a real app, this would navigate to the vendor profile editing page
    window.location.href = '#/vendor-profile-creation';
  };
  const handleAddService = () => {
    console.log('Navigate to add service page');
    // In a real app, this would navigate to the service creation page
  };
  const handleEditService = (serviceId: string) => {
    console.log(`Navigate to edit service page for service ${serviceId}`);
    // In a real app, this would navigate to the service editing page with the serviceId
  };
  return <AppLayout onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick}>
      <VendorProfile onEditProfile={handleEditProfile} onAddService={handleAddService} onEditService={handleEditService} onNavigateToVendorInvoices={onNavigateToVendorInvoices} />
    </AppLayout>;
}