'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface MultiSelectOption {
  label: string;
  value: string;
  sublabel?: string; // e.g. State name
}

interface MultiSelectDropdownProps {
  title: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelectDropdown({
  title,
  options,
  selectedValues,
  onChange,
  placeholder = 'Search...',
  className = '',
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const matchLabel = option.label.toLowerCase().includes(term);
    const matchSublabel = option.sublabel ? option.sublabel.toLowerCase().includes(term) : false;
    return matchLabel || matchSublabel;
  });

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleSelectAll = () => {
    const allValues = options.map((opt) => opt.value);
    onChange(allValues);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const selectedCount = selectedValues.length;

  return (
    <div className={`relative block w-full text-left ${className}`} ref={dropdownRef}>
      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <span className="truncate font-medium text-gray-700">
          {selectedCount === 0
            ? title
            : selectedCount === 1
            ? options.find((opt) => opt.value === selectedValues[0])?.label || selectedValues[0]
            : `${title} (${selectedCount})`}
        </span>
        <div className="flex items-center gap-1">
          {selectedCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700">
              {selectedCount}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Floating Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 w-full min-w-[260px] max-w-sm rounded-xl border border-gray-200 bg-white p-3 shadow-xl animate-in fade-in-50 zoom-in-95 sm:right-auto sm:left-0">
          {/* Search Box */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-xs focus:border-amber-500 focus:bg-white focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick Controls */}
          <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-2 text-xs">
            <button
              type="button"
              onClick={handleSelectAll}
              className="font-medium text-amber-600 hover:text-amber-800"
            >
              Select All
            </button>
            {selectedCount > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-gray-500 hover:text-red-600"
              >
                Clear ({selectedCount})
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <label
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    className={`flex cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                      isSelected ? 'bg-amber-50 text-slate-900 font-medium' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          isSelected
                            ? 'border-amber-600 bg-amber-500 text-slate-950 font-semibold'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <span className="truncate">{option.label}</span>
                    </div>

                    {option.sublabel && (
                      <span className="ml-2 shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-normal text-gray-500">
                        {option.sublabel}
                      </span>
                    )}
                  </label>
                );
              })
            ) : (
              <p className="py-4 text-center text-xs text-gray-400">No matching locations found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
