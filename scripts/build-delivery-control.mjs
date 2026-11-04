import {build} from 'vite';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
await build({
  root,configFile:false,
  define:{'process.env.NODE_ENV':JSON.stringify('production')},
  build:{
    outDir:resolve(root,'shared/vendor'),emptyOutDir:false,
    lib:{entry:resolve(root,'src/web/materials-delivery-control-entry.jsx'),name:'SIALDocumentDashboard',formats:['iife'],fileName:()=> 'sial-delivery-control.js'},
    rollupOptions:{onwarn(warning,handler){if(warning.code!=='MODULE_LEVEL_DIRECTIVE')handler(warning);}}
  }
});
