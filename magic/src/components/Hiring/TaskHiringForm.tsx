import React, { useState } from 'react';
import { Clock, DollarSign, Calendar, MapPin, FileText, Briefcase, CheckSquare, AlertCircle, PaperclipIcon, XIcon, Star, Users, Filter, Home } from 'lucide-react';
type TaskCategory = 'household' | 'errands' | 'professional' | 'technical' | 'creative' | 'education' | 'health' | 'other';
type TaskType = 'paid' | 'unpaid';
type PaymentType = 'hourly' | 'fixed';
type LocationType = 'remote' | 'in-person' | 'both';
interface TaskHiringFormProps {
  onTaskCreated?: () => void;
}
export function TaskHiringForm({
  onTaskCreated
}: TaskHiringFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('household');
  const [taskType, setTaskType] = useState<TaskType>('paid');
  const [paymentType, setPaymentType] = useState<PaymentType>('hourly');
  const [hourlyRate, setHourlyRate] = useState('');
  const [fixedPrice, setFixedPrice] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [deadline, setDeadline] = useState('');
  const [location, setLocation] = useState<LocationType>('in-person');
  const [address, setAddress] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<1 | 2 | 3>(2); // 1=beginner, 2=intermediate, 3=expert
  const [preferredDoers, setPreferredDoers] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [relationshipToDoer, setRelationshipToDoer] = useState<string>('family');
  const categoryOptions: {
    value: TaskCategory;
    label: string;
    examples: string;
  }[] = [{
    value: 'household',
    label: 'Household',
    examples: 'Cleaning, Repairs, Assembly'
  }, {
    value: 'errands',
    label: 'Errands',
    examples: 'Shopping, Pet care, Delivery'
  }, {
    value: 'professional',
    label: 'Professional Services',
    examples: 'Legal, Financial, Consulting'
  }, {
    value: 'technical',
    label: 'Technical',
    examples: 'IT Support, Programming, Data Entry'
  }, {
    value: 'creative',
    label: 'Creative',
    examples: 'Design, Writing, Photography'
  }, {
    value: 'education',
    label: 'Education',
    examples: 'Tutoring, Research, Editing'
  }, {
    value: 'health',
    label: 'Health & Wellness',
    examples: 'Personal Training, Nutrition, Therapy'
  }, {
    value: 'other',
    label: 'Other',
    examples: 'Miscellaneous tasks'
  }];
  const relationshipOptions = [{
    value: 'family',
    label: 'Family Member'
  }, {
    value: 'friend',
    label: 'Friend'
  }, {
    value: 'colleague',
    label: 'Colleague/Coworker'
  }, {
    value: 'other',
    label: 'Other'
  }];
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...fileList]);
      setAttachmentNames(prev => [...prev, ...fileList.map(file => file.name)]);
    }
  };
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    setAttachmentNames(prev => prev.filter((_, i) => i !== index));
  };
  const nextStep = () => {
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a task description');
      return;
    }
    if (taskType === 'paid') {
      if (paymentType === 'hourly' && !hourlyRate) {
        setError('Please enter an hourly rate');
        return;
      }
      if (paymentType === 'fixed' && !fixedPrice) {
        setError('Please enter a fixed price');
        return;
      }
    }
    setError('');
    setStep(2);
  };
  const prevStep = () => {
    setStep(1);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!deadline) {
      setError('Please set a deadline');
      return;
    }
    if (location === 'in-person' && !address.trim()) {
      setError('Please provide an address for in-person tasks');
      return;
    }
    // In a real app, we would submit the form data to the server
    console.log({
      title,
      description,
      category,
      taskType,
      paymentType: taskType === 'paid' ? paymentType : null,
      hourlyRate: taskType === 'paid' && paymentType === 'hourly' ? hourlyRate : null,
      fixedPrice: taskType === 'paid' && paymentType === 'fixed' ? fixedPrice : null,
      estimatedHours: taskType === 'paid' ? estimatedHours : null,
      deadline,
      location,
      address: location === 'remote' ? null : address,
      skillsRequired,
      experienceLevel: taskType === 'paid' ? experienceLevel : null,
      preferredDoers,
      attachments,
      relationshipToDoer: taskType === 'unpaid' ? relationshipToDoer : null
    });
    const successMessage = taskType === 'paid' ? "Your task has been posted! We'll notify you when someone applies." : "Your task has been sent! We'll notify you when it's accepted.";
    alert(successMessage);
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('household');
    setTaskType('paid');
    setPaymentType('hourly');
    setHourlyRate('');
    setFixedPrice('');
    setEstimatedHours('');
    setDeadline('');
    setLocation('in-person');
    setAddress('');
    setSkillsRequired('');
    setAttachments([]);
    setAttachmentNames([]);
    setExperienceLevel(2);
    setPreferredDoers([]);
    setRelationshipToDoer('family');
    setError('');
    setStep(1);
    if (onTaskCreated) {
      onTaskCreated();
    }
  };
  return <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Progress Indicator */}
      <div className="bg-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white">
              1
            </div>
            <span className="ml-2 font-medium text-gray-700">Task Details</span>
          </div>
          <div className="flex-1 mx-4">
            <div className={`h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          </div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              2
            </div>
            <span className="ml-2 font-medium text-gray-700">
              {taskType === 'paid' ? 'Requirements & Preferences' : 'Additional Details'}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-8">
        {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>}

        {step === 1 ? <div className="space-y-6">
            {/* Task Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`border rounded-md p-4 cursor-pointer ${taskType === 'paid' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`} onClick={() => setTaskType('paid')}>
                  <div className="flex items-center">
                    <input type="radio" name="taskType" checked={taskType === 'paid'} onChange={() => setTaskType('paid')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-gray-900">
                        Paid Task
                      </span>
                      <span className="block text-sm text-gray-500">
                        Hire someone to complete a task for payment
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`border rounded-md p-4 cursor-pointer ${taskType === 'unpaid' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}`} onClick={() => setTaskType('unpaid')}>
                  <div className="flex items-center">
                    <input type="radio" name="taskType" checked={taskType === 'unpaid'} onChange={() => setTaskType('unpaid')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-gray-900">
                        Simple Request
                      </span>
                      <span className="block text-sm text-gray-500">
                        Ask family, friends, or colleagues to help with a task
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={taskType === 'paid' ? 'E.g., Weekly Grocery Shopping, Website Design, Legal Document Review' : 'E.g., Take out the trash, Pick up milk on your way home, Feed the dog'} required />
            </div>

            {/* Task Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select id="category" value={category} onChange={e => setCategory(e.target.value as TaskCategory)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                {categoryOptions.map(option => <option key={option.value} value={option.value}>
                    {option.label} ({option.examples})
                  </option>)}
              </select>
            </div>

            {/* Task Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Task Description <span className="text-red-500">*</span>
              </label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={taskType === 'paid' ? 'Provide a detailed description of what needs to be done. Include specific requirements, expected outcomes, and any special instructions.' : 'Describe what you need done. Be specific about any details they should know.'} required />
            </div>

            {/* Relationship to Doer - Only for unpaid tasks */}
            {taskType === 'unpaid' && <div>
                <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
                  Who are you asking? <span className="text-red-500">*</span>
                </label>
                <select id="relationship" value={relationshipToDoer} onChange={e => setRelationshipToDoer(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  {relationshipOptions.map(option => <option key={option.value} value={option.value}>
                      {option.label}
                    </option>)}
                </select>
              </div>}

            {/* Payment Type - Only for paid tasks */}
            {taskType === 'paid' && <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" name="paymentType" value="hourly" checked={paymentType === 'hourly'} onChange={() => setPaymentType('hourly')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="ml-2 text-gray-700">Hourly Rate</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" name="paymentType" value="fixed" checked={paymentType === 'fixed'} onChange={() => setPaymentType('fixed')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="ml-2 text-gray-700">Fixed Price</span>
                    </label>
                  </div>
                </div>

                {/* Payment Details */}
                {paymentType === 'hourly' ? <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                        Hourly Rate ($) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign size={18} className="text-gray-400" />
                        </div>
                        <input type="number" id="hourlyRate" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} min="1" step="0.01" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="25.00" required={taskType === 'paid' && paymentType === 'hourly'} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Hours
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock size={18} className="text-gray-400" />
                        </div>
                        <input type="number" id="estimatedHours" value={estimatedHours} onChange={e => setEstimatedHours(e.target.value)} min="0.5" step="0.5" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 5" />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Your estimated total: $
                        {hourlyRate && estimatedHours ? (parseFloat(hourlyRate) * parseFloat(estimatedHours)).toFixed(2) : '0.00'}
                      </p>
                    </div>
                  </div> : <div>
                    <label htmlFor="fixedPrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Fixed Price ($) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={18} className="text-gray-400" />
                      </div>
                      <input type="number" id="fixedPrice" value={fixedPrice} onChange={e => setFixedPrice(e.target.value)} min="1" step="0.01" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 100.00" required={taskType === 'paid' && paymentType === 'fixed'} />
                    </div>
                  </div>}
              </>}

            {/* Deadline */}
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                Deadline <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input type="date" id="deadline" value={deadline} onChange={e => setDeadline(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="pt-4">
              <button type="button" onClick={nextStep} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                Continue to{' '}
                {taskType === 'paid' ? 'Requirements & Preferences' : 'Additional Details'}
              </button>
            </div>
          </div> : <div className="space-y-6">
            {/* Location Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input type="radio" name="locationType" value="remote" checked={location === 'remote'} onChange={() => setLocation('remote')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  <span className="ml-2 text-gray-700">Remote</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="locationType" value="in-person" checked={location === 'in-person'} onChange={() => setLocation('in-person')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  <span className="ml-2 text-gray-700">In-Person</span>
                </label>
                {taskType === 'paid' && <label className="inline-flex items-center">
                    <input type="radio" name="locationType" value="both" checked={location === 'both'} onChange={() => setLocation('both')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span className="ml-2 text-gray-700">Both Options</span>
                  </label>}
              </div>
            </div>

            {/* Address (for in-person tasks) */}
            {location !== 'remote' && <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-gray-400" />
                  </div>
                  <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={taskType === 'paid' ? 'Enter address or location for this task' : 'Enter location (e.g., Home, Office, School)'} required={location !== 'remote'} />
                </div>
              </div>}

            {/* Skills Required - Only for paid tasks */}
            {taskType === 'paid' && <div>
                <label htmlFor="skillsRequired" className="block text-sm font-medium text-gray-700 mb-1">
                  Skills Required
                </label>
                <textarea id="skillsRequired" value={skillsRequired} onChange={e => setSkillsRequired(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="List any specific skills or qualifications needed (e.g., cooking skills, programming languages, certifications)" />
              </div>}

            {/* Experience Level - Only for paid tasks */}
            {taskType === 'paid' && <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level Required
                </label>
                <div className="flex flex-col space-y-2">
                  <label className="inline-flex items-center">
                    <input type="radio" name="experienceLevel" checked={experienceLevel === 1} onChange={() => setExperienceLevel(1)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <div className="ml-2">
                      <span className="text-gray-700 font-medium">
                        Beginner
                      </span>
                      <p className="text-xs text-gray-500">
                        Little to no experience required, suitable for
                        entry-level
                      </p>
                    </div>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="experienceLevel" checked={experienceLevel === 2} onChange={() => setExperienceLevel(2)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <div className="ml-2">
                      <span className="text-gray-700 font-medium">
                        Intermediate
                      </span>
                      <p className="text-xs text-gray-500">
                        Some experience required, comfortable with the basics
                      </p>
                    </div>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="experienceLevel" checked={experienceLevel === 3} onChange={() => setExperienceLevel(3)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <div className="ml-2">
                      <span className="text-gray-700 font-medium">Expert</span>
                      <p className="text-xs text-gray-500">
                        Significant experience required, advanced skills needed
                      </p>
                    </div>
                  </label>
                </div>
              </div>}

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
                          <FileText size={16} className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{name}</span>
                        </div>
                        <button type="button" onClick={() => removeAttachment(index)} className="text-red-500 hover:text-red-700">
                          <XIcon size={16} />
                        </button>
                      </li>)}
                  </ul>
                </div>}
            </div>

            {/* Task Preview */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div className="flex items-center mb-2">
                {taskType === 'paid' ? <Briefcase size={18} className="text-blue-600 mr-2" /> : <Home size={18} className="text-blue-600 mr-2" />}
                <h3 className="text-sm font-medium text-gray-700">
                  Task Summary
                </h3>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <h4 className="font-medium text-gray-900">
                  {title || 'Task Title'}
                </h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {description || 'No description provided'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {taskType === 'paid' && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {paymentType === 'hourly' ? `$${hourlyRate || '0'}/hour` : `$${fixedPrice || '0'} fixed`}
                    </span>}
                  {taskType === 'unpaid' && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      Unpaid Request
                    </span>}
                  {deadline && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      Due: {new Date(deadline).toLocaleDateString()}
                    </span>}
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {location === 'remote' ? 'Remote' : location === 'in-person' ? 'In-Person' : 'Remote or In-Person'}
                  </span>
                  {taskType === 'unpaid' && relationshipToDoer && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      For:{' '}
                      {relationshipOptions.find(r => r.value === relationshipToDoer)?.label}
                    </span>}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button type="button" onClick={prevStep} className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50">
                Back
              </button>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md">
                {taskType === 'paid' ? 'Post Task' : 'Send Request'}
              </button>
            </div>
          </div>}
      </form>
    </div>;
}