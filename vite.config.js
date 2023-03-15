import { defineConfig } from 'vite'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'

export default defineConfig({
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },plugins: [nodePolyfills()]
});
