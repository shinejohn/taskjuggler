import React, { useEffect, useState, Component } from 'react';
// ... existing code ...
interface FilterState {
  categories: string[];
  priceRange: [number, number];
  location: string | null;
  coordinates: [number, number] | null;
  radius: number;
  deadlineAfter: string | null;
  deadlineBefore: string | null;
  providerType: TaskProviderType | 'all';
  urgency: UrgencyLevel | 'all';
}
type SortOption = 'newest' | 'deadline' | 'price-high' | 'price-low' | 'distance';
// ... existing code ...
export function TaskMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [proposalSortBy, setProposalSortBy] = useState<ProposalSortOption>('newest');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'proposals'>('overview');
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [proposalPreviewMode, setProposalPreviewMode] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [customLocation, setCustomLocation] = useState('');
  const [proposalFormData, setProposalFormData] = useState({
    // ... existing code ...
  });
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 10000],
    location: null,
    coordinates: null,
    radius: 25,
    deadlineAfter: null,
    deadlineBefore: null,
    providerType: 'all',
    urgency: 'all'
  });
  // Function to detect user's location using browser's Geolocation API
  const detectUserLocation = () => {
    setIsDetectingLocation(true);
    setLocationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const {
          latitude,
          longitude
        } = position.coords;
        try {
          // Reverse geocoding to get address from coordinates
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await response.json();
          // Extract city and state/country from the response
          const city = data.address.city || data.address.town || data.address.village || '';
          const state = data.address.state || '';
          const country = data.address.country || '';
          const locationString = [city, state, country].filter(Boolean).join(', ');
          // Update filters with the detected location
          setFilters(prev => ({
            ...prev,
            location: locationString,
            coordinates: [latitude, longitude]
          }));
          // Save to localStorage for persistence
          localStorage.setItem('userLocation', locationString);
          localStorage.setItem('userCoordinates', JSON.stringify([latitude, longitude]));
          setIsDetectingLocation(false);
        } catch (error) {
          console.error('Error getting location name:', error);
          setLocationError('Could not determine your location name. Please enter it manually.');
          setIsDetectingLocation(false);
        }
      }, error => {
        console.error('Geolocation error:', error);
        setLocationError('Could not access your location. Please enable location services or enter your location manually.');
        setIsDetectingLocation(false);
        // Fallback to IP-based geolocation
        fetchLocationByIP();
      });
    } else {
      setLocationError('Geolocation is not supported by your browser. Please enter your location manually.');
      setIsDetectingLocation(false);
      // Fallback to IP-based geolocation
      fetchLocationByIP();
    }
  };
  // Fallback function to get location by IP address
  const fetchLocationByIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.city && data.country_name) {
        const locationString = `${data.city}, ${data.region || ''} ${data.country_name}`.trim();
        setFilters(prev => ({
          ...prev,
          location: locationString,
          coordinates: [data.latitude, data.longitude]
        }));
        // Save to localStorage for persistence
        localStorage.setItem('userLocation', locationString);
        localStorage.setItem('userCoordinates', JSON.stringify([data.latitude, data.longitude]));
      } else {
        throw new Error('Incomplete location data');
      }
    } catch (error) {
      console.error('Error fetching location by IP:', error);
      setLocationError('Could not detect your location automatically. Please enter it manually.');
    }
  };
  // Function to update location with custom input
  const updateCustomLocation = async () => {
    if (!customLocation.trim()) {
      setLocationError('Please enter a valid location');
      return;
    }
    try {
      // Geocoding to get coordinates from address
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(customLocation)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const {
          lat,
          lon,
          display_name
        } = data[0];
        setFilters(prev => ({
          ...prev,
          location: display_name,
          coordinates: [parseFloat(lat), parseFloat(lon)]
        }));
        // Save to localStorage for persistence
        localStorage.setItem('userLocation', display_name);
        localStorage.setItem('userCoordinates', JSON.stringify([parseFloat(lat), parseFloat(lon)]));
        setIsLocationModalOpen(false);
        setCustomLocation('');
      } else {
        setLocationError('Could not find this location. Please try another search term.');
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      setLocationError('Error finding location. Please try again.');
    }
  };
  // Load saved location on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    const savedCoordinates = localStorage.getItem('userCoordinates');
    if (savedLocation && savedCoordinates) {
      try {
        const coordinates = JSON.parse(savedCoordinates) as [number, number];
        setFilters(prev => ({
          ...prev,
          location: savedLocation,
          coordinates: coordinates
        }));
      } catch (e) {
        console.error('Error parsing saved coordinates:', e);
      }
    } else {
      // Auto-detect location on first visit
      detectUserLocation();
    }
  }, []);
  // Calculate distance between two coordinate points (using Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
  };
  // ... existing code ...
  // Filter tasks based on search query, filters, etc.
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase()) || task.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategories = filters.categories.length === 0 || filters.categories.includes(task.category);
    const matchesPrice = task.type === 'unpaid' || task.price !== null && task.price >= filters.priceRange[0] && task.price <= filters.priceRange[1];
    const matchesProviderType = filters.providerType === 'all' || task.providerType === filters.providerType || filters.providerType === 'both' && task.providerType === 'both';
    const matchesUrgency = filters.urgency === 'all' || task.urgency === filters.urgency;
    // Location filtering - only apply to in-person tasks
    const matchesLocation = task.location === 'remote' ||
    // Remote tasks always match
    !filters.coordinates ||
    // If no user location is set, show all tasks
    !task.coordinates ||
    // If task has no coordinates, include it
    calculateDistance(filters.coordinates[0], filters.coordinates[1], task.coordinates[0], task.coordinates[1]) <= filters.radius; // Check if task is within radius
    return matchesSearch && matchesCategories && matchesPrice && matchesProviderType && matchesUrgency && matchesLocation;
  });
  // Sort tasks based on selected sorting option
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'price-high':
        // Sort by price, with unpaid tasks at the bottom
        if (a.price === null && b.price === null) return 0;
        if (a.price === null) return 1;
        if (b.price === null) return -1;
        return b.price - a.price;
      case 'price-low':
        // Sort by price, with unpaid tasks at the bottom
        if (a.price === null && b.price === null) return 0;
        if (a.price === null) return 1;
        if (b.price === null) return -1;
        return a.price - b.price;
      case 'distance':
        // Sort by distance from user location
        if (!filters.coordinates) return 0;
        if (a.location === 'remote' && b.location === 'remote') return 0;
        if (a.location === 'remote') return 1;
        if (b.location === 'remote') return -1;
        if (!a.coordinates) return 1;
        if (!b.coordinates) return -1;
        const distanceA = calculateDistance(filters.coordinates[0], filters.coordinates[1], a.coordinates[0], a.coordinates[1]);
        const distanceB = calculateDistance(filters.coordinates[0], filters.coordinates[1], b.coordinates[0], b.coordinates[1]);
        return distanceA - distanceB;
      default:
        return 0;
    }
  });
  // ... existing code ...
  // Location Modal Component
  const LocationModal = () => {
    if (!isLocationModalOpen) return null;
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Set Your Location
          </h3>
          {locationError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {locationError}
            </div>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter your location
            </label>
            <div className="flex">
              <input type="text" value={customLocation} onChange={e => setCustomLocation(e.target.value)} placeholder="City, State, Country" className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={updateCustomLocation} className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
                Set
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Example: "Seattle, WA" or "New York City"
            </p>
          </div>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <button onClick={detectUserLocation} disabled={isDetectingLocation} className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100">
              {isDetectingLocation ? <>Detecting your location...</> : <>
                  <MapPin size={16} className="mr-2" />
                  Detect my location automatically
                </>}
            </button>
          </div>
          <div className="flex justify-end mt-6">
            <button onClick={() => setIsLocationModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      </div>;
  };
  // ... existing code ...
  return <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Task Marketplace
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Find tasks to complete - both paid opportunities and community
              help requests
            </p>
          </div>
          <div className="flex space-x-3">
            <button onClick={() => setIsLocationModalOpen(true)} className="flex items-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md">
              <MapPin size={18} className="mr-2 text-blue-600" />
              {filters.location ? <span className="truncate max-w-[150px]">
                  {filters.location.split(',')[0]}
                </span> : 'Set Location'}
            </button>
            <button onClick={() => setViewMode('map')} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              <MapIcon size={18} className="mr-2" />
              Map View
            </button>
          </div>
        </div>
        {/* Search and Filters */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search tasks by title, description, or required skills..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <div>
                <button onClick={() => setFiltersOpen(!filtersOpen)} className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                  <Filter size={18} className="mr-2" />
                  Filters
                  <ChevronDown size={18} className={`ml-2 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
            {filtersOpen && <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map(category => <label key={category} className="flex items-center">
                        <input type="checkbox" checked={filters.categories.includes(category)} onChange={() => handleCategoryToggle(category)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-2 text-gray-700">{category}</span>
                        <span className="ml-auto text-xs text-gray-500">
                          ({tasks.filter(t => t.category === category).length}
                          )
                        </span>
                      </label>)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button className={`px-3 py-2 rounded-md text-sm font-medium ${filters.providerType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  providerType: 'all'
                }))}>
                      All
                    </button>
                    <button className={`px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center ${filters.providerType === 'human-only' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  providerType: 'human-only'
                }))}>
                      <User size={14} className="mr-1" />
                      Human
                    </button>
                    <button className={`px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center ${filters.providerType === 'ai-capable' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  providerType: 'ai-capable'
                }))}>
                      <Bot size={14} className="mr-1" />
                      AI
                    </button>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                    Urgency
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    <button className={`px-3 py-2 rounded-md text-sm font-medium ${filters.urgency === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  urgency: 'all'
                }))}>
                      All
                    </button>
                    <button className={`px-3 py-2 rounded-md text-sm font-medium ${filters.urgency === 'urgent' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  urgency: 'urgent'
                }))}>
                      Urgent
                    </button>
                    <button className={`px-3 py-2 rounded-md text-sm font-medium ${filters.urgency === 'soon' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  urgency: 'soon'
                }))}>
                      Soon
                    </button>
                    <button className={`px-3 py-2 rounded-md text-sm font-medium ${filters.urgency === 'flexible' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setFilters(prev => ({
                  ...prev,
                  urgency: 'flexible'
                }))}>
                      Flexible
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range (${filters.priceRange[0]} - $
                    {filters.priceRange[1]})
                  </label>
                  <div className="mt-2 px-2">
                    <input type="range" min="0" max="10000" step="100" value={filters.priceRange[1]} onChange={e => setFilters(prev => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                }))} className="w-full" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>$0</span>
                      <span>$5,000</span>
                      <span>$10,000+</span>
                    </div>
                  </div>
                  {/* Location radius slider */}
                  {filters.location && <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Distance Radius: {filters.radius} miles
                      </label>
                      <div className="mt-2 px-2">
                        <input type="range" min="5" max="100" step="5" value={filters.radius} onChange={e => setFilters(prev => ({
                    ...prev,
                    radius: parseInt(e.target.value)
                  }))} className="w-full" />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>5 mi</span>
                          <span>50 mi</span>
                          <span>100 mi</span>
                        </div>
                      </div>
                    </div>}
                  <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                    Sort By
                  </label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)}>
                    <option value="newest">Newest First</option>
                    <option value="deadline">Deadline (Soonest)</option>
                    <option value="price-high">Price (Highest)</option>
                    <option value="price-low">Price (Lowest)</option>
                    <option value="distance">Distance (Nearest)</option>
                  </select>
                  <div className="mt-6 flex justify-end">
                    <button onClick={resetFilters} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      Reset All Filters
                    </button>
                  </div>
                </div>
              </div>}
          </div>
        </div>
        {/* Task Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white shadow-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {sortedTasks.length}
            </div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {sortedTasks.filter(t => t.type === 'paid').length}
            </div>
            <div className="text-sm text-gray-600">Paid Opportunities</div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {sortedTasks.filter(t => t.type === 'unpaid').length}
            </div>
            <div className="text-sm text-gray-600">Help Requests</div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {sortedTasks.filter(t => daysUntilDeadline(t.deadline) <= 3).length}
            </div>
            <div className="text-sm text-gray-600">Urgent (≤ 3 days)</div>
          </div>
        </div>
        {/* Location Modal */}
        <LocationModal />
        {/* Task List */}
        {/* ... existing code ... */}
      </div>
    </div>;
}