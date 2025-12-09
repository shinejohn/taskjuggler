import React, { useState } from 'react';
import { Search, Users, Plus, Star, Clock, ExternalLink, ArrowRight } from 'lucide-react';
interface Friend {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  rating: number;
  tasksCompleted: number;
  recentlyActive: boolean;
}
export function FriendSelector() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  // Mock data for friends
  const friends: Friend[] = [{
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    skills: ['Design', 'Coding', 'Writing'],
    rating: 4.8,
    tasksCompleted: 27,
    recentlyActive: true
  }, {
    id: '2',
    name: 'Maria Garcia',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    skills: ['Research', 'Data Analysis', 'Editing'],
    rating: 4.9,
    tasksCompleted: 42,
    recentlyActive: true
  }, {
    id: '3',
    name: 'James Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    skills: ['Photography', 'Video Editing', 'Social Media'],
    rating: 4.6,
    tasksCompleted: 18,
    recentlyActive: false
  }, {
    id: '4',
    name: 'Sarah Chen',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    skills: ['Translation', 'Proofreading', 'Content Creation'],
    rating: 4.7,
    tasksCompleted: 31,
    recentlyActive: true
  }, {
    id: '5',
    name: 'David Kim',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    skills: ['Marketing', 'SEO', 'Analytics'],
    rating: 4.5,
    tasksCompleted: 23,
    recentlyActive: false
  }];
  const filteredFriends = friends.filter(friend => friend.name.toLowerCase().includes(searchQuery.toLowerCase()) || friend.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())));
  const toggleFriendSelection = (friendId: string) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };
  const navigateToMarketplace = () => {
    // In a real app, this would navigate to the marketplace
    window.location.href = '/marketplace';
  };
  return <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Find Someone to Complete Your Task
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Choose from your friend group or explore the marketplace
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Users className="mr-2" />
              Your Friend Group
            </h2>
          </div>
          <div className="p-6">
            <div className="mb-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search friends by name or skills..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            {filteredFriends.length > 0 ? <ul className="divide-y divide-gray-200">
                {filteredFriends.map(friend => <li key={friend.id} className="py-4">
                    <div className="flex items-start">
                      <input type="checkbox" checked={selectedFriends.includes(friend.id)} onChange={() => toggleFriendSelection(friend.id)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1.5" />
                      <div className="ml-3 flex-shrink-0">
                        <img src={friend.avatar} alt={friend.name} className="h-12 w-12 rounded-full object-cover" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            {friend.name}
                          </h3>
                          <div className="flex items-center">
                            <Star size={16} className="text-yellow-400" />
                            <span className="ml-1 text-sm text-gray-600">
                              {friend.rating}
                            </span>
                          </div>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {friend.skills.map((skill, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {skill}
                            </span>)}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          <span>{friend.tasksCompleted} tasks completed</span>
                          {friend.recentlyActive && <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Recently active
                            </span>}
                        </div>
                      </div>
                    </div>
                  </li>)}
              </ul> : <div className="text-center py-8">
                <p className="text-gray-500">
                  No friends match your search criteria
                </p>
              </div>}
            {selectedFriends.length > 0 && <div className="mt-6">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center">
                  Assign to {selectedFriends.length} selected friend
                  {selectedFriends.length > 1 ? 's' : ''}
                  <ArrowRight size={18} className="ml-2" />
                </button>
              </div>}
            <div className="mt-4 flex justify-center">
              <button className="flex items-center text-blue-600 hover:text-blue-800" onClick={() => {}}>
                <Plus size={18} className="mr-1" />
                Invite new friends to your group
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Explore the Task Marketplace
            </h2>
            <p className="text-purple-100 mt-1">
              Find skilled professionals, AI assistants, and services to
              complete your tasks
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  1,000+
                </div>
                <div className="text-sm text-gray-600">Verified Do-ers</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">50+</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  24/7
                </div>
                <div className="text-sm text-gray-600">Task Support</div>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Our marketplace connects you with skilled professionals and
              automated services that can handle your tasks quickly and
              efficiently.
            </p>
            <button onClick={navigateToMarketplace} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-md flex items-center justify-center">
              Browse the Marketplace
              <ExternalLink size={18} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>;
}