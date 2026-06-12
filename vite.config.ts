import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const externalPackages = new Set(["lit", "react", "react-dom", "react/jsx-runtime"]);

function isExternal(id: string) {
  return [...externalPackages].some((packageName) => {
    return id === packageName || id.startsWith(`${packageName}/`);
  });
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: "src",
      exclude: ["playground", "src/cdn.ts"],
      include: ["src"],
      tsconfigPath: "./tsconfig.lib.json",
    }),
  ],
  build: {
    lib: {
      entry: {
        index: path.resolve(rootDir, "src/index.ts"),
        react: path.resolve(rootDir, "src/react.ts"),
        register: path.resolve(rootDir, "src/register.ts"),
      },
      formats: ["es"],
    },
    minify: false,
    rollupOptions: {
      external: isExternal,
      output: {
        entryFileNames: "[name].js",
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    },
    sourcemap: true,
    target: "es2022",
  },
});
