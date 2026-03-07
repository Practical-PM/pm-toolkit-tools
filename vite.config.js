import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/tools/',
  resolve: {
    preserveSymlinks: true,
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: '../dist/tools',
    emptyOutDir: true,
    rollupOptions: {
      external: [],
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    exclude: ['@toolkit-pm/design-system'],
    esbuildOptions: {
      jsx: 'automatic',
    },
  },
  server: {
    watch: {
      ignored: ['!**/packages/toolkit-pm-design-system/**'],
    },
  },
})
