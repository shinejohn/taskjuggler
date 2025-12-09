import React from 'react';
import { Send, Clock, RotateCcw, CheckCircle, Play } from 'lucide-react';
export function HowItWorks() {
  return <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Task Juggler Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple four-step process that transforms communication into
            action.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6">
              <Send size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Send a Task</h3>
            <p className="text-gray-600">
              Create and send a task to anyone using just their email or phone
              number.
            </p>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6">
              <Clock size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Set Timeline</h3>
            <p className="text-gray-600">
              Do-er sets realistic start and completion dates they can commit
              to.
            </p>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6">
              <RotateCcw size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Track Progress</h3>
            <p className="text-gray-600">
              Both parties stay updated with automatic notifications on timeline
              changes.
            </p>
          </div>
          {/* Step 4 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Complete Task</h3>
            <p className="text-gray-600">
              Task is marked complete, creating a clear record of
              accomplishment.
            </p>
          </div>
        </div>
        <div className="mt-20 bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                See Task Juggler in Action
              </h3>
              <p className="text-gray-600 mb-6">
                Watch how Task Juggler transforms chaotic communications into
                clear, actionable tasks with full accountability.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md inline-flex items-center">
                <Play size={18} className="mr-2" />
                Watch Demo
              </button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Play size={32} className="text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}