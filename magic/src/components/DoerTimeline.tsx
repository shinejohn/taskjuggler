import React, { useState } from 'react';
import { CalendarIcon, ClockIcon, CheckCircleIcon, XCircleIcon, EditIcon, UserIcon, ThumbsUpIcon, ArrowRightIcon } from 'lucide-react';
export function DoerTimeline() {
  const [activeStep, setActiveStep] = useState(1);
  const [timelineEditing, setTimelineEditing] = useState(false);
  const [startDate, setStartDate] = useState('2023-11-15');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('2023-11-17');
  const [endTime, setEndTime] = useState('17:00');
  const [originalRequest, setOriginalRequest] = useState({
    date: '2023-11-16',
    time: '12:00'
  });
  const handleNext = () => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
    }
  };
  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };
  const handleEditTimeline = () => {
    setTimelineEditing(true);
  };
  const handleSaveTimeline = () => {
    setTimelineEditing(false);
  };
  const handleResetDemo = () => {
    setActiveStep(1);
    setTimelineEditing(false);
    setStartDate('2023-11-15');
    setStartTime('09:00');
    setEndDate('2023-11-17');
    setEndTime('17:00');
  };
  return <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Do-er Controls Timeline
          </h2>
          <p className="text-xl text-gray-700">
            See how Task Juggler empowers assignees to set realistic timelines
            they can commit to, leading to better outcomes.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-gray-200 z-0"></div>
              {[1, 2, 3, 4].map(step => <div key={step} className={`relative z-10 flex flex-col items-center ${activeStep >= step ? 'cursor-pointer' : ''}`} onClick={() => activeStep >= step && setActiveStep(step)}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {step}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${activeStep >= step ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step === 1 ? 'Receive Task' : step === 2 ? 'Set Timeline' : step === 3 ? 'Confirmation' : 'Completion'}
                  </span>
                </div>)}
            </div>
          </div>
          {/* Interactive Timeline Demo */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            {activeStep === 1 && <div className="p-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      JD
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">John Doe (Requestor)</h3>
                      <span className="text-gray-500 text-sm">
                        Today, 10:30 AM
                      </span>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-lg mb-2">
                        Website Content Review
                      </h4>
                      <p className="text-gray-700 mb-3">
                        Please review the updated website content and provide
                        feedback on tone, clarity, and accuracy.
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <CalendarIcon size={16} className="mr-1 text-blue-600" />
                          Requested: {originalRequest.date}
                        </span>
                        <span className="flex items-center">
                          <ClockIcon size={16} className="mr-1 text-blue-600" />
                          By: {originalRequest.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                        View Task
                      </button>
                    </div>
                  </div>
                </div>
              </div>}
            {activeStep === 2 && <div className="p-6">
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      AS
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">Anna Smith (Do-er)</h3>
                      <span className="text-gray-500 text-sm">Now</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex justify-between mb-3">
                        <h4 className="font-medium text-lg">
                          Set Your Timeline
                        </h4>
                        {!timelineEditing && <button onClick={handleEditTimeline} className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                            <EditIcon size={16} className="mr-1" />
                            Edit
                          </button>}
                      </div>
                      {timelineEditing ? <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <CalendarIcon size={18} className="text-gray-400" />
                                </div>
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <ClockIcon size={18} className="text-gray-400" />
                                </div>
                                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Completion Date
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <CalendarIcon size={18} className="text-gray-400" />
                                </div>
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Completion Time
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <ClockIcon size={18} className="text-gray-400" />
                                </div>
                                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button onClick={() => setTimelineEditing(false)} className="border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50">
                              Cancel
                            </button>
                            <button onClick={handleSaveTimeline} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                              Save Timeline
                            </button>
                          </div>
                        </div> : <div>
                          <div className="flex flex-col md:flex-row md:items-center mb-4">
                            <div className="bg-blue-50 p-3 rounded-md mb-3 md:mb-0 md:mr-4 flex-1">
                              <p className="text-sm text-gray-500 mb-1">
                                Start
                              </p>
                              <div className="flex items-center">
                                <CalendarIcon size={18} className="text-blue-600 mr-2" />
                                <span className="font-medium">{startDate}</span>
                                <span className="mx-2">at</span>
                                <ClockIcon size={18} className="text-blue-600 mr-2" />
                                <span className="font-medium">{startTime}</span>
                              </div>
                            </div>
                            <ArrowRightIcon size={24} className="hidden md:block text-gray-400 mx-2" />
                            <div className="bg-green-50 p-3 rounded-md flex-1">
                              <p className="text-sm text-gray-500 mb-1">
                                Complete
                              </p>
                              <div className="flex items-center">
                                <CalendarIcon size={18} className="text-green-600 mr-2" />
                                <span className="font-medium">{endDate}</span>
                                <span className="mx-2">at</span>
                                <ClockIcon size={18} className="text-green-600 mr-2" />
                                <span className="font-medium">{endTime}</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100">
                            <p className="text-sm text-yellow-800">
                              <strong>Note:</strong> This differs from the
                              requestor's timeline of {originalRequest.date} at{' '}
                              {originalRequest.time}. The requestor will be
                              notified of your proposed timeline.
                            </p>
                          </div>
                        </div>}
                    </div>
                    <div className="flex justify-between">
                      <button onClick={handlePrev} className="border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50">
                        Back
                      </button>
                      <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md" disabled={timelineEditing}>
                        Confirm Timeline
                      </button>
                    </div>
                  </div>
                </div>
              </div>}
            {activeStep === 3 && <div className="p-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      JD
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">John Doe (Requestor)</h3>
                      <span className="text-gray-500 text-sm">Just now</span>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-lg mb-3">
                        Timeline Confirmation
                      </h4>
                      <p className="text-gray-700 mb-4">
                        Anna Smith has set a timeline for the "Website Content
                        Review" task:
                      </p>
                      <div className="bg-white p-3 rounded-md mb-3">
                        <div className="flex flex-col md:flex-row md:items-center">
                          <div className="mb-3 md:mb-0 md:mr-4 flex-1">
                            <p className="text-sm text-gray-500 mb-1">Start</p>
                            <div className="flex items-center">
                              <CalendarIcon size={16} className="text-blue-600 mr-2" />
                              <span className="font-medium">{startDate}</span>
                              <span className="mx-2">at</span>
                              <ClockIcon size={16} className="text-blue-600 mr-2" />
                              <span className="font-medium">{startTime}</span>
                            </div>
                          </div>
                          <ArrowRightIcon size={20} className="hidden md:block text-gray-400 mx-2" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">
                              Complete
                            </p>
                            <div className="flex items-center">
                              <CalendarIcon size={16} className="text-green-600 mr-2" />
                              <span className="font-medium">{endDate}</span>
                              <span className="mx-2">at</span>
                              <ClockIcon size={16} className="text-green-600 mr-2" />
                              <span className="font-medium">{endTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button onClick={handleNext} className="flex items-center text-blue-600 hover:text-blue-800">
                          <ThumbsUpIcon size={18} className="mr-2" />
                          Accept Timeline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
            {activeStep === 4 && <div className="p-6">
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircleIcon size={32} className="text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Timeline Confirmed!
                  </h3>
                  <p className="text-gray-700 mb-6 max-w-md mx-auto">
                    Both parties have agreed on the timeline. Task Juggler will
                    send automatic reminders as the start and completion dates
                    approach.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg inline-block">
                    <h4 className="font-medium mb-3 text-left">
                      Website Content Review
                    </h4>
                    <div className="flex flex-col md:flex-row md:items-center text-left">
                      <div className="mb-3 md:mb-0 md:mr-4">
                        <p className="text-xs text-gray-500 mb-1">
                          Assigned to
                        </p>
                        <div className="flex items-center">
                          <UserIcon size={16} className="text-gray-600 mr-2" />
                          <span>Anna Smith</span>
                        </div>
                      </div>
                      <div className="mb-3 md:mb-0 md:mr-4">
                        <p className="text-xs text-gray-500 mb-1">Start</p>
                        <div className="flex items-center">
                          <CalendarIcon size={16} className="text-blue-600 mr-2" />
                          <span>{startDate}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Complete</p>
                        <div className="flex items-center">
                          <CalendarIcon size={16} className="text-green-600 mr-2" />
                          <span>{endDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleResetDemo} className="mt-8 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50">
                    Restart Demo
                  </button>
                </div>
              </div>}
          </div>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Why Do-er Controlled Timelines Matter
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">
                  For Requestors
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircleIcon size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Get realistic completion estimates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Reduce follow-up communications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Increase likelihood of on-time delivery</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-green-800 mb-2">For Do-ers</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircleIcon size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Set timelines that respect your workload</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Reduce stress from unrealistic deadlines</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Build reputation for reliability</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}