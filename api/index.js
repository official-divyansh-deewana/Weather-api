// api/index.js – Root endpoint showing API usage and owner info
export default function handler(req, res) {
  const baseUrl = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;

  res.status(200).json({
    success: true,
    message: '🌤️ Welcome to Oye Buggu Premium Weather API!',
    owner: {
      name: 'Oye Buggu',
      telegram: 'https://t.me/tera_paglu',
    },
    usage: {
      description: 'Send a GET request with a city name to get weather data.',
      endpoint: `${baseUrl}/weather?city=city_name`,
      example: `${baseUrl}/weather?city=London`,
      response_format: 'JSON with emoji-enhanced weather details and owner credit.',
    },
    note: 'This is the root endpoint. Use the /weather endpoint for weather data. ✨',
  });
}
