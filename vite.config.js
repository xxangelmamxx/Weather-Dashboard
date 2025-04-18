// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  preview: {
    host: '0.0.0.0',       // make sure it listens on all interfaces
    port: Number(process.env.PORT) || 4173,
    allowedHosts: [
      'weather-dashboard-jqbp.onrender.com',  // Render public host
    ]
  }
})