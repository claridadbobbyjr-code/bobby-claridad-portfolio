/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // '/' locally; the GitHub Pages build sets BASE_PATH=/bobby-claridad-portfolio/
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  build: { target: 'es2020', cssMinify: true },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    css: false,
  },
});
