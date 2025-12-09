import React, { useState } from 'react';
import { MapPin, Star, Clock, MessageSquare, Briefcase, Calendar, Globe, Shield, Check, ChevronLeft, ChevronRight, Heart, Share2, ExternalLink, DollarSign, Calendar as CalendarIcon, Award, CheckCircle, ThumbsUp, ThumbsDown, AlertCircle, Map as MapIcon, Image, Users, FileText, CreditCard, X } from 'lucide-react';
type ProviderType = 'human' | 'ai' | 'both';
type VerificationStatus = 'verified' | 'basic' | 'unverified';
interface Skill {
  id: string;
  name: string;
}
interface ServiceCategory {
  id: string;
  name: string;
}
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  isPriceHourly: boolean;
  estimatedDuration: string;
}
interface PortfolioItem {
  id: string;
  image: string;
  title: string;
  category: string;
  completionDate: string;
  clientReview?: string;
}
interface Review {
  id: string;
  reviewerName: string;
  reviewerImage: string;
  rating: number;
  date: string;
  taskCategory: string;
  text: string;
  providerResponse?: string;
}
interface Provider {
  id: string;
  name: string;
  title: string;
  profileImage: string;
  type: ProviderType;
  bio: string;
  location: string;
  coordinates: [number, number];
  rating: number;
  reviewCount: number;
  responseTime: string;
  responseRate: string;
  completedTaskCount: number;
  memberSince: string;
  isAvailableNow: boolean;
  skills: Skill[];
  categories: ServiceCategory[];
  services: Service[];
  portfolio: PortfolioItem[];
  reviews: Review[];
  languages: string[];
  verificationStatus: VerificationStatus;
  yearsOfExperience: number;
  certifications: string[];
  hourlyRate: number;
  cancellationPolicy: string;
  paymentMethods: string[];
}
interface ProviderDetailProps {
  providerId: string;
  onBack: () => void;
}
export function ProviderDetail({
  providerId,
  onBack
}: ProviderDetailProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'portfolio' | 'reviews' | 'pricing'>('about');
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // Mock data for a single provider
  const provider: Provider = {
    id: 'p1',
    name: 'Alex Johnson',
    title: 'Full-stack Developer & UI/UX Designer',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    type: 'human',
    bio: "I'm a full-stack developer with over 5 years of experience building web applications. I specialize in React, Node.js, and modern JavaScript frameworks. My background in UI/UX design allows me to create intuitive and visually appealing interfaces that users love. I've worked with startups and established companies to deliver high-quality digital products on time and within budget.",
    location: 'Seattle, WA',
    coordinates: [47.6062, -122.3321],
    rating: 4.8,
    reviewCount: 47,
    responseTime: '< 2 hours',
    responseRate: '98%',
    completedTaskCount: 83,
    memberSince: 'January 2022',
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
      name: 'UI/UX Design'
    }, {
      id: 's5',
      name: 'Responsive Design'
    }, {
      id: 's6',
      name: 'API Development'
    }, {
      id: 's7',
      name: 'Database Design'
    }],
    categories: [{
      id: 'tech',
      name: 'Technology'
    }, {
      id: 'design',
      name: 'Design'
    }],
    services: [{
      id: 'serv1',
      name: 'Website Development',
      description: 'Custom website development using React, Next.js, or plain HTML/CSS/JS. Includes responsive design, cross-browser testing, and basic SEO optimization.',
      price: 75,
      isPriceHourly: true,
      estimatedDuration: '2-4 weeks'
    }, {
      id: 'serv2',
      name: 'UI/UX Design',
      description: 'User interface and experience design for web and mobile applications. Includes wireframes, mockups, and interactive prototypes.',
      price: 65,
      isPriceHourly: true,
      estimatedDuration: '1-2 weeks'
    }, {
      id: 'serv3',
      name: 'E-commerce Website Package',
      description: 'Complete e-commerce solution with product catalog, shopping cart, payment processing, and admin dashboard.',
      price: 2500,
      isPriceHourly: false,
      estimatedDuration: '4-6 weeks'
    }, {
      id: 'serv4',
      name: 'Website Maintenance',
      description: 'Ongoing maintenance, updates, and support for existing websites. Includes security patches, content updates, and performance optimization.',
      price: 50,
      isPriceHourly: true,
      estimatedDuration: 'Ongoing'
    }],
    portfolio: [{
      id: 'port1',
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=500&auto=format&fit=crop',
      title: 'E-commerce Platform for Artisanal Products',
      category: 'Website Development',
      completionDate: 'March 2023',
      clientReview: 'Alex delivered an exceptional e-commerce platform that perfectly showcases our artisanal products. The site is beautiful, fast, and easy to use.'
    }, {
      id: 'port2',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=500&auto=format&fit=crop',
      title: 'Finance Dashboard UI Design',
      category: 'UI/UX Design',
      completionDate: 'January 2023',
      clientReview: 'The dashboard design Alex created is both beautiful and functional. It presents complex financial data in an intuitive way.'
    }, {
      id: 'port3',
      image: 'https://images.unsplash.com/photo-1558882224-dda166733046?q=80&w=500&auto=format&fit=crop',
      title: 'Real Estate Listing Platform',
      category: 'Website Development',
      completionDate: 'November 2022'
    }, {
      id: 'port4',
      image: 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=500&auto=format&fit=crop',
      title: 'Blog Platform for Writers',
      category: 'Website Development',
      completionDate: 'September 2022',
      clientReview: 'Our writers love the clean, distraction-free interface Alex designed. The reading experience is excellent too.'
    }, {
      id: 'port5',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop',
      title: 'Marketing Analytics Dashboard',
      category: 'UI/UX Design',
      completionDate: 'July 2022'
    }, {
      id: 'port6',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&auto=format&fit=crop',
      title: 'Mobile App for Fitness Tracking',
      category: 'UI/UX Design',
      completionDate: 'May 2022',
      clientReview: 'The app design is sleek, intuitive, and motivating. Our users love the interface and ease of use.'
    }],
    reviews: [{
      id: 'rev1',
      reviewerName: 'Emily Watson',
      reviewerImage: 'https://randomuser.me/api/portraits/women/45.jpg',
      rating: 5,
      date: '2023-10-15',
      taskCategory: 'Website Development',
      text: "Alex was amazing to work with! He understood my requirements perfectly and delivered a beautiful, functional website ahead of schedule. His communication was excellent throughout the project, and he was very responsive to feedback and revision requests. I'll definitely hire him again for future projects.",
      providerResponse: "Thank you for the kind words, Emily! It was a pleasure working with you, and I'm thrilled that you're happy with the website. Looking forward to collaborating on future projects!"
    }, {
      id: 'rev2',
      reviewerName: 'Michael Torres',
      reviewerImage: 'https://randomuser.me/api/portraits/men/42.jpg',
      rating: 4,
      date: '2023-09-22',
      taskCategory: 'UI/UX Design',
      text: 'Alex created excellent UI designs for our application. He has a great eye for detail and produced clean, modern interfaces. The only reason for 4 stars instead of 5 is that we had to extend the timeline a bit, but the quality of work was top-notch.'
    }, {
      id: 'rev3',
      reviewerName: 'Sarah Chen',
      reviewerImage: 'https://randomuser.me/api/portraits/women/33.jpg',
      rating: 5,
      date: '2023-08-05',
      taskCategory: 'Website Development',
      text: "I hired Alex to build an e-commerce website for my small business, and I couldn't be happier with the results. The site looks professional, loads quickly, and is easy for my customers to navigate. Alex also provided training on how to update products and manage orders, which has been invaluable. Highly recommended!",
      providerResponse: "Thanks for the wonderful review, Sarah! I'm glad the website is working well for your business. Don't hesitate to reach out if you need any further assistance or have questions about managing your site."
    }, {
      id: 'rev4',
      reviewerName: 'David Kim',
      reviewerImage: 'https://randomuser.me/api/portraits/men/45.jpg',
      rating: 5,
      date: '2023-07-18',
      taskCategory: 'UI/UX Design',
      text: "Alex redesigned our app interface and the results were fantastic. Our user engagement metrics improved significantly after implementing his designs. He took the time to understand our users' needs and created intuitive flows that addressed pain points in our previous design."
    }, {
      id: 'rev5',
      reviewerName: 'Lisa Martinez',
      reviewerImage: 'https://randomuser.me/api/portraits/women/22.jpg',
      rating: 4,
      date: '2023-06-30',
      taskCategory: 'Website Development',
      text: 'Good work on our website redesign. Alex is knowledgeable and implemented all the features we requested. The only issue was occasional delays in communication, but the end product met our expectations.'
    }],
    languages: ['English', 'Spanish'],
    verificationStatus: 'verified',
    yearsOfExperience: 5,
    certifications: ['AWS Certified Developer', 'Google UX Design Certificate', 'Meta Front-End Developer Certificate'],
    hourlyRate: 75,
    cancellationPolicy: 'Full refund if cancelled within 24 hours of booking. 50% refund if cancelled at least 48 hours before scheduled start time. No refund after work has begun.',
    paymentMethods: ['Credit Card', 'PayPal', 'Bank Transfer']
  };
  const contactProvider = () => {
    // In a real app, this would open a chat or contact form
    console.log(`Contact provider: ${providerId}`);
  };
  const hireProvider = () => {
    // In a real app, this would navigate to a booking/hiring flow
    console.log(`Hire provider: ${providerId}`);
  };
  const bookService = (serviceId: string) => {
    // In a real app, this would navigate to a service booking flow
    console.log(`Book service: ${serviceId}`);
  };
  const saveProvider = () => {
    // In a real app, this would save the provider to favorites
    console.log(`Save provider: ${providerId}`);
  };
  const shareProvider = () => {
    // In a real app, this would open a share dialog
    console.log(`Share provider: ${providerId}`);
  };
  const openPortfolioItem = (itemId: string) => {
    setSelectedPortfolioItem(itemId);
  };
  const closePortfolioItem = () => {
    setSelectedPortfolioItem(null);
  };
  const filterPortfolioByCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };
  const filteredPortfolio = selectedCategory ? provider.portfolio.filter(item => item.category === selectedCategory) : provider.portfolio;
  const portfolioCategories = Array.from(new Set(provider.portfolio.map(item => item.category)));
  const selectedPortfolioItemData = selectedPortfolioItem ? provider.portfolio.find(item => item.id === selectedPortfolioItem) : null;
  // Calculate rating distribution
  const ratingDistribution = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
  provider.reviews.forEach(review => {
    ratingDistribution[5 - review.rating]++;
  });
  const ratingPercentages = ratingDistribution.map(count => count / provider.reviews.length * 100 || 0);
  return <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button onClick={onBack} className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
            <ChevronLeft size={16} className="mr-1" /> Back to Providers
          </button>
        </div>
        {/* Provider Header */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="md:flex items-start">
              <div className="relative mb-6 md:mb-0 md:mr-8">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                  <img src={provider.profileImage} alt={provider.name} className="w-full h-full object-cover" />
                </div>
                {provider.type === 'ai' && <div className="absolute top-0 left-0 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    AI Provider
                  </div>}
                {provider.isAvailableNow && <div className="absolute bottom-0 right-0 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Available Now
                  </div>}
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {provider.name}
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">
                      {provider.title}
                    </p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        <Star size={20} className="text-yellow-400" />
                        <span className="ml-1 text-lg font-medium text-gray-900">
                          {provider.rating}
                        </span>
                      </div>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-600">
                        {provider.reviewCount} reviews
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-600">
                        {provider.completedTaskCount} tasks completed
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-gray-600">
                      <MapPin size={18} className="mr-1" />
                      {provider.location}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {provider.categories.map(category => <span key={category.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {category.name}
                        </span>)}
                      {provider.verificationStatus === 'verified' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Shield size={12} className="mr-1" />
                          Verified
                        </span>}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                    <div className="text-gray-600 mb-2 flex items-center">
                      <Clock size={16} className="mr-1" />
                      Response time: {provider.responseTime}
                    </div>
                    <div className="text-gray-600 mb-4 flex items-center">
                      <MessageSquare size={16} className="mr-1" />
                      Response rate: {provider.responseRate}
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={saveProvider} className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        <Heart size={20} />
                      </button>
                      <button onClick={shareProvider} className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        <Share2 size={20} />
                      </button>
                      <button onClick={contactProvider} className="px-4 py-2 border border-blue-600 rounded-md text-blue-600 font-medium hover:bg-blue-50">
                        Contact Me
                      </button>
                      <button onClick={hireProvider} className="px-4 py-2 bg-blue-600 rounded-md text-white font-medium hover:bg-blue-700">
                        Hire Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Tab Navigation */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto">
              <button className={`flex-1 text-center py-4 px-6 font-medium ${activeTab === 'about' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveTab('about')}>
                About
              </button>
              <button className={`flex-1 text-center py-4 px-6 font-medium ${activeTab === 'services' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveTab('services')}>
                Services
              </button>
              <button className={`flex-1 text-center py-4 px-6 font-medium ${activeTab === 'portfolio' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveTab('portfolio')}>
                Portfolio
              </button>
              <button className={`flex-1 text-center py-4 px-6 font-medium ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveTab('reviews')}>
                Reviews ({provider.reviewCount})
              </button>
              <button className={`flex-1 text-center py-4 px-6 font-medium ${activeTab === 'pricing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveTab('pricing')}>
                Pricing
              </button>
            </div>
          </div>
        </div>
        {/* Tab Content */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            {/* About Tab */}
            {activeTab === 'about' && <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {provider.bio}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Experience & Skills
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Briefcase size={20} className="text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            Years of Experience
                          </h4>
                          <p className="text-gray-900">
                            {provider.yearsOfExperience} years
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Award size={20} className="text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            Certifications
                          </h4>
                          <ul className="list-disc pl-5 text-gray-700">
                            {provider.certifications.map((cert, index) => <li key={index}>{cert}</li>)}
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle size={20} className="text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            Skills
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {provider.skills.map(skill => <span key={skill.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {skill.name}
                              </span>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Languages & Location
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Globe size={20} className="text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            Languages
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {provider.languages.map((language, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {language}
                              </span>)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin size={20} className="text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            Service Area
                          </h4>
                          <p className="text-gray-700">{provider.location}</p>
                          {provider.coordinates && <div className="mt-2 h-40 bg-gray-200 rounded-lg overflow-hidden">
                              {/* Map would go here in a real implementation */}
                              <div className="h-full w-full flex items-center justify-center">
                                <MapIcon size={24} className="text-gray-400 mr-2" />
                                <span className="text-gray-500">
                                  Map Preview
                                </span>
                              </div>
                            </div>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Availability
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Calendar size={20} className="text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            Weekly Schedule
                          </h4>
                          <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                            <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-700 bg-gray-50 border-b border-gray-200">
                              <div className="py-2">Mon</div>
                              <div className="py-2">Tue</div>
                              <div className="py-2">Wed</div>
                              <div className="py-2">Thu</div>
                              <div className="py-2">Fri</div>
                              <div className="py-2">Sat</div>
                              <div className="py-2">Sun</div>
                            </div>
                            <div className="grid grid-cols-7 text-center">
                              <div className="py-3 border-r border-gray-200 bg-green-50">
                                <div className="text-xs text-green-800">
                                  9am-5pm
                                </div>
                              </div>
                              <div className="py-3 border-r border-gray-200 bg-green-50">
                                <div className="text-xs text-green-800">
                                  9am-5pm
                                </div>
                              </div>
                              <div className="py-3 border-r border-gray-200 bg-green-50">
                                <div className="text-xs text-green-800">
                                  9am-5pm
                                </div>
                              </div>
                              <div className="py-3 border-r border-gray-200 bg-green-50">
                                <div className="text-xs text-green-800">
                                  9am-5pm
                                </div>
                              </div>
                              <div className="py-3 border-r border-gray-200 bg-green-50">
                                <div className="text-xs text-green-800">
                                  9am-5pm
                                </div>
                              </div>
                              <div className="py-3 border-r border-gray-200 bg-gray-50">
                                <div className="text-xs text-gray-400">
                                  Unavailable
                                </div>
                              </div>
                              <div className="py-3 bg-gray-50">
                                <div className="text-xs text-gray-400">
                                  Unavailable
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock size={20} className="text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            Response Time
                          </h4>
                          <p className="text-gray-700">
                            {provider.responseTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CalendarIcon size={20} className="text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            Member Since
                          </h4>
                          <p className="text-gray-700">
                            {provider.memberSince}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
            {/* Services Tab */}
            {activeTab === 'services' && <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {provider.services.map(service => <div key={service.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-700 mb-4">
                        {service.description}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-lg font-bold text-gray-900">
                          ${service.price}
                          {service.isPriceHourly ? '/hr' : ''}
                        </div>
                        <div className="text-sm text-gray-600">
                          Est. duration: {service.estimatedDuration}
                        </div>
                      </div>
                      <button onClick={() => bookService(service.id)} className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
                        Book This Service
                      </button>
                    </div>)}
                </div>
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Need a custom service?
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Don't see exactly what you're looking for? Contact me to
                    discuss your specific requirements and get a custom quote.
                  </p>
                  <button onClick={contactProvider} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
                    <MessageSquare size={18} className="mr-2" />
                    Request Custom Service
                  </button>
                </div>
              </div>}
            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && <div>
                {/* Portfolio Category Filter */}
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 mr-2">
                    Filter by:
                  </span>
                  <button className={`px-3 py-1 rounded-full text-sm ${selectedCategory === null ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`} onClick={() => filterPortfolioByCategory(null)}>
                    All
                  </button>
                  {portfolioCategories.map((category, index) => <button key={index} className={`px-3 py-1 rounded-full text-sm ${selectedCategory === category ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`} onClick={() => filterPortfolioByCategory(category)}>
                      {category}
                    </button>)}
                </div>
                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredPortfolio.map(item => <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => openPortfolioItem(item.id)}>
                      <div className="h-48 bg-gray-100">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 line-clamp-1">
                          {item.title}
                        </h3>
                        <div className="mt-1 flex justify-between items-center text-sm">
                          <span className="text-blue-600">{item.category}</span>
                          <span className="text-gray-500">
                            {item.completionDate}
                          </span>
                        </div>
                        {item.clientReview && <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                            "{item.clientReview}"
                          </div>}
                      </div>
                    </div>)}
                </div>
                {/* Portfolio Lightbox */}
                {selectedPortfolioItemData && <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedPortfolioItemData.title}
                        </h3>
                        <button onClick={closePortfolioItem} className="text-gray-500 hover:text-gray-700">
                          <X size={24} />
                        </button>
                      </div>
                      <div className="flex-1 overflow-auto">
                        <div className="h-80 bg-gray-100">
                          <img src={selectedPortfolioItemData.image} alt={selectedPortfolioItemData.title} className="w-full h-full object-contain" />
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-blue-600 font-medium">
                              {selectedPortfolioItemData.category}
                            </span>
                            <span className="text-gray-500">
                              Completed:{' '}
                              {selectedPortfolioItemData.completionDate}
                            </span>
                          </div>
                          {selectedPortfolioItemData.clientReview && <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Client Feedback:
                              </h4>
                              <p className="text-gray-700 italic">
                                "{selectedPortfolioItemData.clientReview}"
                              </p>
                            </div>}
                        </div>
                      </div>
                      <div className="p-4 border-t border-gray-200 flex justify-between">
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" onClick={closePortfolioItem}>
                          Close
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={() => {
                    closePortfolioItem();
                    hireProvider();
                  }}>
                          Hire for Similar Project
                        </button>
                      </div>
                    </div>
                  </div>}
                {filteredPortfolio.length === 0 && <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Image size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No portfolio items found
                    </h3>
                    <p className="text-gray-600">
                      Try selecting a different category or view all items.
                    </p>
                  </div>}
              </div>}
            {/* Reviews Tab */}
            {activeTab === 'reviews' && <div className="space-y-8">
                {/* Review Summary */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-5xl font-bold text-gray-900">
                        {provider.rating}
                      </div>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => <Star key={i} size={20} className={i < Math.round(provider.rating) ? 'text-yellow-400' : 'text-gray-300'} fill={i < Math.round(provider.rating) ? 'currentColor' : 'none'} />)}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        Based on {provider.reviewCount} reviews
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Rating Breakdown
                      </h3>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map(stars => <div key={stars} className="flex items-center">
                            <div className="w-12 text-sm text-gray-600">
                              {stars} stars
                            </div>
                            <div className="flex-1 mx-4">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="h-2.5 rounded-full bg-yellow-400" style={{
                            width: `${ratingPercentages[5 - stars]}%`
                          }}></div>
                              </div>
                            </div>
                            <div className="w-12 text-sm text-gray-600 text-right">
                              {ratingDistribution[5 - stars]} (
                              {Math.round(ratingPercentages[5 - stars])}%)
                            </div>
                          </div>)}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Review List */}
                <div className="space-y-6">
                  {provider.reviews.map(review => <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start">
                        <img src={review.reviewerImage} alt={review.reviewerName} className="h-12 w-12 rounded-full object-cover mr-4" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-gray-900">
                              {review.reviewerName}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} fill={i < review.rating ? 'currentColor' : 'none'} />)}
                            </div>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-sm text-blue-600">
                              {review.taskCategory}
                            </span>
                          </div>
                          <p className="mt-3 text-gray-700">{review.text}</p>
                          {review.providerResponse && <div className="mt-4 pt-4 border-t border-gray-200">
                              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                                <MessageSquare size={14} className="mr-1" />
                                Response from {provider.name}
                              </h4>
                              <p className="mt-2 text-gray-700 text-sm">
                                {review.providerResponse}
                              </p>
                            </div>}
                          <div className="mt-4 flex items-center text-sm text-gray-500">
                            <div className="flex items-center mr-4">
                              <button className="text-gray-400 hover:text-gray-600">
                                <ThumbsUp size={14} className="mr-1" />
                              </button>
                              <span>Helpful</span>
                            </div>
                            <div className="flex items-center">
                              <button className="text-gray-400 hover:text-gray-600">
                                <AlertCircle size={14} className="mr-1" />
                              </button>
                              <span>Report</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
                {/* Pagination */}
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center">
                    <button className="px-2 py-1 border border-gray-300 rounded-l-md text-gray-700 hover:bg-gray-50">
                      <ChevronLeft size={18} />
                    </button>
                    <button className="px-3 py-1 border-t border-b border-gray-300 text-blue-600 font-medium bg-blue-50">
                      1
                    </button>
                    <button className="px-3 py-1 border-t border-b border-gray-300 text-gray-700 hover:bg-gray-50">
                      2
                    </button>
                    <button className="px-3 py-1 border-t border-b border-gray-300 text-gray-700 hover:bg-gray-50">
                      3
                    </button>
                    <button className="px-2 py-1 border border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-50">
                      <ChevronRight size={18} />
                    </button>
                  </nav>
                </div>
              </div>}
            {/* Pricing Tab */}
            {activeTab === 'pricing' && <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Pricing Information
                    </h2>
                    <div className="space-y-6">
                      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Standard Hourly Rate
                        </h3>
                        <div className="text-3xl font-bold text-gray-900">
                          ${provider.hourlyRate}/hr
                        </div>
                        <p className="mt-2 text-gray-600">
                          This is my base rate for most services. Specific
                          project rates may vary based on complexity and
                          requirements.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                          Service Pricing
                        </h3>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Service
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {provider.services.map(service => <tr key={service.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {service.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    ${service.price}
                                    {service.isPriceHourly ? '/hr' : ''}
                                  </td>
                                </tr>)}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                          Package Deals
                        </h3>
                        <div className="space-y-4">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <h4 className="font-medium text-gray-900">
                              Website Starter Package
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                              5-page responsive website with basic SEO
                              optimization
                            </p>
                            <div className="mt-2 flex justify-between items-center">
                              <span className="text-lg font-bold text-gray-900">
                                $1,800
                              </span>
                              <span className="text-sm text-green-600">
                                Save 15%
                              </span>
                            </div>
                          </div>
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <h4 className="font-medium text-gray-900">
                              Design + Development Bundle
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                              UI/UX design plus full implementation of designs
                            </p>
                            <div className="mt-2 flex justify-between items-center">
                              <span className="text-lg font-bold text-gray-900">
                                $3,200
                              </span>
                              <span className="text-sm text-green-600">
                                Save 20%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Additional Information
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                          Rush Job Pricing
                        </h3>
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <p className="text-gray-700">
                            Need your project completed urgently? I offer
                            expedited service with the following surcharges:
                          </p>
                          <ul className="mt-2 space-y-1 text-gray-700">
                            <li className="flex justify-between">
                              <span>24-hour turnaround</span>
                              <span className="font-medium">
                                +100% surcharge
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>2-3 day turnaround</span>
                              <span className="font-medium">
                                +50% surcharge
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>4-7 day turnaround</span>
                              <span className="font-medium">
                                +25% surcharge
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                          Cancellation Policy
                        </h3>
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <p className="text-gray-700">
                            {provider.cancellationPolicy}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                          Payment Methods
                        </h3>
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex flex-wrap gap-3">
                            {provider.paymentMethods.map((method, index) => <div key={index} className="flex items-center px-3 py-1 bg-gray-100 rounded-full">
                                <CreditCard size={16} className="text-gray-500 mr-2" />
                                <span className="text-sm text-gray-700">
                                  {method}
                                </span>
                              </div>)}
                          </div>
                          <p className="mt-3 text-sm text-gray-600">
                            All payments are processed securely through the Task
                            Juggler platform.
                          </p>
                        </div>
                      </div>
                      <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Need a custom quote?
                        </h3>
                        <p className="text-gray-700 mb-4">
                          If you have specific requirements or a complex
                          project, I'd be happy to provide a personalized quote.
                        </p>
                        <button onClick={contactProvider} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                          <MessageSquare size={18} className="mr-2" />
                          Request Custom Quote
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>;
}