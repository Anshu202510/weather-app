import type { Metadata } from 'next';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Weather Dashboard | Real-time Weather Forecasts',
  description:
    'A modern weather dashboard with real-time data from OpenWeatherMap API. Get current weather, 5-day forecasts, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
