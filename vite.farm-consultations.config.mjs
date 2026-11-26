import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const root = dirname(fileURLToPath(import.meta.url));
export default { root, define: { "process.env.NODE_ENV": JSON.stringify("production") }, build: { outDir: resolve(root,'shared/vendor'), emptyOutDir:false, lib:{entry:resolve(root,'src/web/farm-consultations.jsx'),name:'SIALFarmConsultations',formats:['iife'],fileName:()=>'farm-consultations.js',cssFileName:'farm-consultations'} } };

