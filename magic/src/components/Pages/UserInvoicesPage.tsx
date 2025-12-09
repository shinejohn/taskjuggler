import React, { useEffect, useState } from 'react';
import { AppLayout } from '../Layout/AppLayout';
import { InvoiceList } from '../Invoice/InvoiceList';
import { InvoiceDetail } from '../Invoice/InvoiceDetail';
import { StripePaymentForm } from '../Payment/StripePaymentForm';
import { PlaidPaymentForm } from '../Payment/PlaidPaymentForm';
import { PaymentMethodSelector } from '../Payment/PaymentMethodSelector';
interface UserInvoicesPageProps {
  onCreateTaskClick?: () => void;
  onTaskReportClick?: () => void;
  onChatClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
}
export function UserInvoicesPage({
  onCreateTaskClick,
  onTaskReportClick,
  onChatClick,
  onProfileClick,
  onHomeClick,
  onLogoutClick
}: UserInvoicesPageProps) {
  // View states: 'list', 'detail', 'payment'
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'payment'>('list');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'plaid'>('stripe');
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
          clientName: 'Sarah Miller',
          clientId: 'client-1',
          vendorName: 'Jessica Taylor',
          vendorId: 'vendor-2',
          items: [{
            id: 'item-1',
            description: 'Content Writing - Product Descriptions',
            quantity: 10,
            rate: 50,
            amount: 500
          }],
          subtotal: 500,
          serviceFee: 40,
          serviceFeePercentage: 8,
          total: 540,
          notes: 'Thank you for your business!',
          terms: 'Payment due within 14 days of issue.',
          status: 'pending',
          taskId: 'task-5',
          taskTitle: 'Product Catalog Update'
        }, {
          id: 'inv-3',
          invoiceNumber: 'INV-2023-003',
          issueDate: '2023-11-08',
          dueDate: '2023-11-22',
          clientName: 'Sarah Miller',
          clientId: 'client-1',
          vendorName: 'Michael Wong',
          vendorId: 'vendor-3',
          items: [{
            id: 'item-1',
            description: 'Social Media Graphics',
            quantity: 6,
            rate: 75,
            amount: 450
          }],
          subtotal: 450,
          serviceFee: 36,
          serviceFeePercentage: 8,
          total: 486,
          notes: 'Thank you for your business!',
          terms: 'Payment due within 14 days of issue.',
          status: 'overdue',
          taskId: 'task-6',
          taskTitle: 'Marketing Campaign'
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
  const handlePayInvoice = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setCurrentView('payment');
  };
  const handlePaymentComplete = (paymentInfo: any) => {
    // Update the invoice status to paid
    setInvoices(invoices.map(inv => inv.id === selectedInvoiceId ? {
      ...inv,
      status: 'paid',
      paymentDate: new Date().toISOString(),
      paymentMethod: paymentInfo.paymentMethod
    } : inv));
    // Return to the invoice detail view
    setCurrentView('detail');
  };
  const handleSelectPaymentMethod = (method: 'stripe' | 'plaid') => {
    setPaymentMethod(method);
  };
  const handleCancel = () => {
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
            {selectedInvoice && <InvoiceDetail invoice={selectedInvoice} userType="client" onBack={handleCancel} onPay={() => handlePayInvoice(selectedInvoice.id)} onDownload={() => console.log('Download invoice:', selectedInvoice.id)} />}
          </div>;
      case 'payment':
        const invoiceToPay = getSelectedInvoice();
        return <div>
            {invoiceToPay && <div className="space-y-6">
                <div className="mb-4">
                  <button onClick={() => setCurrentView('detail')} className="text-blue-600 hover:text-blue-800">
                    ← Back to Invoice
                  </button>
                </div>
                <PaymentMethodSelector onSelectMethod={handleSelectPaymentMethod} />
                {paymentMethod === 'stripe' ? <StripePaymentForm amount={invoiceToPay.total} invoiceId={invoiceToPay.invoiceNumber} onPaymentComplete={handlePaymentComplete} onCancel={() => setCurrentView('detail')} /> : <PlaidPaymentForm amount={invoiceToPay.total} invoiceId={invoiceToPay.invoiceNumber} onPaymentComplete={handlePaymentComplete} onCancel={() => setCurrentView('detail')} />}
              </div>}
          </div>;
      default:
        return <InvoiceList invoices={invoices} userType="client" onViewInvoice={handleViewInvoice} onPayInvoice={handlePayInvoice} />;
    }
  };
  return <AppLayout onCreateTaskClick={onCreateTaskClick} onTaskReportClick={onTaskReportClick} onChatClick={onChatClick} onProfileClick={onProfileClick} onHomeClick={onHomeClick} onLogoutClick={onLogoutClick}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentView === 'list' && 'Your Invoices'}
              {currentView === 'detail' && 'Invoice Details'}
              {currentView === 'payment' && 'Pay Invoice'}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {currentView === 'list' && 'View and manage invoices from your vendors'}
              {currentView === 'detail' && 'Review the complete invoice details'}
              {currentView === 'payment' && 'Complete payment for your invoice'}
            </p>
          </div>
          {renderContent()}
        </div>
      </div>
    </AppLayout>;
}