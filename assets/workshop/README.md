# Recursos abiertos del taller

**Archivo histórico, retirado del render actual.** A petición del usuario se sustituyeron estos modelos y texturas por geometría y efectos desarrollados en el proyecto. El manifiesto vigente está en `assets/workshop-authored/manifest.json`; se conservan aquí los originales y sus créditos para no perder su procedencia.

Fecha de verificación: 2026-10-30. Créditos visibles: `Errores/recursos-taller.html`.

- Yunque GLB: Innerscene, original CC0. https://www.innerscene.com/tools/library/3d-parts/low-poly-medieval-anvil-5fd39d9e . Descargado mediante su enlace público en navegador; el acceso de terminal devolvía 403. `node scripts/project-workshop-model.mjs` proyecta sus 28 caras visibles a SVG con iluminación y material SIAL. No es un yunque dibujado a partir de una captura.
- Gafas: **Steampunk goggles**, **Delapouite**, Game-icons.net. https://game-icons.net/1x1/delapouite/steampunk-goggles.html . **CC BY 3.0**, https://creativecommons.org/licenses/by/3.0/ . Se conserva su geometría; cambios en montura, lentes, materiales, color, escala y encaje. El fondo negro del icono original se excluye del render.
- Humo, llama y chispa: **Kenney Particle Pack**, **CC0**. https://kenney.nl/assets/particle-pack . Copia distribuida por https://github.com/Calinou/kenney-particle-pack . Licencia adjunta. Máscaras de luminancia, tintado y coreografía propios; no se cambia el archivo original.
- `anvil.svg` de **Lorc**, https://game-icons.net/1x1/lorc/anvil.html , **CC BY 3.0**: consultado/descargado, descartado del render a favor del modelo 3D. Las otras tres texturas PNG conservadas se descargaron en la misma selección, pero no se cargan en la escena.

Los recursos FreeSVG se evaluaron pero no se incorporaron: sus descargas no estuvieron disponibles. `sources.json` contiene origen, autor, licencia, uso y hashes. No se incorpora código remoto ejecutable. El maestro de Bananito y la marca son fuentes existentes de SIAL y no pertenecen a estos paquetes externos.
