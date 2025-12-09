import React, { useState, useRef } from 'react';
import { Upload, Plus, Trash2, DollarSign, Check, Clock, Award, Code, Globe, Briefcase, Mail, Phone, ExternalLink, Info, AlertCircle, Zap, Database, Server, Shield, Cpu, Bot, FileText, MessageSquare, Terminal, Key } from 'lucide-react';
interface AICapability {
  name: string;
  description: string;
}
interface IntegrationMethod {
  type: string;
  details: string;
}
interface PricingTier {
  name: string;
  price: string;
  features: string[];
  recommended: boolean;
}
interface AIVendorForm {
  name: string;
  tagline: string;
  description: string;
  developerName: string;
  developerEmail: string;
  developerWebsite: string;
  aiType: 'chatbot' | 'functional-agent' | 'voice-assistant' | 'data-processor' | 'other';
  capabilities: AICapability[];
  specializations: string[];
  languages: string[];
  integrationMethods: IntegrationMethod[];
  apiDocumentation: string;
  trainingDataSources: string[];
  privacyPolicy: string;
  termsOfService: string;
  pricingTiers: PricingTier[];
  samplePrompts: string[];
}
export function AIVendorProfileCreation() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [aiLogo, setAiLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [screenshotImages, setScreenshotImages] = useState<File[]>([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [newCapability, setNewCapability] = useState<AICapability>({
    name: '',
    description: ''
  });
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newTrainingSource, setNewTrainingSource] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [showNewIntegration, setShowNewIntegration] = useState(false);
  const [newIntegration, setNewIntegration] = useState<IntegrationMethod>({
    type: '',
    details: ''
  });
  const [aiVendorForm, setAiVendorForm] = useState<AIVendorForm>({
    name: '',
    tagline: '',
    description: '',
    developerName: '',
    developerEmail: '',
    developerWebsite: '',
    aiType: 'chatbot',
    capabilities: [],
    specializations: [],
    languages: ['English'],
    integrationMethods: [{
      type: 'API',
      details: ''
    }, {
      type: 'Webhook',
      details: ''
    }],
    apiDocumentation: '',
    trainingDataSources: [],
    privacyPolicy: '',
    termsOfService: '',
    pricingTiers: [{
      name: 'Basic',
      price: '0',
      features: ['Limited requests', 'Standard response time', 'Basic functionality'],
      recommended: false
    }, {
      name: 'Professional',
      price: '49',
      features: ['Unlimited requests', 'Priority response', 'Advanced functionality', 'Custom integrations'],
      recommended: true
    }, {
      name: 'Enterprise',
      price: '199',
      features: ['Unlimited requests', 'Dedicated instance', 'Custom training', '24/7 support', 'SLA guarantees'],
      recommended: false
    }],
    samplePrompts: []
  });
  const logoInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAiLogo(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleScreenshotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setScreenshotImages(prev => [...prev, ...files]);
      // Create preview URLs
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          setScreenshotPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const removeScreenshot = (index: number) => {
    setScreenshotImages(prev => prev.filter((_, i) => i !== index));
    setScreenshotPreviews(prev => prev.filter((_, i) => i !== index));
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setAiVendorForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const addCapability = () => {
    if (newCapability.name && newCapability.description) {
      setAiVendorForm(prev => ({
        ...prev,
        capabilities: [...prev.capabilities, {
          ...newCapability
        }]
      }));
      setNewCapability({
        name: '',
        description: ''
      });
    }
  };
  const removeCapability = (index: number) => {
    setAiVendorForm(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter((_, i) => i !== index)
    }));
  };
  const addSpecialization = () => {
    if (newSpecialization && !aiVendorForm.specializations.includes(newSpecialization)) {
      setAiVendorForm(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization]
      }));
      setNewSpecialization('');
    }
  };
  const removeSpecialization = (item: string) => {
    setAiVendorForm(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== item)
    }));
  };
  const addLanguage = () => {
    if (newLanguage && !aiVendorForm.languages.includes(newLanguage)) {
      setAiVendorForm(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage]
      }));
      setNewLanguage('');
    }
  };
  const removeLanguage = (language: string) => {
    if (aiVendorForm.languages.length > 1) {
      setAiVendorForm(prev => ({
        ...prev,
        languages: prev.languages.filter(l => l !== language)
      }));
    }
  };
  const addTrainingSource = () => {
    if (newTrainingSource && !aiVendorForm.trainingDataSources.includes(newTrainingSource)) {
      setAiVendorForm(prev => ({
        ...prev,
        trainingDataSources: [...prev.trainingDataSources, newTrainingSource]
      }));
      setNewTrainingSource('');
    }
  };
  const removeTrainingSource = (source: string) => {
    setAiVendorForm(prev => ({
      ...prev,
      trainingDataSources: prev.trainingDataSources.filter(s => s !== source)
    }));
  };
  const addIntegration = () => {
    if (newIntegration.type && newIntegration.details) {
      setAiVendorForm(prev => ({
        ...prev,
        integrationMethods: [...prev.integrationMethods, {
          ...newIntegration
        }]
      }));
      setNewIntegration({
        type: '',
        details: ''
      });
      setShowNewIntegration(false);
    }
  };
  const removeIntegration = (index: number) => {
    setAiVendorForm(prev => ({
      ...prev,
      integrationMethods: prev.integrationMethods.filter((_, i) => i !== index)
    }));
  };
  const updateIntegration = (index: number, field: 'type' | 'details', value: string) => {
    const updatedIntegrations = [...aiVendorForm.integrationMethods];
    updatedIntegrations[index] = {
      ...updatedIntegrations[index],
      [field]: value
    };
    setAiVendorForm(prev => ({
      ...prev,
      integrationMethods: updatedIntegrations
    }));
  };
  const addPricingFeature = (tierIndex: number) => {
    const updatedTiers = [...aiVendorForm.pricingTiers];
    updatedTiers[tierIndex].features.push('');
    setAiVendorForm(prev => ({
      ...prev,
      pricingTiers: updatedTiers
    }));
  };
  const updatePricingFeature = (tierIndex: number, featureIndex: number, value: string) => {
    const updatedTiers = [...aiVendorForm.pricingTiers];
    updatedTiers[tierIndex].features[featureIndex] = value;
    setAiVendorForm(prev => ({
      ...prev,
      pricingTiers: updatedTiers
    }));
  };
  const removePricingFeature = (tierIndex: number, featureIndex: number) => {
    const updatedTiers = [...aiVendorForm.pricingTiers];
    updatedTiers[tierIndex].features = updatedTiers[tierIndex].features.filter((_, i) => i !== featureIndex);
    setAiVendorForm(prev => ({
      ...prev,
      pricingTiers: updatedTiers
    }));
  };
  const updatePricingTier = (tierIndex: number, field: keyof PricingTier, value: string | boolean) => {
    const updatedTiers = [...aiVendorForm.pricingTiers];
    updatedTiers[tierIndex] = {
      ...updatedTiers[tierIndex],
      [field]: value
    };
    setAiVendorForm(prev => ({
      ...prev,
      pricingTiers: updatedTiers
    }));
  };
  const addSamplePrompt = () => {
    if (newPrompt && !aiVendorForm.samplePrompts.includes(newPrompt)) {
      setAiVendorForm(prev => ({
        ...prev,
        samplePrompts: [...prev.samplePrompts, newPrompt]
      }));
      setNewPrompt('');
    }
  };
  const removeSamplePrompt = (prompt: string) => {
    setAiVendorForm(prev => ({
      ...prev,
      samplePrompts: prev.samplePrompts.filter(p => p !== prompt)
    }));
  };
  const validateStep1 = () => {
    if (!aiVendorForm.name) {
      setErrorMessage('Please enter your AI solution name');
      return false;
    }
    if (!aiVendorForm.tagline) {
      setErrorMessage('Please enter a tagline for your AI');
      return false;
    }
    if (!aiLogo) {
      setErrorMessage('Please upload a logo for your AI solution');
      return false;
    }
    if (!aiVendorForm.developerName) {
      setErrorMessage('Please enter the developer/company name');
      return false;
    }
    if (!aiVendorForm.developerEmail) {
      setErrorMessage('Please enter a contact email');
      return false;
    }
    setErrorMessage('');
    return true;
  };
  const validateStep2 = () => {
    if (aiVendorForm.capabilities.length === 0) {
      setErrorMessage('Please add at least one capability');
      return false;
    }
    if (aiVendorForm.specializations.length === 0) {
      setErrorMessage('Please add at least one specialization');
      return false;
    }
    if (aiVendorForm.description.length < 100) {
      setErrorMessage('Please provide a detailed description (at least 100 characters)');
      return false;
    }
    setErrorMessage('');
    return true;
  };
  const validateStep3 = () => {
    if (aiVendorForm.integrationMethods.length === 0) {
      setErrorMessage('Please add at least one integration method');
      return false;
    }
    if (screenshotImages.length === 0) {
      setErrorMessage('Please upload at least one screenshot');
      return false;
    }
    if (aiVendorForm.samplePrompts.length === 0) {
      setErrorMessage('Please add at least one sample prompt');
      return false;
    }
    setErrorMessage('');
    return true;
  };
  const validateStep4 = () => {
    for (const tier of aiVendorForm.pricingTiers) {
      if (!tier.name) {
        setErrorMessage('Please enter a name for all pricing tiers');
        return false;
      }
      if (tier.features.length === 0) {
        setErrorMessage('Please add at least one feature to each pricing tier');
        return false;
      }
      if (tier.features.some(f => !f)) {
        setErrorMessage('Please fill in all features or remove empty ones');
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
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  };
  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      setStep(3);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep4()) {
      return;
    }
    // Here you would send the data to your backend
    console.log('Form submitted with:', {
      aiVendorForm,
      aiLogo,
      screenshotImages
    });
    alert('AI profile created successfully! (This is just a demo)');
  };
  return <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Your AI Vendor Profile
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Showcase your AI solution and help users automate their tasks
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Progress Indicator */}
          <div className="bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  1
                </div>
                <span className="ml-2 font-medium text-gray-700">
                  Basic Info
                </span>
              </div>
              <div className="flex-1 mx-4">
                <div className={`h-1 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  2
                </div>
                <span className="ml-2 font-medium text-gray-700">
                  Capabilities
                </span>
              </div>
              <div className="flex-1 mx-4">
                <div className={`h-1 ${step >= 3 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  3
                </div>
                <span className="ml-2 font-medium text-gray-700">
                  Integration
                </span>
              </div>
              <div className="flex-1 mx-4">
                <div className={`h-1 ${step >= 4 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  4
                </div>
                <span className="ml-2 font-medium text-gray-700">Pricing</span>
              </div>
            </div>
          </div>
          {errorMessage && <div className="mx-6 mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Step 1: Basic Information */}
            {step === 1 && <div className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300 cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                    {logoPreview ? <img src={logoPreview} alt="AI Logo Preview" className="w-full h-full object-cover" /> : <Bot size={40} className="text-gray-400" />}
                  </div>
                  <input type="file" ref={logoInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
                  <button type="button" onClick={() => logoInputRef.current?.click()} className="mt-2 text-sm text-purple-600 hover:text-purple-500">
                    Upload AI logo
                  </button>
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    AI Solution Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" id="name" name="name" value={aiVendorForm.name} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g. TaskMaster AI" required />
                </div>
                <div>
                  <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">
                    Tagline <span className="text-red-500">*</span>
                  </label>
                  <input type="text" id="tagline" name="tagline" value={aiVendorForm.tagline} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g. Intelligent task automation for busy professionals" maxLength={100} required />
                  <p className="mt-1 text-xs text-gray-500">
                    A short phrase that describes what your AI does (max 100
                    characters)
                  </p>
                </div>
                <div>
                  <label htmlFor="aiType" className="block text-sm font-medium text-gray-700 mb-1">
                    AI Type <span className="text-red-500">*</span>
                  </label>
                  <select id="aiType" name="aiType" value={aiVendorForm.aiType} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" required>
                    <option value="chatbot">Chatbot</option>
                    <option value="functional-agent">Functional Agent</option>
                    <option value="voice-assistant">Voice Assistant</option>
                    <option value="data-processor">Data Processor</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Developer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="developerName" className="block text-sm font-medium text-gray-700 mb-1">
                        Developer/Company Name{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input type="text" id="developerName" name="developerName" value={aiVendorForm.developerName} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="Your name or company name" required />
                    </div>
                    <div>
                      <label htmlFor="developerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={18} className="text-gray-400" />
                        </div>
                        <input type="email" id="developerEmail" name="developerEmail" value={aiVendorForm.developerEmail} onChange={handleFormChange} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="contact@example.com" required />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="developerWebsite" className="block text-sm font-medium text-gray-700 mb-1">
                      Developer Website
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe size={18} className="text-gray-400" />
                      </div>
                      <input type="text" id="developerWebsite" name="developerWebsite" value={aiVendorForm.developerWebsite} onChange={handleFormChange} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="https://example.com" />
                    </div>
                  </div>
                </div>
              </div>}
            {/* Step 2: AI Capabilities */}
            {step === 2 && <div className="space-y-6">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    AI Description <span className="text-red-500">*</span>
                  </label>
                  <textarea id="description" name="description" value={aiVendorForm.description} onChange={handleFormChange} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="Provide a detailed description of your AI solution, how it works, and what problems it solves..." required />
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 100 characters. Be specific about how your AI can
                    help with tasks.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    AI Capabilities <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    List the main capabilities of your AI solution
                  </p>
                  <div className="mb-4 p-4 border border-gray-200 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Capability Name
                        </label>
                        <input type="text" value={newCapability.name} onChange={e => setNewCapability({
                      ...newCapability,
                      name: e.target.value
                    })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g. Natural Language Processing" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input type="text" value={newCapability.description} onChange={e => setNewCapability({
                      ...newCapability,
                      description: e.target.value
                    })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g. Understands and processes human language" />
                      </div>
                    </div>
                    <button type="button" onClick={addCapability} className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md">
                      Add Capability
                    </button>
                  </div>
                  {aiVendorForm.capabilities.length > 0 && <div className="space-y-3">
                      {aiVendorForm.capabilities.map((capability, index) => <div key={index} className="flex bg-gray-50 p-3 rounded-md">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {capability.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {capability.description}
                            </p>
                          </div>
                          <button type="button" onClick={() => removeCapability(index)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={18} />
                          </button>
                        </div>)}
                    </div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specializations <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <input type="text" value={newSpecialization} onChange={e => setNewSpecialization(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="Add a specialization (e.g. Task Management)" />
                    <button type="button" onClick={addSpecialization} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-md">
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {aiVendorForm.specializations.map((specialization, index) => <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {specialization}
                          <button type="button" onClick={() => removeSpecialization(specialization)} className="ml-1 text-purple-600 hover:text-purple-800">
                            &times;
                          </button>
                        </span>)}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Add specific domains or tasks your AI specializes in
                    (minimum 1)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Languages Supported
                  </label>
                  <div className="flex">
                    <input type="text" value={newLanguage} onChange={e => setNewLanguage(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="Add a language" />
                    <button type="button" onClick={addLanguage} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-md">
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {aiVendorForm.languages.map((language, index) => <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {language}
                        {aiVendorForm.languages.length > 1 && <button type="button" onClick={() => removeLanguage(language)} className="ml-1 text-blue-600 hover:text-blue-800">
                            &times;
                          </button>}
                      </span>)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Training Data Sources
                  </label>
                  <div className="flex">
                    <input type="text" value={newTrainingSource} onChange={e => setNewTrainingSource(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g. Public domain books, Custom dataset" />
                    <button type="button" onClick={addTrainingSource} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-md">
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {aiVendorForm.trainingDataSources.map((source, index) => <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {source}
                        <button type="button" onClick={() => removeTrainingSource(source)} className="ml-1 text-green-600 hover:text-green-800">
                          &times;
                        </button>
                      </span>)}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Describe what data your AI was trained on (optional but
                    recommended for transparency)
                  </p>
                </div>
              </div>}
            {/* Step 3: Integration */}
            {step === 3 && <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Integration Methods{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <button type="button" onClick={() => setShowNewIntegration(true)} className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
                      <Plus size={16} className="mr-1" />
                      Add Method
                    </button>
                  </div>
                  {showNewIntegration && <div className="mb-4 p-4 border border-gray-200 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Integration Type
                          </label>
                          <input type="text" value={newIntegration.type} onChange={e => setNewIntegration({
                      ...newIntegration,
                      type: e.target.value
                    })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g. REST API, SDK" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Details
                          </label>
                          <input type="text" value={newIntegration.details} onChange={e => setNewIntegration({
                      ...newIntegration,
                      details: e.target.value
                    })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g. JSON format, rate limits" />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button type="button" onClick={addIntegration} className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md">
                          Add
                        </button>
                        <button type="button" onClick={() => {
                    setShowNewIntegration(false);
                    setNewIntegration({
                      type: '',
                      details: ''
                    });
                  }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md">
                          Cancel
                        </button>
                      </div>
                    </div>}
                  {aiVendorForm.integrationMethods.length > 0 && <div className="space-y-3">
                      {aiVendorForm.integrationMethods.map((integration, index) => <div key={index} className="bg-gray-50 p-4 rounded-md">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <Code size={18} className="text-purple-600 mr-2" />
                                  <input type="text" value={integration.type} onChange={e => updateIntegration(index, 'type', e.target.value)} className="font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0" placeholder="Integration Type" />
                                </div>
                                <textarea value={integration.details} onChange={e => updateIntegration(index, 'details', e.target.value)} className="w-full text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 p-0 resize-none" placeholder="Integration details..." rows={2} />
                              </div>
                              <button type="button" onClick={() => removeIntegration(index)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>)}
                    </div>}
                </div>
                <div>
                  <label htmlFor="apiDocumentation" className="block text-sm font-medium text-gray-700 mb-1">
                    API Documentation URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText size={18} className="text-gray-400" />
                    </div>
                    <input type="url" id="apiDocumentation" name="apiDocumentation" value={aiVendorForm.apiDocumentation} onChange={handleFormChange} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="https://docs.example.com" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Link to your API documentation (if available)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sample Prompts/Commands{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <input type="text" value={newPrompt} onChange={e => setNewPrompt(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g. Schedule a meeting with John on Friday" />
                    <button type="button" onClick={addSamplePrompt} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-md">
                      Add
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {aiVendorForm.samplePrompts.map((prompt, index) => <div key={index} className="flex items-center bg-gray-50 p-2 rounded-md">
                        <Terminal size={16} className="text-purple-600 mr-2 flex-shrink-0" />
                        <span className="flex-1 text-gray-700">{prompt}</span>
                        <button type="button" onClick={() => removeSamplePrompt(prompt)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </div>)}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Add examples of how users can interact with your AI (minimum
                    1)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Screenshots <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="screenshots-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                          <span>Upload screenshots</span>
                          <input id="screenshots-upload" ref={screenshotInputRef} name="screenshots-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleScreenshotsChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                    </div>
                  </div>
                  {screenshotPreviews.length > 0 && <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {screenshotPreviews.map((preview, index) => <div key={index} className="relative group">
                          <img src={preview} alt={`Screenshot ${index + 1}`} className="h-40 w-full object-cover rounded-md" />
                          <button type="button" onClick={() => removeScreenshot(index)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={16} />
                          </button>
                        </div>)}
                    </div>}
                </div>
              </div>}
            {/* Step 4: Pricing */}
            {step === 4 && <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Pricing Tiers
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Define your pricing model and what features are included in
                    each tier.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {aiVendorForm.pricingTiers.map((tier, tierIndex) => <div key={tierIndex} className={`border rounded-lg overflow-hidden ${tier.recommended ? 'border-purple-500 shadow-md' : 'border-gray-200'}`}>
                        {tier.recommended && <div className="bg-purple-500 text-white py-1 px-4 text-center text-sm font-medium">
                            Recommended
                          </div>}
                        <div className="p-6">
                          <div className="mb-4">
                            <input type="text" value={tier.name} onChange={e => updatePricingTier(tierIndex, 'name', e.target.value)} className="w-full text-xl font-bold text-gray-900 border-none focus:outline-none focus:ring-0 p-0 mb-2" placeholder="Tier Name" />
                            <div className="flex items-baseline">
                              <span className="text-gray-500 text-2xl mr-1">
                                $
                              </span>
                              <input type="text" value={tier.price} onChange={e => updatePricingTier(tierIndex, 'price', e.target.value)} className="text-3xl font-bold text-gray-900 border-none focus:outline-none focus:ring-0 p-0 w-20" placeholder="0" />
                              <span className="text-gray-500 ml-1">/month</span>
                            </div>
                          </div>
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Features
                              </label>
                              <button type="button" onClick={() => addPricingFeature(tierIndex)} className="text-purple-600 hover:text-purple-800 text-xs font-medium">
                                + Add
                              </button>
                            </div>
                            <div className="space-y-2">
                              {tier.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-center">
                                  <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                                  <input type="text" value={feature} onChange={e => updatePricingFeature(tierIndex, featureIndex, e.target.value)} className="flex-1 text-sm text-gray-600 border-none focus:outline-none focus:ring-0 p-0" placeholder={`Feature ${featureIndex + 1}`} />
                                  {tier.features.length > 1 && <button type="button" onClick={() => removePricingFeature(tierIndex, featureIndex)} className="text-red-500 hover:text-red-700 ml-1">
                                      <Trash2 size={14} />
                                    </button>}
                                </div>)}
                            </div>
                          </div>
                          <div className="mt-6 flex items-center">
                            <input type="checkbox" id={`recommended-${tierIndex}`} checked={tier.recommended} onChange={e => updatePricingTier(tierIndex, 'recommended', e.target.checked)} className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                            <label htmlFor={`recommended-${tierIndex}`} className="ml-2 block text-sm text-gray-700">
                              Mark as recommended
                            </label>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>
                <div>
                  <label htmlFor="privacyPolicy" className="block text-sm font-medium text-gray-700 mb-1">
                    Privacy Policy URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield size={18} className="text-gray-400" />
                    </div>
                    <input type="url" id="privacyPolicy" name="privacyPolicy" value={aiVendorForm.privacyPolicy} onChange={handleFormChange} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="https://example.com/privacy" />
                  </div>
                </div>
                <div>
                  <label htmlFor="termsOfService" className="block text-sm font-medium text-gray-700 mb-1">
                    Terms of Service URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText size={18} className="text-gray-400" />
                    </div>
                    <input type="url" id="termsOfService" name="termsOfService" value={aiVendorForm.termsOfService} onChange={handleFormChange} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="https://example.com/terms" />
                  </div>
                </div>
              </div>}
            <div className={`flex ${step === 1 ? 'justify-end' : 'justify-between'} mt-8`}>
              {step > 1 && <button type="button" onClick={handlePrevStep} className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50">
                  Previous
                </button>}
              {step < 4 ? <button type="button" onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-md">
                  Next
                </button> : <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-md flex items-center">
                  <Bot size={18} className="mr-2" />
                  Create AI Profile
                </button>}
            </div>
          </form>
        </div>
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            By creating an AI profile, you agree to our Terms of Service and
            Privacy Policy.
          </p>
          <p className="mt-1">
            Need help?{' '}
            <a href="#" className="text-purple-600 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>;
}