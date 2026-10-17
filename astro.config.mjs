import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  site: 'https://zainsaleem.co',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  vite: { plugins: [tailwindcss()], build: { assetsInlineLimit: 0 } },
})
