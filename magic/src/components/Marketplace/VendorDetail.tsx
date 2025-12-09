import React, { useState, Component } from 'react';
import { Star, Clock, Calendar, DollarSign, MessageCircle, ChevronDown, ChevronUp, Award, Check, User, Bot, Server, MapPin, Globe, Briefcase, Phone, Mail, ExternalLink, Heart, Share2 } from 'lucide-react';
interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  date: string;
  comment: string;
}
interface CompletedTask {
  id: string;
  title: string;
  category: string;
  date: string;
  clientName: string;
  clientAvatar: string;
  review?: Review;
}
export function VendorDetail() {
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews' | 'tasks'>('about');
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  // Mock data for the vendor
  const vendor = {
    id: '1',
    name: 'Jessica Reynolds',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    type: 'human',
    tagline: 'UI/UX Designer & Brand Strategist',
    description: 'Professional UI/UX designer with 8+ years of experience creating intuitive interfaces for web and mobile applications. I specialize in user-centered design, wireframing, prototyping, and visual design. My approach combines aesthetics with functionality to deliver exceptional user experiences.',
    skills: ['UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'Brand Identity', 'Design Systems', 'User Testing', 'Visual Design'],
    rating: 4.9,
    reviewCount: 87,
    tasksCompleted: 134,
    responseTime: '< 2 hours',
    responseRate: '98%',
    memberSince: 'January 2021',
    location: 'San Francisco, CA',
    languages: ['English', 'Spanish'],
    education: 'Bachelor of Fine Arts in Graphic Design, Rhode Island School of Design',
    certifications: ['Adobe Certified Expert', 'Google UX Design Certificate'],
    featured: true,
    availability: 'Available for hire',
    contactInfo: {
      email: 'jessica@example.com',
      phone: '+1 (555) 123-4567',
      website: 'www.jessicareynolds.com'
    }
  };
  // Mock services offered
  const services = [{
    id: '1',
    title: 'UI/UX Design for Web Applications',
    description: 'Complete user interface design including wireframes, prototypes, and final designs for web applications.',
    price: 65,
    duration: '3-5 days',
    deliverables: ['Wireframes', 'Interactive Prototype', 'UI Design Files', 'Style Guide'],
    popular: true
  }, {
    id: '2',
    title: 'Mobile App UI Design',
    description: 'User-friendly and visually appealing interface design for iOS and Android mobile applications.',
    price: 75,
    duration: '4-7 days',
    deliverables: ['Wireframes', 'UI Design Files', 'Interactive Prototype', 'Design Specifications'],
    popular: true
  }, {
    id: '3',
    title: 'Brand Identity Design',
    description: 'Complete brand identity including logo, color palette, typography, and usage guidelines.',
    price: 120,
    duration: '7-10 days',
    deliverables: ['Logo (Multiple Formats)', 'Color Palette', 'Typography Guide', 'Brand Guidelines PDF'],
    popular: false
  }, {
    id: '4',
    title: 'UX Research & Analysis',
    description: 'In-depth user research, persona development, user journey mapping, and usability analysis.',
    price: 55,
    duration: '5-7 days',
    deliverables: ['Research Report', 'User Personas', 'User Journey Maps', 'Recommendations'],
    popular: false
  }, {
    id: '5',
    title: 'Design System Creation',
    description: 'Comprehensive design system with reusable components, guidelines, and documentation.',
    price: 90,
    duration: '10-14 days',
    deliverables: ['Component Library', 'Style Guide', 'Usage Documentation', 'Design Files'],
    popular: false
  }];
  // Mock reviews
  const reviews: Review[] = [{
    id: '1',
    user: {
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    rating: 5,
    date: 'July 15, 2023',
    comment: 'Jessica did an amazing job redesigning our company website. She was very responsive, professional, and delivered exactly what we needed. The new design has significantly improved our user engagement.'
  }, {
    id: '2',
    user: {
      name: 'Sarah Chen',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
    },
    rating: 5,
    date: 'June 22, 2023',
    comment: 'Working with Jessica was a pleasure. She created a beautiful and functional UI for our mobile app. Her attention to detail and understanding of user experience principles really shows in the final product.'
  }, {
    id: '3',
    user: {
      name: 'Michael Torres',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
    },
    rating: 4,
    date: 'May 10, 2023',
    comment: 'Jessica designed a great logo and brand identity for my startup. The process was smooth and she was open to feedback and revisions. I would definitely work with her again.'
  }, {
    id: '4',
    user: {
      name: 'Emily Watson',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    rating: 5,
    date: 'April 5, 2023',
    comment: 'Exceptional work on our e-commerce website redesign. Jessica took the time to understand our business needs and created a design that not only looks great but has improved our conversion rate by 25%.'
  }, {
    id: '5',
    user: {
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    rating: 5,
    date: 'March 18, 2023',
    comment: 'Jessica created a comprehensive design system for our product that has made our development process much more efficient. Her documentation was thorough and the component library is extremely well organized.'
  }];
  // Mock completed tasks
  const completedTasks: CompletedTask[] = [{
    id: '1',
    title: 'E-commerce Website Redesign',
    category: 'UI Design',
    date: 'July 10, 2023',
    clientName: 'Emily Watson',
    clientAvatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    review: reviews[3]
  }, {
    id: '2',
    title: 'Mobile Banking App UI Design',
    category: 'Mobile Design',
    date: 'June 15, 2023',
    clientName: 'Sarah Chen',
    clientAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    review: reviews[1]
  }, {
    id: '3',
    title: 'SaaS Product Design System',
    category: 'Design Systems',
    date: 'May 22, 2023',
    clientName: 'David Kim',
    clientAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    review: reviews[4]
  }, {
    id: '4',
    title: 'Startup Brand Identity',
    category: 'Branding',
    date: 'April 30, 2023',
    clientName: 'Michael Torres',
    clientAvatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    review: reviews[2]
  }, {
    id: '5',
    title: 'Corporate Website Redesign',
    category: 'UI Design',
    date: 'March 25, 2023',
    clientName: 'Alex Johnson',
    clientAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    review: reviews[0]
  }];
  const displayedServices = showAllServices ? services : services.slice(0, 3);
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const getVendorTypeIcon = (type: string) => {
    switch (type) {
      case 'human':
        return <User size={16} className="mr-1 text-blue-500" />;
      case 'ai':
        return <Bot size={16} className="mr-1 text-purple-500" />;
      case 'system':
        return <Server size={16} className="mr-1 text-green-500" />;
      default:
        return <User size={16} className="mr-1 text-blue-500" />;
    }
  };
  return <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <button onClick={() => window.history.back()} className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
            ← Back to Marketplace
          </button>
          <div className="flex space-x-3">
            <button className="flex items-center text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-md px-3 py-1">
              <Heart size={16} className="mr-1" />
              Save
            </button>
            <button className="flex items-center text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-md px-3 py-1">
              <Share2 size={16} className="mr-1" />
              Share
            </button>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          {vendor.featured && <div className="bg-blue-500 text-white text-sm font-bold px-4 py-1 text-center">
              FEATURED DO-ER
            </div>}
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start">
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <img src={vendor.avatar} alt={vendor.name} className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg" />
              </div>
              <div className="md:ml-8 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {vendor.name}
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getVendorTypeIcon(vendor.type)}
                    {vendor.type.charAt(0).toUpperCase() + vendor.type.slice(1)}
                  </span>
                  {vendor.availability === 'Available for hire' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Available Now
                    </span>}
                </div>
                <p className="mt-1 text-xl text-gray-600">{vendor.tagline}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center">
                    <Star size={18} className="text-yellow-400 mr-1" />
                    <span className="font-medium text-gray-900">
                      {vendor.rating}
                    </span>
                    <span className="ml-1 text-gray-600">
                      ({vendor.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase size={16} className="mr-1" />
                    {vendor.tasksCompleted} tasks completed
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock size={16} className="mr-1" />
                    Response time: {vendor.responseTime}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-1" />
                    Member since {vendor.memberSince}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1">
                  {vendor.skills.map((skill, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {skill}
                    </span>)}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md">
                    Contact
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md flex items-center">
                    <DollarSign size={18} className="mr-1" />
                    Hire for Task
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-md flex items-center">
                    <MessageCircle size={18} className="mr-1" />
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto">
              <button className={`flex-1 text-center py-4 px-6 font-medium ${activeTab === 'about' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveTab('about')}>
                About
              </button>
              <button className={`flex-1 text-center py-4 px-6 font-medium ${activeTab === 'services' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveTab('services')}>
                Services
              </button>
              <button className={`flex-1 text-center py-4 px-6 font-medium ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveTab('reviews')}>
                Reviews
              </button>
              <button className={`flex-1 text-center py-4 px-6 font-medium ${activeTab === 'tasks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveTab('tasks')}>
                Completed Tasks
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {activeTab === 'about' && <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About {vendor.name}
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {vendor.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin size={18} className="text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">
                          Location
                        </h4>
                        <p className="text-gray-600">{vendor.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Globe size={18} className="text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">
                          Languages
                        </h4>
                        <p className="text-gray-600">
                          {vendor.languages.join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Award size={18} className="text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">
                          Education
                        </h4>
                        <p className="text-gray-600">{vendor.education}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check size={18} className="text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">
                          Certifications
                        </h4>
                        <ul className="text-gray-600">
                          {vendor.certifications.map((cert, index) => <li key={index}>{cert}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail size={18} className="text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">
                          Email
                        </h4>
                        <p className="text-gray-600">
                          {vendor.contactInfo.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone size={18} className="text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">
                          Phone
                        </h4>
                        <p className="text-gray-600">
                          {vendor.contactInfo.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <ExternalLink size={18} className="text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">
                          Website
                        </h4>
                        <a href={`https://${vendor.contactInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {vendor.contactInfo.website}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Work Statistics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {vendor.tasksCompleted}
                        </div>
                        <div className="text-sm text-gray-600">
                          Tasks Completed
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {vendor.responseRate}
                        </div>
                        <div className="text-sm text-gray-600">
                          Response Rate
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {vendor.responseTime}
                        </div>
                        <div className="text-sm text-gray-600">
                          Response Time
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {vendor.rating}
                        </div>
                        <div className="text-sm text-gray-600">
                          Average Rating
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          {activeTab === 'services' && <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Services Offered
              </h2>
              <div className="space-y-6">
                {displayedServices.map(service => <div key={service.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">
                          {service.title}
                          {service.popular && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Popular
                            </span>}
                        </h3>
                        <p className="mt-2 text-gray-600">
                          {service.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 flex items-center">
                          <DollarSign size={20} className="text-green-600" />
                          {service.price}
                        </div>
                        <div className="text-sm text-gray-500">per hour</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <Clock size={16} className="mr-1" />
                      <span>Estimated duration: {service.duration}</span>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">
                        Deliverables:
                      </h4>
                      <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {service.deliverables.map((item, index) => <li key={index} className="flex items-center text-gray-600">
                            <Check size={16} className="mr-2 text-green-500" />
                            {item}
                          </li>)}
                      </ul>
                    </div>
                    <div className="mt-6">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                        Select This Service
                      </button>
                    </div>
                  </div>)}
              </div>
              {services.length > 3 && <div className="mt-6 text-center">
                  <button onClick={() => setShowAllServices(!showAllServices)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center mx-auto">
                    {showAllServices ? <>
                        Show Less <ChevronUp size={16} className="ml-1" />
                      </> : <>
                        Show All Services ({services.length}){' '}
                        <ChevronDown size={16} className="ml-1" />
                      </>}
                  </button>
                </div>}
            </div>}
          {activeTab === 'reviews' && <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Client Reviews ({reviews.length})
                </h2>
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-md">
                  <Star size={20} className="text-yellow-400 mr-1" />
                  <span className="font-bold text-gray-900">
                    {vendor.rating}
                  </span>
                  <span className="mx-1 text-gray-500">/</span>
                  <span className="text-gray-600">5</span>
                </div>
              </div>
              <div className="space-y-6">
                {displayedReviews.map(review => <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start">
                      <img src={review.user.avatar} alt={review.user.name} className="h-10 w-10 rounded-full object-cover mr-4" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-900">
                            {review.user.name}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} fill={i < review.rating ? 'currentColor' : 'none'} />)}
                        </div>
                        <p className="mt-2 text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  </div>)}
              </div>
              {reviews.length > 3 && <div className="mt-6 text-center">
                  <button onClick={() => setShowAllReviews(!showAllReviews)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center mx-auto">
                    {showAllReviews ? <>
                        Show Less <ChevronUp size={16} className="ml-1" />
                      </> : <>
                        Show All Reviews ({reviews.length}){' '}
                        <ChevronDown size={16} className="ml-1" />
                      </>}
                  </button>
                </div>}
            </div>}
          {activeTab === 'tasks' && <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Completed Tasks ({completedTasks.length})
              </h2>
              <div className="space-y-6">
                {completedTasks.map(task => <div key={task.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">
                          {task.title}
                        </h3>
                        <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {task.category}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{task.date}</div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-sm text-gray-600 mr-2">
                        Client:
                      </span>
                      <img src={task.clientAvatar} alt={task.clientName} className="h-6 w-6 rounded-full object-cover mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {task.clientName}
                      </span>
                    </div>
                    {task.review && <div className="mt-4 bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700 mr-2">
                            Client Review:
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < task.review!.rating ? 'text-yellow-400' : 'text-gray-300'} fill={i < task.review!.rating ? 'currentColor' : 'none'} />)}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {task.review.comment}
                        </p>
                      </div>}
                  </div>)}
              </div>
            </div>}
        </div>
      </div>
    </div>;
}