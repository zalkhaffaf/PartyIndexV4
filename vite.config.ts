import { defineConfig } from 'vite';
import dynamicImport from '@rollup/plugin-dynamic-import-vars';

export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [dynamicImport()],
      output: {
        manualChunks: {
          'vendor': ['date-fns'],
          'supabase': ['@supabase/supabase-js']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['date-fns', '@supabase/supabase-js']
  }
});