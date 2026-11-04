import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { build } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = process.argv[2] || process.env.SIAL_WEB_LIBRARY_PREVIEW;
const studio = process.argv[3] || process.env.SIAL_REMOTION_PREVIEW;
if (!studio) throw new Error("Indica también la raíz del proyecto Remotion recuperado como tercer argumento.");
const remotionInfo = JSON.parse(await readFile(resolve(studio, 'node_modules/remotion/package.json'), 'utf8'));
if (!source) throw new Error("Indica la raíz del checkout de librería ya compilado: npm run build:mascot-preview -- <ruta>");
const entry = resolve(source, "dist/banasan-ui.js");
const stylesheet = resolve(source, "src/components/Mascot/mascot.css");
const packageInfo = JSON.parse(await readFile(resolve(source, "package.json"), "utf8"));
const digest = async (path) => createHash("sha256").update(await readFile(path)).digest("hex");

await build({
  configFile: false,
  root,
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: { "@sial/mascot-preview": entry, "@sial/mascot-preview-style": stylesheet,
      "@remotion/player": resolve(studio, 'node_modules/@remotion/player/dist/esm/index.mjs'),
      "remotion/no-react": resolve(studio, 'node_modules/remotion/dist/esm/no-react.mjs'),
      "remotion": resolve(studio, 'node_modules/remotion/dist/esm/index.mjs') }
  },
  build: {
    outDir: resolve(root, "shared/vendor"),
    emptyOutDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      onwarn(warning, handler) {
        if (warning.code !== "MODULE_LEVEL_DIRECTIVE") handler(warning);
      }
    },
    lib: {
      entry: resolve(root, "src/web/mascot-preview.jsx"),
      name: "SIALMascotPreview",
      formats: ["iife"],
      fileName: () => "sial-mascot-preview.js",
      cssFileName: "sial-mascot-preview"
    }
  }
});

await writeFile(resolve(root, "shared/vendor/sial-mascot-preview.provenance.json"), JSON.stringify({
  package: packageInfo.name,
  version: packageInfo.version,
  published: false,
  source: "christmas-isotype: local build preview",
  entrySha256: await digest(entry),
  stylesheetSha256: await digest(stylesheet),
  animationEngine: `Remotion Player ${remotionInfo.version}`,
  sessionMasterSha256: await digest(resolve(root, 'src/web/session-master.json')),
  builtAt: new Date().toISOString()
}, null, 2) + "\n");
