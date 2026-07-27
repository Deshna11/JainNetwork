'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, X, Loader2, Sparkles, ChevronRight, Building2, Landmark, Home, Map } from 'lucide-react';
import {
  searchLocationSuggestions,
  type LocationSuggestion,
} from '@/lib/location-search-service';

interface LocationAutocompleteProps {
  value?: LocationSuggestion | null;
  onChange: (location: LocationSuggestion | null) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

export function LocationAutocomplete({
  value = null,
  onChange,
  placeholder = 'Search city, town, village, district or state...',
  className = '',
  label = '📍 Location',
  required = false,
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [didYouMean, setDidYouMean] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search (150ms)
  useEffect(() => {
    if (!query.trim() || value) {
      setSuggestions([]);
      setDidYouMean([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const result = await searchLocationSuggestions(query);
        setSuggestions(result.suggestions);
        setDidYouMean(result.didYouMean || []);
      } catch (err) {
        console.error('Error fetching location suggestions:', err);
      } finally {
        setIsLoading(false);
        setIsOpen(true);
        setSelectedIndex(-1);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query, value]);

  const handleSelect = (suggestion: LocationSuggestion) => {
    onChange(suggestion);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    onChange(null);
    setQuery('');
    setIsOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' && query.trim()) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Function to highlight matching query text
  const highlightMatch = (text: string) => {
    if (!query.trim()) return text;
    const cleanQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${cleanQuery})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === query.trim().toLowerCase() ? (
        <span key={i} className="font-bold text-amber-600 bg-amber-50 px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Get icon based on location type
  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'State':
      case 'Union Territory':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'District':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'City':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Town':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Village':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Field Label if provided */}
      {label && (
        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Selected Location Pill Display */}
      {value ? (
        <div className="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-amber-300 bg-amber-50/80 px-3.5 py-2 text-sm shadow-sm transition-all hover:border-amber-400">
          <div className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 shrink-0 text-amber-600 animate-pulse" />
            <span className="font-semibold text-slate-900 truncate">
              {value.formatted}
            </span>
            <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold ${getTypeBadgeStyle(value.type)}`}>
              {value.type}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-amber-700 hover:bg-amber-200 hover:text-slate-950 transition-colors"
            title="Clear Location"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        /* Autocomplete Search Input */
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0 || query.trim()) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            required={required && !value}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-9 text-sm shadow-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100 placeholder:text-gray-400"
          />

          {isLoading ? (
            <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-amber-600 pointer-events-none" />
          ) : query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      )}

      {/* Floating Suggestions Dropdown */}
      {isOpen && !value && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-2xl animate-in fade-in-50 zoom-in-95">
          {suggestions.length > 0 ? (
            <div className="space-y-1">
              <p className="px-2 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Locations in India</span>
                <span className="text-[10px] text-amber-600 font-normal">{suggestions.length} results</span>
              </p>
              {suggestions.map((item, index) => (
                <div
                  key={item.id || `loc-${index}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                    selectedIndex === index
                      ? 'bg-amber-50 text-slate-900 font-medium'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MapPin className={`h-4 w-4 shrink-0 ${selectedIndex === index ? 'text-amber-600' : 'text-gray-400'}`} />
                    <div className="truncate">
                      <span className="font-semibold text-gray-900">
                        {highlightMatch(item.name)}
                      </span>
                      <span className="ml-1.5 text-xs text-gray-500">
                        {item.district && item.district !== item.name ? `${item.district}, ` : ''}
                        {item.state}
                      </span>
                    </div>
                  </div>
                  <span className={`ml-2 shrink-0 rounded border px-2 py-0.5 text-[10px] font-semibold ${getTypeBadgeStyle(item.type)}`}>
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          ) : !isLoading ? (
            /* No Results Fallback with Did You Mean */
            <div className="p-4 text-center">
              <p className="text-sm font-medium text-gray-700">No matching location found.</p>
              <p className="text-xs text-gray-400 mt-0.5">Try searching for state, district, city, town or village name.</p>
              
              {didYouMean.length > 0 && (
                <div className="mt-3 text-left border-t border-gray-100 pt-3">
                  <p className="flex items-center gap-1 text-xs font-semibold text-amber-600 mb-2">
                    <Sparkles className="h-3.5 w-3.5" /> Did you mean...
                  </p>
                  <div className="space-y-1">
                    {didYouMean.map((item, idx) => (
                      <button
                        key={item.id || `dym-${idx}`}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className="flex w-full items-center justify-between rounded-md p-2 text-xs text-gray-700 hover:bg-amber-50 hover:text-slate-900 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-400">({item.state})</span>
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
