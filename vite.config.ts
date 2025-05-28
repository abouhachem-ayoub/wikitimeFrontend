import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), glsl(), tsconfigPaths()],
  publicDir: "public",
  base: "/wikit/",  // Ensure this matches your repository name
  optimizeDeps: {
    include: ["simplex-noise"],
  },
  build: {
    outDir: "dist",  // Custom output directory
    rollupOptions: {
      // external: ['dayjs/plugin/bigIntSupport']
    }
  }
});
