import React from 'react';
import { Eye, CreditCard, AlertCircle, Check, Clock } from 'lucide-react';
interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  clientName: string;
  vendorName: string;
  subtotal: number;
  serviceFee?: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  taskTitle: string;
}
interface InvoiceListProps {
  invoices: Invoice[];
  userType: 'client' | 'vendor';
  onViewInvoice: (invoiceId: string) => void;
  onPayInvoice?: (invoiceId: string) => void;
}
export function InvoiceList({
  invoices,
  userType,
  onViewInvoice,
  onPayInvoice
}: InvoiceListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check size={12} className="mr-1" />
            Paid
          </span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>;
      case 'overdue':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle size={12} className="mr-1" />
            Overdue
          </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>;
    }
  };
  const isOverdue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    return due < now;
  };
  return <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {userType === 'client' ? 'Vendor' : 'Client'}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.length === 0 ? <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No invoices found
                </td>
              </tr> : invoices.map(invoice => <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userType === 'client' ? invoice.vendorName : invoice.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                    {invoice.taskTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Issue: {formatDate(invoice.issueDate)}</div>
                    <div className={`text-xs ${isOverdue(invoice.dueDate) && invoice.status !== 'paid' ? 'text-red-600 font-medium' : ''}`}>
                      Due: {formatDate(invoice.dueDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${invoice.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => onViewInvoice(invoice.id)} className="text-blue-600 hover:text-blue-900" title="View Invoice">
                        <Eye size={18} />
                      </button>
                      {onPayInvoice && userType === 'client' && (invoice.status === 'pending' || invoice.status === 'overdue') && <button onClick={() => onPayInvoice(invoice.id)} className="text-green-600 hover:text-green-900" title="Pay Invoice">
                            <CreditCard size={18} />
                          </button>}
                    </div>
                  </td>
                </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}