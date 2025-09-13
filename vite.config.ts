import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    return {
      define: {
        'process.env.GEMINI_API_KEY': JSON.stringify('AIzaSyBYbv_Ma81mJqqtHLTLbk3FD9ewq9lEQqw')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
