import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" makes the built files work from any folder or sub-path
// (company web server, SharePoint-style paths, GitHub Pages project sites).
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: { port: 5173, open: true },
  preview: { port: 4173, open: true },
  build: { outDir: "dist", sourcemap: false },
});
