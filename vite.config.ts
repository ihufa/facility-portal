import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      // The package export map appends .css twice, so Vite cannot load the weight files.
      '@fontsource/inter': fileURLToPath(new URL('./node_modules/@fontsource/inter', import.meta.url)),
    },
  },
  plugins: [
    react(),
    VitePWA({
      disable: process.env.VITEST === 'true',
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'images/*.jpg'],
      manifest: {
        name: 'Facility Portal',
        short_name: 'Portal',
        description: 'Facility portal for managing golf courses.',
        theme_color: '#2f2f2f',
        background_color: '#f5f5f6',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'logo.png',
            sizes: '113x113',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,woff2}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
