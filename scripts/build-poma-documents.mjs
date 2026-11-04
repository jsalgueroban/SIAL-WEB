// Artifact build only: source repositories are read-only; no backend requests.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const root=process.cwd();
const backend=process.env.SIAL_POMA_SOURCE||'D:/SIAL/Repos/sial/ms-track';
const source=path.join(backend,'src/infrastructure/documents/poma');
const req=createRequire(path.join(backend,'package.json'));
const ts=req('typescript'),Handlebars=req('handlebars'),puppeteer=req('puppeteer');
const cache=new Map();
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);const mod={exports:{}};cache.set(file,mod.exports);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;const localRequire=name=>{if(name==='@domain/exceptions')return {BusinessException:class extends Error{}};if(name==='@domain/rules/poma.rules')return {isFarmOriginRoute:type=>type!=='PORT_TO_FINAL_PORT'};if(name.startsWith('.')){const target=path.resolve(path.dirname(file),name);return name.endsWith('.json')?JSON.parse(fs.readFileSync(target,'utf8')):load(target+'.ts');}return req(name);};new Function('require','module','exports','__dirname','Buffer',code)(localRequire,mod,mod.exports,path.dirname(file),Buffer);return mod.exports;}
const {renderPomaHtml}=load(path.join(source,'poma_template.registry.ts'));
const fixtures=load(path.join(root,'src/web/security-product/fixtures.js'));
const out=path.join(root,'shared/poma');fs.mkdirSync(out,{recursive:true});
const browser=await puppeteer.launch({headless:true});
const report=[];
try{for(const row of fixtures.loadings){const detail=fixtures.loadingDetail(row.loadingId),model=structuredClone(detail.document);model.templateVersion=row.loadingType==='TRUCK'?'POMA-TRUCK-V1':'POMA-CONTAINER-V1';model.routeType=row.routeType||'FARM_TO_PORT';model.origin.locationCode=model.origin.locationCode||'-';model.authorization={supervisor:{name:''}};
if(row.loadingId==='snapshot-poma-64'){const extra=JSON.parse(fs.readFileSync(path.join(out,'real-document-fields.json'),'utf8'));for(const key of ['origin','transport','dispatch','loading'])Object.assign(model[key],extra[key]);model.authorization=extra.authorization;model.signature=extra.signature;}model.loading.pallets.forEach(p=>{if(p.composition.length===1)p.composition[0].boxQuantity=p.boxQuantity;});
// Missing snapshot fields remain absent: never invent OTP signatures, authorizers or operation times.
let html=renderPomaHtml(model);html=html.replace('<head>','<head><title>POMA - Remisión de carga - Demostración</title>');html=html.replace('</style>','\n.proposal-watermark{position:fixed;bottom:1mm;left:6mm;font:7px Arial;color:#555;z-index:20}\n</style>').replace('<body>','<body><div class="proposal-watermark">PROPUESTA DE DEMOSTRACIÓN · SIN VALIDEZ OPERATIVA · DATOS NO DISPONIBLES: —</div>');
fs.writeFileSync(path.join(out,row.loadingId+'.html'),html);
const page=await browser.newPage();await page.setContent(html,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);await page.pdf({path:path.join(out,row.loadingId+'.pdf'),format:'Letter',landscape:false,printBackground:true,preferCSSPageSize:true});
report.push({loadingId:row.loadingId,pallets:model.loading.pallets.length,template:model.templateVersion});await page.close();}
}finally{await browser.close();}
const files=['poma_v1.template.ts','poma_v1.styles.ts','poma_official.view_model.ts','gs1_128_barcode.generator.ts'];fs.writeFileSync(path.join(out,'source-manifest.json'),JSON.stringify({source:backend,files:files.map(name=>({name,sha256:createHash('sha256').update(fs.readFileSync(path.join(source,name))).digest('hex')})),cases:report},null,2));console.log(report);
