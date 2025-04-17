import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const API_KEY = import.meta.env.VITE_APP_API_KEY;

export default function TempTrend() {
  const location = useLocation();
  const cityFromState = location.state?.city;
  const city = cityFromState || localStorage.getItem('city') || 'New York';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // persist city whenever we land here
    localStorage.setItem('city', city);
    fetch(
      `https://api.weatherbit.io/v2.0/forecast/daily?city=${encodeURIComponent(city)}&key=${API_KEY}`
    )
      .then(res => res.json())
      .then(json => setData(json.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [city]);

  if (loading) return <p>Loading trend…</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>7‑Day Trend for {city}</h2>
      <LineChart width={700} height={300} data={data}>
        <XAxis dataKey="datetime" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip />
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
        <Line type="monotone" dataKey="temp" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}
