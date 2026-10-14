import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

export default {
  root,
  build: {
    outDir: resolve(root, "shared/vendor"),
    emptyOutDir: false,
    sourcemap: false,
    lib: {
      entry: resolve(root, "src/web/vehicle-viewer.js"),
      name: "SIALVehicleViewer",
      formats: ["iife"],
      fileName: () => "sial-vehicle-viewer.js"
    }
  }
};
