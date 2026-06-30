// api/weather.js
export default async function handler(req, res) {
  // क्वेरी पैरामीटर "city" लें (जैसे ?city=delhi)
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({
      error: 'कृपया शहर का नाम दें। उदाहरण: /api/weather?city=delhi'
    });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'API key कॉन्फ़िगर नहीं है। Vercel के एनवायरनमेंट वेरिएबल्स में OPENWEATHER_API_KEY सेट करें।'
    });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=hi`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(data.cod).json({ error: data.message || 'शहर नहीं मिला' });
    }

    // ज़रूरी जानकारी भेजें
    return res.status(200).json({
      शहर: data.name,
      देश: data.sys.country,
      तापमान: `${data.main.temp}°C`,
      महसूस_होता_है: `${data.main.feels_like}°C`,
      मौसम: data.weather[0].description,
      आर्द्रता: `${data.main.humidity}%`,
      हवा_की_गति: `${data.wind.speed} m/s`,
      आइकन: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    });
  } catch (error) {
    return res.status(500).json({ error: 'मौसम डेटा लाने में विफल' });
  }
}
