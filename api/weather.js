// api/weather.js – Premium Weather API by Oye Buggu
// Replace with your actual OpenWeather API key
const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY';

// Weather condition to emoji mapping
const WEATHER_EMOJI = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Smoke: '🌫️',
  Haze: '🌫️',
  Dust: '🌪️',
  Fog: '🌫️',
  Sand: '🌪️',
  Ash: '🌋',
  Squall: '💨',
  Tornado: '🌪️',
};

export default async function handler(req, res) {
  // Allow only GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Only GET method is allowed',
    });
  }

  // Get city from query parameter
  const { city } = req.query;
  if (!city || city.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Please provide a city name. Example: /weather?city=London',
    });
  }

  // Check API key
  if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
    return res.status(500).json({
      success: false,
      error: 'Server configuration error: API key not set.',
    });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=en`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(data.cod).json({
        success: false,
        error: data.message || 'City not found or invalid API key',
      });
    }

    const weatherMain = data.weather[0].main;
    const emoji = WEATHER_EMOJI[weatherMain] || '🌡️';

    // Premium response with emojis and credit
    const result = {
      success: true,
      city: `${data.name} 🏙️`,
      country: `${data.sys.country} 🌍`,
      temperature: `${data.main.temp}°C 🌡️`,
      feels_like: `${data.main.feels_like}°C 🤔`,
      weather: `${data.weather[0].description} ${emoji}`,
      humidity: `${data.main.humidity}% 💧`,
      wind_speed: `${data.wind.speed} m/s 💨`,
      wind_deg: `${data.wind.deg}° 🧭`,
      pressure: `${data.main.pressure} hPa ⚖️`,
      visibility: data.visibility ? `${data.visibility / 1000} km 👁️` : 'N/A',
      cloudiness: `${data.clouds.all}% ☁️`,
      sunrise: `🌅 ${new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      sunset: `🌇 ${new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      icon_url: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      last_updated: new Date(data.dt * 1000).toLocaleString('en-US'),
      api_credit: {
        name: 'Oye Buggu',
        telegram: '@tera_paglu',
      },
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('Weather fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch weather data. Please try again later.',
    });
  }
}
