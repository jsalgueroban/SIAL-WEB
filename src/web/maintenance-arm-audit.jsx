import React,{useEffect,useRef,useState} from 'react';
import {MaintenanceWorker} from './maintenance-composition.jsx';
import {workshopAt,WORKSHOP_FRAMES,WELD_FRAMES} from './maintenance-rig.mjs';
import master from './session-master.json';

const schedule=[...Array.from({length:WORKSHOP_FRAMES},(_,frame)=>({mode:'workshop',frame})),...Array.from({length:WELD_FRAMES},(_,frame)=>({mode:'weld',frame}))];
const batchSize=24;
function Actor({mode,frame,id,normalize=false}){
 const raw=workshopAt(frame,mode),p=normalize?{...raw,x:170,y:0,scale:1}:raw;
 return <svg viewBox="0 80 1200 620" width="600" height="310" data-arm-audit-frame={frame} data-arm-audit-mode={mode} style={{'--bui-mascot-ink':'#123f70','--bui-mascot-tip':'#433a32'}}>
  <defs><linearGradient id={`${id}-peel`}><stop stopColor="#ffb911"/><stop offset="1" stopColor="#f7bd13"/></linearGradient><radialGradient id={`${id}-front`}><stop stopColor="#ffdf31"/><stop offset="1" stopColor="#ffd523"/></radialGradient></defs>
  <MaintenanceWorker p={p} id={id}/>
 </svg>;
}
const point=(x,y,matrix)=>new DOMPoint(x,y).matrixTransform(matrix);
function regions(paths){return [...paths].map(path=>({path,inverse:path.getCTM().inverse()}));}
const inside=(p,shapes)=>shapes.some(({path,inverse})=>path.isPointInFill(p.matrixTransform(inverse)));
function inspect(svg){
 const arm=svg.querySelector('[data-free-arm]'),hand=svg.querySelector('[data-free-hand-context]'),body=svg.querySelector('[data-workshop-body]');
 const bodyRegions=regions([...body.querySelectorAll('path')].slice(0,2)),armRegions=regions(arm.querySelectorAll('path,circle'));
 const visibleHand=[...hand.querySelectorAll('[data-free-hand-shape]')].filter(g=>Number(g.getAttribute('opacity'))>.05).flatMap(g=>[...g.querySelectorAll('path')]);
 const handRegions=regions(visibleHand),am=arm.getCTM(),hm=hand.getCTM(),bm=body.getCTM().inverse();
 const failures=[],root=point(365,425,am),wrist=point(453,420,am),handWrist=point(453,420,hm);
 const gap=Math.hypot(wrist.x-handWrist.x,wrist.y-handWrist.y);
 if(!inside(root,bodyRegions))failures.push('hombro-fuera-del-torso');
 if(gap>.05)failures.push('muneca-separada');
 let overlap=0,rootSamples=0,rootInside=0;
 for(let x=434;x<=456;x+=2)for(let y=414;y<=434;y+=2){const p=point(x,y,am);if(inside(p,armRegions)&&inside(p,handRegions))overlap++;}
 if(!overlap)failures.push('sin-solape-brazo-mano');
 for(let x=-22;x<=22;x+=4)for(let y=-22;y<=22;y+=4)if(x*x+y*y<24*24){rootSamples++;if(inside(point(365+x,425+y,am),bodyRegions))rootInside++;}
 const coverage=rootInside/rootSamples;
 if(coverage<.75)failures.push('raiz-demasiado-expuesta');
 const relative=bm.multiply(am),distortion=Math.max(Math.abs(Math.hypot(relative.a,relative.b)-1),Math.abs(Math.hypot(relative.c,relative.d)-1),Math.abs(relative.a*relative.c+relative.b*relative.d));
 if(distortion>1e-6)failures.push('brazo-deformado');
 const localWrist=wrist.matrixTransform(bm),localElbow=point(423,461.625,am).matrixTransform(bm);
 return {mode:svg.dataset.armAuditMode,frame:Number(svg.dataset.armAuditFrame),phase:workshopAt(Number(svg.dataset.armAuditFrame),svg.dataset.armAuditMode).phase,failures,gap,overlap,coverage,distortion,rootSamples,wrist:[localWrist.x,localWrist.y],elbow:[localElbow.x,localElbow.y]};
}
function summarize(results){
 const transitions=[[270,510],[440,622],[760,1040],[1000,1080]].map(([from,to])=>{
  let maxSpeed=0,maxAcceleration=0,speedFrame=from,accelerationFrame=from;
  for(let f=from;f<=to;f++){
   const p=results[f],q=results[f-1],r=results[f-2],v=p.wrist.map((n,i)=>n-q.wrist[i]),prior=q.wrist.map((n,i)=>n-r.wrist[i]);
   const speed=Math.hypot(...v),acceleration=Math.hypot(...v.map((n,i)=>n-prior[i]));
   if(speed>maxSpeed){maxSpeed=speed;speedFrame=f;}if(acceleration>maxAcceleration){maxAcceleration=acceleration;accelerationFrame=f;}
  }
  return {from,to,maxSpeed,maxAcceleration,speedFrame,accelerationFrame};
 });
 return {frames:results.length,failedFrames:results.filter(r=>r.failures.length).length,minRootCoverage:Math.min(...results.map(r=>r.coverage)),minWristOverlap:Math.min(...results.map(r=>r.overlap)),maxWristGap:Math.max(...results.map(r=>r.gap)),maxDistortion:Math.max(...results.map(r=>r.distortion)),rootSamples:results.reduce((n,r)=>n+r.rootSamples,0),masterSha256:master.sha256,transitions,failures:results.filter(r=>r.failures.length),results};
}
export function MaintenanceArmAudit(){
 const [cursor,setCursor]=useState(0),[report,setReport]=useState(null),[frame,setFrame]=useState(0),[mode,setMode]=useState('workshop'),[normalize,setNormalize]=useState(true),samples=useRef(null),results=useRef([]);
 useEffect(()=>{
  if(report)return;
  const raf=requestAnimationFrame(()=>{
   results.current.push(...[...samples.current.querySelectorAll('svg[data-arm-audit-frame]')].map(inspect));
   const next=cursor+batchSize;
   if(next>=schedule.length)setReport(summarize(results.current));else setCursor(next);
  });
  return()=>cancelAnimationFrame(raf);
 },[cursor,report]);
 return <>
  <p id="audit-status" role="status">{report?`${report.frames} cuadros · ${report.failedFrames} cuadros con fallos`:`Revisando ${Math.min(cursor,schedule.length)} / ${schedule.length} cuadros…`}</p>
  {!report&&<div className="audit-samples" ref={samples}>{schedule.slice(cursor,cursor+batchSize).map(({mode,frame})=><Actor key={`${mode}-${frame}`} mode={mode} frame={frame} id={`sample-${mode}-${frame}`}/>)}</div>}
  <p>Se comprueba el SVG real de ambos ciclos: raíz del hombro dentro del torso, solape de muñeca y mano, dimensiones y trayectoria. La naturalidad del gesto requiere además revisión visual.</p>
  <label>Escena <select value={mode} onChange={e=>{setMode(e.target.value);setFrame(0);}}><option value="workshop">Taller completo</option><option value="weld">Soldadura</option></select></label>{' '}
  <label>Cuadro <input aria-label="Cuadro" type="number" min="0" max={(mode==='workshop'?WORKSHOP_FRAMES:WELD_FRAMES)-1} value={frame} onChange={e=>setFrame(Math.max(0,Math.min((mode==='workshop'?WORKSHOP_FRAMES:WELD_FRAMES)-1,Number(e.target.value))))}/></label>
  {' '}<label><input type="checkbox" checked={normalize} onChange={e=>setNormalize(e.target.checked)}/>Ampliar personaje distante para inspección</label>
  <div className="frame-view"><Actor mode={mode} frame={frame} id="selected" normalize={normalize}/></div>
  <div className="frame-actions"><button onClick={()=>setFrame(f=>Math.max(0,f-1))}>Cuadro anterior</button><button onClick={()=>setFrame(f=>Math.min((mode==='workshop'?WORKSHOP_FRAMES:WELD_FRAMES)-1,f+1))}>Cuadro siguiente</button>{[300,310,474,494,771,804,1000,1038,1050,1150].map(f=><button key={f} onClick={()=>{setMode('workshop');setFrame(f);}}>{f}</button>)}</div>
  {report&&<><p>Raíz cubierta: {(report.minRootCoverage*100).toFixed(1)}% mínimo. Muñeca: {report.maxWristGap.toFixed(4)} px de separación máxima. Solape: {report.minWristOverlap} muestras mínimo.</p><details><summary>Informe completo de cuadros y transiciones</summary><pre id="audit-report">{JSON.stringify(report)}</pre></details></>}
 </>;
}
