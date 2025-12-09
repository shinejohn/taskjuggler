import React, { useState } from 'react';
import { Star, Upload, Check, AlertCircle, Info } from 'lucide-react';
interface SubmitReviewFormProps {
  providerName: string;
  providerImage: string;
  taskTitle: string;
  onSubmit: (reviewData: ReviewData) => void;
  onCancel: () => void;
}
interface ReviewData {
  overallRating: number;
  categoryRatings: {
    quality: number;
    communication: number;
    timeliness: number;
    value: number;
  };
  reviewText: string;
  photos: File[];
  recommend: boolean;
  futureTips: string;
}
export function SubmitReviewForm({
  providerName,
  providerImage,
  taskTitle,
  onSubmit,
  onCancel
}: SubmitReviewFormProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState({
    quality: 0,
    communication: 0,
    timeliness: 0,
    value: 0
  });
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);
  const [recommend, setRecommend] = useState(true);
  const [futureTips, setFutureTips] = useState('');
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});
  const handleRatingChange = (rating: number) => {
    setOverallRating(rating);
    if (errors.overallRating) {
      setErrors({
        ...errors,
        overallRating: ''
      });
    }
  };
  const handleCategoryRatingChange = (category: keyof typeof categoryRatings, rating: number) => {
    setCategoryRatings({
      ...categoryRatings,
      [category]: rating
    });
    if (errors[category]) {
      setErrors({
        ...errors,
        [category]: ''
      });
    }
  };
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (photos.length + newFiles.length > 5) {
        alert('You can upload a maximum of 5 photos');
        return;
      }
      setPhotos([...photos, ...newFiles]);
      // Create preview URLs
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPhotosPreviews([...photosPreviews, ...newPreviews]);
    }
  };
  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
    const newPreviews = [...photosPreviews];
    URL.revokeObjectURL(newPreviews[index]); // Clean up the URL
    newPreviews.splice(index, 1);
    setPhotosPreviews(newPreviews);
  };
  const validateForm = () => {
    const newErrors: {
      [key: string]: string;
    } = {};
    if (overallRating === 0) {
      newErrors.overallRating = 'Please provide an overall rating';
    }
    if (categoryRatings.quality === 0) {
      newErrors.quality = 'Please rate the quality of work';
    }
    if (categoryRatings.communication === 0) {
      newErrors.communication = 'Please rate the communication';
    }
    if (categoryRatings.timeliness === 0) {
      newErrors.timeliness = 'Please rate the timeliness';
    }
    if (categoryRatings.value === 0) {
      newErrors.value = 'Please rate the value for money';
    }
    if (reviewText.length < 50) {
      newErrors.reviewText = 'Please provide a review of at least 50 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const reviewData: ReviewData = {
      overallRating,
      categoryRatings,
      reviewText,
      photos,
      recommend,
      futureTips
    };
    onSubmit(reviewData);
  };
  return <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 px-6 py-4 text-white">
        <h2 className="text-xl font-bold">Review Your Experience</h2>
        <p className="text-blue-100 mt-1">
          Your honest feedback helps others make better decisions
        </p>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <img src={providerImage} alt={providerName} className="h-14 w-14 rounded-full object-cover" />
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              {providerName}
            </h3>
            <p className="text-gray-600">Task: {taskTitle}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Overall Rating */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Overall Rating
            </label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map(rating => <button key={rating} type="button" onClick={() => handleRatingChange(rating)} onMouseEnter={() => setHoveredRating(rating)} onMouseLeave={() => setHoveredRating(0)} className="text-2xl mr-1 focus:outline-none">
                  <Star size={32} className={rating <= (hoveredRating || overallRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                </button>)}
              <span className="ml-2 text-gray-700">
                {overallRating > 0 ? overallRating + '/5' : ''}
              </span>
            </div>
            {errors.overallRating && <p className="mt-1 text-red-600 text-sm flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.overallRating}
              </p>}
          </div>
          {/* Category Ratings */}
          <div className="mb-6">
            <h4 className="text-gray-700 font-medium mb-3">
              Rate specific aspects
            </h4>
            <div className="space-y-4">
              {/* Quality of Work */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-gray-700">Quality of Work</label>
                  <span className="text-gray-500 text-sm">
                    {categoryRatings.quality > 0 ? categoryRatings.quality + '/5' : ''}
                  </span>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(rating => <button key={rating} type="button" onClick={() => handleCategoryRatingChange('quality', rating)} className="text-xl mr-1 focus:outline-none">
                      <Star size={24} className={rating <= categoryRatings.quality ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                    </button>)}
                </div>
                {errors.quality && <p className="mt-1 text-red-600 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.quality}
                  </p>}
              </div>
              {/* Communication */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-gray-700">Communication</label>
                  <span className="text-gray-500 text-sm">
                    {categoryRatings.communication > 0 ? categoryRatings.communication + '/5' : ''}
                  </span>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(rating => <button key={rating} type="button" onClick={() => handleCategoryRatingChange('communication', rating)} className="text-xl mr-1 focus:outline-none">
                      <Star size={24} className={rating <= categoryRatings.communication ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                    </button>)}
                </div>
                {errors.communication && <p className="mt-1 text-red-600 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.communication}
                  </p>}
              </div>
              {/* Timeliness */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-gray-700">Timeliness</label>
                  <span className="text-gray-500 text-sm">
                    {categoryRatings.timeliness > 0 ? categoryRatings.timeliness + '/5' : ''}
                  </span>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(rating => <button key={rating} type="button" onClick={() => handleCategoryRatingChange('timeliness', rating)} className="text-xl mr-1 focus:outline-none">
                      <Star size={24} className={rating <= categoryRatings.timeliness ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                    </button>)}
                </div>
                {errors.timeliness && <p className="mt-1 text-red-600 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.timeliness}
                  </p>}
              </div>
              {/* Value for Money */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-gray-700">Value for Money</label>
                  <span className="text-gray-500 text-sm">
                    {categoryRatings.value > 0 ? categoryRatings.value + '/5' : ''}
                  </span>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(rating => <button key={rating} type="button" onClick={() => handleCategoryRatingChange('value', rating)} className="text-xl mr-1 focus:outline-none">
                      <Star size={24} className={rating <= categoryRatings.value ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                    </button>)}
                </div>
                {errors.value && <p className="mt-1 text-red-600 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.value}
                  </p>}
              </div>
            </div>
          </div>
          {/* Written Review */}
          <div className="mb-6">
            <label htmlFor="reviewText" className="block text-gray-700 font-medium mb-2">
              Your Review
            </label>
            <textarea id="reviewText" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Share your experience working with this provider..." value={reviewText} onChange={e => {
            setReviewText(e.target.value);
            if (errors.reviewText && e.target.value.length >= 50) {
              setErrors({
                ...errors,
                reviewText: ''
              });
            }
          }}></textarea>
            <div className="flex justify-between mt-1">
              <div>
                {errors.reviewText ? <p className="text-red-600 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.reviewText}
                  </p> : <p className={`text-sm ${reviewText.length < 50 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {reviewText.length < 50 ? `Minimum 50 characters (${reviewText.length}/50)` : 'Looks good!'}
                  </p>}
              </div>
              <p className="text-sm text-gray-500">{reviewText.length}/1000</p>
            </div>
          </div>
          {/* Photo Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Add Photos (Optional)
            </label>
            <div className="flex flex-wrap gap-3 mb-3">
              {photosPreviews.map((preview, index) => <div key={index} className="relative w-20 h-20 border border-gray-300 rounded-md overflow-hidden">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removePhoto(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/3 -translate-y-1/3">
                    <X size={12} />
                  </button>
                </div>)}
              {photos.length < 5 && <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                  <Upload size={20} className="text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} multiple />
                </label>}
            </div>
            <p className="text-sm text-gray-500">
              You can upload up to 5 photos ({photos.length}/5)
            </p>
          </div>
          {/* Recommendation */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Would you recommend this provider?
            </label>
            <div className="flex space-x-4">
              <button type="button" onClick={() => setRecommend(true)} className={`px-4 py-2 rounded-md flex items-center ${recommend ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}>
                <Check size={18} className={recommend ? 'text-green-600 mr-2' : 'text-gray-400 mr-2'} />
                Yes
              </button>
              <button type="button" onClick={() => setRecommend(false)} className={`px-4 py-2 rounded-md flex items-center ${!recommend ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}>
                <X size={18} className={!recommend ? 'text-red-600 mr-2' : 'text-gray-400 mr-2'} />
                No
              </button>
            </div>
          </div>
          {/* Future Tips */}
          <div className="mb-6">
            <label htmlFor="futureTips" className="block text-gray-700 font-medium mb-2">
              Tips for future clients (Optional)
            </label>
            <textarea id="futureTips" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Share any advice for people who might work with this provider in the future..." value={futureTips} onChange={e => setFutureTips(e.target.value)}></textarea>
          </div>
          {/* Information Notice */}
          <div className="mb-6 p-4 bg-blue-50 rounded-md">
            <div className="flex">
              <Info size={20} className="text-blue-600 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Before you submit
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  Your review will be publicly visible on the provider's
                  profile. Be honest and constructive to help both the provider
                  and future clients.
                </p>
              </div>
            </div>
          </div>
          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>;
}