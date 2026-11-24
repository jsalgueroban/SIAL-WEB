import {resolve} from 'node:path';
export default {define:{'process.env.NODE_ENV':JSON.stringify('production')},build:{outDir:'shared/vendor',emptyOutDir:false,cssCodeSplit:false,lib:{entry:resolve('src/web/conmat-entry.jsx'),name:'SIALConmat',formats:['iife'],fileName:()=> 'conmat-panel.js',cssFileName:'conmat-panel'},rollupOptions:{onwarn(w,h){if(w.code!=='MODULE_LEVEL_DIRECTIVE')h(w);}}}};
