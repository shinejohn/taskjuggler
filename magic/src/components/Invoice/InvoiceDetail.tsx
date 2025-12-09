import React from 'react';
import { ArrowLeft, Download, CreditCard, FileText, Check, AlertCircle } from 'lucide-react';
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}
interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  clientName: string;
  clientId: string;
  vendorName: string;
  vendorId: string;
  items: InvoiceItem[];
  subtotal: number;
  serviceFee?: number;
  serviceFeePercentage?: number;
  total: number;
  notes?: string;
  terms?: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paymentDate?: string;
  paymentMethod?: string;
  taskId: string;
  taskTitle: string;
}
interface InvoiceDetailProps {
  invoice: Invoice;
  userType: 'client' | 'vendor';
  onBack: () => void;
  onPay?: () => void;
  onDownload: () => void;
}
export function InvoiceDetail({
  invoice,
  userType,
  onBack,
  onPay,
  onDownload
}: InvoiceDetailProps) {
  // Calculate service fee if not already included in the invoice
  const serviceFeePercentage = invoice.serviceFeePercentage || 8;
  const subtotal = invoice.subtotal;
  const serviceFee = invoice.serviceFee || Math.round(subtotal * serviceFeePercentage / 100);
  const total = invoice.total || subtotal + serviceFee;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const getStatusBadge = () => {
    switch (invoice.status) {
      case 'paid':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
            <Check size={14} className="mr-1" />
            Paid
          </span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Pending
          </span>;
      case 'overdue':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
            <AlertCircle size={14} className="mr-1" />
            Overdue
          </span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {invoice.status}
          </span>;
    }
  };
  return <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-gray-600 hover:text-gray-900 flex items-center">
            <ArrowLeft size={20} className="mr-1" />
            Back to Invoices
          </button>
          <div className="flex space-x-2">
            <button onClick={onDownload} className="flex items-center text-gray-700 hover:text-gray-900">
              <Download size={18} className="mr-1" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Invoice #{invoice.invoiceNumber}
            </h1>
            <div className="flex items-center">
              <p className="text-gray-600 mr-3">
                {formatDate(invoice.issueDate)}
              </p>
              {getStatusBadge()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Amount Due</div>
            <div className="text-3xl font-bold text-gray-900">
              ${total.toFixed(2)}
            </div>
            {invoice.status === 'paid' && invoice.paymentDate && <div className="text-sm text-green-600 mt-1">
                Paid on {formatDate(invoice.paymentDate)}
                {invoice.paymentMethod && ` via ${invoice.paymentMethod}`}
              </div>}
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                {userType === 'client' ? 'From' : 'Bill To'}
              </h3>
              <p className="text-gray-900 font-medium">
                {userType === 'client' ? invoice.vendorName : invoice.clientName}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Related Task
              </h3>
              <p className="text-gray-900">{invoice.taskTitle}</p>
              <p className="text-sm text-gray-600">ID: {invoice.taskId}</p>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                {userType === 'client' ? 'Bill To' : 'From'}
              </h3>
              <p className="text-gray-900 font-medium">
                {userType === 'client' ? invoice.clientName : invoice.vendorName}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Issue Date
                </h3>
                <p className="text-gray-900">{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Due Date
                </h3>
                <p className="text-gray-900">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Invoice Items
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map(item => <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 text-right">{item.quantity}</td>
                    <td className="px-6 py-4 text-right">
                      ${item.rate.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      ${item.amount.toFixed(2)}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="mb-8 flex justify-end">
          <div className="w-full md:w-1/2">
            <div className="border-t border-gray-200 pt-4 pb-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-medium">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">
                  TaskJuggler Service Fee ({serviceFeePercentage}%)
                </span>
                <span className="text-gray-900 font-medium">
                  ${serviceFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-3 border-t border-gray-200">
                <span className="text-gray-900 font-bold">Total</span>
                <span className="text-gray-900 font-bold">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes and Terms */}
        {(invoice.notes || invoice.terms) && <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {invoice.notes && <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Notes
                </h3>
                <p className="text-gray-600">{invoice.notes}</p>
              </div>}
            {invoice.terms && <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Terms and Conditions
                </h3>
                <p className="text-gray-600">{invoice.terms}</p>
              </div>}
          </div>}

        {/* Pay Button - Only for clients and pending/overdue invoices */}
        {userType === 'client' && (invoice.status === 'pending' || invoice.status === 'overdue') && onPay && <div className="mt-8 flex justify-end">
              <button onClick={onPay} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md flex items-center">
                <CreditCard size={18} className="mr-2" />
                Pay Now
              </button>
            </div>}
      </div>
    </div>;
}