'use client';

import Image from 'next/image';
import { weatherApi } from '@/lib/weatherApi';
import { useWeatherStore } from '@/lib/weatherStore';
import { format } from 'date-fns';

interface ForecastCardProps {
  dt: number
  temp: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  precipitation: number
}

export function ForecastCard({
  dt,
  temp,
  description,
  icon,
  humidity,
  windSpeed,
  precipitation,
}: ForecastCardProps) {
  const unit = useWeatherStore((state) => state.unit);
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <div className="rounded-lg bg-white p-4 shadow-md transition-all hover:shadow-lg">
      <p className="mb-3 text-center text-sm font-semibold text-gray-700">
        {format(new Date(dt * 1000), 'EEE, MMM d')}
      </p>
      <p className="text-center text-xs text-gray-500 mb-3">
        {format(new Date(dt * 1000), 'h:mm a')}
      </p>

      <div className="mb-3 flex justify-center">
        <Image
          src={weatherApi.getWeatherIconUrl(icon)}
          alt={description}
          width={80}
          height={80}
        />
      </div>

      <div className="mb-3 text-center">
        <p className="text-2xl font-bold text-blue-600">{Math.round(temp)}{tempUnit}</p>
        <p className="text-xs capitalize text-gray-600">{description}</p>
      </div>

      <div className="space-y-2 border-t pt-3 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Humidity:</span>
          <span className="font-semibold">{humidity}%</span>
        </div>
        <div className="flex justify-between">
          <span>Wind:</span>
          <span className="font-semibold">{windSpeed.toFixed(1)} {speedUnit}</span>
        </div>
        {precipitation > 0 && (
          <div className="flex justify-between">
            <span>Precip:</span>
            <span className="font-semibold">{(precipitation * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
