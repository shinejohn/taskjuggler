import React, { useState, useRef } from 'react';
import { User, Mail, Phone, MapPin, Upload, Save, Edit } from 'lucide-react';
interface UserData {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  profileImage: string;
}
interface UserInfoSectionProps {
  userData: UserData;
}
export function UserInfoSection({
  userData
}: UserInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserData>(userData);
  const [imagePreview, setImagePreview] = useState<string | null>(userData.profileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the updated data to your backend
    console.log('Updated user data:', formData);
    // For demo, we'll just toggle out of edit mode
    setIsEditing(false);
  };
  return <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
        {!isEditing ? <button onClick={() => setIsEditing(true)} className="flex items-center text-blue-600 hover:text-blue-800">
            <Edit size={18} className="mr-1" />
            Edit Profile
          </button> : <button onClick={() => setIsEditing(false)} className="text-gray-600 hover:text-gray-800">
            Cancel
          </button>}
      </div>
      {!isEditing ? <div className="space-y-6">
          <div className="flex items-center">
            <img src={userData.profileImage} alt={userData.name} className="w-20 h-20 rounded-full mr-6" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {userData.name}
              </h3>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Phone</p>
              <div className="flex items-center">
                <Phone size={18} className="text-gray-400 mr-2" />
                <p className="text-gray-900">{userData.phone}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Email</p>
              <div className="flex items-center">
                <Mail size={18} className="text-gray-400 mr-2" />
                <p className="text-gray-900">{userData.email}</p>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Address</p>
            <div className="flex items-start">
              <MapPin size={18} className="text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-gray-900">{userData.address.street}</p>
                <p className="text-gray-900">
                  {userData.address.city}, {userData.address.state}{' '}
                  {userData.address.zip}
                </p>
              </div>
            </div>
          </div>
        </div> : <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start">
            <div className="relative mb-4 sm:mb-0 sm:mr-6">
              <img src={imagePreview || userData.profileImage} alt={formData.name} className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1">
                <Upload size={16} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>
            <div className="sm:flex-1 w-full">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">
              Address Information
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input type="text" id="address.street" name="address.street" value={formData.address.street} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input type="text" id="address.city" name="address.city" value={formData.address.city} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input type="text" id="address.state" name="address.state" value={formData.address.state} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label htmlFor="address.zip" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP / Postal Code
                </label>
                <input type="text" id="address.zip" name="address.zip" value={formData.address.zip} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center">
              <Save size={18} className="mr-2" />
              Save Changes
            </button>
          </div>
        </form>}
    </div>;
}