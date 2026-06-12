import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: path.resolve(rootDir, "src/cdn.ts"),
      fileName: () => "murga-components.js",
      formats: ["es"],
    },
    minify: "esbuild",
    outDir: path.resolve(rootDir, "cdn-dist/.bundle"),
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    sourcemap: false,
    target: "es2022",
  },
});
