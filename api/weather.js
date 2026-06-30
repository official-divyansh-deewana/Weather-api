// api/weather.js
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY; // Use env var, don't hardcode

// Emoji mapping for weather conditions
const weatherEmojis = {
  'Clear': '☀️',
  'Clouds': '☁️',
  'Rain': '🌧️',
  'Drizzle': '🌦️',
  'Thunderstorm': '⛈️',
  'Snow': '❄️',
  'Mist': '🌫️',
  'Smoke': '🌫️',
  'Haze': '🌫️',
  'Dust': '🌪️',
  'Fog': '🌫️',
  'Sand': '🌪️',
  'Ash': '🌋',
  'Squall': '💨',
  'Tornado': '🌪️'
};

export default async function handler(req, res) {
  if (req.method!== 'GET') {
    return res.status(405).json({ error: 'Only GET method is allowed' });
  }

  const { city } = req.query;
  if (!city || city.trim() === '') {
    return res.status(400).json({
      error: 'Please provide a city name. Example: /api/weather?city=delhi',
    });
  }

  if (!OPENWEATHER_API_KEY) {
    return res.status(500).json({ error: 'API key is not set' });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=en`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod!== 200) {
      return res.status(data.cod).json({
        error: data.message || 'City not found',
      });
    }

    const weatherMain = data.weather[0].main;
    const emoji = weatherEmojis[weatherMain] || '🌡️';

    const result = {
      status: '✅ Success',
      city: `${data.name} 🏙️`,
      country: `${data.sys.country} 🌍`,
      temperature: `${data.main.temp}°C 🌡️`,
      feels_like: `${data.main.feels_like}°C 🤔`,
      weather: `${data.weather[0].description} ${emoji}`,
      humidity: `${data.main.humidity}% 💧`,
      wind_speed: `${data.wind.speed} m/s 💨`,
      wind_direction: `${data.wind.deg}° 🧭`,
      pressure: `${data.main.pressure} hPa ⚖️`,
      visibility: data.visibility? `${data.visibility / 1000} km 👁️` : 'Not available',
      clouds: `${data.clouds.all}% ☁️`,
      sunrise: `🌅 ${new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US')}`,
      sunset: `🌇 ${new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US')}`,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      timestamp: new Date(data.dt * 1000).toLocaleString('en-US'),
      // Owner credit
      api_credit: {
        name: 'Oye Buggu',
        telegram: '@tera_paglu'
      }
    };

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
}
