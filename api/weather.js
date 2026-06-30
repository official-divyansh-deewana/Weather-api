// api/weather.js – Premium Weather API by Oye Buggu
// 🔒 API key Vercel Environment Variables से ली जाएगी (OPENWEATHER_API_KEY)

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

  // 🔑 API key Vercel के environment variable से लें
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: 'Server configuration error: OpenWeather API key not set in environment variables.',
    });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric&lang=en`;

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

    return res.status(200).json({
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
    });
  } catch (error) {
    console.error('Weather fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch weather data. Please try again later.',
    });
  }
}
