'use client';

import { useWeatherStore } from '@/lib/weatherStore';
import { SavedCity } from '@/types/weather';
import { MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface SavedCitiesProps {
  onCityClick: (city: SavedCity) => void;
}

export function SavedCities({ onCityClick }: SavedCitiesProps) {
  const savedCities = useWeatherStore((state) => state.savedCities);
  const removeSavedCity = useWeatherStore((state) => state.removeSavedCity);

  const handleRemove = (cityName: string) => {
    removeSavedCity(cityName);
    toast.success(`${cityName} removed from saved cities`);
  };

  if (savedCities.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Saved Cities</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {savedCities.map((city) => (
          <div
            key={city.name}
            className="flex items-center justify-between rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-4 shadow-md transition-all hover:shadow-lg"
          >
            <button
              onClick={() => onCityClick(city)}
              className="flex flex-1 items-center gap-3"
            >
              <MapPinIcon className="h-5 w-5 flex-shrink-0 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-800">{city.name}</p>
                <p className="text-xs text-gray-500">{city.country}</p>
              </div>
            </button>

            <button
              onClick={() => handleRemove(city.name)}
              className="ml-2 rounded p-2 text-gray-400 hover:bg-red-100 hover:text-red-600"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
