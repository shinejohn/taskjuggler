import React, { Component } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { SearchBar } from '../Search/SearchBar';
export function SearchBarPage() {
  const handleSearch = (term: string, category?: string) => {
    console.log(`Searching for: ${term}${category ? ` in category: ${category}` : ''}`);
  };
  return <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Search Bar Component
          </h1>
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Component Information
            </h2>
            <p className="text-gray-700 mb-4">
              This is a reusable search bar component that supports:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Auto-complete with categories</li>
              <li>Recent searches dropdown</li>
              <li>Voice search option</li>
              <li>Search filters preview</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}