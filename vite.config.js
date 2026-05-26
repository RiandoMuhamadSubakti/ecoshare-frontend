// ============================================
// VITE.CONFIG.JS - Konfigurasi Vite + Vue
// Dibuat oleh: Riando Muhamad Subakti
// Universitas Dian Nusantara
// ============================================

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      // Forward semua request /api ke backend Node.js
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})