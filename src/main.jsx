import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

import Layout from './routes/Layout.jsx';
import DetailView from './routes/DetailView.jsx';
import NotFound from './routes/NotFound.jsx';
import TempTrend from './routes/TempTrend.jsx';
import TempComparison from './routes/TempComparison.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="detail/:datetime" element={<DetailView />} />
          <Route path="trend" element={<TempTrend />} />
          <Route path="comparison" element={<TempComparison />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
