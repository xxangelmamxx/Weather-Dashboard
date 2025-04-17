import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const API_KEY = import.meta.env.VITE_APP_API_KEY;
const CITY = "New York";
const API_URL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${CITY}&key=${API_KEY}`;

const TempComparison = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeatherData() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setWeatherData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchWeatherData();
  }, []);

  if (loading) return <div className="glass-panel"><div className="loader">Loading...</div></div>;
  if (error) return <div className="glass-panel"><p>Error: {error}</p></div>;

  return (
    <div className="glass-panel">
      <h2>Temperature Comparison</h2>
      <BarChart width={600} height={300} data={weatherData}>
        <XAxis dataKey="datetime" stroke="#ffffff" />
        <YAxis stroke="#ffffff" />
        <Tooltip />
        <CartesianGrid stroke="#cccccc" strokeDasharray="5 5" />
        <Bar dataKey="temp" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default TempComparison;
