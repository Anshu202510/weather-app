import { create } from 'zustand';
import { WeatherData, ForecastData, SavedCity } from '@/types/weather';

interface WeatherStore {
  currentWeather: WeatherData | null
  forecast: ForecastData | null
  savedCities: SavedCity[]
  loading: boolean
  error: string | null
  unit: 'metric' | 'imperial'
  setCurrentWeather: (data: WeatherData) => void
  setForecast: (data: ForecastData) => void
  setSavedCities: (cities: SavedCity[]) => void
  addSavedCity: (city: SavedCity) => void
  removeSavedCity: (cityName: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setUnit: (unit: 'metric' | 'imperial') => void
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  currentWeather: null,
  forecast: null,
  savedCities: [],
  loading: false,
  error: null,
  unit: 'metric',

  setCurrentWeather: (data) => set({ currentWeather: data }),
  setForecast: (data) => set({ forecast: data }),
  setSavedCities: (cities) => set({ savedCities: cities }),
  addSavedCity: (city) =>
    set((state) => ({
      savedCities: [...state.savedCities, city],
    })),
  removeSavedCity: (cityName) =>
    set((state) => ({
      savedCities: state.savedCities.filter((city) => city.name !== cityName),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setUnit: (unit) => set({ unit }),
}))
