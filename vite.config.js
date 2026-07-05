import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // The Azure Speech SDK ships a UMD 'browser' bundle that has no proper
    // ESM exports. By preferring 'module' then 'main', Vite uses the CJS
    // entry instead, which esbuild can convert to a proper ESM namespace.
    mainFields: ['module', 'main'],
  },
  optimizeDeps: {
    // Force esbuild to pre-bundle the CJS entry so all SpeechSDK.* names
    // are available on the namespace import at runtime.
    include: ['microsoft-cognitiveservices-speech-sdk'],
  },
})

