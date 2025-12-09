import React, { useEffect, useState } from 'react';
import { Search, Filter, Grid, List, MapPin, Star, Clock, CheckCircle, ChevronDown, Sliders, Bot, User as UserIcon, Globe, Shield, DollarSign, Briefcase, Calendar, Languages, MessageSquare, Heart, Share2, X } from 'lucide-react';
type ProviderType = 'human' | 'ai' | 'both';
type AvailabilityType = 'now' | 'today' | 'this-week' | 'any';
type VerificationStatus = 'verified' | 'basic' | 'unverified';
type ViewMode = 'grid' | 'list';
interface ServiceCategory {
  id: string;
  name: string;
}
interface Skill {
  id: string;
  name: string;
}
interface Provider {
  id: string;
  name: string;
  tagline: string;
  profileImage: string;
  type: ProviderType;
  categories: ServiceCategory[];
  rating: number;
  reviewCount: number;
  startingPrice: number;
  isPriceHourly: boolean;
  location: string;
  responseTime: string;
  isAvailableNow: boolean;
  skills: Skill[];
  portfolioImages: string[];
  languages: string[];
  verificationStatus: VerificationStatus;
}
interface FilterState {
  categories: string[];
  priceRange: [number, number];
  location: string | null;
  distance: number;
  availability: AvailabilityType;
  minRating: number;
  providerType: ProviderType | 'all';
  languages: string[];
  verificationStatus: VerificationStatus | 'all';
}
export function ProviderBrowse() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 200],
    location: null,
    distance: 25,
    availability: 'any',
    minRating: 0,
    providerType: 'all',
    languages: [],
    verificationStatus: 'all'
  });
  // Mock categories
  const serviceCategories: ServiceCategory[] = [{
    id: 'tech',
    name: 'Technology'
  }, {
    id: 'design',
    name: 'Design'
  }, {
    id: 'writing',
    name: 'Writing'
  }, {
    id: 'admin',
    name: 'Admin Support'
  }, {
    id: 'marketing',
    name: 'Marketing'
  }, {
    id: 'household',
    name: 'Household'
  }, {
    id: 'errands',
    name: 'Errands'
  }, {
    id: 'education',
    name: 'Education'
  }, {
    id: 'health',
    name: 'Health & Wellness'
  }];
  // Mock languages
  const availableLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Russian', 'Arabic', 'Portuguese'];
  // Mock providers data
  const providers: Provider[] = [{
    id: 'p1',
    name: 'Alex Johnson',
    tagline: 'Full-stack developer with 5+ years experience',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    type: 'human',
    categories: [{
      id: 'tech',
      name: 'Technology'
    }, {
      id: 'design',
      name: 'Design'
    }],
    rating: 4.8,
    reviewCount: 47,
    startingPrice: 45,
    isPriceHourly: true,
    location: 'Seattle, WA',
    responseTime: '< 2 hours',
    isAvailableNow: true,
    skills: [{
      id: 's1',
      name: 'React'
    }, {
      id: 's2',
      name: 'Node.js'
    }, {
      id: 's3',
      name: 'TypeScript'
    }, {
      id: 's4',
      name: 'UI/UX'
    }],
    portfolioImages: ['https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1558882224-dda166733046?q=80&w=500&auto=format&fit=crop'],
    languages: ['English', 'Spanish'],
    verificationStatus: 'verified'
  }, {
    id: 'p2',
    name: 'Sarah Chen',
    tagline: 'Graphic designer specializing in brand identity',
    profileImage: 'https://randomuser.me/api/portraits/women/33.jpg',
    type: 'human',
    categories: [{
      id: 'design',
      name: 'Design'
    }, {
      id: 'marketing',
      name: 'Marketing'
    }],
    rating: 4.9,
    reviewCount: 36,
    startingPrice: 40,
    isPriceHourly: true,
    location: 'Portland, OR',
    responseTime: 'Same day',
    isAvailableNow: false,
    skills: [{
      id: 's5',
      name: 'Adobe Suite'
    }, {
      id: 's6',
      name: 'Logo Design'
    }, {
      id: 's7',
      name: 'Brand Strategy'
    }, {
      id: 's8',
      name: 'Illustration'
    }],
    portfolioImages: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?q=80&w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=500&auto=format&fit=crop'],
    languages: ['English', 'Chinese'],
    verificationStatus: 'verified'
  }, {
    id: 'p3',
    name: 'WriterGPT',
    tagline: 'AI content writer for blogs, articles, and more',
    profileImage: 'https://ui-avatars.com/api/?name=WG&background=6366f1&color=fff',
    type: 'ai',
    categories: [{
      id: 'writing',
      name: 'Writing'
    }, {
      id: 'marketing',
      name: 'Marketing'
    }],
    rating: 4.6,
    reviewCount: 128,
    startingPrice: 25,
    isPriceHourly: false,
    location: 'Remote',
    responseTime: 'Instant',
    isAvailableNow: true,
    skills: [{
      id: 's9',
      name: 'Blog Writing'
    }, {
      id: 's10',
      name: 'SEO Content'
    }, {
      id: 's11',
      name: 'Technical Writing'
    }, {
      id: 's12',
      name: 'Editing'
    }, {
      id: 's13',
      name: 'Proofreading'
    }],
    portfolioImages: ['https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1523120974498-9d764390d8e5?q=80&w=500&auto=format&fit=crop'],
    languages: ['English', 'Spanish', 'French', 'German'],
    verificationStatus: 'verified'
  }, {
    id: 'p4',
    name: 'Michael Torres',
    tagline: 'Experienced handyman for all household tasks',
    profileImage: 'https://randomuser.me/api/portraits/men/42.jpg',
    type: 'human',
    categories: [{
      id: 'household',
      name: 'Household'
    }, {
      id: 'errands',
      name: 'Errands'
    }],
    rating: 4.7,
    reviewCount: 52,
    startingPrice: 35,
    isPriceHourly: true,
    location: 'Bellevue, WA',
    responseTime: '< 1 hour',
    isAvailableNow: true,
    skills: [{
      id: 's14',
      name: 'Furniture Assembly'
    }, {
      id: 's15',
      name: 'Plumbing'
    }, {
      id: 's16',
      name: 'Electrical'
    }, {
      id: 's17',
      name: 'Painting'
    }],
    portfolioImages: ['https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?q=80&w=500&auto=format&fit=crop'],
    languages: ['English', 'Spanish'],
    verificationStatus: 'basic'
  }, {
    id: 'p5',
    name: 'Emily Watson',
    tagline: 'Math tutor with 10+ years teaching experience',
    profileImage: 'https://randomuser.me/api/portraits/women/45.jpg',
    type: 'human',
    categories: [{
      id: 'education',
      name: 'Education'
    }],
    rating: 4.9,
    reviewCount: 89,
    startingPrice: 50,
    isPriceHourly: true,
    location: 'Remote',
    responseTime: 'Same day',
    isAvailableNow: false,
    skills: [{
      id: 's18',
      name: 'Calculus'
    }, {
      id: 's19',
      name: 'Algebra'
    }, {
      id: 's20',
      name: 'Statistics'
    }, {
      id: 's21',
      name: 'Test Prep'
    }],
    portfolioImages: ['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=500&auto=format&fit=crop'],
    languages: ['English', 'French'],
    verificationStatus: 'verified'
  }, {
    id: 'p6',
    name: 'TaskAssistAI',
    tagline: 'Virtual assistant for admin and data tasks',
    profileImage: 'https://ui-avatars.com/api/?name=TA&background=10b981&color=fff',
    type: 'ai',
    categories: [{
      id: 'admin',
      name: 'Admin Support'
    }, {
      id: 'tech',
      name: 'Technology'
    }],
    rating: 4.5,
    reviewCount: 73,
    startingPrice: 15,
    isPriceHourly: true,
    location: 'Remote',
    responseTime: 'Instant',
    isAvailableNow: true,
    skills: [{
      id: 's22',
      name: 'Data Entry'
    }, {
      id: 's23',
      name: 'Scheduling'
    }, {
      id: 's24',
      name: 'Research'
    }, {
      id: 's25',
      name: 'Email Management'
    }, {
      id: 's26',
      name: 'Document Processing'
    }],
    portfolioImages: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1586282391535-74c5a43780e4?q=80&w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=500&auto=format&fit=crop'],
    languages: ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Chinese'],
    verificationStatus: 'verified'
  }, {
    id: 'p7',
    name: 'David Kim',
    tagline: 'Digital marketing specialist and SEO expert',
    profileImage: 'https://randomuser.me/api/portraits/men/45.jpg',
    type: 'human',
    categories: [{
      id: 'marketing',
      name: 'Marketing'
    }, {
      id: 'tech',
      name: 'Technology'
    }],
    rating: 4.6,
    reviewCount: 41,
    startingPrice: 55,
    isPriceHourly: true,
    location: 'San Francisco, CA',
    responseTime: '< 3 hours',
    isAvailableNow: false,
    skills: [{
      id: 's27',
      name: 'SEO'
    }, {
      id: 's28',
      name: 'Google Ads'
    }, {
      id: 's29',
      name: 'Social Media'
    }, {
      id: 's30',
      name: 'Analytics'
    }],
    portfolioImages: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=500&auto=format&fit=crop'],
    languages: ['English', 'Korean'],
    verificationStatus: 'basic'
  }, {
    id: 'p8',
    name: 'Lisa Martinez',
    tagline: 'Personal trainer and nutrition coach',
    profileImage: 'https://randomuser.me/api/portraits/women/22.jpg',
    type: 'human',
    categories: [{
      id: 'health',
      name: 'Health & Wellness'
    }],
    rating: 4.9,
    reviewCount: 63,
    startingPrice: 60,
    isPriceHourly: true,
    location: 'Miami, FL',
    responseTime: 'Same day',
    isAvailableNow: true,
    skills: [{
      id: 's31',
      name: 'Fitness Training'
    }, {
      id: 's32',
      name: 'Nutrition Planning'
    }, {
      id: 's33',
      name: 'Weight Loss'
    }, {
      id: 's34',
      name: 'Strength Training'
    }],
    portfolioImages: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500&auto=format&fit=crop', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=500&auto=format&fit=crop'],
    languages: ['English', 'Spanish'],
    verificationStatus: 'verified'
  }];
  // Filter providers based on search query, filters, etc.
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) || provider.tagline.toLowerCase().includes(searchQuery.toLowerCase()) || provider.skills.some(skill => skill.name.toLowerCase().includes(searchQuery.toLowerCase())) || provider.categories.some(category => category.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategories = filters.categories.length === 0 || provider.categories.some(category => filters.categories.includes(category.id));
    const matchesPrice = provider.startingPrice >= filters.priceRange[0] && provider.startingPrice <= filters.priceRange[1];
    const matchesProviderType = filters.providerType === 'all' || provider.type === filters.providerType || filters.providerType === 'both' && provider.type === 'both';
    const matchesAvailability = filters.availability === 'any' || filters.availability === 'now' && provider.isAvailableNow || filters.availability === 'today' && (provider.isAvailableNow || provider.responseTime.includes('Same day')) || filters.availability === 'this-week' && true; // Simplified for demo
    const matchesRating = provider.rating >= filters.minRating;
    const matchesLanguages = filters.languages.length === 0 || filters.languages.some(lang => provider.languages.includes(lang));
    const matchesVerification = filters.verificationStatus === 'all' || provider.verificationStatus === filters.verificationStatus;
    return matchesSearch && matchesCategories && matchesPrice && matchesProviderType && matchesAvailability && matchesRating && matchesLanguages && matchesVerification;
  });
  const handleCategoryToggle = (categoryId: string) => {
    setFilters(prev => {
      if (prev.categories.includes(categoryId)) {
        return {
          ...prev,
          categories: prev.categories.filter(c => c !== categoryId)
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, categoryId]
        };
      }
    });
  };
  const handleLanguageToggle = (language: string) => {
    setFilters(prev => {
      if (prev.languages.includes(language)) {
        return {
          ...prev,
          languages: prev.languages.filter(l => l !== language)
        };
      } else {
        return {
          ...prev,
          languages: [...prev.languages, language]
        };
      }
    });
  };
  const resetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 200],
      location: null,
      distance: 25,
      availability: 'any',
      minRating: 0,
      providerType: 'all',
      languages: [],
      verificationStatus: 'all'
    });
    setSearchQuery('');
  };
  const viewProviderDetails = (providerId: string) => {
    setSelectedProvider(providerId);
    // In a real app, this would navigate to a provider detail page
    console.log(`View provider details: ${providerId}`);
  };
  const contactProvider = (providerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would open a chat or contact form
    console.log(`Contact provider: ${providerId}`);
  };
  const hireProvider = (providerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would navigate to a booking/hiring flow
    console.log(`Hire provider: ${providerId}`);
  };
  const saveProvider = (providerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would save the provider to favorites
    console.log(`Save provider: ${providerId}`);
  };
  return <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Find Task Doers
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Discover skilled professionals and AI assistants for your tasks
            </p>
          </div>
        </div>
        {/* Search and View Toggle */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search by name, skill, or service category..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                  <Grid size={20} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                  <List size={20} />
                </button>
                <button onClick={() => setFiltersOpen(!filtersOpen)} className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                  <Filter size={18} className="mr-2" />
                  Filters
                  <ChevronDown size={18} className={`ml-2 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
            {filtersOpen && <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6 p-4 bg-gray-50 rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Categories
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {serviceCategories.map(category => <label key={category.id} className="flex items-center">
                        <input type="checkbox" checked={filters.categories.includes(category.id)} onChange={() => handleCategoryToggle(category.id)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-2 text-gray-700">
                          {category.name}
                        </span>
                        <span className="ml-auto text-xs text-gray-500">
                          (
                          {providers.filter(p => p.categories.some(c => c.id === category.id)).length}
                          )
                        </span>
                      </label>)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provider Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button className={`px-3 py-2 rounded-md text-sm font-medium ${filters.providerType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  providerType: 'all'
                }))}>
                      All
                    </button>
                    <button className={`px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center ${filters.providerType === 'human' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  providerType: 'human'
                }))}>
                      <UserIcon size={14} className="mr-1" />
                      Human
                    </button>
                    <button className={`px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center ${filters.providerType === 'ai' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  providerType: 'ai'
                }))}>
                      <Bot size={14} className="mr-1" />
                      AI
                    </button>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                    Availability
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className={`px-3 py-2 rounded-md text-sm font-medium ${filters.availability === 'any' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  availability: 'any'
                }))}>
                      Any Time
                    </button>
                    <button className={`px-3 py-2 rounded-md text-sm font-medium ${filters.availability === 'now' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  availability: 'now'
                }))}>
                      Available Now
                    </button>
                    <button className={`px-3 py-2 rounded-md text-sm font-medium ${filters.availability === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  availability: 'today'
                }))}>
                      Today
                    </button>
                    <button className={`px-3 py-2 rounded-md text-sm font-medium ${filters.availability === 'this-week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  availability: 'this-week'
                }))}>
                      This Week
                    </button>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                    Minimum Rating
                  </label>
                  <div className="flex items-center">
                    <input type="range" min="0" max="5" step="0.5" value={filters.minRating} onChange={e => setFilters(prev => ({
                  ...prev,
                  minRating: parseFloat(e.target.value)
                }))} className="w-full mr-3" />
                    <div className="flex items-center min-w-[60px]">
                      <span className="text-gray-700">{filters.minRating}</span>
                      <Star size={16} className="ml-1 text-yellow-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range ($/hour)
                  </label>
                  <div className="mt-2 px-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">
                        ${filters.priceRange[0]}
                      </span>
                      <span className="text-sm text-gray-600">
                        ${filters.priceRange[1]}+
                      </span>
                    </div>
                    <input type="range" min="0" max="200" step="5" value={filters.priceRange[1]} onChange={e => setFilters(prev => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                }))} className="w-full" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                    Verification Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button className={`px-3 py-2 rounded-md text-sm font-medium ${filters.verificationStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  verificationStatus: 'all'
                }))}>
                      All
                    </button>
                    <button className={`px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center ${filters.verificationStatus === 'verified' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  verificationStatus: 'verified'
                }))}>
                      <Shield size={14} className="mr-1" />
                      Verified
                    </button>
                    <button className={`px-3 py-2 rounded-md text-sm font-medium ${filters.verificationStatus === 'basic' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  verificationStatus: 'basic'
                }))}>
                      Basic
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Languages
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableLanguages.map(language => <label key={language} className="flex items-center">
                        <input type="checkbox" checked={filters.languages.includes(language)} onChange={() => handleLanguageToggle(language)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-2 text-gray-700">{language}</span>
                        <span className="ml-auto text-xs text-gray-500">
                          (
                          {providers.filter(p => p.languages.includes(language)).length}
                          )
                        </span>
                      </label>)}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button onClick={resetFilters} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      Reset All Filters
                    </button>
                  </div>
                </div>
              </div>}
          </div>
        </div>
        {/* Provider Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white shadow-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {providers.length}
            </div>
            <div className="text-sm text-gray-600">Total Providers</div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {providers.filter(p => p.isAvailableNow).length}
            </div>
            <div className="text-sm text-gray-600">Available Now</div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {providers.filter(p => p.type === 'human').length}
            </div>
            <div className="text-sm text-gray-600">Human Providers</div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {providers.filter(p => p.type === 'ai').length}
            </div>
            <div className="text-sm text-gray-600">AI Assistants</div>
          </div>
        </div>
        {/* Provider List */}
        {filteredProviders.length > 0 ? <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'} mb-8`}>
            {filteredProviders.map(provider => <div key={provider.id} className={`bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`} onClick={() => viewProviderDetails(provider.id)}>
                {viewMode === 'list' ? <div className="flex w-full">
                    <div className="relative w-48 h-auto bg-gray-100">
                      <img src={provider.profileImage} alt={provider.name} className="w-full h-full object-cover" />
                      {provider.type === 'ai' && <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                          <Bot size={12} className="mr-1" />
                          AI
                        </div>}
                      {provider.isAvailableNow && <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                          Available Now
                        </div>}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {provider.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {provider.tagline}
                          </p>
                        </div>
                        <button onClick={e => saveProvider(provider.id, e)} className="p-1 text-gray-400 hover:text-gray-600">
                          <Heart size={18} />
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {provider.categories.map(category => <span key={category.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {category.name}
                          </span>)}
                      </div>
                      <div className="mt-3 flex items-center">
                        <div className="flex items-center">
                          <Star size={16} className="text-yellow-400" />
                          <span className="ml-1 text-sm text-gray-700">
                            {provider.rating}
                          </span>
                        </div>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {provider.reviewCount} reviews
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <MapPin size={14} className="mr-1" />
                        <span>{provider.location}</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        <span>Response time: {provider.responseTime}</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {provider.skills.slice(0, 4).map(skill => <span key={skill.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {skill.name}
                            </span>)}
                          {provider.skills.length > 4 && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{provider.skills.length - 4} more
                            </span>}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-lg font-bold text-gray-900">
                          ${provider.startingPrice}
                          {provider.isPriceHourly ? '/hr' : ''}
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={e => contactProvider(provider.id, e)} className="px-3 py-1 border border-blue-600 rounded text-blue-600 text-sm font-medium hover:bg-blue-50">
                            Contact
                          </button>
                          <button onClick={e => hireProvider(provider.id, e)} className="px-3 py-1 bg-blue-600 rounded text-white text-sm font-medium hover:bg-blue-700">
                            Hire
                          </button>
                        </div>
                      </div>
                    </div>
                  </div> : <div>
                    <div className="relative">
                      <img src={provider.profileImage} alt={provider.name} className="w-full h-48 object-cover" />
                      {provider.type === 'ai' && <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                          <Bot size={12} className="mr-1" />
                          AI
                        </div>}
                      {provider.isAvailableNow && <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                          Available Now
                        </div>}
                      <button onClick={e => saveProvider(provider.id, e)} className="absolute top-2 right-2 p-1 bg-white rounded-full text-gray-400 hover:text-gray-600">
                        <Heart size={18} />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {provider.name}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {provider.tagline}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {provider.categories.map(category => <span key={category.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {category.name}
                          </span>)}
                      </div>
                      <div className="mt-3 flex items-center">
                        <div className="flex items-center">
                          <Star size={16} className="text-yellow-400" />
                          <span className="ml-1 text-sm text-gray-700">
                            {provider.rating}
                          </span>
                        </div>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {provider.reviewCount} reviews
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <MapPin size={14} className="mr-1" />
                        <span>{provider.location}</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        <span>Response time: {provider.responseTime}</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {provider.skills.slice(0, 4).map(skill => <span key={skill.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {skill.name}
                            </span>)}
                          {provider.skills.length > 4 && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{provider.skills.length - 4} more
                            </span>}
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="grid grid-cols-3 gap-1">
                          {provider.portfolioImages.map((image, index) => <div key={index} className="h-16 bg-gray-100 rounded overflow-hidden">
                              <img src={image} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                            </div>)}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-lg font-bold text-gray-900">
                          ${provider.startingPrice}
                          {provider.isPriceHourly ? '/hr' : ''}
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={e => contactProvider(provider.id, e)} className="px-3 py-1 border border-blue-600 rounded text-blue-600 text-sm font-medium hover:bg-blue-50">
                            Contact
                          </button>
                          <button onClick={e => hireProvider(provider.id, e)} className="px-3 py-1 bg-blue-600 rounded text-white text-sm font-medium hover:bg-blue-700">
                            Hire
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>}
              </div>)}
          </div> : <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <p className="text-gray-500 text-lg">
              No providers match your search criteria
            </p>
            <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium" onClick={resetFilters}>
              Clear all filters
            </button>
          </div>}
        {/* Become a Provider CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 md:flex items-center justify-between">
            <div className="text-white mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">
                Want to offer your services?
              </h2>
              <p className="mt-2 text-blue-100">
                Join our marketplace as a task doer and start earning.
              </p>
            </div>
            <div>
              <button className="w-full md:w-auto bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-md flex items-center justify-center" onClick={() => {
              // In a real app, this would navigate to the provider registration page
              console.log('Navigate to provider registration');
            }}>
                Become a Provider
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
}