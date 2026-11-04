import React,{useEffect,useRef,useState} from 'react';
import {Neutral404Actor} from './neutral-404-composition.jsx';
import {neutral404At} from './neutral-404-rig.mjs';
function Sample({frame,id}){return <svg data-audit-frame={frame} viewBox="250 330 290 260" width="580" height="520" style={{'--bui-mascot-tip':'#433a32','--bui-mascot-ink':'#123f70'}}><defs><linearGradient id={`${id}-peel`}><stop stopColor="#ffb911"/><stop offset="1" stopColor="#f7bd13"/></linearGradient><radialGradient id={`${id}-front`}><stop stopColor="#ffdf31"/><stop offset="1" stopColor="#ffd523"/></radialGradient></defs><Neutral404Actor p={neutral404At(frame)} id={id}/></svg>;}
const point=(x,y,m)=>new DOMPoint(x,y).matrixTransform(m);
function inspect(svg){
 const arm=svg.querySelector('[data-neutral-left]'),lower=svg.querySelector('[data-native-forearm]'),body=svg.querySelector('[data-neutral-body]'),torso=svg.querySelector('[data-neutral-torso]');
 const am=arm.getCTM(),lm=lower.getCTM(),inverse=lm.inverse(),tm=torso.getCTM().inverse(),bodyRegions=[...body.querySelectorAll('path')].slice(0,2).map(path=>({path,inverse:path.getCTM().inverse()}));
 const failures=[],root=point(211,414,am),a=point(188,456,am),b=point(188,456,lm);
 const gap=Math.hypot(a.x-b.x,a.y-b.y);
 if(!bodyRegions.some(r=>r.path.isPointInFill(root.matrixTransform(r.inverse))))failures.push('hombro-fuera');
 if(gap>1e-5)failures.push('codo-separado');
 const upperPaths=[...arm.querySelector('[data-native-upper]').querySelectorAll('path')],lowerPaths=[...lower.querySelectorAll('path')];
 let overlap=0;
 for(let x=173;x<=204;x+=2)for(let y=449;y<=466;y+=2){
  const q=point(x,y,am).matrixTransform(inverse);
  if(upperPaths.some(path=>path.isPointInFill(new DOMPoint(x,y)))&&q.y>=456&&lowerPaths.some(path=>path.isPointInFill(q)))overlap++;
 }
 if(overlap<3)failures.push('sin-solape-codo');
 const relative=tm.multiply(lm),distortion=Math.max(Math.abs(Math.hypot(relative.a,relative.b)-1),Math.abs(Math.hypot(relative.c,relative.d)-1),Math.abs(relative.a*relative.c+relative.b*relative.d));
 if(distortion>1e-6)failures.push('mano-deformada');
 return{frame:Number(svg.dataset.auditFrame),gap,overlap,distortion,failures};
}
export function NeutralArmAudit(){
 const[cursor,setCursor]=useState(0),[report,setReport]=useState(null),[frame,setFrame]=useState(420),samples=useRef(null),results=useRef([]);
 useEffect(()=>{if(report)return;const raf=requestAnimationFrame(()=>{
  results.current.push(...[...samples.current.querySelectorAll('svg')].map(inspect));
  if(cursor+24>=644){const rows=results.current;setReport({frames:rows.length,failedFrames:rows.filter(r=>r.failures.length).length,maxElbowGap:Math.max(...rows.map(r=>r.gap)),minElbowOverlap:Math.min(...rows.map(r=>r.overlap)),maxHandDistortion:Math.max(...rows.map(r=>r.distortion)),results:rows});}else setCursor(cursor+24);
 });return()=>cancelAnimationFrame(raf);},[cursor,report]);
 return <><p role="status" id="audit-status">{report?`${report.frames} cuadros · ${report.failedFrames} cuadros con fallos`:`Revisando ${cursor}/644…`}</p><p>Se comprueba el SVG real: raíz dentro del torso, mismo pivote del codo, solape entre segmentos y mano sin escala ni deformación. La naturalidad requiere además revisión visual.</p>
 {!report&&<div ref={samples} style={{position:'absolute',left:-20000}}>{Array.from({length:Math.min(24,644-cursor)},(_,i)=><Sample key={cursor+i} frame={cursor+i} id={`audit-${cursor+i}`}/>)}</div>}
 <label>Cuadro <input type="number" aria-label="Cuadro" min="0" max="643" value={frame} onChange={e=>setFrame(Math.max(0,Math.min(643,Number(e.target.value))))}/></label><button onClick={()=>setFrame(f=>Math.max(0,f-1))}>Anterior</button><button onClick={()=>setFrame(f=>Math.min(643,f+1))}>Siguiente</button>{[420,450,470,490,548,570,600,643,164,212].map(f=><button key={f} onClick={()=>setFrame(f)}>{f}</button>)}
 <div style={{background:'white',maxWidth:580,marginTop:20}}><Sample frame={frame} id="selected-arm"/></div>
 {report&&<details><summary>Informe de todos los cuadros</summary><pre id="audit-report">{JSON.stringify(report)}</pre></details>}</>;
}
