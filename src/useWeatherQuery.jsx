// useWeatherQuery.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_KEY = "1cb58c1f6189475381a71419250508";

const fetchWeather = async (city) => {
  const response = await axios.get(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=14&aqi=no&alerts=no`
  );
  return response.data;
};

export const useWeatherQuery = (city) => {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: () => fetchWeather(city),
    enabled: !!city, // only fetch if city is not empty
  });
};
