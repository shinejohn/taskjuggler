import React, { useState } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { SearchResults } from '../Search/SearchResults';
export function SearchResultsPage() {
  const [searchTerm, setSearchTerm] = useState('web developer');
  const handleSearchChange = (term: string, category?: string) => {
    setSearchTerm(term);
  };
  return <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16">
        <SearchResults searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      </div>
      <Footer />
    </div>;
}