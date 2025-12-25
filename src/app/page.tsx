'use client';

import { domains, type Domain } from '@/lib/domains';
import { DomainCard } from '@/components/domain-card';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  // Helper to check if a domain or any of its topics match the search
  const filterDomains = (domain: Domain) => {
    const q = search.toLowerCase();
    if (
      domain.name.toLowerCase().includes(q) ||
      domain.description.toLowerCase().includes(q) ||
      domain.slug.toLowerCase().includes(q) ||
      domain.roadmap.some((step: { title: string; description: string }) => step.title.toLowerCase().includes(q) || step.description.toLowerCase().includes(q)) ||
      domain.resources.some((res: { title: string }) => res.title.toLowerCase().includes(q)) ||
      domain.projectIdeas.some((idea: { title: string; description: string }) => idea.title.toLowerCase().includes(q) || idea.description.toLowerCase().includes(q))
    ) {
      return true;
    }
    return false;
  };
  const filteredDomains = search ? domains.filter(filterDomains) : domains;

  // Only show up to 8 suggestions in dropdown
  const dropdownDomains = search ? filteredDomains.slice(0, 8) : [];

  // Handle blur: delay closing so click can register
  const handleBlur = () => {
    setTimeout(() => setDropdownOpen(false), 120);
  };

  // Handle focus: open dropdown if there are matches
  const handleFocus = () => {
    if (dropdownDomains.length > 0 && search.length > 0) {
      setDropdownOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold font-headline bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in-up">
            Explore Tech Domains
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Discover a world of technology! Browse domains like Web Development, Machine Learning, Cloud, UI/UX, and more. Click any card to dive into roadmaps, resources, project ideas, and essential tools for each field.
          </p>
          <div className="mt-8 max-w-md mx-auto relative animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setDropdownOpen(e.target.value.length > 0 && dropdownDomains.length > 0);
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Search domains or topics..."
              className="w-full px-4 py-3 border border-input rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm"
              autoComplete="off"
            />
            {dropdownOpen && (
              <ul
                ref={dropdownRef}
                className="absolute left-0 right-0 z-10 bg-white/90 backdrop-blur-md border border-muted rounded-xl mt-2 shadow-xl max-h-72 overflow-auto divide-y divide-muted-foreground/10 animate-scale-in"
              >
                {dropdownDomains.map(domain => (
                  <li
                    key={domain.slug}
                    className="px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-left transition-all duration-200"
                    onMouseDown={e => {
                      e.preventDefault();
                      setDropdownOpen(false);
                      setSearch('');
                      router.push(`/domain/${domain.slug}`);
                    }}
                  >
                    <span className="font-semibold text-gray-800">{domain.name}</span>
                    <span className="block text-sm text-muted-foreground">{domain.description}</span>
                  </li>
                ))}
                {dropdownDomains.length === 0 && (
                  <li className="px-4 py-3 text-muted-foreground">No domains found.</li>
                )}
              </ul>
            )}
          </div>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDomains.length > 0 ? (
            filteredDomains.map((domain, index) => (
              <div 
                key={domain.slug} 
                className="animate-fade-in-up"
                style={{animationDelay: `${0.1 * (index % 8)}s`}}
              >
                <DomainCard domain={domain} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground text-lg animate-fade-in">
              No domains or topics found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
