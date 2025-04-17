import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const API_KEY = import.meta.env.VITE_APP_API_KEY;

export default function DetailView() {
  const { datetime } = useParams();
  const location = useLocation();
  const forecast = location.state?.forecast;
  const cityFromState = location.state?.city;
  const city = cityFromState || localStorage.getItem('city') || 'New York';

  const [detailData, setDetailData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('city', city);
    if (!forecast) {
      setLoading(false);
      return;
    }
    const url = `https://api.weatherbit.io/v2.0/forecast/hourly?city=${encodeURIComponent(
      city
    )}&key=${API_KEY}&hours=24`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const hourly = data.data || [];
        const filtered = hourly.filter(item =>
          item.timestamp_local.startsWith(forecast.datetime)
        );
        setDetailData(
          filtered.map(item => ({
            time: item.timestamp_local.split('T')[1].slice(0, 5),
            temp: item.temp,
          }))
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [city, forecast]);

  if (!forecast) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>No forecast for {datetime}</h2>
        <Link to="/">← Back</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/">← Back to {city}</Link>
      <h2>
        {city} – {forecast.datetime}
      </h2>
      <p>{forecast.weather.description}</p>

      <h3>Hourly Temperature Trend</h3>
      {loading ? (
        <p>Loading…</p>
      ) : detailData.length > 0 ? (
        <LineChart width={700} height={300} data={detailData}>
          <XAxis dataKey="time" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="temp" stroke="#ff7300" />
        </LineChart>
      ) : (
        <p>No hourly data available.</p>
      )}
    </div>
  );
}
