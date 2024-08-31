import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    /* for local ssl setting */
    https: {
      // key: fs.readFileSync('./keitomatsuri.example.com-key.pem'),
      // cert: fs.readFileSync('./keitomatsuri.example.com.pem'),
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
