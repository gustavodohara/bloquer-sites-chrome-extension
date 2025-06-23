import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "public/warning",
          dest: "",
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        // Popup principal
        main: resolve(__dirname, "index.html"),
        // Background script
        background: resolve(__dirname, "src/background/background.ts"),
      },
      output: {
        // Deja el background en la raíz de dist
        entryFileNames: (assetInfo) => {
          if (assetInfo.name === "background") return "background.js";
          return "[name].js";
        },
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
