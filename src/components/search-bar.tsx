'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { MultiSelectDropdown, type MultiSelectOption } from '@/components/multi-select-dropdown';
import { LocationAutocomplete } from '@/components/location-autocomplete';
import {
  type LocationSuggestion,
  INDIA_PLACES_DATASET,
} from '@/lib/location-search-service';
import { Search, X, Filter } from 'lucide-react';

interface SearchBarProps {
  categories: { id: string; name: string; slug: string }[];
  cities?: string[];
  basePath?: string;
}

export function SearchBar({ categories, basePath = '/businesses' }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('query') || '');
  
  // Parse category params
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const catParam = searchParams.get('category');
    return catParam ? catParam.split(',').filter(Boolean) : [];
  });

  // Parse location object from URL city param
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(() => {
    const cityParam = searchParams.get('city');
    if (!cityParam) return null;

    // Find match in dataset or create formatted location object
    const match = INDIA_PLACES_DATASET.find(
      (p) => p.formatted.toLowerCase() === cityParam.toLowerCase() || p.name.toLowerCase() === cityParam.toLowerCase()
    );

    if (match) return match;

    const [name, state] = cityParam.split(',').map((s) => s.trim());
    return {
      id: `url-${cityParam}`,
      name: name || cityParam,
      state: state || '',
      type: 'City',
      formatted: cityParam,
    };
  });

  // Sync state if URL changes externally
  useEffect(() => {
    setQuery(searchParams.get('query') || '');
    const catParam = searchParams.get('category');
    setSelectedCategories(catParam ? catParam.split(',').filter(Boolean) : []);

    const cityParam = searchParams.get('city');
    if (cityParam) {
      const match = INDIA_PLACES_DATASET.find(
        (p) => p.formatted.toLowerCase() === cityParam.toLowerCase() || p.name.toLowerCase() === cityParam.toLowerCase()
      );
      if (match) {
        setSelectedLocation(match);
      } else {
        const [name, state] = cityParam.split(',').map((s) => s.trim());
        setSelectedLocation({
          id: `url-${cityParam}`,
          name: name || cityParam,
          state: state || '',
          type: 'City',
          formatted: cityParam,
        });
      }
    } else {
      setSelectedLocation(null);
    }
  }, [searchParams]);

  const categoryOptions: MultiSelectOption[] = categories.map((cat) => ({
    label: cat.name,
    value: cat.slug,
  }));

  function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const params = new URLSearchParams();

    if (query.trim()) params.set('query', query.trim());
    if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
    if (selectedLocation) params.set('city', selectedLocation.formatted);

    router.push(`${basePath}?${params.toString()}`);
  }

  function handleClear() {
    setQuery('');
    setSelectedCategories([]);
    setSelectedLocation(null);
    router.push(basePath);
  }

  const removeCategory = (slugToRemove: string) => {
    const updated = selectedCategories.filter((slug) => slug !== slugToRemove);
    setSelectedCategories(updated);
    const params = new URLSearchParams(searchParams.toString());
    if (updated.length > 0) {
      params.set('category', updated.join(','));
    } else {
      params.delete('category');
    }
    params.delete('page');
    router.push(`${basePath}?${params.toString()}`);
  };

  const removeLocation = () => {
    setSelectedLocation(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('city');
    params.delete('page');
    router.push(`${basePath}?${params.toString()}`);
  };

  const removeQuery = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('query');
    params.delete('page');
    router.push(`${basePath}?${params.toString()}`);
  };

  const hasFilters = query || selectedCategories.length > 0 || selectedLocation !== null;

  return (
    <div className="space-y-4">
      {/* 4-Column Responsive Non-Overlapping Grid Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:items-end">
        {/* Column 1: Search Keyword (lg:col-span-4) */}
        <div className="lg:col-span-4">
          <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            🔍 Search Keyword
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-full pl-9 pr-8"
            />
            {query && (
              <button
                type="button"
                onClick={removeQuery}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Column 2: Location Autocomplete Component (lg:col-span-4) */}
        <div className="lg:col-span-4">
          <LocationAutocomplete
            value={selectedLocation}
            onChange={(loc) => setSelectedLocation(loc)}
            placeholder="Search city, town, village or district..."
          />
        </div>

        {/* Column 3: Category Multiselect Dropdown (lg:col-span-2) */}
        <div className="lg:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            🏷️ Category
          </label>
          <MultiSelectDropdown
            title="All Categories"
            options={categoryOptions}
            selectedValues={selectedCategories}
            onChange={(values) => setSelectedCategories(values)}
            placeholder="Filter categories..."
            className="w-full"
          />
        </div>

        {/* Column 4: Search & Clear Action Buttons (lg:col-span-2) */}
        <div className="flex items-center gap-2 lg:col-span-2">
          <Button type="submit" className="h-10 flex-1 bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm">
            <Filter className="mr-1.5 h-4 w-4" />
            Search
          </Button>
          {hasFilters && (
            <Button type="button" variant="outline" onClick={handleClear} className="h-10 shrink-0">
              Clear
            </Button>
          )}
        </div>
      </form>

      {/* Active Filter Badges */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-600">
          <span className="font-medium text-gray-500">Active Filters:</span>

          {query && (
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-blue-700">
              Keyword: &quot;{query}&quot;
              <button type="button" onClick={removeQuery} className="hover:text-blue-900">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedLocation && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800 font-semibold">
              📍 {selectedLocation.formatted}
              <button type="button" onClick={removeLocation} className="hover:text-emerald-950">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedCategories.map((slug) => {
            const cat = categories.find((c) => c.slug === slug);
            return (
              <span
                key={slug}
                className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-indigo-700"
              >
                Category: {cat ? cat.name : slug}
                <button type="button" onClick={() => removeCategory(slug)} className="hover:text-indigo-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}

          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-gray-400 underline hover:text-gray-600"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
