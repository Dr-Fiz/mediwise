// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// IMPORTANT: set `base` to "/<your-repo-name>/"
// Example below assumes the repo is named "mediwise"
export default defineConfig({
  base: '/mediwise/',
  plugins: [react(), tailwind()],
})
