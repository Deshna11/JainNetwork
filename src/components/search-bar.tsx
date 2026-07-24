'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface SearchBarProps {
  categories: { id: string; name: string; slug: string }[];
  cities: string[];
  basePath?: string;
}

export function SearchBar({ categories, cities, basePath = '/businesses' }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (category) params.set('category', category);
    if (city) params.set('city', city);
    router.push(`${basePath}?${params.toString()}`);
  }

  function handleClear() {
    setQuery('');
    setCategory('');
    setCity('');
    router.push(basePath);
  }

  const hasFilters = query || category || city;

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search by name, city, description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Search
        </Button>
        {hasFilters && (
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear Filters
          </Button>
        )}
      </div>
    </form>
  );
}
