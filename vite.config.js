import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env': {}
  },
  server: {
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  }
})
