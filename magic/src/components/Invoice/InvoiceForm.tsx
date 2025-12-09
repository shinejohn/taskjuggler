import React, { useEffect, useState } from 'react';
import { PlusIcon, TrashIcon, CalendarIcon, DollarSignIcon, ClipboardIcon, ArrowDownIcon } from 'lucide-react';
interface Task {
  id: string;
  title: string;
  description?: string;
  clientId: string;
  clientName: string;
  status: string;
  estimatedHours?: number;
  actualHours?: number;
  hourlyRate?: number;
  fixedPrice?: number;
  paymentType?: 'hourly' | 'fixed';
}
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}
interface InvoiceFormProps {
  taskId?: string;
  clientId?: string;
  clientName?: string;
  onSubmit: (invoiceData: any) => void;
  onCancel: () => void;
  existingInvoice?: any;
  availableTasks?: Task[];
  autoCreateLineItem?: boolean;
}
export function InvoiceForm({
  taskId,
  clientId,
  clientName,
  onSubmit,
  onCancel,
  existingInvoice,
  availableTasks = [],
  autoCreateLineItem = false
}: InvoiceFormProps) {
  const [invoiceNumber, setInvoiceNumber] = useState(existingInvoice?.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`);
  const [issueDate, setIssueDate] = useState(existingInvoice?.issueDate || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(existingInvoice?.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [items, setItems] = useState<InvoiceItem[]>(existingInvoice?.items || []);
  const [notes, setNotes] = useState(existingInvoice?.notes || '');
  const [terms, setTerms] = useState(existingInvoice?.terms || 'Payment due within 14 days of issue.');
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(taskId);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(clientId);
  const [selectedClientName, setSelectedClientName] = useState<string | undefined>(clientName);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  // Find and set the selected task when taskId changes or when availableTasks loads
  useEffect(() => {
    if (selectedTaskId && availableTasks.length > 0) {
      const task = availableTasks.find(t => t.id === selectedTaskId);
      if (task) {
        setSelectedTask(task);
        setSelectedClientId(task.clientId);
        setSelectedClientName(task.clientName);
        // If autoCreateLineItem is true or this is a new form with a task selected,
        // automatically create line items based on task details
        if ((autoCreateLineItem || !existingInvoice) && items.length === 0) {
          createLineItemFromTask(task);
        }
      }
    }
  }, [selectedTaskId, availableTasks, autoCreateLineItem]);
  // Initialize with at least one empty item if no items exist
  useEffect(() => {
    if (items.length === 0 && !selectedTask) {
      setItems([{
        id: '1',
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0
      }]);
    }
  }, [items, selectedTask]);
  // Create line item based on task details
  const createLineItemFromTask = (task: Task) => {
    if (!task) return;
    let newItem: InvoiceItem;
    if (task.paymentType === 'fixed' || task.fixedPrice) {
      // Fixed price task
      newItem = {
        id: Date.now().toString(),
        description: `${task.title} - Fixed Price Project`,
        quantity: 1,
        rate: task.fixedPrice || 0,
        amount: task.fixedPrice || 0
      };
    } else {
      // Hourly task
      const hours = task.actualHours || task.estimatedHours || 0;
      const rate = task.hourlyRate || 0;
      newItem = {
        id: Date.now().toString(),
        description: `${task.title} - Professional Services`,
        quantity: hours,
        rate: rate,
        amount: hours * rate
      };
    }
    setItems([newItem]);
  };
  const addItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }]);
  };
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          [field]: value
        };
        // Recalculate amount if quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    }));
  };
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };
  const calculateTotal = () => {
    return calculateSubtotal();
  };
  const handleTaskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTaskId = e.target.value;
    setSelectedTaskId(newTaskId === 'none' ? undefined : newTaskId);
  };
  // Create a line item from task details
  const addTaskAsLineItem = () => {
    if (!selectedTask) return;
    // Create a new line item based on task details
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: `Task: ${selectedTask.title}`,
      quantity: selectedTask.actualHours || selectedTask.estimatedHours || 1,
      rate: selectedTask.hourlyRate || 50,
      amount: selectedTask.paymentType === 'fixed' ? selectedTask.fixedPrice || 0 : (selectedTask.actualHours || selectedTask.estimatedHours || 1) * (selectedTask.hourlyRate || 50)
    };
    // Add to existing items
    setItems([...items, newItem]);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceData = {
      invoiceNumber,
      issueDate,
      dueDate,
      clientId: selectedClientId,
      clientName: selectedClientName,
      taskId: selectedTaskId,
      taskTitle: selectedTask?.title,
      items,
      subtotal: calculateSubtotal(),
      total: calculateTotal(),
      notes,
      terms,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    onSubmit(invoiceData);
  };
  // Automatically populate notes with task description if it exists
  useEffect(() => {
    if (selectedTask?.description && !existingInvoice) {
      setNotes(`Invoice for task: ${selectedTask.title}\n\n${selectedTask.description}`);
    }
  }, [selectedTask, existingInvoice]);
  return <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {existingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
          </h2>
          <p className="text-gray-600">
            {existingInvoice ? 'Update the invoice details below' : 'Fill in the details to create a new invoice'}
          </p>
        </div>

        {/* Task Selection Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Related Task
          </h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Task to Bill Against
            </label>
            <select value={selectedTaskId || 'none'} onChange={handleTaskChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={!!existingInvoice}>
              <option value="none">-- Select a task --</option>
              {availableTasks.map(task => <option key={task.id} value={task.id}>
                  {task.title} - {task.clientName}{' '}
                  {task.status === 'completed' ? '(Completed)' : ''}
                </option>)}
            </select>
          </div>
          {selectedTask && <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-700">Task Details</h4>
                <button type="button" onClick={() => setShowTaskDetails(!showTaskDetails)} className="text-sm text-blue-600 hover:text-blue-800">
                  {showTaskDetails ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              {showTaskDetails && <div className="bg-white p-3 rounded border border-gray-200 mb-3">
                  <p className="text-sm font-medium text-gray-700">
                    Title:{' '}
                    <span className="font-normal">{selectedTask.title}</span>
                  </p>
                  {selectedTask.description && <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">
                        Description:
                      </p>
                      <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                        {selectedTask.description}
                      </p>
                    </div>}
                  <p className="text-sm font-medium text-gray-700 mt-2">
                    Status:{' '}
                    <span className="font-normal">{selectedTask.status}</span>
                  </p>
                  <p className="text-sm font-medium text-gray-700 mt-1">
                    Client:{' '}
                    <span className="font-normal">
                      {selectedTask.clientName}
                    </span>
                  </p>
                  {selectedTask.paymentType === 'fixed' || selectedTask.fixedPrice ? <p className="text-sm font-medium text-gray-700 mt-1">
                      Fixed Price:{' '}
                      <span className="font-normal">
                        ${selectedTask.fixedPrice?.toFixed(2) || '0.00'}
                      </span>
                    </p> : <>
                      <p className="text-sm font-medium text-gray-700 mt-1">
                        Hours:{' '}
                        <span className="font-normal">
                          {selectedTask.actualHours || selectedTask.estimatedHours || 0}
                        </span>
                      </p>
                      <p className="text-sm font-medium text-gray-700 mt-1">
                        Rate:{' '}
                        <span className="font-normal">
                          ${selectedTask.hourlyRate?.toFixed(2) || '0.00'}/hr
                        </span>
                      </p>
                    </>}
                </div>}
              <button type="button" onClick={addTaskAsLineItem} className="mt-1 inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none">
                <ClipboardIcon size={16} className="mr-1" />
                Add Task as Line Item
              </button>
            </div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Number
            </label>
            <input type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <input type="text" value={selectedClientName || ''} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issue Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon size={18} className="text-gray-400" />
              </div>
              <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon size={18} className="text-gray-400" />
              </div>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
            <button type="button" onClick={addItem} className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
              <PlusIcon size={16} className="mr-1" />
              Add Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map(item => <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="text" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Item description" required />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="number" min="1" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" required />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSignIcon size={14} className="text-gray-400" />
                        </div>
                        <input type="number" min="0" step="0.01" value={item.rate} onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} className="w-28 pl-7 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" required />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${item.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button type="button" onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-900" disabled={items.length === 1}>
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  ${calculateSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Additional notes for the client..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terms & Conditions
            </label>
            <textarea value={terms} onChange={e => setTerms(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Payment terms and conditions..."></textarea>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
            {existingInvoice ? 'Update Invoice' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>;
}