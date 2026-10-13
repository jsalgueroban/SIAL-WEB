import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

export default {
  root,
  define: {
    "process.env.NODE_ENV": JSON.stringify("production")
  },
  build: {
    outDir: resolve(root, "shared/vendor"),
    emptyOutDir: false,
    cssCodeSplit: false,
    sourcemap: false,
    lib: {
      entry: resolve(root, "src/web/main.jsx"),
      name: "SIALWebProposalUI",
      formats: ["iife"],
      fileName: () => "sial-ui-runtime.js",
      cssFileName: "sial-ui-runtime"
    },
    rollupOptions: {
      onwarn(warning, handler) {
        if (warning.code !== "MODULE_LEVEL_DIRECTIVE") handler(warning);
      },
      output: { assetFileNames: "[name][extname]" }
    }
  }
};
