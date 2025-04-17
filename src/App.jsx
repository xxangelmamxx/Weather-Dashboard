import React, { useState, useEffect } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const API_KEY = import.meta.env.VITE_APP_API_KEY;
const CITY = "New York";
const API_URL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${CITY}&key=${API_KEY}`;

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [tempFilter, setTempFilter] = useState("");
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

  const filteredData = weatherData
    .filter(item => {
      const searchLower = searchInput.toLowerCase();
      return (
        item.datetime.toLowerCase().includes(searchLower) ||
        item.weather.description.toLowerCase().includes(searchLower)
      );
    })
    .filter(item => {
      if (tempFilter === "") return true;
      return item.temp >= Number(tempFilter);
    });

  const totalItems = weatherData.length;
  const meanTemp = totalItems > 0
    ? weatherData.reduce((acc, curr) => acc + curr.temp, 0) / totalItems
    : 0;
  const maxTemp = totalItems > 0
    ? weatherData.reduce((acc, curr) => (curr.temp > acc ? curr.temp : acc), -Infinity)
    : 0;

  if (loading) {
    return (
      <div className="app-container">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Weather Dashboard - {CITY} 🗽</h1>
      </header>

      <section className="summary">
        <div className="stat glass-panel">
          <h2>{totalItems}</h2>
          <p>Total Forecast Days</p>
        </div>
        <div className="stat glass-panel">
          <h2>{meanTemp.toFixed(2)}°C</h2>
          <p>Mean Temperature</p>
        </div>
        <div className="stat glass-panel">
          <h2>{maxTemp}°C</h2>
          <p>Max Temperature</p>
        </div>
      </section>

      <section className="filters glass-panel">
        <div>
          <label>Search:</label>
          <input
            type="text"
            placeholder="Date or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
        </div>
        <div>
          <label>Min Temp:</label>
          <input
            type="number"
            placeholder="Min Temperature"
            value={tempFilter}
            onChange={(e) => setTempFilter(e.target.value)}
            className="filter-input"
          />
        </div>
      </section>

      <section className="dashboard-main">
        <div className="cards-container glass-panel">
          <h2>Forecast Cards</h2>
          <div className="dashboard-list">
            {filteredData.length > 0 ? (
              filteredData.map(item => (
                <Link
                  key={item.datetime}
                  to={`/detail/${item.datetime}`}
                  state={{ forecast: item }}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="card glass-panel">
                    <h3>{item.datetime}</h3>
                    <p>{item.weather.description}</p>
                    <p>
                      <strong>Temp:</strong> {item.temp}°C
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p>No results found.</p>
            )}
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-container glass-panel">
            <h2>Temperature Trend</h2>
            <LineChart width={400} height={200} data={weatherData}>
              <XAxis dataKey="datetime" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip />
              <CartesianGrid stroke="#cccccc" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="temp" stroke="#ffcf00" />
            </LineChart>
          </div>
          <div className="chart-container glass-panel">
            <h2>Temperature Comparison</h2>
            <BarChart width={400} height={200} data={weatherData}>
              <XAxis dataKey="datetime" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip />
              <CartesianGrid stroke="#cccccc" strokeDasharray="5 5" />
              <Bar dataKey="temp" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
