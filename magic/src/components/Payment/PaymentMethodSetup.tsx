import React, { useState } from 'react';
import { CreditCard, Building, Wallet, Check, AlertCircle, ChevronDown } from 'lucide-react';
interface PaymentMethodSetupProps {
  onSave: (paymentMethod: PaymentMethod) => void;
  onCancel: () => void;
}
interface PaymentMethod {
  type: 'card' | 'bank' | 'wallet';
  details: any;
  billingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  isDefault: boolean;
}
export function PaymentMethodSetup({
  onSave,
  onCancel
}: PaymentMethodSetupProps) {
  const [activeTab, setActiveTab] = useState<'card' | 'bank' | 'wallet'>('card');
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});
  // Card details
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  // Bank details
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking'
  });
  // Wallet details
  const [walletType, setWalletType] = useState<'paypal' | 'apple' | 'google'>('paypal');
  const [walletEmail, setWalletEmail] = useState('');
  // Billing address
  const [billingAddress, setBillingAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US'
  });
  // Countries list for dropdown
  const countries = [{
    code: 'US',
    name: 'United States'
  }, {
    code: 'CA',
    name: 'Canada'
  }, {
    code: 'GB',
    name: 'United Kingdom'
  }, {
    code: 'AU',
    name: 'Australia'
  }, {
    code: 'DE',
    name: 'Germany'
  }, {
    code: 'FR',
    name: 'France'
  }, {
    code: 'JP',
    name: 'Japan'
  }];
  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  const handleBankDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setBankDetails({
      ...bankDetails,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setBillingAddress({
      ...billingAddress,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  const validateForm = () => {
    const newErrors: {
      [key: string]: string;
    } = {};
    if (activeTab === 'card') {
      if (!cardDetails.number) {
        newErrors.number = 'Card number is required';
      } else if (!/^\d{16}$/.test(cardDetails.number.replace(/\s/g, ''))) {
        newErrors.number = 'Invalid card number';
      }
      if (!cardDetails.name) {
        newErrors.name = 'Cardholder name is required';
      }
      if (!cardDetails.expiry) {
        newErrors.expiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
        newErrors.expiry = 'Invalid format (MM/YY)';
      }
      if (!cardDetails.cvc) {
        newErrors.cvc = 'CVC is required';
      } else if (!/^\d{3,4}$/.test(cardDetails.cvc)) {
        newErrors.cvc = 'Invalid CVC';
      }
    } else if (activeTab === 'bank') {
      if (!bankDetails.accountName) {
        newErrors.accountName = 'Account name is required';
      }
      if (!bankDetails.accountNumber) {
        newErrors.accountNumber = 'Account number is required';
      }
      if (!bankDetails.routingNumber) {
        newErrors.routingNumber = 'Routing number is required';
      }
    } else if (activeTab === 'wallet') {
      if (!walletEmail) {
        newErrors.walletEmail = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(walletEmail)) {
        newErrors.walletEmail = 'Invalid email address';
      }
    }
    // Validate billing address
    if (!billingAddress.line1) {
      newErrors.line1 = 'Address line 1 is required';
    }
    if (!billingAddress.city) {
      newErrors.city = 'City is required';
    }
    if (!billingAddress.state) {
      newErrors.state = 'State is required';
    }
    if (!billingAddress.postalCode) {
      newErrors.postalCode = 'Postal code is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    let details;
    if (activeTab === 'card') {
      details = cardDetails;
    } else if (activeTab === 'bank') {
      details = bankDetails;
    } else {
      details = {
        type: walletType,
        email: walletEmail
      };
    }
    const paymentMethod: PaymentMethod = {
      type: activeTab,
      details,
      billingAddress,
      isDefault
    };
    onSave(paymentMethod);
  };
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      value
    } = e.target;
    const formattedValue = formatCardNumber(value);
    setCardDetails({
      ...cardDetails,
      number: formattedValue
    });
    if (errors.number) {
      setErrors({
        ...errors,
        number: ''
      });
    }
  };
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      value
    } = e.target;
    const formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4).replace(/^(\d{2})(\d{0,2})/, '$1/$2');
    setCardDetails({
      ...cardDetails,
      expiry: formattedValue
    });
    if (errors.expiry) {
      setErrors({
        ...errors,
        expiry: ''
      });
    }
  };
  return <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 px-6 py-4 text-white">
        <h2 className="text-xl font-bold">Payment Method</h2>
        <p className="text-blue-100 mt-1">
          Add a new payment method to your account
        </p>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button className={`px-4 py-2 text-sm font-medium ${activeTab === 'card' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('card')}>
              <div className="flex items-center">
                <CreditCard size={18} className="mr-2" />
                Credit / Debit Card
              </div>
            </button>
            <button className={`px-4 py-2 text-sm font-medium ${activeTab === 'bank' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('bank')}>
              <div className="flex items-center">
                <Building size={18} className="mr-2" />
                Bank Account
              </div>
            </button>
            <button className={`px-4 py-2 text-sm font-medium ${activeTab === 'wallet' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('wallet')}>
              <div className="flex items-center">
                <Wallet size={18} className="mr-2" />
                Digital Wallet
              </div>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Credit/Debit Card Form */}
          {activeTab === 'card' && <div className="mb-6 space-y-4">
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input type="text" id="number" name="number" value={cardDetails.number} onChange={handleCardNumberChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="1234 5678 9012 3456" maxLength={19} />
                {errors.number && <p className="mt-1 text-red-600 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.number}
                  </p>}
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input type="text" id="name" name="name" value={cardDetails.name} onChange={handleCardDetailsChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Smith" />
                {errors.name && <p className="mt-1 text-red-600 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.name}
                  </p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input type="text" id="expiry" name="expiry" value={cardDetails.expiry} onChange={handleExpiryChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="MM/YY" maxLength={5} />
                  {errors.expiry && <p className="mt-1 text-red-600 text-sm flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.expiry}
                    </p>}
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input type="text" id="cvc" name="cvc" value={cardDetails.cvc} onChange={handleCardDetailsChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="123" maxLength={4} />
                  {errors.cvc && <p className="mt-1 text-red-600 text-sm flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.cvc}
                    </p>}
                </div>
              </div>
            </div>}
          {/* Bank Account Form */}
          {activeTab === 'bank' && <div className="mb-6 space-y-4">
              <div>
                <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name
                </label>
                <input type="text" id="accountName" name="accountName" value={bankDetails.accountName} onChange={handleBankDetailsChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Smith" />
                {errors.accountName && <p className="mt-1 text-red-600 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.accountName}
                  </p>}
              </div>
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input type="text" id="accountNumber" name="accountNumber" value={bankDetails.accountNumber} onChange={handleBankDetailsChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="123456789" />
                {errors.accountNumber && <p className="mt-1 text-red-600 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.accountNumber}
                  </p>}
              </div>
              <div>
                <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Routing Number
                </label>
                <input type="text" id="routingNumber" name="routingNumber" value={bankDetails.routingNumber} onChange={handleBankDetailsChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="123456789" />
                {errors.routingNumber && <p className="mt-1 text-red-600 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.routingNumber}
                  </p>}
              </div>
              <div>
                <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select id="accountType" name="accountType" value={bankDetails.accountType} onChange={handleBankDetailsChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>}
          {/* Digital Wallet Form */}
          {activeTab === 'wallet' && <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Wallet Type
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button type="button" onClick={() => setWalletType('paypal')} className={`p-4 border rounded-md flex flex-col items-center justify-center ${walletType === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="PayPal" className="h-8 mb-2" />
                    <span className="text-sm font-medium">PayPal</span>
                  </button>
                  <button type="button" onClick={() => setWalletType('apple')} className={`p-4 border rounded-md flex flex-col items-center justify-center ${walletType === 'apple' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Apple_Pay_logo.svg/1200px-Apple_Pay_logo.svg.png" alt="Apple Pay" className="h-8 mb-2" />
                    <span className="text-sm font-medium">Apple Pay</span>
                  </button>
                  <button type="button" onClick={() => setWalletType('google')} className={`p-4 border rounded-md flex flex-col items-center justify-center ${walletType === 'google' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png" alt="Google Pay" className="h-8 mb-2" />
                    <span className="text-sm font-medium">Google Pay</span>
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="walletEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input type="email" id="walletEmail" value={walletEmail} onChange={e => {
              setWalletEmail(e.target.value);
              if (errors.walletEmail) {
                setErrors({
                  ...errors,
                  walletEmail: ''
                });
              }
            }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="your.email@example.com" />
                {errors.walletEmail && <p className="mt-1 text-red-600 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.walletEmail}
                  </p>}
              </div>
              <div className="p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  You will be redirected to{' '}
                  {walletType === 'paypal' ? 'PayPal' : walletType === 'apple' ? 'Apple Pay' : 'Google Pay'}{' '}
                  to complete the connection after saving.
                </p>
              </div>
            </div>}
          {/* Billing Address */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Billing Address
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="line1" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input type="text" id="line1" name="line1" value={billingAddress.line1} onChange={handleBillingAddressChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="123 Main St" />
                {errors.line1 && <p className="mt-1 text-red-600 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.line1}
                  </p>}
              </div>
              <div>
                <label htmlFor="line2" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2 (Optional)
                </label>
                <input type="text" id="line2" name="line2" value={billingAddress.line2} onChange={handleBillingAddressChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Apt 4B" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input type="text" id="city" name="city" value={billingAddress.city} onChange={handleBillingAddressChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="New York" />
                  {errors.city && <p className="mt-1 text-red-600 text-sm flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.city}
                    </p>}
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State / Province
                  </label>
                  <input type="text" id="state" name="state" value={billingAddress.state} onChange={handleBillingAddressChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="NY" />
                  {errors.state && <p className="mt-1 text-red-600 text-sm flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.state}
                    </p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input type="text" id="postalCode" name="postalCode" value={billingAddress.postalCode} onChange={handleBillingAddressChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="10001" />
                  {errors.postalCode && <p className="mt-1 text-red-600 text-sm flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.postalCode}
                    </p>}
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <div className="relative">
                    <select id="country" name="country" value={billingAddress.country} onChange={handleBillingAddressChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                      {countries.map(country => <option key={country.code} value={country.code}>
                          {country.name}
                        </option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Default Payment Method */}
          <div className="mb-6">
            <label className="flex items-center">
              <input type="checkbox" checked={isDefault} onChange={() => setIsDefault(!isDefault)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <span className="ml-2 text-sm text-gray-700">
                Set as default payment method
              </span>
            </label>
          </div>
          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save Payment Method
            </button>
          </div>
        </form>
      </div>
    </div>;
}