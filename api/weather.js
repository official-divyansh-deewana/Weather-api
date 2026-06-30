// api/weather.js
// ⚠️  अपनी OpenWeather API key यहाँ स्ट्रिंग में डालें
const OPENWEATHER_API_KEY = 'c3f2eab27d073ac7a4c4df06fed7c4ba'; // <-- अपनी असली key यहाँ लिखें

export default async function handler(req, res) {
  // 1. सिर्फ GET रिक्वेस्ट स्वीकार करें
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'सिर्फ GET मेथड की अनुमति है',
    });
  }

  // 2. शहर का नाम क्वेरी से लें (?city=delhi)
  const { city } = req.query;

  if (!city || city.trim() === '') {
    return res.status(400).json({
      error: 'कृपया शहर का नाम दें। उदाहरण: /api/weather?city=delhi',
      example: '/api/weather?city=mumbai',
    });
  }

  // 3. API key की जाँच (अगर भूल से खाली छोड़ दी)
  if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
    return res.status(500).json({
      error: 'API key कोड में सेट नहीं है। कृपया api/weather.js में अपनी key डालें।',
    });
  }

  // 4. OpenWeather API का URL (हिंदी विवरण और मीट्रिक यूनिट)
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=hi`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // 5. अगर शहर नहीं मिला या key गलत है
    if (data.cod !== 200) {
      return res.status(data.cod).json({
        error: data.message || 'शहर नहीं मिला या API key अमान्य है',
        openweather_error_code: data.cod,
      });
    }

    // 6. डेटा को साफ़ हिंदी फ़ॉर्मेट में भेजें
    const weatherInfo = {
      शहर: data.name,
      देश: data.sys.country,
      तापमान: `${data.main.temp}°C`,
      महसूस_होने_वाला_तापमान: `${data.main.feels_like}°C`,
      न्यूनतम_तापमान: `${data.main.temp_min}°C`,
      अधिकतम_तापमान: `${data.main.temp_max}°C`,
      मौसम: data.weather[0].description,
      मौसम_का_प्रकार: data.weather[0].main,
      आर्द्रता: `${data.main.humidity}%`,
      हवा_की_गति: `${data.wind.speed} मी/से`,
      हवा_की_दिशा: `${data.wind.deg}°`,
      वायुमंडलीय_दबाव: `${data.main.pressure} hPa`,
      दृश्यता: data.visibility ? `${data.visibility / 1000} किमी` : 'उपलब्ध नहीं',
      बादल: `${data.clouds.all}%`,
      सूर्योदय: new Date(data.sys.sunrise * 1000).toLocaleTimeString('hi-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      सूर्यास्त: new Date(data.sys.sunset * 1000).toLocaleTimeString('hi-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      मौसम_आइकन: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      डेटा_समय: new Date(data.dt * 1000).toLocaleString('hi-IN'),
    };

    return res.status(200).json(weatherInfo);
  } catch (error) {
    console.error('OpenWeather API कॉल विफल:', error);
    return res.status(500).json({
      error: 'मौसम डेटा प्राप्त करने में विफल। कृपया बाद में पुनः प्रयास करें।',
    });
  }
}
