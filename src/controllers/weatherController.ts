// src/controllers/weatherController.ts
import { Request, Response } from 'express';
import { getWeatherData } from '../services/weatherService';
import { WeatherData } from '../types/weatherTypes'; // Import the interface

export const adjustDevicesBasedOnWeather = async (req: Request, res: Response) => {
  const { location } = req.body;
  
  try {
    const weatherData = await getWeatherData(location);

    // Extract weather data (example: temperature and conditions)
    const temperature = weatherData.main.temp;
    const weatherCondition = weatherData.weather[0].main;

    // Logic for adjusting devices based on weather
    if (temperature < 18) {
      // Turn on heating
      return res.json({ message: 'It\'s cold, turning on the heater' });
    } else if (temperature > 30) {
      // Turn on air conditioning
      return res.json({ message: 'It\'s hot, turning on the AC' });
    } else if (weatherCondition === 'Rain') {
      // Adjust lights or other devices for rain
      return res.json({ message: 'It\'s raining, adjusting lights for rain' });
    }

    return res.json({ message: 'Weather conditions are normal, no adjustments needed' });

  } catch (error) {
    return res.status(500).json({ message: 'Error adjusting devices based on weather' });
  }
};

