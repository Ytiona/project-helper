import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// import commonjs from 'rollup-plugin-commonjs';
// import coffeescript  from 'rollup-plugin-coffee-script';
// import nodeResolve from 'rollup-plugin-node-resolve';
// import coffee from 'rollup-plugin-coffee-script';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  server: {
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
})
