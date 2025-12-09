import React from 'react';
import { CheckCircleIcon } from 'lucide-react';
interface HeroProps {
  onGetStartedClick?: () => void;
}
export function Hero({
  onGetStartedClick
} = {}) {
  return <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Streamline Your World, One Task at a Time
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Transform chaotic communication into clear, actionable task
            exchanges. The AI-powered platform that eliminates the friction
            between intention and action.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md text-lg" onClick={onGetStartedClick}>
              Get Started Free
            </button>
            <button className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 font-medium py-3 px-8 rounded-md text-lg">
              Watch Demo
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm md:text-base text-gray-700">
            <div className="flex items-center">
              <CheckCircleIcon size={20} className="text-green-500 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon size={20} className="text-green-500 mr-2" />
              <span>Free for basic use</span>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon size={20} className="text-green-500 mr-2" />
              <span>Instant setup</span>
            </div>
          </div>
        </div>
        <div className="mt-12 max-w-5xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gray-800 p-4 text-white">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div className="p-4 bg-gray-100">
            <div className="bg-white rounded-md p-6 shadow-sm">
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 rounded-full p-2 mr-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
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
                  <div className="bg-blue-50 p-3 rounded-lg mb-2">
                    <p className="font-medium">
                      Review contract draft by end of week
                    </p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>+ Contract.pdf</span>
                    <span>Priority: High</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start ml-12">
                <div className="bg-green-100 rounded-full p-2 mr-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    AS
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Anna Smith (Do-er)</h3>
                    <span className="text-gray-500 text-sm">
                      Today, 10:45 AM
                    </span>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg mb-2">
                    <p>I'll start on Thursday and complete by Friday 3pm</p>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Start: Thu, 10am
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      Due: Fri, 3pm
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}