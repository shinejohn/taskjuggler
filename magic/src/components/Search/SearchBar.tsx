import React, { useEffect, useState, useRef } from 'react';
import { Search as SearchIcon, Mic, X, ChevronDown } from 'lucide-react';
interface SearchCategory {
  id: string;
  name: string;
}
interface RecentSearch {
  id: string;
  term: string;
  timestamp: Date;
}
interface SearchBarProps {
  onSearch: (term: string, category?: string) => void;
  placeholder?: string;
  showFilters?: boolean;
}
export function SearchBar({
  onSearch,
  placeholder = 'Search for tasks or providers...',
  showFilters = true
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Mock data for categories and recent searches
  const categories: SearchCategory[] = [{
    id: 'c1',
    name: 'Web Development'
  }, {
    id: 'c2',
    name: 'Graphic Design'
  }, {
    id: 'c3',
    name: 'Writing & Translation'
  }, {
    id: 'c4',
    name: 'Virtual Assistance'
  }, {
    id: 'c5',
    name: 'Marketing'
  }];
  const recentSearches: RecentSearch[] = [{
    id: 'rs1',
    term: 'logo design',
    timestamp: new Date(2023, 10, 15)
  }, {
    id: 'rs2',
    term: 'website developer',
    timestamp: new Date(2023, 10, 14)
  }, {
    id: 'rs3',
    term: 'content writer',
    timestamp: new Date(2023, 10, 12)
  }];
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRecentSearches(false);
        setShowCategories(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setShowRecentSearches(false);
    }
  };
  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      onSearch(searchTerm, category.name);
      setShowCategories(false);
    }
  };
  const handleRecentSearchSelect = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
    setShowRecentSearches(false);
  };
  const clearSearch = () => {
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  const toggleVoiceSearch = () => {
    setIsListening(!isListening);
    // In a real implementation, this would use the Web Speech API
    if (!isListening) {
      alert('Voice search activated. This would use the Web Speech API in a real implementation.');
      // Simulate receiving voice input after 2 seconds
      setTimeout(() => {
        setSearchTerm('voice search demo');
        setIsListening(false);
      }, 2000);
    }
  };
  return <div className="relative w-full max-w-3xl" ref={dropdownRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input ref={searchInputRef} type="text" className="block w-full pl-10 pr-20 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={placeholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onFocus={() => setShowRecentSearches(true)} />
            {searchTerm && <button type="button" onClick={clearSearch} className="absolute inset-y-0 right-10 pr-3 flex items-center">
                <X size={18} className="text-gray-400 hover:text-gray-600" />
              </button>}
          </div>
          <button type="button" onClick={toggleVoiceSearch} className={`absolute right-3 p-1 rounded-full ${isListening ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-gray-600'}`}>
            <Mic size={18} />
          </button>
        </div>
        {showFilters && <div className="flex mt-2 text-sm text-gray-600">
            <button type="button" className="flex items-center mr-4 hover:text-blue-600" onClick={() => setShowCategories(!showCategories)}>
              Categories
              <ChevronDown size={14} className="ml-1" />
            </button>
            <button type="button" className="flex items-center mr-4 hover:text-blue-600">
              Price Range
              <ChevronDown size={14} className="ml-1" />
            </button>
            <button type="button" className="flex items-center mr-4 hover:text-blue-600">
              Ratings
              <ChevronDown size={14} className="ml-1" />
            </button>
            <button type="button" className="flex items-center hover:text-blue-600">
              More Filters
              <ChevronDown size={14} className="ml-1" />
            </button>
          </div>}
      </form>
      {/* Recent searches dropdown */}
      {showRecentSearches && searchTerm === '' && <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-2 border-b border-gray-200">
            <h3 className="text-xs font-medium text-gray-500">
              RECENT SEARCHES
            </h3>
          </div>
          <ul>
            {recentSearches.map(search => <li key={search.id}>
                <button type="button" onClick={() => handleRecentSearchSelect(search.term)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between">
                  <span className="text-gray-700">{search.term}</span>
                  <span className="text-xs text-gray-500">
                    {search.timestamp.toLocaleDateString()}
                  </span>
                </button>
              </li>)}
          </ul>
          <div className="p-2 border-t border-gray-200">
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Clear recent searches
            </button>
          </div>
        </div>}
      {/* Auto-complete categories dropdown */}
      {showCategories && <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-2 border-b border-gray-200">
            <h3 className="text-xs font-medium text-gray-500">CATEGORIES</h3>
          </div>
          <ul>
            {categories.map(category => <li key={category.id}>
                <button type="button" onClick={() => handleCategorySelect(category.id)} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  {category.name}
                </button>
              </li>)}
          </ul>
        </div>}
    </div>;
}