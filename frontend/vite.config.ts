import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    // 開発時は /api をバックエンドへ中継し、本番（Vercel rewrites）と同じ「同一オリジン」構成にする。
    // これにより認証 Cookie がそのまま使える。
    proxy: {
      '/api': 'http://localhost:5094',
    },
  },
})
