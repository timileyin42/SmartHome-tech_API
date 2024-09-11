export interface WeatherData {
  main: {
    temp: number; // Temperature
    humidity: number; // Humidity
    pressure?: number; // Optional
  };
  weather: Array<{
    main: string; // Main weather condition (e.g., 'Clear', 'Cloudy')
    description: string; // Weather description (e.g., 'clear sky')
  }>;
}

