import React, { useEffect, useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { Mail, Phone, Book, Users, Plus, X, CheckCircle, ArrowRight, Sparkles, Loader, Copy, Share2, Upload, Gift, CheckIcon, Clock, MessageCircle, Facebook, Twitter, Smartphone, Link as LinkIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
interface Contact {
  name?: string;
  email?: string;
  phone?: string;
  status?: 'pending' | 'joined';
  joinDate?: string;
}
interface InviteFriendsPageProps {
  onSkip?: () => void;
  onComplete?: () => void;
  userName?: string;
}
export function InviteFriendsPage({
  onSkip,
  onComplete,
  userName = 'Alex'
}: InviteFriendsPageProps) {
  const [activeTab, setActiveTab] = useState<'entry' | 'import' | 'link' | 'message' | 'tracking' | 'success'>('entry');
  const [emails, setEmails] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentPhone, setCurrentPhone] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [isAddressBookLoading, setIsAddressBookLoading] = useState(false);
  const [addressBookContacts, setAddressBookContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [invitationSent, setInvitationSent] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [inviteMessage, setInviteMessage] = useState(`Hey! I'm using Task Juggler to manage my tasks and collaborate better. Join me with this link and we'll both get rewards! 🎁`);
  const [inviteLink] = useState('https://taskjuggler.com/invite/ABC123XYZ');
  const [linkCopied, setLinkCopied] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState<Contact[]>([{
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    status: 'joined',
    joinDate: '2 days ago'
  }, {
    name: 'Michael Chen',
    email: 'mchen@example.com',
    status: 'pending'
  }, {
    name: 'Taylor Williams',
    email: 'taylor.w@example.com',
    status: 'joined',
    joinDate: '5 days ago'
  }, {
    name: 'Jordan Smith',
    email: 'jsmith@example.com',
    status: 'pending'
  }]);
  const [pointsEarned, setPointsEarned] = useState(100);
  const [inviteGoal] = useState(5);
  const [invitesAccepted] = useState(2);
  const [dragActive, setDragActive] = useState(false);
  // AI processing states
  const [aiInputText, setAiInputText] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiExtractedContacts, setAiExtractedContacts] = useState<Contact[]>([]);
  const [aiSelectedContacts, setAiSelectedContacts] = useState<Contact[]>([]);
  // Trigger confetti effect when success modal is shown
  useEffect(() => {
    if (showSuccessModal) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 9999
      };
      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }
      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2
          },
          colors: ['#FF6B6B', '#4ECDC4', '#FFD166']
        });
        confetti({
          ...defaults,
          particleCount,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2
          },
          colors: ['#06D6A0', '#118AB2', '#073B4C']
        });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [showSuccessModal]);
  const addEmail = () => {
    if (currentEmail && !emails.includes(currentEmail)) {
      setEmails([...emails, currentEmail]);
      setCurrentEmail('');
    }
  };
  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };
  const addPhone = () => {
    if (currentPhone && !phones.includes(currentPhone)) {
      setPhones([...phones, currentPhone]);
      setCurrentPhone('');
    }
  };
  const removePhone = (phone: string) => {
    setPhones(phones.filter(p => p !== phone));
  };
  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };
  const handlePhoneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPhone();
    }
  };
  const handleAccessContacts = () => {
    setIsAddressBookLoading(true);
    // Simulate loading contacts from address book
    setTimeout(() => {
      const mockContacts = [{
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '555-123-4567'
      }, {
        name: 'Michael Chen',
        email: 'mchen@example.com',
        phone: '555-987-6543'
      }, {
        name: 'Taylor Williams',
        email: 'taylor.w@example.com',
        phone: '555-567-8901'
      }, {
        name: 'Jordan Smith',
        email: 'jsmith@example.com',
        phone: '555-234-5678'
      }, {
        name: 'Alex Rodriguez',
        email: 'arod@example.com',
        phone: '555-876-5432'
      }, {
        name: 'Jamie Lee',
        email: 'jamie.lee@example.com',
        phone: '555-345-6789'
      }];
      setAddressBookContacts(mockContacts);
      setIsAddressBookLoading(false);
    }, 1500);
  };
  const toggleContactSelection = (contact: Contact) => {
    if (selectedContacts.some(c => c.name === contact.name)) {
      setSelectedContacts(selectedContacts.filter(c => c.name !== contact.name));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };
  const toggleAiContactSelection = (contact: Contact, index: number) => {
    if (aiSelectedContacts.some((c, i) => i === index)) {
      setAiSelectedContacts(aiSelectedContacts.filter((c, i) => i !== index));
    } else {
      setAiSelectedContacts([...aiSelectedContacts, contact]);
    }
  };
  // AI processing function
  const processAiInput = () => {
    if (!aiInputText.trim()) return;
    setIsAiProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      // This is a simplified extraction algorithm
      // In a real app, this would be done by an actual AI service
      const lines = aiInputText.split('\n').filter(line => line.trim());
      const extractedContacts: Contact[] = [];
      const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
      const phoneRegex = /(\+?1?[ -]?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4})/gi;
      lines.forEach(line => {
        const contact: Contact = {};
        // Extract email
        const emailMatch = line.match(emailRegex);
        if (emailMatch) {
          contact.email = emailMatch[0];
          // Remove email from line to help with name extraction
          line = line.replace(emailMatch[0], '');
        }
        // Extract phone
        const phoneMatch = line.match(phoneRegex);
        if (phoneMatch) {
          contact.phone = phoneMatch[0];
          // Remove phone from line to help with name extraction
          line = line.replace(phoneMatch[0], '');
        }
        // What's left might be a name
        const possibleName = line.trim().replace(/[,;]/g, '').trim();
        if (possibleName && possibleName.length > 2) {
          contact.name = possibleName;
        }
        // Only add if we have at least an email or phone
        if (contact.email || contact.phone) {
          extractedContacts.push(contact);
        }
      });
      setAiExtractedContacts(extractedContacts);
      setAiSelectedContacts(extractedContacts); // Select all by default
      setIsAiProcessing(false);
    }, 2000);
  };
  const handleSendInvitations = () => {
    // Combine all contacts to invite
    const allEmails = [...emails];
    const allPhones = [...phones];
    const allContacts = [...selectedContacts, ...aiSelectedContacts];
    // In a real app, this would send API requests to send invitations
    console.log('Sending email invitations to:', allEmails);
    console.log('Sending SMS invitations to:', allPhones);
    console.log('Sending invitations to selected contacts:', allContacts);
    // Show success state
    setInvitationSent(true);
    setShowSuccessModal(true);
    // Reset form
    setEmails([]);
    setPhones([]);
    setSelectedContacts([]);
    setAiSelectedContacts([]);
    // After 4 seconds, hide success modal
    setTimeout(() => {
      setShowSuccessModal(false);
      setActiveTab('tracking');
    }, 4000);
  };
  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload - in a real app, this would parse the CSV/vCard
      alert('File uploaded! In a real app, this would import your contacts.');
    }
  };
  const hasInvitations = emails.length > 0 || phones.length > 0 || selectedContacts.length > 0 || aiSelectedContacts.length > 0;
  // Entry Screen - Main invite landing page
  if (activeTab === 'entry') {
    return <AuthLayout title="Earn Rewards by Inviting Friends" subtitle="Invite your friends and unlock exclusive rewards together">
        <div className="flex flex-col items-center py-6">
          <div className="w-full max-w-md mx-auto">
            {/* Reward Graphic */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <Gift size={36} className="text-blue-600" />
                  </div>
                  <div className="absolute -right-2 -top-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                    <span className="font-bold text-yellow-800">+</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Invite & Earn
              </h3>
              <p className="text-gray-700 mb-4">
                Get 50 points for each friend who joins and completes their
                first task
              </p>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Your Points:
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {pointsEarned}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{
                  width: `${invitesAccepted / inviteGoal * 100}%`
                }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {invitesAccepted} of {inviteGoal} invites accepted
                </p>
              </div>
            </div>
            {/* Invite Options */}
            <div className="space-y-4">
              <button onClick={() => setActiveTab('import')} className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                    <Users size={20} className="text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">
                      Import Contacts
                    </h3>
                    <p className="text-sm text-gray-600">
                      From Google, CSV, or vCard
                    </p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
              <button onClick={() => setActiveTab('link')} className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <LinkIcon size={20} className="text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">
                      Share Your Link
                    </h3>
                    <p className="text-sm text-gray-600">
                      Via social media or messaging
                    </p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
              <button onClick={() => setActiveTab('message')} className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                    <Mail size={20} className="text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Send Invites</h3>
                    <p className="text-sm text-gray-600">Via email or SMS</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
              <button onClick={() => setActiveTab('tracking')} className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 group-hover:bg-amber-200 transition-colors">
                    <CheckCircle size={20} className="text-amber-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Track Invites</h3>
                    <p className="text-sm text-gray-600">See who's joined</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            </div>
            <div className="mt-8 text-center">
              <button onClick={onSkip} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </AuthLayout>;
  }
  // Import Contacts Screen
  if (activeTab === 'import') {
    return <AuthLayout title="Import Contacts" subtitle="Add friends from your contacts">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button onClick={() => setActiveTab('entry')} className="mr-4 text-gray-600 hover:text-gray-900">
              ← Back
            </button>
            <div className="flex-1">
              <div className="flex space-x-2 justify-center">
                <button onClick={() => setActiveTab('import')} className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium">
                  <Book size={16} className="inline mr-2" />
                  Import
                </button>
                <button onClick={() => setActiveTab('link')} className="px-4 py-2 rounded-md bg-white text-gray-700 font-medium">
                  <LinkIcon size={16} className="inline mr-2" />
                  Link
                </button>
                <button onClick={() => setActiveTab('message')} className="px-4 py-2 rounded-md bg-white text-gray-700 font-medium">
                  <Mail size={16} className="inline mr-2" />
                  Message
                </button>
              </div>
            </div>
          </div>
          {/* Drag & Drop Area */}
          <div className={`border-2 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'} rounded-lg p-8 text-center mb-6`} onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}>
            <Upload size={32} className={`mx-auto mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {dragActive ? 'Drop your file here' : 'Drag & Drop Contact File'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload CSV, vCard, or exported contacts
            </p>
            <label className="inline-block">
              <span className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                Browse Files
              </span>
              <input type="file" className="hidden" accept=".csv,.vcf" />
            </label>
          </div>
          {/* Google Contacts */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M12 11V8L17 12L12 16V13H7V11H12Z" fill="#DB4437" />
                  <path d="M19.77 12.66C19.92 12.12 20 11.56 20 11C20 10.44 19.92 9.88 19.77 9.34L22.25 7.71C22.45 7.58 22.5 7.31 22.37 7.11L20.37 3.89C20.24 3.69 19.97 3.64 19.77 3.77L17.29 5.4C16.65 4.88 15.92 4.47 15.12 4.2L14.75 1.44C14.72 1.2 14.53 1 14.3 1H10.7C10.47 1 10.28 1.2 10.25 1.44L9.88 4.2C9.08 4.47 8.35 4.88 7.71 5.4L5.23 3.77C5.03 3.64 4.76 3.69 4.63 3.89L2.63 7.11C2.5 7.31 2.55 7.58 2.75 7.71L5.23 9.34C5.08 9.88 5 10.44 5 11C5 11.56 5.08 12.12 5.23 12.66L2.75 14.29C2.55 14.42 2.5 14.69 2.63 14.89L4.63 18.11C4.76 18.31 5.03 18.36 5.23 18.23L7.71 16.6C8.35 17.12 9.08 17.53 9.88 17.8L10.25 20.56C10.28 20.8 10.47 21 10.7 21H14.3C14.53 21 14.72 20.8 14.75 20.56L15.12 17.8C15.92 17.53 16.65 17.12 17.29 16.6L19.77 18.23C19.97 18.36 20.24 18.31 20.37 18.11L22.37 14.89C22.5 14.69 22.45 14.42 22.25 14.29L19.77 12.66Z" fill="#DB4437" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  Import Google Contacts
                </h3>
                <p className="text-sm text-gray-600">
                  Connect your Google account to import contacts
                </p>
              </div>
              <button className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Connect
              </button>
            </div>
          </div>
          {/* Manual Entry */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">
              Add Contacts Manually
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input type="text" value={currentName} onChange={e => setCurrentName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Friend's name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input type="email" value={currentEmail} onChange={e => setCurrentEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="friend@example.com" />
              </div>
              <div className="pt-2">
                <button onClick={addEmail} disabled={!currentName || !currentEmail} className={`w-full ${!currentName || !currentEmail ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 rounded-md`}>
                  Add Contact
                </button>
              </div>
            </div>
          </div>
          {emails.length > 0 && <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-3">
                Added Contacts ({emails.length})
              </h3>
              <div className="max-h-40 overflow-y-auto">
                <div className="space-y-2">
                  {emails.map((email, index) => <div key={email} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <span className="text-gray-800">{email}</span>
                      <button onClick={() => removeEmail(email)} className="text-gray-500 hover:text-red-500">
                        <X size={16} />
                      </button>
                    </div>)}
                </div>
              </div>
            </div>}
          <div className="flex justify-between pt-4">
            <button onClick={() => setActiveTab('entry')} className="text-gray-600 hover:text-gray-900 font-medium">
              Cancel
            </button>
            <button onClick={handleSendInvitations} disabled={!hasInvitations} className={`${hasInvitations ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'} text-white font-medium py-2 px-6 rounded-md`}>
              Send Invitations
            </button>
          </div>
        </div>
      </AuthLayout>;
  }
  // Share Link Screen
  if (activeTab === 'link') {
    return <AuthLayout title="Share Your Invite Link" subtitle="Invite friends via your personal referral link">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button onClick={() => setActiveTab('entry')} className="mr-4 text-gray-600 hover:text-gray-900">
              ← Back
            </button>
            <div className="flex-1">
              <div className="flex space-x-2 justify-center">
                <button onClick={() => setActiveTab('import')} className="px-4 py-2 rounded-md bg-white text-gray-700 font-medium">
                  <Book size={16} className="inline mr-2" />
                  Import
                </button>
                <button onClick={() => setActiveTab('link')} className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium">
                  <LinkIcon size={16} className="inline mr-2" />
                  Link
                </button>
                <button onClick={() => setActiveTab('message')} className="px-4 py-2 rounded-md bg-white text-gray-700 font-medium">
                  <Mail size={16} className="inline mr-2" />
                  Message
                </button>
              </div>
            </div>
          </div>
          {/* Referral Link */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-medium text-gray-900 mb-4 text-center">
              Your Personal Invite Link
            </h3>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md p-2 mb-4">
              <input type="text" value={inviteLink} readOnly className="flex-1 bg-transparent border-none focus:outline-none px-2 font-mono text-sm" />
              <button onClick={copyInviteLink} className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center">
                {linkCopied ? <>
                    <CheckIcon size={14} className="mr-1" />
                    Copied
                  </> : <>
                    <Copy size={14} className="mr-1" />
                    Copy
                  </>}
              </button>
            </div>
            <p className="text-sm text-gray-600 text-center mb-6">
              Share this link with friends to earn 50 points for each person who
              joins
            </p>
            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="flex items-center justify-center bg-[#25D366] hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-md">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.571.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375c-.99-1.576-1.516-3.391-1.516-5.26 0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.859 2.909 4.35 2.909 6.99-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
                </svg>
                WhatsApp
              </button>
              <button className="flex items-center justify-center bg-[#3b5998] hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-md">
                <Facebook size={18} className="mr-2" />
                Facebook
              </button>
              <button className="flex items-center justify-center bg-[#1DA1F2] hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-md">
                <Twitter size={18} className="mr-2" />
                Twitter
              </button>
              <button className="flex items-center justify-center bg-[#34B7F1] hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-md">
                <MessageCircle size={18} className="mr-2" />
                SMS
              </button>
            </div>
            {/* Custom Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customize Your Message
              </label>
              <textarea value={inviteMessage} onChange={e => setInviteMessage(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <button onClick={() => setActiveTab('entry')} className="text-gray-600 hover:text-gray-900 font-medium">
              Cancel
            </button>
            <button onClick={() => setActiveTab('tracking')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md">
              View Invites
            </button>
          </div>
        </div>
      </AuthLayout>;
  }
  // Message Screen (Email/SMS)
  if (activeTab === 'message') {
    return <AuthLayout title="Send Invite Messages" subtitle="Invite friends via email or SMS">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button onClick={() => setActiveTab('entry')} className="mr-4 text-gray-600 hover:text-gray-900">
              ← Back
            </button>
            <div className="flex-1">
              <div className="flex space-x-2 justify-center">
                <button onClick={() => setActiveTab('import')} className="px-4 py-2 rounded-md bg-white text-gray-700 font-medium">
                  <Book size={16} className="inline mr-2" />
                  Import
                </button>
                <button onClick={() => setActiveTab('link')} className="px-4 py-2 rounded-md bg-white text-gray-700 font-medium">
                  <LinkIcon size={16} className="inline mr-2" />
                  Link
                </button>
                <button onClick={() => setActiveTab('message')} className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium">
                  <Mail size={16} className="inline mr-2" />
                  Message
                </button>
              </div>
            </div>
          </div>
          {/* Tab for Email vs SMS */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="flex -mb-px">
              <button className="py-2 px-4 border-b-2 border-blue-600 text-blue-600 text-sm font-medium">
                <Mail size={16} className="inline mr-2" />
                Email
              </button>
              <button className="py-2 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 text-sm font-medium">
                <Smartphone size={16} className="inline mr-2" />
                SMS
              </button>
            </nav>
          </div>
          {/* Email Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Friend's Email
              </label>
              <div className="flex">
                <input type="email" id="email" value={currentEmail} onChange={e => setCurrentEmail(e.target.value)} onKeyDown={handleEmailKeyDown} className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="friend@example.com" />
                <button onClick={addEmail} className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md">
                  <Plus size={20} />
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Press Enter to add multiple emails
              </p>
            </div>
            {emails.length > 0 && <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Recipients:
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {emails.map(email => <div key={email} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <span className="text-gray-800">{email}</span>
                      <button onClick={() => removeEmail(email)} className="text-gray-500 hover:text-red-500">
                        <X size={16} />
                      </button>
                    </div>)}
                </div>
              </div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea value={inviteMessage} onChange={e => setInviteMessage(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="mt-1 text-xs text-gray-500">
                Your invite link will be automatically added to the message
              </p>
            </div>
          </div>
          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview:</h3>
            <div className="bg-white border border-gray-200 rounded-md p-3">
              <p className="text-sm text-gray-800">
                <strong>Subject:</strong> {userName} invites you to Task Juggler
              </p>
              <p className="text-sm text-gray-800 mt-2">
                <strong>Message:</strong> {inviteMessage}
              </p>
              <p className="text-sm text-blue-600 mt-2">{inviteLink}</p>
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <button onClick={() => setActiveTab('entry')} className="text-gray-600 hover:text-gray-900 font-medium">
              Cancel
            </button>
            <button onClick={handleSendInvitations} disabled={!hasInvitations} className={`${hasInvitations ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'} text-white font-medium py-2 px-6 rounded-md`}>
              Send Invitations
            </button>
          </div>
        </div>
      </AuthLayout>;
  }
  // Tracking Screen
  if (activeTab === 'tracking') {
    return <AuthLayout title="Your Invites" subtitle="Track who's joined and your rewards">
        <div className="mb-6">
          <div className="flex items-center mb-6">
            <button onClick={() => setActiveTab('entry')} className="mr-4 text-gray-600 hover:text-gray-900">
              ← Back
            </button>
          </div>
          {/* Rewards Progress */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Referral Rewards</h3>
              <span className="text-blue-600 font-bold">
                {pointsEarned} points
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-3 mb-1">
              <div className="bg-blue-600 h-3 rounded-full" style={{
              width: `${invitesAccepted / inviteGoal * 100}%`
            }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>{invitesAccepted} joined</span>
              <span>{inviteGoal} to reach next tier</span>
            </div>
          </div>
          {/* Invited Friends List */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Invited Friends</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {invitedFriends.map((friend, index) => <div key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <span className="text-gray-600 font-medium">
                          {friend.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {friend.name}
                        </h4>
                        <p className="text-sm text-gray-600">{friend.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {friend.status === 'joined' ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckIcon size={12} className="mr-1" />
                          Joined {friend.joinDate}
                        </span> : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock size={12} className="mr-1" />
                          Pending
                        </span>}
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
          <div className="flex justify-center">
            <button onClick={() => setActiveTab('entry')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md">
              Invite More Friends
            </button>
          </div>
        </div>
      </AuthLayout>;
  }
  // Success Modal (shown as overlay)
  if (showSuccessModal) {
    return <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 animate-bounce-in">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Invitations Sent!
            </h2>
            <p className="text-gray-600 mb-6">
              You've earned 50 points for sending invites!
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-medium">
                You'll earn more rewards when your friends join
              </p>
            </div>
            <button onClick={() => {
            setShowSuccessModal(false);
            setActiveTab('tracking');
          }} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md">
              View Your Invites
            </button>
          </div>
        </div>
      </div>;
  }
  // Fallback to original invitation sent view
  if (invitationSent) {
    return <AuthLayout title="Invitations Sent!" subtitle="Your friends will receive a task to join Task Juggler">
        <div className="flex flex-col items-center py-8">
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Success!</h3>
          <p className="text-gray-600 text-center mb-8">
            Your invitations have been sent. Your friends will receive a task
            from you to join Task Juggler.
          </p>
          <button onClick={onComplete} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md flex items-center justify-center">
            Continue to Dashboard
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </AuthLayout>;
  }
  // This should never be reached, but adding as a fallback
  return <AuthLayout title="Invite Friends to Task Juggler" subtitle="Help your friends and colleagues be more productive">
      <div className="text-center py-8">
        <button onClick={() => setActiveTab('entry')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md">
          Start Inviting Friends
        </button>
      </div>
    </AuthLayout>;
}