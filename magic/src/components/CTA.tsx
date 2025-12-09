import React from 'react';
import { CheckIcon } from 'lucide-react';
interface CTAProps {
  onGetStartedClick?: () => void;
}
export function CTA({
  onGetStartedClick
} = {}) {
  return <section className="py-16 md:py-24 bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform How You Work?
              </h2>
              <p className="text-blue-100 text-lg mb-6">
                Join thousands of professionals who are streamlining their
                workflow with Task Juggler.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckIcon size={20} className="mr-2 flex-shrink-0 mt-1" />
                  <span>Free to get started - no credit card required</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={20} className="mr-2 flex-shrink-0 mt-1" />
                  <span>Set up in minutes with SSO authentication</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={20} className="mr-2 flex-shrink-0 mt-1" />
                  <span>Import your existing contacts instantly</span>
                </li>
              </ul>
              <button className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-md text-lg" onClick={onGetStartedClick}>
                Get Started Free
              </button>
            </div>
            <div className="md:w-5/12">
              <div className="bg-white rounded-lg p-6 text-gray-900">
                <h3 className="text-xl font-bold mb-4">
                  Sign up for early access
                </h3>
                <form>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Smith" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Work Email
                    </label>
                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@company.com" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Company Size
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Select company size</option>
                      <option>1-10 employees</option>
                      <option>11-50 employees</option>
                      <option>51-200 employees</option>
                      <option>201+ employees</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                    Request Early Access
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}