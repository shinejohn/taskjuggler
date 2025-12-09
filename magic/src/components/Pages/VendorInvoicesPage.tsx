import React, { useEffect, useState } from 'react';
import { AppLayout } from '../Layout/AppLayout';
import { InvoiceList } from '../Invoice/InvoiceList';
import { InvoiceDetail } from '../Invoice/InvoiceDetail';
interface VendorInvoicesPageProps {
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
}
export function VendorInvoicesPage({
  onCreateTaskClick,
  onTaskReportClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLogoutClick
}: VendorInvoicesPageProps) {
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // In a real app, this would be an API call to fetch invoices
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock data
        const mockInvoices = [{
          id: 'inv-1',
          invoiceNumber: 'INV-2023-001',
          issueDate: '2023-11-01',
          dueDate: '2023-11-15',
          clientName: 'Sarah Miller',
          clientId: 'client-1',
          vendorName: 'Alex Johnson',
          vendorId: 'vendor-1',
          items: [{
            id: 'item-1',
            description: 'Website Design - Homepage',
            quantity: 1,
            rate: 500,
            amount: 500
          }, {
            id: 'item-2',
            description: 'Website Design - About Page',
            quantity: 1,
            rate: 300,
            amount: 300
          }],
          subtotal: 800,
          serviceFee: 64,
          serviceFeePercentage: 8,
          total: 864,
          vendorAmount: 800,
          notes: 'Thank you for your business!',
          terms: 'Payment due within 14 days of issue.',
          status: 'paid',
          paymentDate: '2023-11-10',
          paymentMethod: 'Credit Card',
          taskId: 'task-1',
          taskTitle: 'Website Redesign Project'
        }, {
          id: 'inv-2',
          invoiceNumber: 'INV-2023-002',
          issueDate: '2023-11-05',
          dueDate: '2023-11-19',
          clientName: 'John Davis',
          clientId: 'client-2',
          vendorName: 'Alex Johnson',
          vendorId: 'vendor-1',
          items: [{
            id: 'item-1',
            description: 'Logo Design',
            quantity: 1,
            rate: 350,
            amount: 350
          }],
          subtotal: 350,
          serviceFee: 28,
          serviceFeePercentage: 8,
          total: 378,
          vendorAmount: 350,
          notes: 'Thank you for your business!',
          terms: 'Payment due within 14 days of issue.',
          status: 'pending',
          taskId: 'task-2',
          taskTitle: 'Brand Identity Design'
        }, {
          id: 'inv-3',
          invoiceNumber: 'INV-2023-003',
          issueDate: '2023-10-20',
          dueDate: '2023-11-03',
          clientName: 'Emily Wilson',
          clientId: 'client-3',
          vendorName: 'Alex Johnson',
          vendorId: 'vendor-1',
          items: [{
            id: 'item-1',
            description: 'Mobile App UI Design',
            quantity: 1,
            rate: 1200,
            amount: 1200
          }],
          subtotal: 1200,
          serviceFee: 96,
          serviceFeePercentage: 8,
          total: 1296,
          vendorAmount: 1200,
          notes: 'Thank you for your business!',
          terms: 'Payment due within 14 days of issue.',
          status: 'overdue',
          taskId: 'task-3',
          taskTitle: 'Fitness App Design'
        }];
        setInvoices(mockInvoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);
  const handleViewInvoice = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setCurrentView('detail');
  };
  const handleBack = () => {
    setCurrentView('list');
    setSelectedInvoiceId(null);
  };
  const getSelectedInvoice = () => {
    return invoices.find(inv => inv.id === selectedInvoiceId);
  };
  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }
    switch (currentView) {
      case 'detail':
        const selectedInvoice = getSelectedInvoice();
        return <div>
            {selectedInvoice && <InvoiceDetail invoice={selectedInvoice} userType="vendor" onBack={handleBack} onDownload={() => console.log('Download invoice:', selectedInvoice.id)} />}
          </div>;
      default:
        return <InvoiceList invoices={invoices} userType="vendor" onViewInvoice={handleViewInvoice} />;
    }
  };
  return <AppLayout onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentView === 'list' && 'Your Invoices'}
              {currentView === 'detail' && 'Invoice Details'}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {currentView === 'list' && "Manage invoices you've sent to clients"}
              {currentView === 'detail' && 'Review the complete invoice details'}
            </p>
          </div>
          {renderContent()}
        </div>
      </div>
    </AppLayout>;
}