'use client';

import { useState } from 'react';
import { useWeatherStore } from '@/lib/weatherStore';
import { weatherApi } from '@/lib/weatherApi';
import toast from 'react-hot-toast';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const setLoading = useWeatherStore((state) => state.setLoading);
  const setError = useWeatherStore((state) => state.setError);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      onSearch(searchQuery);
      setQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
    } catch (error) {
      setError('Failed to fetch weather data');
      toast.error('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (value: string) => {
    setQuery(value);

    if (value.length > 2) {
      try {
        const results = await weatherApi.searchCities(value);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (city: any) => {
    setQuery(city.name);
    handleSearch(city.name);
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLoading(true);
          try {
            const weather = await weatherApi.getCurrentWeatherByCoords(
              latitude,
              longitude
            );
            setQuery(weather.name);
            onSearch(weather.name);
          } catch (error) {
            toast.error('Failed to get weather for your location');
          } finally {
            setLoading(false);
          }
        },
        () => {
          toast.error('Unable to access your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported');
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Search for a city..."
            className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 pr-12 text-gray-800 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={() => handleSearch(query)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-blue-500"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 mt-2 rounded-lg border border-gray-300 bg-white shadow-lg">
              {suggestions.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(city)}
                  className="w-full border-b border-gray-200 px-4 py-3 text-left hover:bg-blue-50 last:border-b-0"
                >
                  <div className="font-semibold text-gray-800">{city.name}</div>
                  <div className="text-sm text-gray-500">{city.country}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleGeolocation}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-600"
        >
          <MapPinIcon className="h-5 w-5" />
          <span className="hidden sm:inline">My Location</span>
        </button>
      </div>
    </div>
  );
}
