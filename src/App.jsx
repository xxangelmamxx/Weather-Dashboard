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
// Predefined list of cities for dropdown
const CITIES = [
  'New York',
  'Los Angeles',
  'Chicago',
  'London',
  'Tokyo',
  'Paris',
  'Berlin',
  'Sydney',
  'Moscow',
  'Beijing',
  'Gaborone',
  'New Delhi'
];

function App() {
  // Initialize city from localStorage or default to New York
  const [city, setCity] = useState(() => localStorage.getItem('city') || 'New York');
  const [weatherData, setWeatherData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [tempFilter, setTempFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Show popup on error
  useEffect(() => {
    if (error) {
      alert(error);
      setError(null);
    }
  }, [error]);

  // Update city selection and persist
  const updateCity = (newCity) => {
    setCity(newCity);
    localStorage.setItem('city', newCity);
  };

  // Fetch weather data when city changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${encodeURIComponent(city)}&key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Could not fetch weather for ${city}`);
        const data = await response.json();
        if (!data.data || data.data.length === 0) throw new Error(`No data available for ${city}`);
        setWeatherData(data.data);
      } catch (err) {
        setError(err.message);
        setWeatherData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [city]);

  // Filtered forecast including weekday
  const filteredData = weatherData
    .filter(item => {
      const query = searchInput.toLowerCase();
      const weekday = new Date(item.datetime)
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toLowerCase();
      return (
        item.datetime.toLowerCase().includes(query) ||
        item.weather.description.toLowerCase().includes(query) ||
        weekday.includes(query)
      );
    })
    .filter(item => tempFilter === "" || item.temp >= Number(tempFilter));

  // Summary stats
  const totalItems = filteredData.length;
  const meanTemp = totalItems > 0
    ? filteredData.reduce((sum, d) => sum + d.temp, 0) / totalItems
    : 0;
  const maxTemp = totalItems > 0
    ? Math.max(...filteredData.map(d => d.temp))
    : 0;

  if (loading) return <div className="app-container"><div className="loader">Loading...</div></div>;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Weather Dashboard – {city}</h1>
      </header>

      {/* City Selector Dropdown */}
      <section
        className="city-select glass-panel"
        style={{ width: '260px', margin: '1rem 0 0 0' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="city-dropdown">City:</label>
          <select
            id="city-dropdown"
            value={city}
            onChange={e => updateCity(e.target.value)}
            className="search-input"
            style={{ width: '150px' }}
          >
            {CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="summary">
        <div className="stat glass-panel">
          <h2>{totalItems}</h2>
          <p>Matching Days</p>
        </div>
        <div className="stat glass-panel">
          <h2>{meanTemp.toFixed(2)}°C</h2>
          <p>Average Temp</p>
        </div>
        <div className="stat glass-panel">
          <h2>{maxTemp}°C</h2>
          <p>Max Temp</p>
        </div>
      </section>

      {/* Filters */}
      <section className="filters glass-panel">
        <div>
          <label>Search:</label>
          <input
            type="text"
            placeholder="Date, description, or weekday"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="search-input"
          />
        </div>
        <div>
          <label>Min Temp:</label>
          <input
            type="number"
            placeholder="Min Temperature"
            value={tempFilter}
            onChange={e => setTempFilter(e.target.value)}
            className="filter-input"
          />
        </div>
      </section>

      {/* Dashboard Cards & Charts */}
      <section className="dashboard-main">
        <div className="cards-container glass-panel">
          <h2>Forecast Cards</h2>
          <div className="dashboard-list">
            {filteredData.map(item => {
              const weekday = new Date(item.datetime)
                .toLocaleDateString('en-US', { weekday: 'long' });
              return (
                <Link
                  key={item.datetime}
                  to={`/detail/${item.datetime}`}
                  state={{ forecast: item, city }}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="card glass-panel">
                    <p className="weekday" style={{ textAlign: 'left' }}>
                      <strong>{weekday}</strong>
                    </p>
                    <div style={{ textAlign: 'right', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      <h3 style={{ fontWeight: 'normal', margin: '0.25rem 0' }}>{item.datetime}</h3>
                      <p style={{ margin: '0.25rem 0' }}>{item.weather.description}</p>
                      <p style={{ margin: '0.25rem 0' }}><strong>Temp:</strong> {item.temp}°C</p>
                    </div>
                  </div>
                </Link>
              );
            })}
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