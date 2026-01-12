import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon, MinimizeIcon, ListIcon } from 'lucide-react';
export const PresentationPanel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const slides = [{
    id: 1,
    title: 'Q3 Project Overview',
    content: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    notes: "Start by welcoming everyone and introducing the agenda for today's meeting."
  }, {
    id: 2,
    title: 'Current Metrics',
    content: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    notes: "Highlight the key performance indicators and how we've improved since last quarter."
  }, {
    id: 3,
    title: 'Team Structure',
    content: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    notes: 'Explain the new team organization and how it will help us meet our goals.'
  }, {
    id: 4,
    title: 'Next Steps',
    content: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    notes: 'Outline action items and deadlines for the upcoming sprint.'
  }, {
    id: 5,
    title: 'Q&A',
    content: 'https://images.unsplash.com/photo-1520004434532-668416a08753?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    notes: 'Open the floor for questions and discussion.'
  }];
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  const goToSlide = index => {
    setCurrentSlide(index);
    setShowThumbnails(false);
  };
  return <div className="h-full flex flex-col">
      <div className="p-3 bg-gray-200 font-medium flex justify-between items-center">
        <span>Presentation: {slides[currentSlide].title}</span>
        <div className="flex space-x-2">
          <button onClick={() => setShowThumbnails(!showThumbnails)} className="p-1 hover:bg-gray-300 rounded">
            <ListIcon size={18} />
          </button>
          <button onClick={() => setFullscreen(!fullscreen)} className="p-1 hover:bg-gray-300 rounded">
            {fullscreen ? <MinimizeIcon size={18} /> : <ExpandIcon size={18} />}
          </button>
        </div>
      </div>
      <div className={`flex-1 flex ${showThumbnails ? 'flex-row' : 'flex-col'}`}>
        {/* Main slide view */}
        <div className={`${showThumbnails ? 'w-3/4' : 'w-full'} flex flex-col`}>
          <div className="flex-1 bg-gray-800 flex items-center justify-center p-4 relative">
            <img src={slides[currentSlide].content} alt={`Slide ${currentSlide + 1}`} className="max-h-full max-w-full object-contain shadow-lg" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 rounded-full px-3 py-1">
              {slides.map((_, index) => <div key={index} className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-gray-400'}`} onClick={() => goToSlide(index)}></div>)}
            </div>
          </div>
          {/* Slide controls */}
          <div className="flex justify-between items-center p-3 bg-gray-100 border-t border-gray-300">
            <button onClick={prevSlide} disabled={currentSlide === 0} className={`p-2 rounded-full ${currentSlide === 0 ? 'text-gray-400' : 'hover:bg-gray-200'}`}>
              <ChevronLeftIcon size={20} />
            </button>
            <div className="text-sm font-medium">
              Slide {currentSlide + 1} of {slides.length}
            </div>
            <button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className={`p-2 rounded-full ${currentSlide === slides.length - 1 ? 'text-gray-400' : 'hover:bg-gray-200'}`}>
              <ChevronRightIcon size={20} />
            </button>
          </div>
          {/* Presenter notes */}
          <div className="p-3 bg-yellow-50 border-t border-yellow-200">
            <div className="text-xs font-medium text-yellow-800 mb-1">
              PRESENTER NOTES:
            </div>
            <p className="text-sm text-gray-700">
              {slides[currentSlide].notes}
            </p>
          </div>
        </div>
        {/* Thumbnails sidebar */}
        {showThumbnails && <div className="w-1/4 border-l border-gray-300 overflow-y-auto bg-gray-100">
            <div className="p-2 text-sm font-medium bg-gray-200 border-b border-gray-300">
              All Slides
            </div>
            <div className="p-2 space-y-2">
              {slides.map((slide, index) => <div key={slide.id} onClick={() => goToSlide(index)} className={`p-2 rounded cursor-pointer ${index === currentSlide ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-200'}`}>
                  <div className="aspect-w-16 aspect-h-9 mb-1 bg-gray-800 rounded overflow-hidden">
                    <img src={slide.content} alt={slide.title} className="object-cover w-full h-full" />
                  </div>
                  <div className="text-xs font-medium truncate">
                    {index + 1}. {slide.title}
                  </div>
                </div>)}
            </div>
          </div>}
      </div>
    </div>;
};