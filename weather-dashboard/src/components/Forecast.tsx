'use client';

import { ForecastData } from '@/types/weather';
import { ForecastCard } from './ForecastCard';

interface ForecastProps {
  data: ForecastData;
}

export function Forecast({ data }: ForecastProps) {
  const dailyForecasts = data.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toDateString();
    const hour = new Date(item.dt * 1000).getHours();

    if (hour === 12 || !acc[date]) {
      acc[date] = item;
    }
    return acc;
  }, {} as Record<string, (typeof data.list)[0]>);

  const forecastList = Object.values(dailyForecasts).slice(0, 5);

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">5-Day Forecast</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {forecastList.map((item) => (
          <ForecastCard
            key={item.dt}
            dt={item.dt}
            temp={item.main.temp}
            description={item.weather[0].description}
            icon={item.weather[0].icon}
            humidity={item.main.humidity}
            windSpeed={item.wind.speed}
            precipitation={item.pop}
          />
        ))}
      </div>
    </div>
  );
}
