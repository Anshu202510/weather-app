'use client';

import { useWeatherStore } from '@/lib/weatherStore';

export function UnitToggle() {
  const unit = useWeatherStore((state) => state.unit);
  const setUnit = useWeatherStore((state) => state.setUnit);

  return (
    <div className="flex gap-2 rounded-lg bg-white p-1 shadow">
      <button
        onClick={() => setUnit('metric')}
        className={`px-4 py-2 rounded font-semibold transition-all ${
          unit === 'metric'
            ? 'bg-blue-500 text-white'
            : 'bg-transparent text-gray-700 hover:bg-gray-100'
        }`}
      >
        °C / m/s
      </button>
      <button
        onClick={() => setUnit('imperial')}
        className={`px-4 py-2 rounded font-semibold transition-all ${
          unit === 'imperial'
            ? 'bg-blue-500 text-white'
            : 'bg-transparent text-gray-700 hover:bg-gray-100'
        }`}
      >
        °F / mph
      </button>
    </div>
  );
}
