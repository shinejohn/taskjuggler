import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { Star, User, Briefcase, ArrowRight } from 'lucide-react';
interface SearchResultsProps {
  searchTerm: string;
  onSearchChange: (term: string, category?: string) => void;
}
type ResultType = 'all' | 'tasks' | 'providers';
interface TaskResult {
  id: string;
  type: 'task';
  title: string;
  description: string;
  budget: string;
  dueDate: string;
  category: string;
  status: string;
}
interface ProviderResult {
  id: string;
  type: 'provider';
  name: string;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  hourlyRate: string;
  responseTime: string;
  skills: string[];
}
type SearchResult = TaskResult | ProviderResult;
export function SearchResults({
  searchTerm,
  onSearchChange
}: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState<ResultType>('all');
  // Mock search results
  const mockResults: SearchResult[] = [{
    id: 't1',
    type: 'task',
    title: 'Website Redesign for Small Business',
    description: 'Looking for an experienced web designer to refresh our company website with modern design elements and mobile responsiveness.',
    budget: '$1,000-$2,000',
    dueDate: '2023-12-15',
    category: 'Web Development',
    status: 'Open'
  }, {
    id: 'p1',
    type: 'provider',
    name: 'Alex Johnson',
    title: 'Full-stack Developer & UI/UX Designer',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    reviewCount: 47,
    hourlyRate: '$65/hr',
    responseTime: '< 2 hours',
    skills: ['React', 'Node.js', 'UI/UX Design', 'Responsive Design']
  }, {
    id: 't2',
    type: 'task',
    title: 'Logo Design for Tech Startup',
    description: 'Need a modern, minimalist logo for our AI-focused tech startup. Should convey innovation and trust.',
    budget: '$300-$500',
    dueDate: '2023-12-01',
    category: 'Graphic Design',
    status: 'Open'
  }, {
    id: 'p2',
    type: 'provider',
    name: 'Sarah Chen',
    title: 'Graphic Designer & Branding Expert',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    rating: 4.9,
    reviewCount: 62,
    hourlyRate: '$55/hr',
    responseTime: '< 1 hour',
    skills: ['Logo Design', 'Branding', 'Illustration', 'Print Design']
  }, {
    id: 't3',
    type: 'task',
    title: 'Content Writing for Blog Series',
    description: 'Seeking a content writer to create a 10-part blog series on digital marketing trends for our agency website.',
    budget: '$500-$800',
    dueDate: '2023-12-20',
    category: 'Writing & Translation',
    status: 'Open'
  }];
  // Filter results based on active tab
  const filteredResults = mockResults.filter(result => {
    if (activeTab === 'all') return true;
    if (activeTab === 'tasks') return result.type === 'task';
    if (activeTab === 'providers') return result.type === 'provider';
    return true;
  });
  // Related searches suggestions
  const relatedSearches = ['web design portfolio', 'affordable logo designer', 'react developer remote', 'content writer marketing'];
  return <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-center">
        <SearchBar onSearch={onSearchChange} placeholder="Search for tasks or providers..." />
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Search results for "{searchTerm}"
        </h1>
        <p className="text-gray-600 mt-1">
          Found {filteredResults.length} results
        </p>
      </div>
      <div className="flex border-b border-gray-200 mb-6">
        <button className={`px-6 py-3 text-sm font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('all')}>
          All Results
        </button>
        <button className={`px-6 py-3 text-sm font-medium ${activeTab === 'tasks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('tasks')}>
          Tasks
        </button>
        <button className={`px-6 py-3 text-sm font-medium ${activeTab === 'providers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('providers')}>
          Providers
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {filteredResults.map(result => <div key={result.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {result.type === 'task' ? <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Briefcase size={18} className="text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-600">
                      {result.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {result.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{result.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Budget:</span>{' '}
                      <span className="text-gray-600">{result.budget}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Due Date:
                      </span>{' '}
                      <span className="text-gray-600">
                        {new Date(result.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>{' '}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {result.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                    View Task
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div> : <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <img src={result.image} alt={result.name} className="w-16 h-16 rounded-full object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {result.name}
                  </h2>
                  <p className="text-gray-600 mb-2">{result.title}</p>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center mr-3">
                      <Star size={16} className="text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{result.rating}</span>
                      <span className="text-gray-500 ml-1">
                        ({result.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="text-gray-600 mr-3">
                      {result.hourlyRate}
                    </div>
                    <div className="text-gray-600">
                      Response time: {result.responseTime}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {result.skills.map((skill, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {skill}
                      </span>)}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                    View Profile
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>}
          </div>)}
      </div>
      {/* Related searches */}
      <div className="mt-10 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Related Searches
        </h3>
        <div className="flex flex-wrap gap-3">
          {relatedSearches.map((term, index) => <button key={index} onClick={() => onSearchChange(term)} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              {term}
            </button>)}
        </div>
      </div>
    </div>;
}