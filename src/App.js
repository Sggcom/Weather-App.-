import React, { useState, useEffect } from "react";
import axios from "axios";
import { useWeatherQuery } from "./useWeatherQuery";

 const API_KEY ="1cb58c1f6189475381a71419250508"
const fetchWeather = async (city) => {
  const response = await axios.get(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=14&aqi=no&alerts=no`
  );
  return response.data;
};
function App()
 {
   const [city, setCity] = useState("");
   const [autoFetchCity, setAutoFetchCity] = useState("");
   const { data, isError, error, isLoading, refetch } = useWeatherQuery(city);

   useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      try {
        const res = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=14&aqi=no&alerts=no`);
        const cityName = `${res.data.location.name}, ${res.data.location.country}`;
        setCity(cityName);
      } catch (err) {
        console.error("Error fetching weather by location", err);
      }
    },
    (error) => {
      console.error("Location access denied:", error);
    }
  );
}, []);

  
  return (
       <div className=" min-h-screen bg-gradient-to-br from-blue-500 via-pink-400 via-pink-400 to-blue-600 p-6">
        <h1 className="text-center text-white/90 lg:text-5xl text-2xl md:text-3xl font-extrabold mt-5">☀️Weather App🌈</h1>
        <div className="flex gap-3 justify-center mt-6 ">
          <input placeholder="Search Country or City..." type="text"
            value={city} 
           onChange={(a) => setCity(a.target.value)}
          className="border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-[350px] lg:w-[400px] pl-2 bg-white/80 " >
          </input>
          <button className="bg-blue-600 rounded w-20 focus:outline-none focus:ring-2 focus:ring-blue-300 text-white"
          onClick={() => refetch()}
          onKeyDown={(e) => {
    if (e.key === "Enter") {
      refetch();
    }
  }}>
            Search
          </button>
        </div>
        {isLoading && <p className="text-center text-gray-900 mt-5">Loading...</p>}
        {isError && <p className="text-center text-red-600 mt-5">cannot find..</p>}

        {data && !isLoading &&(
        <div className="flex mt-20  mb-10 rounded lg:py-10 lg:flex-row flex-col lg:p-20 gap-10">
        <div className="bg-white flex flex-col md:flex-row  rounded-2xl md:pt-6 md:pb-8 shadow-2xl bg-white/70 p-10 ">
        <div>
             <h2 className="text-3xl text-blue-600 font-bold mb-6 ">{data.location.name}, {data.location.country}</h2>
           
             <p className="text-gray-700 mt-1 text-lg font-semibold">🌡️{data.current.temp_c}°C - {data.current.condition.text}</p>
             
              <p className="text-gray-500 mt-1">💧 Humidity: {data.current.humidity}%</p>
            <p className="text-gray-500 mt-1">🌪️ Wind: {data.current.wind_kph} km/h</p>
            <p className="text-gray-500 mt-1" >🌧️ Precip: {data.current.precip_mm} mm</p>
              <p className="text-gray-500 mt-1">
                           {new Date(data.location.localtime).toLocaleDateString("en-US", {
                           weekday: "long",
                            year: "numeric",
                             month: "long",
                             day: "numeric",
                            })}            
                           </p>
            </div>
            <img
                   src={data.current.condition.icon}
                      alt="weather icon"
                          className="lg:w-[130px] lg:[130px] md:w-[160px] md:ml-20 lg:ml-6 lg:mt-10 lg:mr-6"/>
         </div>
         
         <div className="bg-white flex-1 flex-col border-2xl border-gray-200 rounded-2xl shadow-2xl bg-white/70 py-4 lg:px-4 lg:w-[70vh] ">
            <h2 className="text-2xl text-blue-600 font-bold text-center">Hourly forecast</h2>
         
         <div className="flex gap-3 py-6 px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500">
              {data.forecast.forecastday[0].hour.map((hourData, index) => (
               <div key={index} className="flex flex-col items-center min-w-[122px] bg-blue-50 rounded-xl p-2 shadow hover:scale-105 transition">
                <p className="text-sm font-bold text-gray-700 ">{new Date(hourData.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <img src={hourData.condition.icon} alt="icon" className="w-10 h-10" />
               <p className="text-sm font-bold text-gray-600">{hourData.temp_c}°C</p>
              <p className="text-sm text-gray-600 text-center">{hourData.condition.text}</p>
             </div>
              ))}
         </div>
       </div>
       
    </div>
        )}
        {data && !isLoading &&(
        <div className="flex  rounded  lg:flex-row flex-col lg:p-20 gap-10">
     <div className="bg-white flex flex-col rounded-2xl pt-6 pb-3 shadow-2xl bg-white/70 lg:p-5  lg:w-[174.5vh]">
     <h2 className="text-2xl text-blue-600 font-bold text-center">Daily Forecast</h2>
         <div className="flex gap-4 py-5 px-4 flex-row overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500">
      {data?.forecast?.forecastday?.map((day, index) => (
          <div key={index} className="flex flex-col items-center min-w-[150px] bg-blue-50 rounded-xl p-3 shadow hover:scale-105 transition">
         <p className="font-semibold">{new Date(day.date).toLocaleDateString("en-US", { weekday: "long" })}</p>
        <img src={day.day.condition.icon} alt="icon" className="w-20 h-20" />
        <p className="text-center text-sm text-gray-600">{day.day.condition.text}</p>
        <p className="text-center text-sm text-gray-700">Max:🌡️{day.day.maxtemp_c}°C</p>
        <p className="text-center text-sm text-gray-700">Min:❄️ {day.day.mintemp_c}°C </p>
        </div>
     ))}
     </div>
     </div>

     </div>
        )}
      </div>
    
  );
}
export default App;
