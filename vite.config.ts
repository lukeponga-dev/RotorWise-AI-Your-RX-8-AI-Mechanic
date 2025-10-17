import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // 1. Load environment variables
    // loads variables from .env.* files into process.env
    const env = loadEnv(mode, '.', ''); 
    
    return {
      // 2. Server Configuration
      server: {
        port: 3000,
        host: '0.0.0.0', // Allows external access (needed for Docker/Render)
        // IMPORTANT: Add the host that was blocked
        allowedHosts: [
          'rx8chatbot.onrender.com',
          'localhost',
          '127.0.0.1',
          // You may want to include 'localhost' or '127.0.0.1' here as well
        ],
      },
      
      // 3. Plugins
      plugins: [react()],
      
      // 4. Define Global Constants
      // This exposes the GEMINI_API_KEY environment variable to the client-side code
      define: {
        // Expose the API key under common names
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      
      // 5. Module Resolution Configuration (Aliases)
      resolve: {
        alias: {
          // Sets '@' to resolve to the project root directory
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
