import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false, // Disable the error overlay
    },
    watch: {
      // Reduce file system watching sensitivity
      usePolling: false,
      interval: 1000,
    },
  },
  plugins: [
    react(),
    // Only use componentTagger in production
    process.env.NODE_ENV === 'production' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    // Force Vite to pre-bundle these dependencies
    include: ['react', 'react-dom', '@radix-ui/react-icons'],
  },
});
