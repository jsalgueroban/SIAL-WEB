import React,{memo,useEffect,useState} from 'react';
import {SessionActor} from './session-composition.jsx';
import {sessionRigAt,SESSION_FRAMES} from './session-rig.mjs';
import master from './session-master.json';

const Tile=memo(function Tile({frame}){
  const pose=sessionRigAt(frame);
  return <figure data-audit-frame={frame}><figcaption>{frame} · {pose.phase}</figcaption><div className="audit-crop"><SessionActor pose={{...pose,travel:0}} feetDetail/></div></figure>;
});
const inside=(screen,regions)=>regions.some(({path,inverse})=>path.isPointInFill(screen.matrixTransform(inverse)));
function inspect(tile,expected){
  const actor=tile.querySelector('svg'),rootInverse=actor.getCTM().inverse();
  const body=[...tile.querySelector('[data-session-torso]').children[2].querySelectorAll('path')].slice(0,2).map(path=>({path,inverse:path.getCTM().inverse()}));
  const failures=[];
  let samples=0,maxDistortion=0;
  for(const side of ['left','right']){
    const foot=tile.querySelector(`[data-session-foot="${side}"]`),join=tile.querySelector(`[data-session-leg-join="${side}"]`);
    const footMatrix=foot.getCTM(),joinMatrix=join.getCTM();
    const regions=[{path:join,inverse:joinMatrix.inverse()},...body];
    const matrix=rootInverse.multiply(footMatrix);
    const distortion=Math.max(Math.abs(Math.hypot(matrix.a,matrix.b)-1),Math.abs(Math.hypot(matrix.c,matrix.d)-1),Math.abs(matrix.a*matrix.c+matrix.b*matrix.d),Math.abs(Math.abs(matrix.a*matrix.d-matrix.b*matrix.c)-1));
    maxDistortion=Math.max(maxDistortion,distortion);
    if(!Number.isFinite(distortion)||distortion>1e-6)failures.push({side,kind:'foot-distortion',distortion});
    const paths=[...foot.querySelectorAll('path')].map(p=>p.getAttribute('d'));
    if(JSON.stringify(paths)!==JSON.stringify(expected[side]))failures.push({side,kind:'master-path-changed'});
    const a=side==='left'?[277,592]:[365,601],b=side==='left'?[303,600]:[391,600];
    // Test a strip above the entire upper edge, not merely the central anchor.
    for(let n=0;n<=32;n++){
      const t=(n+.25)/32.5;
      const screen=new DOMPoint(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t-.35).matrixTransform(footMatrix);
      samples++;
      if(!inside(screen,regions))failures.push({side,kind:'upper-edge-gap',sample:n});
    }
    const coords=join.getAttribute('d').match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi).map(Number);
    for(let n=0;n<=8;n++){
      const t=(n+.1)/8.2;
      const screen=new DOMPoint(coords[0]+(coords[2]-coords[0])*t,coords[1]+(coords[3]-coords[1])*t).matrixTransform(joinMatrix);
      samples++;
      if(!inside(screen,body))failures.push({side,kind:'hip-outside-body',sample:n});
    }
  }
  return {frame:Number(tile.dataset.auditFrame),samples,maxDistortion,failures};
}

export function SessionLegAudit(){
  const [progress,setProgress]=useState(0),[report,setReport]=useState(null);
  useEffect(()=>{
    let cancelled=false,request;
    const parser=new DOMParser(),expected={};
    for(const side of ['left','right'])expected[side]=[...parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${master[`${side}Foot`]}</svg>`,'image/svg+xml').querySelectorAll('path')].map(p=>p.getAttribute('d'));
    const tiles=[...document.querySelectorAll('[data-audit-frame]')];
    const results=[];
    let cursor=0;
    const batch=()=>{
      if(cancelled)return;
      const stop=Math.min(cursor+16,tiles.length);
      while(cursor<stop){const result=inspect(tiles[cursor],expected);results.push(result);if(result.failures.length)tiles[cursor].dataset.auditFailure='true';cursor++;}
      setProgress(cursor);
      if(cursor<tiles.length){request=requestAnimationFrame(batch);return;}
      const summary={frames:results.length,legs:results.length*2,samples:results.reduce((n,r)=>n+r.samples,0),failedFrames:results.filter(r=>r.failures.length).length,maxFootDistortion:Math.max(...results.map(r=>r.maxDistortion)),failures:results.filter(r=>r.failures.length),masterSha256:master.sha256,results};
      setReport(summary);
    };
    request=requestAnimationFrame(batch);
    return ()=>{cancelled=true;cancelAnimationFrame(request);};
  },[]);
  return <>
    <p id="audit-status" role="status">{report?`${report.frames} cuadros · ${report.failedFrames} cuadros con fallos · ${report.samples} puntos comprobados`:`Revisando ${progress} / ${SESSION_FRAMES} cuadros…`}</p>
    <p>Se centra el desplazamiento global para ver ambos pies. Las formas, uniones y poses son las mismas de la vista 401. Esta comprobación geométrica se acompaña de revisión visual.</p>
    {report&&<details><summary>Informe reproducible</summary><pre id="audit-report">{JSON.stringify(report,null,2)}</pre></details>}
    <div className="audit-grid">{Array.from({length:SESSION_FRAMES},(_,frame)=><Tile key={frame} frame={frame}/>)}</div>
  </>;
}
