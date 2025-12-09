import React, { useState, useRef } from 'react';
import { Upload, Plus, Trash2, DollarSign, Check, Clock, Award, MapPin, Globe, Briefcase, Mail, Phone, ExternalLink, Info, AlertCircle } from 'lucide-react';
interface ServiceForm {
  title: string;
  description: string;
  price: string;
  duration: string;
  deliverables: string[];
}
interface VendorForm {
  name: string;
  email: string;
  phone: string;
  website: string;
  type: 'human' | 'ai' | 'system';
  tagline: string;
  description: string;
  location: string;
  languages: string[];
  skills: string[];
  education: string;
  certifications: string[];
}
interface VendorProfileCreationProps {
  onComplete?: () => void;
}
export function VendorProfileCreation({
  onComplete
}: VendorProfileCreationProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [portfolioImages, setPortfolioImages] = useState<File[]>([]);
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);
  const [vendorForm, setVendorForm] = useState<VendorForm>({
    name: '',
    email: '',
    phone: '',
    website: '',
    type: 'human',
    tagline: '',
    description: '',
    location: '',
    languages: ['English'],
    skills: [],
    education: '',
    certifications: []
  });
  const [services, setServices] = useState<ServiceForm[]>([{
    title: '',
    description: '',
    price: '',
    duration: '',
    deliverables: ['']
  }]);
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const profileInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handlePortfolioImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setPortfolioImages(prev => [...prev, ...files]);
      // Create preview URLs
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          setPortfolioPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const removePortfolioImage = (index: number) => {
    setPortfolioImages(prev => prev.filter((_, i) => i !== index));
    setPortfolioPreviews(prev => prev.filter((_, i) => i !== index));
  };
  const handleVendorFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setVendorForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleServiceChange = (index: number, field: keyof ServiceForm, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };
    setServices(updatedServices);
  };
  const addDeliverable = (serviceIndex: number) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].deliverables.push('');
    setServices(updatedServices);
  };
  const updateDeliverable = (serviceIndex: number, deliverableIndex: number, value: string) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].deliverables[deliverableIndex] = value;
    setServices(updatedServices);
  };
  const removeDeliverable = (serviceIndex: number, deliverableIndex: number) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].deliverables = updatedServices[serviceIndex].deliverables.filter((_, i) => i !== deliverableIndex);
    setServices(updatedServices);
  };
  const addService = () => {
    setServices([...services, {
      title: '',
      description: '',
      price: '',
      duration: '',
      deliverables: ['']
    }]);
  };
  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };
  const addSkill = () => {
    if (newSkill && !vendorForm.skills.includes(newSkill)) {
      setVendorForm(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      setNewSkill('');
    }
  };
  const removeSkill = (skill: string) => {
    setVendorForm(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };
  const addLanguage = () => {
    if (newLanguage && !vendorForm.languages.includes(newLanguage)) {
      setVendorForm(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage]
      }));
      setNewLanguage('');
    }
  };
  const removeLanguage = (language: string) => {
    setVendorForm(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };
  const addCertification = () => {
    if (newCertification && !vendorForm.certifications.includes(newCertification)) {
      setVendorForm(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification]
      }));
      setNewCertification('');
    }
  };
  const removeCertification = (certification: string) => {
    setVendorForm(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== certification)
    }));
  };
  const validateStep1 = () => {
    if (!vendorForm.name) {
      setErrorMessage('Please enter your name');
      return false;
    }
    if (!vendorForm.email) {
      setErrorMessage('Please enter your email');
      return false;
    }
    if (!vendorForm.tagline) {
      setErrorMessage('Please enter a tagline');
      return false;
    }
    if (!profileImage) {
      setErrorMessage('Please upload a profile image');
      return false;
    }
    if (vendorForm.skills.length === 0) {
      setErrorMessage('Please add at least one skill');
      return false;
    }
    setErrorMessage('');
    return true;
  };
  const validateStep2 = () => {
    if (!vendorForm.description || vendorForm.description.length < 50) {
      setErrorMessage('Please provide a detailed description (at least 50 characters)');
      return false;
    }
    if (!vendorForm.location) {
      setErrorMessage('Please enter your location');
      return false;
    }
    if (portfolioImages.length === 0) {
      setErrorMessage('Please upload at least one portfolio image');
      return false;
    }
    setErrorMessage('');
    return true;
  };
  const validateStep3 = () => {
    for (const service of services) {
      if (!service.title) {
        setErrorMessage('Please enter a title for all services');
        return false;
      }
      if (!service.description) {
        setErrorMessage('Please enter a description for all services');
        return false;
      }
      if (!service.price) {
        setErrorMessage('Please enter a price for all services');
        return false;
      }
      if (!service.duration) {
        setErrorMessage('Please enter a duration for all services');
        return false;
      }
      if (service.deliverables.some(d => !d)) {
        setErrorMessage('Please fill in all deliverables or remove empty ones');
        return false;
      }
    }
    setErrorMessage('');
    return true;
  };
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };
  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) {
      return;
    }
    // Here you would send the data to your backend
    console.log('Form submitted with:', {
      vendorForm,
      services,
      profileImage,
      portfolioImages
    });
    alert('Profile created successfully! (This is just a demo)');
    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete();
    }
  };
  return <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Your Vendor Profile
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Showcase your skills and services to potential clients
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
                  Basic Info
                </span>
              </div>
              <div className="flex-1 mx-4">
                <div className={`h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  2
                </div>
                <span className="ml-2 font-medium text-gray-700">
                  Profile Details
                </span>
              </div>
              <div className="flex-1 mx-4">
                <div className={`h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  3
                </div>
                <span className="ml-2 font-medium text-gray-700">Services</span>
              </div>
            </div>
          </div>
          {errorMessage && <div className="mx-6 mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>}
          <form onSubmit={handleSubmit} className="p-6">
            {step === 1 && <div className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300 cursor-pointer" onClick={() => profileInputRef.current?.click()}>
                    {imagePreview ? <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" /> : <Upload size={40} className="text-gray-400" />}
                  </div>
                  <input type="file" ref={profileInputRef} onChange={handleProfileImageChange} accept="image/*" className="hidden" />
                  <button type="button" onClick={() => profileInputRef.current?.click()} className="mt-2 text-sm text-blue-600 hover:text-blue-500">
                    Upload profile picture
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input type="text" id="name" name="name" value={vendorForm.name} onChange={handleVendorFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Your name" required />
                  </div>
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor Type <span className="text-red-500">*</span>
                    </label>
                    <select id="type" name="type" value={vendorForm.type} onChange={handleVendorFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                      <option value="human">Human (Individual)</option>
                      <option value="ai">AI Service</option>
                      <option value="system">Automated System</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Tagline <span className="text-red-500">*</span>
                  </label>
                  <input type="text" id="tagline" name="tagline" value={vendorForm.tagline} onChange={handleVendorFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="E.g. UI/UX Designer & Brand Strategist" required />
                  <p className="mt-1 text-xs text-gray-500">
                    A short phrase that describes what you do (max 60
                    characters)
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input type="email" id="email" name="email" value={vendorForm.email} onChange={handleVendorFormChange} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="your.email@example.com" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={18} className="text-gray-400" />
                      </div>
                      <input type="tel" id="phone" name="phone" value={vendorForm.phone} onChange={handleVendorFormChange} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="(123) 456-7890" />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ExternalLink size={18} className="text-gray-400" />
                    </div>
                    <input type="text" id="website" name="website" value={vendorForm.website} onChange={handleVendorFormChange} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="www.yourwebsite.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Add a skill (e.g. UI Design)" />
                    <button type="button" onClick={addSkill} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md">
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {vendorForm.skills.map((skill, index) => <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="ml-1 text-blue-600 hover:text-blue-800">
                          &times;
                        </button>
                      </span>)}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Add skills that represent your expertise (minimum 1)
                  </p>
                </div>
              </div>}
            {step === 2 && <div className="space-y-6">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Description{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea id="description" name="description" value={vendorForm.description} onChange={handleVendorFormChange} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Describe your experience, expertise, and what you offer to clients..." required />
                  <p className="mt-1 text-xs text-gray-500">
                    Provide a detailed description of your professional
                    background (minimum 50 characters)
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-gray-400" />
                      </div>
                      <input type="text" id="location" name="location" value={vendorForm.location} onChange={handleVendorFormChange} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="City, Country" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                      Education
                    </label>
                    <input type="text" id="education" name="education" value={vendorForm.education} onChange={handleVendorFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Degree, University" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Languages
                    </label>
                    <div className="flex">
                      <input type="text" value={newLanguage} onChange={e => setNewLanguage(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Add a language" />
                      <button type="button" onClick={addLanguage} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md">
                        Add
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {vendorForm.languages.map((language, index) => <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {language}
                          {index !== 0 && <button type="button" onClick={() => removeLanguage(language)} className="ml-1 text-green-600 hover:text-green-800">
                              &times;
                            </button>}
                        </span>)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certifications
                    </label>
                    <div className="flex">
                      <input type="text" value={newCertification} onChange={e => setNewCertification(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Add a certification" />
                      <button type="button" onClick={addCertification} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md">
                        Add
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {vendorForm.certifications.map((certification, index) => <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {certification}
                          <button type="button" onClick={() => removeCertification(certification)} className="ml-1 text-purple-600 hover:text-purple-800">
                            &times;
                          </button>
                        </span>)}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Portfolio Images <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="portfolio-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload files</span>
                          <input id="portfolio-upload" ref={portfolioInputRef} name="portfolio-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handlePortfolioImagesChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                    </div>
                  </div>
                  {portfolioPreviews.length > 0 && <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {portfolioPreviews.map((preview, index) => <div key={index} className="relative group">
                          <img src={preview} alt={`Portfolio ${index + 1}`} className="h-32 w-full object-cover rounded-md" />
                          <button type="button" onClick={() => removePortfolioImage(index)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={16} />
                          </button>
                        </div>)}
                    </div>}
                </div>
              </div>}
            {step === 3 && <div className="space-y-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Services You Offer
                  </h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <Info size={16} className="mr-1" />
                    Clients will be able to select from these services
                  </div>
                </div>
                {services.map((service, serviceIndex) => <div key={serviceIndex} className="border border-gray-200 rounded-lg p-6 relative">
                    {services.length > 1 && <button type="button" onClick={() => removeService(serviceIndex)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>}
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Service #{serviceIndex + 1}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor={`service-title-${serviceIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Service Title <span className="text-red-500">*</span>
                        </label>
                        <input type="text" id={`service-title-${serviceIndex}`} value={service.title} onChange={e => handleServiceChange(serviceIndex, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="E.g. UI/UX Design for Web Applications" required />
                      </div>
                      <div>
                        <label htmlFor={`service-description-${serviceIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Service Description{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea id={`service-description-${serviceIndex}`} value={service.description} onChange={e => handleServiceChange(serviceIndex, 'description', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Describe what this service includes..." required />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`service-price-${serviceIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Price ($/hour){' '}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <DollarSign size={18} className="text-gray-400" />
                            </div>
                            <input type="number" id={`service-price-${serviceIndex}`} value={service.price} onChange={e => handleServiceChange(serviceIndex, 'price', e.target.value)} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="45" min="1" required />
                          </div>
                        </div>
                        <div>
                          <label htmlFor={`service-duration-${serviceIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Estimated Duration{' '}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Clock size={18} className="text-gray-400" />
                            </div>
                            <input type="text" id={`service-duration-${serviceIndex}`} value={service.duration} onChange={e => handleServiceChange(serviceIndex, 'duration', e.target.value)} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="E.g. 3-5 days" required />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Deliverables <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                          List what the client will receive with this service
                        </p>
                        {service.deliverables.map((deliverable, deliverableIndex) => <div key={deliverableIndex} className="flex items-center mb-2">
                              <div className="flex-shrink-0 mr-2">
                                <Check size={18} className="text-green-500" />
                              </div>
                              <input type="text" value={deliverable} onChange={e => updateDeliverable(serviceIndex, deliverableIndex, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder={`Deliverable ${deliverableIndex + 1}`} required />
                              {service.deliverables.length > 1 && <button type="button" onClick={() => removeDeliverable(serviceIndex, deliverableIndex)} className="ml-2 text-red-500 hover:text-red-700">
                                  <Trash2 size={18} />
                                </button>}
                            </div>)}
                        <button type="button" onClick={() => addDeliverable(serviceIndex)} className="mt-2 text-blue-600 hover:text-blue-800 flex items-center text-sm">
                          <Plus size={16} className="mr-1" />
                          Add Another Deliverable
                        </button>
                      </div>
                    </div>
                  </div>)}
                <button type="button" onClick={addService} className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:text-gray-900 hover:border-gray-400 flex items-center justify-center">
                  <Plus size={20} className="mr-2" />
                  Add Another Service
                </button>
              </div>}
            <div className={`flex ${step === 1 ? 'justify-end' : 'justify-between'} mt-8`}>
              {step > 1 && <button type="button" onClick={handlePrevStep} className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50">
                  Previous
                </button>}
              {step < 3 ? <button type="button" onClick={handleNextStep} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md">
                  Next
                </button> : <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md flex items-center">
                  <Award size={18} className="mr-2" />
                  Create Profile
                </button>}
            </div>
          </form>
        </div>
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            By creating a profile, you agree to our Terms of Service and Privacy
            Policy.
          </p>
          <p className="mt-1">
            Need help?{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>;
}