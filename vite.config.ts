import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.REACT_APP_CONTRACT_ADDRESS': JSON.stringify(env.REACT_APP_CONTRACT_ADDRESS),
      'process.env.REACT_APP_RPC_URL': JSON.stringify(env.REACT_APP_RPC_URL),
    }
  }
})
