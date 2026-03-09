import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/shared"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  build: {
    // Enable source maps in development for better debugging
    sourcemap: mode === 'development',
    // Configure chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and related libraries
          'react-vendor': ['react', 'react-dom'],
          // State management chunk
          'state-vendor': ['@reduxjs/toolkit', 'react-redux', '@tanstack/react-query'],
          // UI library chunk
          'ui-vendor': ['react-router-dom'],
        },
      },
    },
    // Bundle size warnings and limits
    chunkSizeWarningLimit: 600, // Warn if chunks exceed 600kb
  },
  // Enable build analysis in analyze mode
  ...(mode === 'analyze' && {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'state-vendor': ['@reduxjs/toolkit', 'react-redux', '@tanstack/react-query'],
            'ui-vendor': ['react-router-dom'],
          },
        },
      },
    },
  }),
}));
