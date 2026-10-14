import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { detailTractomula } from "../src/web/tractomula-detail.js";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "../Gestion de Transporte/assets/tractomula.glb");
const target = resolve(here, "../Gestion de Transporte/assets/tractomula-detallada.glb");

// GLTFExporter uses the browser FileReader API for its binary chunk assembly.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buffer => {
      this.result = buffer;
      this.onloadend?.();
    }).catch(error => this.onerror?.(error));
  }
};

const data = await readFile(source);
const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
const imported = await new GLTFLoader().parseAsync(buffer, "");
detailTractomula(imported.scene);
const exported = await new GLTFExporter().parseAsync(imported.scene, { binary: true, onlyVisible: true });
await writeFile(target, Buffer.from(exported));
console.log(`Tractomula detallada: ${target} (${(exported.byteLength / 1048576).toFixed(2)} MiB)`);
