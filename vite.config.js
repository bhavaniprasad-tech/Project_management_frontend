import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// Load env variables from .env file
dotenv.config()

// Get API URL
const API_URL = process.env.VITE_API_URL

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/auth': {
        target: API_URL,
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: API_URL,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
