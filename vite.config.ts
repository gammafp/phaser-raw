import { defineConfig } from 'vite'
import commonjs from 'vite-plugin-commonjs'

export default defineConfig({
  plugins: [
    commonjs()
  ],
  build: {
    commonjsOptions: {
      include: [/src\/phaser\/.*/, /node_modules/],
      transformMixedEsModules: true
    },
  },
  optimizeDeps: {
    include: ['src/phaser/**/*']
  },
  resolve: {
    alias: {
      'require': 'vite-plugin-commonjs'
    }
  }
}) 