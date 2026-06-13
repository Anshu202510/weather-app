import axios from 'axios';
import { WeatherData, ForecastData } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org';

if (!API_KEY) {
  console.warn('NEXT_PUBLIC_WEATHER_API_KEY is not set');
}

export const weatherApi = {
  getCurrentWeather: async (
    city: string,
    units: 'metric' | 'imperial' = 'metric'
  ): Promise<WeatherData> => {
    try {
      const response = await axios.get(`${BASE_URL}/data/2.5/weather`, {
        params: {
          q: city,
          units,
          appid: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch current weather');
    }
  },

  getCurrentWeatherByCoords: async (
    lat: number,
    lon: number,
    units: 'metric' | 'imperial' = 'metric'
  ): Promise<WeatherData> => {
    try {
      const response = await axios.get(`${BASE_URL}/data/2.5/weather`, {
        params: {
          lat,
          lon,
          units,
          appid: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch weather by coordinates');
    }
  },

  getForecast: async (
    city: string,
    units: 'metric' | 'imperial' = 'metric'
  ): Promise<ForecastData> => {
    try {
      const response = await axios.get(`${BASE_URL}/data/2.5/forecast`, {
        params: {
          q: city,
          units,
          appid: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch forecast');
    }
  },

  getForecastByCoords: async (
    lat: number,
    lon: number,
    units: 'metric' | 'imperial' = 'metric'
  ): Promise<ForecastData> => {
    try {
      const response = await axios.get(`${BASE_URL}/data/2.5/forecast`, {
        params: {
          lat,
          lon,
          units,
          appid: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch forecast by coordinates');
    }
  },

  searchCities: async (query: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/geo/1.0/direct`, {
        params: {
          q: query,
          limit: 5,
          appid: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to search cities');
    }
  },

  getWeatherIconUrl: (icon: string): string => {
    return `https://openweathermap.org/img/wn/${icon}@4x.png`;
  },
}
