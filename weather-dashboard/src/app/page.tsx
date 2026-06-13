'use client';

import { useEffect, useState } from 'react';
import { CurrentWeather } from '@/components/CurrentWeather';
import { Forecast } from '@/components/Forecast';
import { SearchBar } from '@/components/SearchBar';
import { SavedCities } from '@/components/SavedCities';
import { UnitToggle } from '@/components/UnitToggle';
import { useWeatherStore } from '@/lib/weatherStore';
import { weatherApi } from '@/lib/weatherApi';
import { SavedCity } from '@/types/weather';
import toast from 'react-hot-toast';

export default function Home() {
  const {
    currentWeather,
    forecast,
    loading,
    error,
    unit,
    setCurrentWeather,
    setForecast,
    setLoading,
    setError,
    setSavedCities,
    addSavedCity,
  } = useWeatherStore();

  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved cities from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedCities');
    if (saved) {
      try {
        const cities = JSON.parse(saved);
        setSavedCities(cities);
      } catch (error) {
        console.error('Failed to load saved cities', error);
      }
    }
    setIsInitialized(true);
  }, [setSavedCities]);

  // Save cities to localStorage whenever they change
  useEffect(() => {
    const savedCities = useWeatherStore((state) => state.savedCities);
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
  }, [useWeatherStore((state) => state.savedCities)]);

  // Load default city on first load
  useEffect(() => {
    if (isInitialized && !currentWeather) {
      handleSearch('London');
    }
  }, [isInitialized]);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const [weather, forecastData] = await Promise.all([
        weatherApi.getCurrentWeather(city, unit),
        weatherApi.getForecast(city, unit),
      ]);

      setCurrentWeather(weather);
      setForecast(forecastData);

      const newCity: SavedCity = {
        name: weather.name,
        lat: weather.coord.lat,
        lon: weather.coord.lon,
        country: weather.sys.country,
      };

      const savedCities = useWeatherStore((state) => state.savedCities);
      if (!savedCities.find((c) => c.name === weather.name)) {
        addSavedCity(newCity);
      }
    } catch (error) {
      setError('Failed to fetch weather data');
      toast.error('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSavedCityClick = async (city: SavedCity) => {
    setLoading(true);
    setError(null);

    try {
      const [weather, forecastData] = await Promise.all([
        weatherApi.getCurrentWeatherByCoords(city.lat, city.lon, unit),
        weatherApi.getForecastByCoords(city.lat, city.lon, unit),
      ]);

      setCurrentWeather(weather);
      setForecast(forecastData);
    } catch (error) {
      setError('Failed to fetch weather data');
      toast.error('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">🌤️ Weather Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Get real-time weather forecasts powered by OpenWeatherMap
              </p>
            </div>
            <UnitToggle />
          </div>

          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading && !currentWeather && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 inline-block">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
              </div>
              <p className="text-lg font-semibold text-gray-700">Loading weather data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {currentWeather && (
          <div className="space-y-8">
            {/* Current Weather */}
            <CurrentWeather data={currentWeather} />

            {/* Forecast */}
            {forecast && <Forecast data={forecast} />}

            {/* Saved Cities */}
            <SavedCities onCityClick={handleSavedCityClick} />
          </div>
        )}
      </div>
    </main>
  );
}
