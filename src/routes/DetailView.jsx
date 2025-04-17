import React from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const DetailView = () => {
  const { datetime } = useParams();
  const location = useLocation();
  const forecast = location.state?.forecast;

  if (!forecast) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Detail View</h2>
        <p>No forecast data available for {datetime}.</p>
        <p>
          Please go back to <Link to="/">Dashboard</Link> and select a forecast.
        </p>
      </div>
    );
  }

  const detailData = [
    { time: "Morning", temp: forecast.temp - 2 },
    { time: "Noon", temp: forecast.temp },
    { time: "Evening", temp: forecast.temp + 1 },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "800px" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "6px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <h2>Detail for {forecast.datetime}</h2>
        <p>{forecast.weather.description}</p>
        <p>
          <strong>Temperature:</strong> {forecast.temp}°C
        </p>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "6px",
          padding: "1rem",
        }}
      >
        <h3>Temperature Throughout the Day</h3>
        <LineChart width={500} height={300} data={detailData}>
          <XAxis dataKey="time" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="temp" stroke="#ff7300" />
        </LineChart>
      </div>
    </div>
  );
};

export default DetailView;
