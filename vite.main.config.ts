import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['sql.js'],
    },
  },
  plugins: [
    {
      name: 'copy-wasm',
      buildStart() {
        // This runs in both dev and production builds
        console.log("dir_name: ", __dirname);
        const src = path.resolve(__dirname, 'node_modules/sql.js/dist/sql-wasm.wasm');
        
        // For development, copy to .vite/build/
        const devDest = path.resolve(__dirname, '.vite/build/sql-wasm.wasm');
        
        // Ensure directory exists
        const devDestDir = path.dirname(devDest);
        if (!fs.existsSync(devDestDir)) {
          fs.mkdirSync(devDestDir, { recursive: true });
        }
        
        // Copy the file
        fs.copyFileSync(src, devDest);
        console.log('✓ Copied sql-wasm.wasm to .vite/build/');
      },
      closeBundle() {
        // Also copy to main directory for production build
        const src = path.resolve(__dirname, 'node_modules/sql.js/dist/sql-wasm.wasm');
        const prodDest = path.resolve(__dirname, '.vite/build/main/sql-wasm.wasm');
        
        const prodDestDir = path.dirname(prodDest);
        if (!fs.existsSync(prodDestDir)) {
          fs.mkdirSync(prodDestDir, { recursive: true });
        }
        
        fs.copyFileSync(src, prodDest);
        console.log('✓ Copied sql-wasm.wasm to .vite/build/main/');
      }
    }
  ]
});