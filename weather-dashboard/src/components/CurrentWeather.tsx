'use client';

import { WeatherData } from '@/types/weather';
import { useWeatherStore } from '@/lib/weatherStore';
import { weatherApi } from '@/lib/weatherApi';
import Image from 'next/image';
import {
  CloudIcon,
  DropletIcon,
  Wind as WindIcon,
  EyeIcon,
  GaugeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface CurrentWeatherProps {
  data: WeatherData;
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  const unit = useWeatherStore((state) => state.unit);
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  const sunrise = new Date(data.sys.sunrise * 1000);
  const sunset = new Date(data.sys.sunset * 1000);
  const currentTime = new Date(data.dt * 1000);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 p-8 text-white shadow-2xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold">{data.name}, {data.sys.country}</h1>
          <p className="mt-2 text-blue-100">
            {format(currentTime, 'EEEE, MMMM d, yyyy h:mm a')}
          </p>
        </div>
      </div>

      {/* Main Weather Info */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <div className="flex items-center gap-6">
          <Image
            src={weatherApi.getWeatherIconUrl(data.weather[0].icon)}
            alt={data.weather[0].description}
            width={150}
            height={150}
            className="drop-shadow-lg"
          />
          <div>
            <div className="text-7xl font-bold">{Math.round(data.main.temp)}{tempUnit}</div>
            <p className="mt-2 text-xl capitalize text-blue-100">
              {data.weather[0].main}
            </p>
            <p className="text-sm text-blue-100">
              Feels like {Math.round(data.main.feels_like)}{tempUnit}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center rounded-lg bg-white/20 p-6">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-4">
              <div>
                <p className="flex items-center gap-2 text-sm text-blue-100 mb-2">
                  <ArrowUpIcon className="h-4 w-4" /> High
                </p>
                <p className="text-3xl font-bold">{Math.round(data.main.temp_max)}{tempUnit}</p>
              </div>
              <div className="text-2xl text-blue-200">/</div>
              <div>
                <p className="flex items-center gap-2 text-sm text-blue-100 mb-2">
                  <ArrowDownIcon className="h-4 w-4" /> Low
                </p>
                <p className="text-3xl font-bold">{Math.round(data.main.temp_min)}{tempUnit}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Weather Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white/20 p-4 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-blue-100">
            <DropletIcon className="h-4 w-4" />
            Humidity
          </div>
          <p className="mt-2 text-2xl font-bold">{data.main.humidity}%</p>
        </div>

        <div className="rounded-lg bg-white/20 p-4 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-blue-100">
            <WindIcon className="h-4 w-4" />
            Wind Speed
          </div>
          <p className="mt-2 text-2xl font-bold">{data.wind.speed.toFixed(1)} {speedUnit}</p>
        </div>

        <div className="rounded-lg bg-white/20 p-4 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-blue-100">
            <GaugeIcon className="h-4 w-4" />
            Pressure
          </div>
          <p className="mt-2 text-2xl font-bold">{data.main.pressure} hPa</p>
        </div>

        <div className="rounded-lg bg-white/20 p-4 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-blue-100">
            <EyeIcon className="h-4 w-4" />
            Visibility
          </div>
          <p className="mt-2 text-2xl font-bold">{(data.visibility / 1000).toFixed(1)} km</p>
        </div>
      </div>

      {/* Sunrise/Sunset and Cloudiness */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white/20 p-4 backdrop-blur">
          <p className="text-sm text-blue-100">Sunrise</p>
          <p className="mt-2 text-lg font-bold">{format(sunrise, 'h:mm a')}</p>
        </div>

        <div className="rounded-lg bg-white/20 p-4 backdrop-blur">
          <p className="text-sm text-blue-100">Sunset</p>
          <p className="mt-2 text-lg font-bold">{format(sunset, 'h:mm a')}</p>
        </div>

        <div className="rounded-lg bg-white/20 p-4 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-blue-100">
            <CloudIcon className="h-4 w-4" />
            Cloudiness
          </div>
          <p className="mt-2 text-lg font-bold">{data.clouds.all}%</p>
        </div>
      </div>
    </div>
  );
}
