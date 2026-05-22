import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        [env.VITE_API_PREFIX || '/api']: {
          target: env.VITE_API_BASE_URL || 'http://localhost:8081',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^\\${env.VITE_API_PREFIX || '/api'}`), '')
        }
      }
    }
  }
})