import {savePomaDocument,downloadPomaDocument} from './poma-document-store';
// Simulation boundary only. Product view structure remains in the copied TSX.
import React, {useSyncExternalStore} from 'react';
import {useToast as useLibraryToast} from '@banasandev/banasan-ui';
import {demoWeek, loadings, loadingDetail} from './fixtures';
export * from './operational-audit-filters';
export * from './vehicle-operational-audit-filters';
export * from './poma.mapper';
export * from './poma-formatters';
export * from './use-poma-generation';
export * from './use-has-poma-for-dispatch';
export * from './poma-dispatch-download-button';

let revision=0;
const listeners=new Set();
const publish=()=>{revision++;listeners.forEach(fn=>fn());};
window.addEventListener('popstate',publish);
const subscribe=fn=>{listeners.add(fn);return()=>listeners.delete(fn);};
const snapshot=()=>location.search+'|'+revision;
const setParams=values=>{const url=new URL(location.href);Object.entries(values).forEach(([k,v])=>v===undefined?url.searchParams.delete(k):url.searchParams.set(k,String(v)));history.replaceState(null,'',url);publish();};
const setParam=(key,value)=>setParams({[key]:value});
export function useQueryParams(){const version=useSyncExternalStore(subscribe,snapshot);return {params:React.useMemo(()=>new URLSearchParams(location.search),[version]),setParams,setParam,version};}
const router={refresh:publish};
export function useRouter(){return router;}
// The proposal deliberately exposes all simulated actions; this is not an auth gate.
export function PermissionGate({children}){return children;}
export function useToast(){const toast=useLibraryToast();return {showToast:({message,variant})=>toast.show({title:message,variant,duration:4500})};}
export const formatDate=value=>new Date(value).toLocaleString('es-CO');
export const getVehicleStageFilterOptions=rows=>rows.map(row=>({label:row.name,value:row.id}));
export const getCurrentWeekAction=async()=>demoWeek;
export async function getWeeksAction({page=1,pageSize=10,search='',year}){const all=Array.from({length:52},(_,i)=>(()=>{const start=new Date(Date.UTC(Number(year),0,4));start.setUTCDate(start.getUTCDate()-((start.getUTCDay()+6)%7)+i*7);const end=new Date(start);end.setUTCDate(end.getUTCDate()+6);return {weekNumber:i+1,year,startDate:start.toISOString(),endDate:end.toISOString()};})()).filter(w=>!search||String(w.weekNumber).includes(search));return {data:{items:all.slice((page-1)*pageSize,page*pageSize),pagination:{total:all.length}}};}
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export async function getPomaLoadingDetailAction({loadingId}){await delay(180);if(new URLSearchParams(location.search).get('demoState')==='detail-error')return {ok:false,message:'No fue posible consultar la información del documento POMA.'};return {ok:true,data:loadingDetail(loadingId)};}
export async function loadPomaRows(radication){await delay(180);if(new URLSearchParams(location.search).get('demoState')==='error')return {ok:false,message:'No fue posible realizar la consulta. Inténtalo nuevamente.'};return {ok:true,data:{items:loadings.filter(row=>row.radication===radication)}};}
export async function hasPomaLoadingForDispatchAction({radication,dispatchedAt}){await delay(100);return loadings.some(row=>row.radication===radication&&row.dispatchedFromOriginAt===dispatchedAt);}
export async function resolvePomaLoadingByDispatchAction({radication,dispatchedAt}){const row=loadings.find(row=>row.radication===radication&&row.dispatchedFromOriginAt===dispatchedAt);return row?{ok:true,data:{loadingId:row.loadingId,loadingType:row.loadingType}}:{ok:false,message:'No se encontró un cargue para la salida seleccionada.'};}
function downloadSample(name,lines){
  const safe=lines.map(x=>String(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7e]/g,' ').replace(/[\\()]/g,'\\$&'));
  const stream='BT /F1 11 Tf 40 790 Td 20 TL '+safe.map((line,i)=>(i?'T* ':'')+'('+line+') Tj').join('\n')+' ET';
  const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
  let pdf='%PDF-1.4\n';const offsets=[];objects.forEach((o,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${o}\nendobj\n`;});const xref=pdf.length;
  pdf+='xref\n0 6\n0000000000 65535 f \n'+offsets.map(n=>`${String(n).padStart(10,'0')} 00000 n \n`).join('')+`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const url=URL.createObjectURL(new Blob([pdf],{type:'application/pdf'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
export async function downloadPoma({loadingId}){await delay(1450);if(new URLSearchParams(location.search).get('demoState')==='generation-error')throw Error('No fue posible generar el POMA.');const detail=loadingDetail(loadingId);const row=loadings.find(r=>r.loadingId===loadingId);await downloadPomaDocument({detail,row});savePomaDocument(detail,row);}
export async function downloadContainerInspectionReport(id){await delay(650);if(new URLSearchParams(location.search).get('demoState')==='generation-error')throw Error('No fue posible generar el informe.');downloadSample('Inspecciones-demostracion.pdf',['INFORME DE INSPECCIONES - DEMOSTRACION',`Inspeccion ${id}`,'Sin validez operativa.']);}
