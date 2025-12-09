import React, { useState } from 'react';
import { UserIcon, CalendarIcon, ClockIcon, AlertCircleIcon, PaperclipIcon, MapPinIcon, PhoneIcon, MailIcon, InfoIcon, XIcon, SendIcon, UsersIcon, AtSignIcon, GlobeIcon, SearchIcon, UserIcon as SingleUserIcon, UserCheckIcon, BotIcon, StarIcon, DollarSignIcon, ClockIcon as TimeIcon, FilterIcon } from 'lucide-react';
type Priority = 'low' | 'medium' | 'high';
type AssignmentOption = 'friend' | 'invite' | 'marketplace-post' | 'marketplace-browse' | 'self';
type ContactMethod = 'email' | 'phone';
type TaskVisibility = 'public' | 'private';
type UserType = 'human' | 'ai';
interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: Priority;
  location: string;
  locationContactName: string;
  locationContactPhone: string;
  attachments: File[];
  notes: string;
  // New assignment fields
  assignmentOption: AssignmentOption | null;
  selectedContact: string | null;
  contactMethod: ContactMethod;
  inviteFirstName: string;
  inviteLastName: string;
  inviteEmail: string;
  invitePhone: string;
  inviteMessage: string;
  taskVisibility: TaskVisibility;
  taskBudget: string;
  requiredSkills: string[];
  applicationsDeadline: string;
  userTypeFilter: UserType | 'all';
}
interface TaskCreatorProps {
  isSignupFlow?: boolean;
  onTaskCreated?: () => void;
}
export function TaskCreator({
  isSignupFlow = false,
  onTaskCreated
}: TaskCreatorProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    location: '',
    locationContactName: '',
    locationContactPhone: '',
    attachments: [],
    notes: '',
    // Initialize new assignment fields
    assignmentOption: null,
    selectedContact: null,
    contactMethod: 'email',
    inviteFirstName: '',
    inviteLastName: '',
    inviteEmail: '',
    invitePhone: '',
    inviteMessage: '',
    taskVisibility: 'public',
    taskBudget: '',
    requiredSkills: [],
    applicationsDeadline: '',
    userTypeFilter: 'all'
  });
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  // Mock data for contacts
  const contacts = [{
    id: '1',
    name: 'Sarah Miller',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    type: 'human',
    status: 'available'
  }, {
    id: '2',
    name: 'David Chen',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    type: 'human',
    status: 'busy'
  }, {
    id: '3',
    name: 'Emily Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    type: 'human',
    status: 'available'
  }, {
    id: '4',
    name: 'TaskBot',
    avatar: 'https://ui-avatars.com/api/?name=TB&background=6366f1&color=fff',
    type: 'ai',
    status: 'available'
  }, {
    id: '5',
    name: 'ResearchAI',
    avatar: 'https://ui-avatars.com/api/?name=RA&background=6366f1&color=fff',
    type: 'ai',
    status: 'available'
  }];
  // Mock data for marketplace
  const marketplaceUsers = [{
    id: 'm1',
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    type: 'human',
    rating: 4.9,
    skills: ['Web Design', 'Copywriting'],
    hourlyRate: 25
  }, {
    id: 'm2',
    name: 'Jessica Taylor',
    avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
    type: 'human',
    rating: 4.7,
    skills: ['Data Entry', 'Research'],
    hourlyRate: 20
  }, {
    id: 'm3',
    name: 'Michael Wong',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    type: 'human',
    rating: 4.8,
    skills: ['Graphic Design', 'Marketing'],
    hourlyRate: 30
  }, {
    id: 'm4',
    name: 'WriterBot',
    avatar: 'https://ui-avatars.com/api/?name=WB&background=6366f1&color=fff',
    type: 'ai',
    rating: 4.6,
    skills: ['Content Writing', 'Editing'],
    hourlyRate: 15
  }, {
    id: 'm5',
    name: 'AnalyticsAI',
    avatar: 'https://ui-avatars.com/api/?name=AA&background=6366f1&color=fff',
    type: 'ai',
    rating: 4.5,
    skills: ['Data Analysis', 'Reporting'],
    hourlyRate: 18
  }];
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...fileList]
      }));
      setAttachmentNames(prev => [...prev, ...fileList.map(file => file.name)]);
    }
  };
  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
    setAttachmentNames(prev => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the task to the server
    console.log('Task created:', formData);
    // Show success message
    if (isSignupFlow) {
      alert('Account created and first task added! Welcome to Task Juggler!');
    } else {
      alert('Task created successfully!');
    }
    // Reset form
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      dueTime: '',
      priority: 'medium',
      location: '',
      locationContactName: '',
      locationContactPhone: '',
      attachments: [],
      notes: '',
      assignmentOption: null,
      selectedContact: null,
      contactMethod: 'email',
      inviteFirstName: '',
      inviteLastName: '',
      inviteEmail: '',
      invitePhone: '',
      inviteMessage: '',
      taskVisibility: 'public',
      taskBudget: '',
      requiredSkills: [],
      applicationsDeadline: '',
      userTypeFilter: 'all'
    });
    setAttachmentNames([]);
    setStep(1);
    // Notify parent component that task was created
    if (onTaskCreated) {
      onTaskCreated();
    }
  };
  const nextStep = () => {
    if (step === 1) {
      if (formData.title) {
        setStep(2);
      } else {
        alert('Please fill in the task title');
      }
    } else if (step === 2) {
      setStep(3);
    }
  };
  const prevStep = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };
  const setAssignmentOption = (option: AssignmentOption) => {
    setFormData(prev => ({
      ...prev,
      assignmentOption: option,
      // Reset related fields when changing option
      selectedContact: null,
      inviteFirstName: '',
      inviteLastName: '',
      inviteEmail: '',
      invitePhone: '',
      inviteMessage: ''
    }));
  };
  const selectContact = (contactId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedContact: contactId
    }));
  };
  const addSkill = () => {
    if (newSkill.trim() && !formData.requiredSkills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };
  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill)
    }));
  };
  // Filter contacts based on userTypeFilter
  const filteredContacts = contacts.filter(contact => {
    if (formData.userTypeFilter === 'all') return true;
    return contact.type === formData.userTypeFilter;
  });
  // Filter marketplace users based on userTypeFilter
  const filteredMarketplaceUsers = marketplaceUsers.filter(user => {
    if (formData.userTypeFilter === 'all') return true;
    return user.type === formData.userTypeFilter;
  });
  return <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isSignupFlow ? 'Create Your First Task' : 'Create New Task'}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {isSignupFlow ? "Let's get started by creating your first task" : 'Assign a clear task to anyone using just their email'}
        </p>
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Progress Indicator */}
        <div className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                1
              </div>
              <span className="ml-2 font-medium text-gray-700">
                Task Details
              </span>
            </div>
            <div className="flex-1 mx-4">
              <div className={`h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
              <span className="ml-2 font-medium text-gray-700">Location</span>
            </div>
            <div className="flex-1 mx-4">
              <div className={`h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                3
              </div>
              <span className="ml-2 font-medium text-gray-700">
                Assign Task
              </span>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-8">
          {step === 1 ? <div className="space-y-6">
              {/* Task Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="E.g. Review contract draft" required />
              </div>
              {/* Task Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add more details about the task" />
              </div>
              {/* Due Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Requested Due Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon size={18} className="text-gray-400" />
                    </div>
                    <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    The Do-er will confirm or suggest an alternative
                  </p>
                </div>
                <div>
                  <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Requested Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon size={18} className="text-gray-400" />
                    </div>
                    <input type="time" id="dueTime" name="dueTime" value={formData.dueTime} onChange={handleInputChange} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input type="radio" name="priority" value="low" checked={formData.priority === 'low'} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span className="ml-2 text-gray-700">Low</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="priority" value="medium" checked={formData.priority === 'medium'} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span className="ml-2 text-gray-700">Medium</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="priority" value="high" checked={formData.priority === 'high'} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span className="ml-2 text-gray-700">High</span>
                  </label>
                </div>
              </div>
              <div className="pt-4">
                <button type="button" onClick={nextStep} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                  Continue to Location
                </button>
              </div>
            </div> : step === 2 ? <div className="space-y-6">
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon size={18} className="text-gray-400" />
                  </div>
                  <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Address or location for this task" />
                </div>
              </div>
              {/* Location Contact Name */}
              <div>
                <label htmlFor="locationContactName" className="block text-sm font-medium text-gray-700 mb-1">
                  Location Contact Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon size={18} className="text-gray-400" />
                  </div>
                  <input type="text" id="locationContactName" name="locationContactName" value={formData.locationContactName} onChange={handleInputChange} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Name of person to contact at location" />
                </div>
              </div>
              {/* Location Contact Phone */}
              <div>
                <label htmlFor="locationContactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Location Contact Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon size={18} className="text-gray-400" />
                  </div>
                  <input type="tel" id="locationContactPhone" name="locationContactPhone" value={formData.locationContactPhone} onChange={handleInputChange} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Phone number for questions" />
                </div>
              </div>
              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachments
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <PaperclipIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload files</span>
                        <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, JPG, PNG up to 10MB each
                    </p>
                  </div>
                </div>
                {/* Attachment List */}
                {attachmentNames.length > 0 && <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      Attached Files:
                    </h4>
                    <ul className="mt-2 divide-y divide-gray-200">
                      {attachmentNames.map((name, index) => <li key={index} className="py-2 flex justify-between items-center">
                          <div className="flex items-center">
                            <PaperclipIcon size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">
                              {name}
                            </span>
                          </div>
                          <button type="button" onClick={() => removeAttachment(index)} className="text-red-500 hover:text-red-700">
                            <XIcon size={16} />
                          </button>
                        </li>)}
                    </ul>
                  </div>}
              </div>
              {/* Additional Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Any other details the assignee should know" />
              </div>
              {/* Task Preview */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex items-center mb-2">
                  <InfoIcon size={18} className="text-blue-600 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">
                    Task Preview
                  </h3>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-medium text-gray-900">
                    {formData.title || 'Task Title'}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.description || 'No description provided'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {formData.location && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Location: {formData.location}
                      </span>}
                    {formData.dueDate && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        Due: {formData.dueDate} {formData.dueTime}
                      </span>}
                    <span className={`px-2 py-1 rounded ${formData.priority === 'high' ? 'bg-red-100 text-red-800' : formData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                      {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}{' '}
                      Priority
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button type="button" onClick={prevStep} className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50">
                  Back
                </button>
                <button type="button" onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                  Continue to Assign Task
                </button>
              </div>
            </div> : <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Who Should Do This Task?
              </h2>
              {/* Assignment Options */}
              <div className="space-y-3">
                {/* Assign to Friend/Associate */}
                <div onClick={() => setAssignmentOption('friend')} className={`p-4 border rounded-lg cursor-pointer transition-colors ${formData.assignmentOption === 'friend' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full ${formData.assignmentOption === 'friend' ? 'bg-blue-100' : 'bg-gray-100'} mr-3`}>
                      <UsersIcon size={20} className={formData.assignmentOption === 'friend' ? 'text-blue-600' : 'text-gray-600'} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Assign to a Friend/Associate
                      </h3>
                      <p className="text-sm text-gray-600">
                        Choose from your contacts who use Task Juggler
                      </p>
                    </div>
                  </div>
                </div>
                {/* Invite Someone New */}
                <div onClick={() => setAssignmentOption('invite')} className={`p-4 border rounded-lg cursor-pointer transition-colors ${formData.assignmentOption === 'invite' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full ${formData.assignmentOption === 'invite' ? 'bg-blue-100' : 'bg-gray-100'} mr-3`}>
                      <AtSignIcon size={20} className={formData.assignmentOption === 'invite' ? 'text-blue-600' : 'text-gray-600'} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Invite Someone New
                      </h3>
                      <p className="text-sm text-gray-600">
                        Send task request via text or email
                      </p>
                    </div>
                  </div>
                </div>
                {/* Post to Marketplace */}
                <div onClick={() => setAssignmentOption('marketplace-post')} className={`p-4 border rounded-lg cursor-pointer transition-colors ${formData.assignmentOption === 'marketplace-post' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full ${formData.assignmentOption === 'marketplace-post' ? 'bg-blue-100' : 'bg-gray-100'} mr-3`}>
                      <GlobeIcon size={20} className={formData.assignmentOption === 'marketplace-post' ? 'text-blue-600' : 'text-gray-600'} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Post to Marketplace
                      </h3>
                      <p className="text-sm text-gray-600">
                        Let others apply to complete this task
                      </p>
                    </div>
                  </div>
                </div>
                {/* Browse Marketplace */}
                <div onClick={() => setAssignmentOption('marketplace-browse')} className={`p-4 border rounded-lg cursor-pointer transition-colors ${formData.assignmentOption === 'marketplace-browse' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full ${formData.assignmentOption === 'marketplace-browse' ? 'bg-blue-100' : 'bg-gray-100'} mr-3`}>
                      <SearchIcon size={20} className={formData.assignmentOption === 'marketplace-browse' ? 'text-blue-600' : 'text-gray-600'} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Browse Marketplace
                      </h3>
                      <p className="text-sm text-gray-600">
                        Find and select someone to do this task
                      </p>
                    </div>
                  </div>
                </div>
                {/* I'll Do It Myself */}
                <div onClick={() => setAssignmentOption('self')} className={`p-4 border rounded-lg cursor-pointer transition-colors ${formData.assignmentOption === 'self' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full ${formData.assignmentOption === 'self' ? 'bg-blue-100' : 'bg-gray-100'} mr-3`}>
                      <SingleUserIcon size={20} className={formData.assignmentOption === 'self' ? 'text-blue-600' : 'text-gray-600'} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        I'll Do It Myself
                      </h3>
                      <p className="text-sm text-gray-600">
                        Keep this task assigned to me
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Conditional UI based on selection */}
              {formData.assignmentOption === 'friend' && <div className="mt-6 border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">
                      Select a Contact
                    </h3>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Filter:</label>
                      <select value={formData.userTypeFilter} onChange={e => setFormData(prev => ({
                  ...prev,
                  userTypeFilter: e.target.value as UserType | 'all'
                }))} className="text-sm border border-gray-300 rounded-md p-1">
                        <option value="all">All</option>
                        <option value="human">Humans</option>
                        <option value="ai">AI Agents</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {filteredContacts.map(contact => <div key={contact.id} onClick={() => selectContact(contact.id)} className={`flex items-center p-3 rounded-md cursor-pointer ${formData.selectedContact === contact.id ? 'bg-blue-50 border border-blue-300' : 'hover:bg-gray-50 border border-gray-200'}`}>
                        <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full mr-3" />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">
                              {contact.name}
                            </span>
                            {contact.type === 'ai' && <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full flex items-center">
                                <BotIcon size={12} className="mr-1" />
                                AI
                              </span>}
                          </div>
                          <span className={`text-xs ${contact.status === 'available' ? 'text-green-600' : 'text-gray-500'}`}>
                            {contact.status === 'available' ? 'Available' : 'Busy'}
                          </span>
                        </div>
                        {formData.selectedContact === contact.id && <UserCheckIcon size={20} className="text-blue-600" />}
                      </div>)}
                    {filteredContacts.length === 0 && <div className="text-center py-4 text-gray-500">
                        No contacts match your filter
                      </div>}
                  </div>
                </div>}
              {formData.assignmentOption === 'invite' && <div className="mt-6 border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Invite Someone
                  </h3>
                  <div className="mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="inviteFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input type="text" id="inviteFirstName" name="inviteFirstName" value={formData.inviteFirstName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="First name" />
                      </div>
                      <div>
                        <label htmlFor="inviteLastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input type="text" id="inviteLastName" name="inviteLastName" value={formData.inviteLastName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Last name" />
                      </div>
                    </div>
                    <div className="flex justify-center space-x-4 mb-4">
                      <button type="button" onClick={() => setFormData(prev => ({
                  ...prev,
                  contactMethod: 'email'
                }))} className={`px-4 py-2 rounded-md ${formData.contactMethod === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                        Email
                      </button>
                      <button type="button" onClick={() => setFormData(prev => ({
                  ...prev,
                  contactMethod: 'phone'
                }))} className={`px-4 py-2 rounded-md ${formData.contactMethod === 'phone' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                        Text Message
                      </button>
                    </div>
                    {formData.contactMethod === 'email' ? <div className="mb-4">
                        <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input type="email" id="inviteEmail" name="inviteEmail" value={formData.inviteEmail} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter email address" />
                      </div> : <div className="mb-4">
                        <label htmlFor="invitePhone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input type="tel" id="invitePhone" name="invitePhone" value={formData.invitePhone} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter phone number" />
                      </div>}
                    <div className="mb-4">
                      <label htmlFor="inviteMessage" className="block text-sm font-medium text-gray-700 mb-1">
                        Personal Message (Optional)
                      </label>
                      <textarea id="inviteMessage" name="inviteMessage" value={formData.inviteMessage} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add a personal message to your invitation" />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Invitation Preview
                    </h4>
                    <div className="bg-white p-3 border border-gray-200 rounded-md">
                      <p className="text-sm text-gray-800">
                        Hi {formData.inviteFirstName || 'there'}! I've assigned
                        you a task "{formData.title}" on Task Juggler.
                        {formData.inviteMessage && <span> {formData.inviteMessage}</span>}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        They'll receive an invitation to join Task Juggler and
                        accept this task
                      </p>
                    </div>
                  </div>
                </div>}
              {formData.assignmentOption === 'marketplace-post' && <div className="mt-6 border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Post to Marketplace
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Visibility
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input type="radio" name="taskVisibility" value="public" checked={formData.taskVisibility === 'public'} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                          <span className="ml-2 text-gray-700">
                            Public (Anyone can apply)
                          </span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="taskVisibility" value="private" checked={formData.taskVisibility === 'private'} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                          <span className="ml-2 text-gray-700">
                            Private (Invitation only)
                          </span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="taskBudget" className="block text-sm font-medium text-gray-700 mb-1">
                        Budget/Compensation (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSignIcon size={18} className="text-gray-400" />
                        </div>
                        <input type="text" id="taskBudget" name="taskBudget" value={formData.taskBudget} onChange={handleInputChange} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter budget amount" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Required Skills/Qualifications
                      </label>
                      <div className="flex items-center mb-2">
                        <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add a required skill" />
                        <button type="button" onClick={addSkill} className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
                          Add
                        </button>
                      </div>
                      {formData.requiredSkills.length > 0 && <div className="flex flex-wrap gap-2 mt-2">
                          {formData.requiredSkills.map(skill => <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {skill}
                              <button type="button" onClick={() => removeSkill(skill)} className="flex-shrink-0 ml-1.5 inline-flex text-blue-600 hover:text-blue-800">
                                <XIcon size={14} />
                              </button>
                            </span>)}
                        </div>}
                    </div>
                    <div>
                      <label htmlFor="applicationsDeadline" className="block text-sm font-medium text-gray-700 mb-1">
                        Deadline for Applications
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <TimeIcon size={18} className="text-gray-400" />
                        </div>
                        <input type="date" id="applicationsDeadline" name="applicationsDeadline" value={formData.applicationsDeadline} onChange={handleInputChange} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>}
              {formData.assignmentOption === 'marketplace-browse' && <div className="mt-6 border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">
                      Browse Marketplace
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button type="button" className="text-sm flex items-center text-gray-600 hover:text-gray-900">
                        <FilterIcon size={16} className="mr-1" />
                        Filters
                      </button>
                      <select value={formData.userTypeFilter} onChange={e => setFormData(prev => ({
                  ...prev,
                  userTypeFilter: e.target.value as UserType | 'all'
                }))} className="text-sm border border-gray-300 rounded-md p-1">
                        <option value="all">All</option>
                        <option value="human">Humans</option>
                        <option value="ai">AI Agents</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {filteredMarketplaceUsers.map(user => <div key={user.id} onClick={() => selectContact(user.id)} className={`flex items-center p-3 rounded-md cursor-pointer ${formData.selectedContact === user.id ? 'bg-blue-50 border border-blue-300' : 'hover:bg-gray-50 border border-gray-200'}`}>
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">
                              {user.name}
                            </span>
                            {user.type === 'ai' && <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full flex items-center">
                                <BotIcon size={12} className="mr-1" />
                                AI
                              </span>}
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <span className="flex items-center">
                              <StarIcon size={12} className="text-yellow-500 mr-1" />
                              {user.rating}
                            </span>
                            <span className="mx-2">•</span>
                            <span>${user.hourlyRate}/hr</span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {user.skills.map((skill, index) => <span key={index} className="px-1.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded">
                                {skill}
                              </span>)}
                          </div>
                        </div>
                        {formData.selectedContact === user.id && <UserCheckIcon size={20} className="text-blue-600" />}
                      </div>)}
                  </div>
                </div>}
              {formData.assignmentOption === 'self' && <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full mr-4">
                      <SingleUserIcon size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Task will be assigned to you
                      </h3>
                      <p className="text-sm text-gray-600">
                        You'll be able to track and manage this task from your
                        dashboard
                      </p>
                    </div>
                  </div>
                </div>}
              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <button type="button" onClick={prevStep} className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50">
                  Back
                </button>
                <div className="flex space-x-3">
                  <button type="button" className="border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50">
                    Save as Draft
                  </button>
                  <button type="submit" className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md" disabled={!formData.assignmentOption}>
                    <SendIcon size={18} className="mr-2" />
                    {isSignupFlow ? 'Complete Signup' : 'Create Task'}
                  </button>
                </div>
              </div>
            </div>}
        </form>
      </div>
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          The assignee will receive an email notification and can set their own
          timeline.
        </p>
        <p className="mt-1">
          Need help?{' '}
          <button className="text-blue-600 hover:underline">
            Contact support
          </button>
        </p>
      </div>
    </div>;
}