import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Op GitHub Pages draait de site onder /xpsr-studio-react/ (zie .github/workflows/pages.yml).
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/xpsr-studio-react/' : '/',
  plugins: [react()],
})
