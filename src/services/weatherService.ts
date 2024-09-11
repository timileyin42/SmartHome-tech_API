import axios from 'axios';
import { WeatherData } from '../types/weatherTypes'; // Import the WeatherData interface

const apiKey = process.env.OPENWEATHERMAP_API_KEY;
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather';

export const getWeatherData = async (location: string): Promise<WeatherData> => {
  try {
    const response = await axios.get<WeatherData>(baseUrl, {
      params: {
        q: location,
        appid: apiKey,
        units: 'metric' // For Celsius
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching weather data');
  }
};

