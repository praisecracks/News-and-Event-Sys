import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  base: process.env.VITE_BASE_PATH || '/',
=======
  base: process.env.VITE_BASE_PATH || '/home',
>>>>>>> origin/main
})
