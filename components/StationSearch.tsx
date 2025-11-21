import React, { useState, useEffect, useRef } from 'react';
import { searchStations } from '../services/transportService.ts';
import { Station } from '../types.ts';
import { SearchIcon, MapPinIcon } from './Icons.tsx';

interface StationSearchProps {
  onSelect: (station: Station) => void;
}

const StationSearch: React.FC<StationSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        const stations = await searchStations(query);
        setResults(stations);
        setLoading(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (station: Station) => {
    setQuery(station.name);
    onSelect(station);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-swiss-red focus:border-swiss-red sm:text-sm transition duration-150 ease-in-out shadow-sm"
          placeholder="Search station (e.g. Zürich HB)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-swiss-red"></div>
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {results.map((station) => (
            <li
              key={station.id}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 transition-colors"
              onClick={() => handleSelect(station)}
            >
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="font-normal block truncate text-gray-900">
                  {station.name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StationSearch;