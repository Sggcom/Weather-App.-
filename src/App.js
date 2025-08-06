import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card } from "./components/ui/card";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "1cb58c1f6189475381a71419250508"; 

  //  Auto-fetch weather based on current location on page load
  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  //  Get user's current location and fetch weather
  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeatherByCoords(lat, lon);
        },
        (err) => {
          console.error(err);
          setError("Location access denied. Please enter city manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  //  Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=no&alerts=no`
      );
      setWeather(response.data);
      setCity(response.data.location.name);
    } catch {
      setError("Failed to fetch weather for your location.");
    }
    setLoading(false);
  };

  //  Fetch weather by city input
  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`
      );
      setWeather(response.data);
    } catch {
      setError("City not found or invalid API request!");
      setWeather(null);
    }
    setLoading(false);
  };

  const formatTime = (time) => {
    const hour = new Date(time).getHours();
    return hour === 0 ? "12 am" : hour < 12 ? `${hour} am` : hour === 12 ? "12 pm" : `${hour - 12} pm`;
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
       <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-500 to-blue-400 p-6">
      <h1 className="text-5xl font-extrabold text-white mb-8 drop-shadow-lg text-center"> ☀️Weather App🌈</h1>

      
      
      <div className="flex justify-center mb-6 w-full">
  <div className="flex gap-3 mb-4 w-full max-w-xl"> {/* Increased max width */}
    <Input
      placeholder="Enter city name..."
      value={city}
      onChange={(e) => setCity(e.target.value)}
      onKeyPress={(e) => e.key === "Enter" && getWeather()}
      className="bg-white/80 border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500 text-lg px-4 w-full" 
      // <-- Added w-full to stretch input width
    />
    <Button className="bg-blue-600 hover:bg-blue-700 shadow-md px-6" onClick={getWeather}>
      Search
    </Button>
  </div>
</div>


      {/* Error Message */}
      {error && <p className="text-red-600 text-lg font-medium">{error}</p>}
      {loading && <p className="text-blue-800 text-xl font-medium animate-pulse">Fetching weather...</p>}

      {weather && !loading && (
        <div className="w-full px-2">
          {/* TOP SECTION: Current Weather (Left) + Hourly Forecast (Right) */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8 max-w-6xl mx-auto">
            {/* Current Weather Card */}
            <Card className="flex-1 p-6 shadow-2xl bg-white/90 rounded-2xl">
              <h2 className="text-3xl font-bold text-gray-800">
                {weather.location.name}, {weather.location.country}
              </h2>
              <p className="text-gray-500 mt-1">
                {new Date(weather.location.localtime).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="flex items-center justify-between mt-6">
                <div>
                  <p className="text-5xl font-extrabold text-blue-700">{weather.current.temp_c}°C</p>
                  <p className="capitalize text-gray-700 mt-1">{weather.current.condition.text}</p>
                  <div className="mt-4 text-gray-600 text-sm space-y-1">
                    <p>💧 Humidity: {weather.current.humidity}%</p>
                    <p>🌬️ Wind: {weather.current.wind_kph} km/h</p>
                    <p>🌧️ Precip: {weather.current.precip_mm} mm</p>
                  </div>
                </div>
                <img src={weather.current.condition.icon} alt="Weather Icon" className="w-28" />
              </div>
            </Card>

            {/* Hourly Forecast Card */}
            <Card className="flex-1 p-6 shadow-2xl bg-white/90 rounded-2xl">
              <h3 className="mb-5 text-center text-3xl font-bold text-gray-800">Hourly Forecast</h3>
              <div className="flex overflow-x-auto gap-4 py-6 px-4  scrollbar-thin scrollbar-thumb-blue-500 ">
                {weather.forecast.forecastday[0].hour
                  .filter((_, index) => index % 3 === 0)
                  .map((hour, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center min-w-[100px] bg-blue-50 rounded-xl p-7 shadow hover:scale-105 transition"
                    >
                      <p className="text-sm text-gray-700 ">{formatTime(hour.time)}</p>
                      <img src={hour.condition.icon} alt="weather" className="w-10 h-10" />
                      <p className="font-semibold text-blue-600">{hour.temp_c}°</p>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
           <div className="flex flex-col lg:flex-row gap-6 mb-8 max-w-6xl mx-auto">
          {/* BOTTOM SECTION: 7-Day Forecast */}
          <Card className="flex-1 p-4 shadow-2xl bg-white/90 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">7-Day Forecast</h3>
            <div className="flex overflow-x-auto gap-5 py-4 scrollbar-thin scrollbar-thumb-blue-500">
              {weather.forecast.forecastday.map((day, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-blue-50 rounded-xl p-3 shadow hover:shadow-lg transition min-w-[140px]"
                >
                  <p className="font-bold text-lg text-gray-800">{getDayName(day.date)}</p>
                  <img src={day.day.condition.icon} alt="weather" className="w-14 h-14 my-2" />
                  <p className="text-gray-600 text-sm text-center">{day.day.condition.text}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="font-bold text-blue-700 text-lg">{Math.round(day.day.maxtemp_c)}°</span>
                    <span className="text-gray-500 text-lg">{Math.round(day.day.mintemp_c)}°</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">💧 {day.day.totalprecip_mm.toFixed(1)} mm</p>
                  <p className="text-xs text-gray-600">🌬 {day.day.maxwind_kph.toFixed(1)} km/h</p>
                </div>
              ))}
            </div>
          </Card>
          </div>
        </div>
      )}
    </div>
    
  );
}

export default App;
