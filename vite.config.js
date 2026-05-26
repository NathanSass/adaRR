import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    proxy: {
      '/finddoor': 'http://localhost:5000',
      '/chooseToiletLocation': 'http://localhost:5000'
    }
  }
})
