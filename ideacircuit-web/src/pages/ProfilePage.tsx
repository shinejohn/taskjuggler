import React, { useState, useEffect } from 'react';
import { NavigationMenu } from '../components/NavigationMenu';
import { FileExplorer } from '../components/FileExplorer';
import { UserIcon, SettingsIcon, BellIcon, KeyIcon, LogOutIcon, CameraIcon, EditIcon, SaveIcon, MailIcon, PhoneIcon, GlobeIcon, ClockIcon, FolderIcon, VideoIcon, FileIcon, BriefcaseIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';

interface ActivityItem {
  id: number;
  type: 'call' | 'file';
  title: string;
  date: string;
  duration?: string;
}

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { user: storeUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: storeUser?.name?.split(' ')[0] || '',
    lastName: storeUser?.name?.split(' ').slice(1).join(' ') || '',
    email: storeUser?.email || '',
    phone: '',
    company: '',
    role: '',
    location: '',
    timezone: 'UTC',
    bio: '',
    profilePicture: ''
  });
  const [formData, setFormData] = useState({ ...userData });
  const [activityData, setActivityData] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
    loadActivity();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const response = await api.get('/ideacircuit/user/profile');
      const profile = response.data.data || response.data;
      
      if (profile) {
        const nameParts = (profile.name || storeUser?.name || '').split(' ');
        setUserData({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: profile.email || storeUser?.email || '',
          phone: profile.phone || '',
          company: profile.company || '',
          role: profile.role || '',
          location: profile.location || '',
          timezone: profile.timezone || 'UTC',
          bio: profile.bio || '',
          profilePicture: profile.profile_picture || ''
        });
        setFormData({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: profile.email || storeUser?.email || '',
          phone: profile.phone || '',
          company: profile.company || '',
          role: profile.role || '',
          location: profile.location || '',
          timezone: profile.timezone || 'UTC',
          bio: profile.bio || '',
          profilePicture: profile.profile_picture || ''
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadActivity = async () => {
    setLoading(true);
    try {
      const response = await api.get('/ideacircuit/user/activity');
      const activities = response.data.data || response.data;
      setActivityData(Array.isArray(activities) ? activities : []);
    } catch (error) {
      console.error('Error loading activity:', error);
      setActivityData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      await api.put('/ideacircuit/user/profile', {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        role: formData.role,
        location: formData.location,
        timezone: formData.timezone,
        bio: formData.bio
      });
      setUserData({ ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ ...userData });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col h-screen bg-bg-secondary">
      {/* Header */}
      <div className="glass-subtle border-b border-border p-4 flex justify-between items-center">
        <h1 className="text-headline font-semibold text-text-primary">My Profile</h1>
        <div className="flex space-x-2 items-center">
          <button 
            className="p-2 rounded-full hover:bg-bg-secondary min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-fast"
            aria-label="Notifications"
          >
            <BellIcon size={20} className="text-text-secondary" />
          </button>
          <NavigationMenu />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-64">
              <div className="glass-standard rounded-lg overflow-hidden shadow-1 sticky top-8">
                <div className="p-6 text-center">
                  <div className="relative inline-block">
                    <img 
                      src={userData.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.firstName + ' ' + userData.lastName)}&background=007AFF&color=fff`} 
                      alt="Profile" 
                      className="h-24 w-24 rounded-full mx-auto object-cover" 
                    />
                    <button 
                      className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full min-h-[32px] min-w-[32px] flex items-center justify-center hover:bg-primary-hover transition-colors duration-fast"
                      aria-label="Change profile picture"
                    >
                      <CameraIcon size={16} />
                    </button>
                  </div>
                  <h2 className="mt-4 text-title-large font-semibold text-text-primary">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <p className="text-text-secondary text-body-small">
                    {userData.role} {userData.company ? `at ${userData.company}` : ''}
                  </p>
                </div>
                <div className="border-t border-border">
                  <nav className="flex flex-col">
                    <button 
                      className={`flex items-center px-6 py-3 text-body-medium font-medium min-h-[44px] transition-colors duration-fast ${
                        activeTab === 'profile' 
                          ? 'bg-primary-light text-primary border-l-4 border-primary' 
                          : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                      }`} 
                      onClick={() => setActiveTab('profile')}
                    >
                      <UserIcon size={18} className="mr-3" />
                      Profile Information
                    </button>
                    <button 
                      className={`flex items-center px-6 py-3 text-body-medium font-medium min-h-[44px] transition-colors duration-fast ${
                        activeTab === 'files' 
                          ? 'bg-primary-light text-primary border-l-4 border-primary' 
                          : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                      }`} 
                      onClick={() => setActiveTab('files')}
                    >
                      <FolderIcon size={18} className="mr-3" />
                      My Files
                    </button>
                    <button 
                      className={`flex items-center px-6 py-3 text-body-medium font-medium min-h-[44px] transition-colors duration-fast ${
                        activeTab === 'activity' 
                          ? 'bg-primary-light text-primary border-l-4 border-primary' 
                          : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                      }`} 
                      onClick={() => setActiveTab('activity')}
                    >
                      <ClockIcon size={18} className="mr-3" />
                      Recent Activity
                    </button>
                    <button 
                      className={`flex items-center px-6 py-3 text-body-medium font-medium min-h-[44px] transition-colors duration-fast ${
                        activeTab === 'settings' 
                          ? 'bg-primary-light text-primary border-l-4 border-primary' 
                          : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                      }`} 
                      onClick={() => setActiveTab('settings')}
                    >
                      <SettingsIcon size={18} className="mr-3" />
                      Account Settings
                    </button>
                    <button 
                      className={`flex items-center px-6 py-3 text-body-medium font-medium min-h-[44px] transition-colors duration-fast ${
                        activeTab === 'security' 
                          ? 'bg-primary-light text-primary border-l-4 border-primary' 
                          : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                      }`} 
                      onClick={() => setActiveTab('security')}
                    >
                      <KeyIcon size={18} className="mr-3" />
                      Security
                    </button>
                  </nav>
                </div>
                <div className="p-6 border-t border-border">
                  <button 
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-1 text-label font-medium text-white bg-destructive hover:bg-destructive/90 min-h-[44px] transition-colors duration-fast"
                    onClick={handleLogout}
                  >
                    <LogOutIcon size={16} className="mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1">
              {activeTab === 'profile' && (
                <div className="glass-standard rounded-lg overflow-hidden shadow-1">
                  <div className="p-6 border-b border-border flex justify-between items-center">
                    <h2 className="text-headline font-semibold text-text-primary">Profile Information</h2>
                    {isEditing ? (
                      <div className="flex space-x-2">
                        <button 
                          onClick={handleSave} 
                          className="px-3 py-1.5 bg-primary text-white rounded-md text-label font-medium min-h-[44px] flex items-center hover:bg-primary-hover transition-colors duration-fast"
                        >
                          <SaveIcon size={14} className="mr-1" />
                          Save
                        </button>
                        <button 
                          onClick={handleCancel} 
                          className="px-3 py-1.5 border border-border text-text-primary rounded-md text-label font-medium min-h-[44px] hover:bg-bg-secondary transition-colors duration-fast"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsEditing(true)} 
                        className="px-3 py-1.5 border border-border text-text-primary rounded-md text-label font-medium min-h-[44px] flex items-center hover:bg-bg-secondary transition-colors duration-fast"
                      >
                        <EditIcon size={14} className="mr-1" />
                        Edit
                      </button>
                    )}
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-label font-medium text-text-primary mb-2">First Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
                          />
                        ) : (
                          <p className="text-body-medium text-text-primary">{userData.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-label font-medium text-text-primary mb-2">Last Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
                          />
                        ) : (
                          <p className="text-body-medium text-text-primary">{userData.lastName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-label font-medium text-text-primary mb-2 flex items-center">
                        <MailIcon size={16} className="mr-2" />
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
                        />
                      ) : (
                        <p className="text-body-medium text-text-primary">{userData.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-label font-medium text-text-primary mb-2 flex items-center">
                        <PhoneIcon size={16} className="mr-2" />
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
                        />
                      ) : (
                        <p className="text-body-medium text-text-primary">{userData.phone || 'Not provided'}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-label font-medium text-text-primary mb-2 flex items-center">
                          <BriefcaseIcon size={16} className="mr-2" />
                          Company
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
                          />
                        ) : (
                          <p className="text-body-medium text-text-primary">{userData.company || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-label font-medium text-text-primary mb-2">Role</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
                          />
                        ) : (
                          <p className="text-body-medium text-text-primary">{userData.role || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-label font-medium text-text-primary mb-2 flex items-center">
                          <GlobeIcon size={16} className="mr-2" />
                          Location
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
                          />
                        ) : (
                          <p className="text-body-medium text-text-primary">{userData.location || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-label font-medium text-text-primary mb-2 flex items-center">
                          <ClockIcon size={16} className="mr-2" />
                          Timezone
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleChange}
                            className="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
                          />
                        ) : (
                          <p className="text-body-medium text-text-primary">{userData.timezone}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-label font-medium text-text-primary mb-2">Bio</label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows={4}
                          className="w-full border border-border rounded-md px-4 py-3 text-body-large bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-y min-h-[88px]"
                        />
                      ) : (
                        <p className="text-body-medium text-text-primary">{userData.bio || 'No bio provided'}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'files' && (
                <div className="glass-standard rounded-lg overflow-hidden shadow-1">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-headline font-semibold text-text-primary">My Files</h2>
                  </div>
                  <div className="p-6">
                    <FileExplorer />
                  </div>
                </div>
              )}
              
              {activeTab === 'activity' && (
                <div className="glass-standard rounded-lg overflow-hidden shadow-1">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-headline font-semibold text-text-primary">Recent Activity</h2>
                  </div>
                  <div className="p-6">
                    {loading ? (
                      <div className="text-center py-8 text-text-secondary text-body-medium">Loading activity...</div>
                    ) : activityData.length === 0 ? (
                      <div className="text-center py-8 text-text-secondary text-body-medium">No recent activity</div>
                    ) : (
                      <div className="space-y-4">
                        {activityData.map(activity => (
                          <div key={activity.id} className="flex items-center p-4 glass-subtle rounded-lg">
                            <div className={`p-2 rounded-md mr-4 ${
                              activity.type === 'call' ? 'bg-primary-light' : 'bg-bg-tertiary'
                            }`}>
                              {activity.type === 'call' ? (
                                <VideoIcon size={20} className={activity.type === 'call' ? 'text-primary' : 'text-text-secondary'} />
                              ) : (
                                <FileIcon size={20} className="text-text-secondary" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-body-medium text-text-primary">{activity.title}</h3>
                              <p className="text-body-small text-text-secondary">{activity.date} {activity.duration && `• ${activity.duration}`}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div className="glass-standard rounded-lg overflow-hidden shadow-1">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-headline font-semibold text-text-primary">Account Settings</h2>
                  </div>
                  <div className="p-6">
                    <p className="text-body-medium text-text-secondary">Settings coming soon...</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div className="glass-standard rounded-lg overflow-hidden shadow-1">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-headline font-semibold text-text-primary">Security</h2>
                  </div>
                  <div className="p-6">
                    <p className="text-body-medium text-text-secondary">Security settings coming soon...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
