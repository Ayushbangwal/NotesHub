import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

// ✅ Ek helper function
function copyPdfWorker() {
  try {
    mkdirSync('public', { recursive: true })
    copyFileSync(
      'node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
      'public/pdf.worker.min.mjs'
    )
    console.log('✅ PDF worker copied to public/')
  } catch (e) {
    console.warn('⚠️ PDF worker copy failed:', e.message)
  }
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-pdf-worker',
      buildStart() { copyPdfWorker() },      // ✅ production build ke liye
      configureServer() { copyPdfWorker() }  // ✅ dev server ke liye
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})