# 🌤️ Weather Dashboard

A modern, responsive weather dashboard built with Next.js 14, TypeScript, and Tailwind CSS. Fetches real-time weather data from the OpenWeatherMap API.

## Features ✨

- **Current Weather**: Real-time temperature, humidity, wind speed, and more
- **5-Day Forecast**: Detailed forecast for the next 5 days
- **Search**: Find weather for any city in the world
- **Geolocation**: Get weather for your current location
- **Saved Cities**: Quickly access weather for frequently checked cities
- **Unit Toggle**: Switch between Celsius/Fahrenheit and m/s/mph
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Beautiful UI**: Modern gradient backgrounds and smooth animations
- **LocalStorage**: Persists saved cities between sessions

## Tech Stack 🛠️

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Custom CSS
- **State Management**: Zustand
- **API**: Axios
- **Weather Data**: OpenWeatherMap API
- **UI Icons**: Heroicons
- **Date Formatting**: date-fns
- **Notifications**: React Hot Toast

## Prerequisites 📋

- Node.js 18+
- npm or yarn
- OpenWeatherMap API key (Free tier available)

## Installation 🔧

1. **Navigate to the weather dashboard directory**
   ```bash
   cd weather-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get your OpenWeatherMap API key**
   - Visit: https://openweathermap.org/api
   - Sign up for a free account
   - Generate an API key

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your API key:
   ```
   NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3001](http://localhost:3001) in your browser.

## Usage 📖

### Search for a City
1. Use the search bar at the top
2. Type a city name
3. Select from suggestions or press Enter

### Use Your Current Location
1. Click the "My Location" button
2. Allow browser geolocation access
3. Weather for your location loads automatically

### Save Cities
- Any city you search for is automatically saved
- Click on saved cities to quickly view their weather
- Remove cities by clicking the trash icon

### Toggle Temperature Units
- Click the unit toggle button in the header
- Switch between Celsius/Fahrenheit
- All temperatures update automatically

## Project Structure 📁

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/
│   ├── CurrentWeather.tsx  # Current weather display
│   ├── Forecast.tsx        # 5-day forecast
│   ├── ForecastCard.tsx    # Individual forecast card
│   ├── SearchBar.tsx       # City search component
│   ├── SavedCities.tsx     # Saved cities list
│   └── UnitToggle.tsx      # Temperature unit toggle
├── lib/
│   ├── weatherApi.ts       # API client
│   └── weatherStore.ts     # Zustand store
├── types/
│   └── weather.ts          # TypeScript types
└── styles/
    └── globals.css         # Global styles
```

## API Integration 🔌

The app uses the following OpenWeatherMap endpoints:

1. **Current Weather**: `/data/2.5/weather?q=city&units=metric&appid=KEY`
2. **5-Day Forecast**: `/data/2.5/forecast?q=city&units=metric&appid=KEY`
3. **City Search**: `/geo/1.0/direct?q=city&limit=5&appid=KEY`
4. **Weather by Coordinates**: `/data/2.5/weather?lat=LAT&lon=LON&units=metric&appid=KEY`

## Building for Production 🏗️

```bash
npm run build
npm start
```

## Deployment 🚀

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_WEATHER_API_KEY`
5. Deploy!

## Environment Variables 🔐

```env
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development
```

## Future Enhancements 🔮

- [ ] Weather alerts and notifications
- [ ] Hourly forecast (24-hour)
- [ ] Air quality index
- [ ] UV index
- [ ] Rainfall charts
- [ ] Weather maps
- [ ] Dark mode
- [ ] PWA support
- [ ] User accounts and sync

## Troubleshooting 🔧

### API Key Issues
- Ensure your API key is correctly set in `.env.local`
- Check that your OpenWeatherMap account has API access enabled
- Free tier may have rate limits

### Geolocation Not Working
- Check browser permissions
- Ensure HTTPS is used (required for geolocation)
- Some browsers may block geolocation by default

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

MIT License - feel free to use this project for personal and commercial purposes.

## Credits 🙏

- Weather data powered by [OpenWeatherMap](https://openweathermap.org)
- Icons by [Heroicons](https://heroicons.com/)
- UI framework by [Tailwind CSS](https://tailwindcss.com)
- Built with [Next.js](https://nextjs.org)
