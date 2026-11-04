import React from 'react';
import {project,svgPoints} from './workshop-space.mjs';
const ink='#123f70';
export function WorkshopResourceDefs({id}){return <>
  <linearGradient id={`${id}-metal`} x1="0" y1="0" x2=".3" y2="1"><stop stopColor="#e5eef2"/><stop offset=".36" stopColor="#9bb3c4"/><stop offset=".55" stopColor="#62859f"/><stop offset="1" stopColor="#214a6e"/></linearGradient>
  <radialGradient id={`${id}-glass`} cx=".35" cy=".25"><stop stopColor="#397e89"/><stop offset=".5" stopColor="#194e63"/><stop offset="1" stopColor="#092d45"/></radialGradient>
  <radialGradient id={`${id}-fire`}><stop stopColor="#fff9df"/><stop offset=".25" stopColor="#ffe078"/><stop offset=".6" stopColor="#ef9c34"/><stop offset="1" stopColor="#d66c31" stopOpacity="0"/></radialGradient>
  <radialGradient id={`${id}-smoke`} cx=".3" cy=".25"><stop stopColor="#c1cbd2" stopOpacity=".85"/><stop offset=".6" stopColor="#6c7d8a" stopOpacity=".65"/><stop offset="1" stopColor="#536476" stopOpacity="0"/></radialGradient>
</>;}
export function GogglesBack({amount}){return <g opacity={amount} transform={`translate(0 ${-54*(1-amount)})`} data-goggle-layer="back"><path d="M201 331q22-35 65-37l117 6 8 18-12 7-111-12q-38 2-59 30Z" fill="#16354e"/><path d="M204 330q26-25 57-26" fill="none" stroke="#52748c" strokeWidth="4"/><path d="m201 323 11-3 4 18-11 4Z" fill="#668da7"/></g>;}
export function GogglesFront({id,amount,arc}){return <g opacity={amount} transform={`translate(0 ${-54*(1-amount)})`} data-workshop-goggles="authored-fit">
  <path d="M224 329q29-13 52-9l10 18-12 12q-28-11-50-8Zm152-24 10 2 4 22-12 5Z" fill="#1b405b"/>
  <path d="M226 332q25-10 44-5m110-15 3 13" fill="none" stroke="#7995a8" strokeWidth="3"/>
  <path d="M316 335q11-17 24-6l11 3-3 10-15-5-11 11Z" fill="#173a55"/>
  {[[297,342,24,27],[369,330,21,25]].map(([x,y,rx,ry],i)=><g key={i} transform={`rotate(${i?-6:5} ${x} ${y})`}>
    <ellipse cx={x-2} cy={y+4} rx={rx+4} ry={ry+3} fill="#12364f"/>
    <ellipse cx={x} cy={y} rx={rx+2} ry={ry+1} fill={`url(#${id}-metal)`} stroke="#143953" strokeWidth="2.5"/>
    <ellipse cx={x} cy={y} rx={rx-4} ry={ry-4} fill={`url(#${id}-glass)`} stroke="#163c54" strokeWidth="3"/>
    <path d={`M${x-rx+9} ${y-6}q4-12 12-12m${x-9} ${y+17} 12-3`} fill="none" stroke="#b3d8df" strokeWidth="2" strokeLinecap="round" opacity={.4+arc*.5}/>
    {[-1,1].map(s=><circle key={s} cx={x+s*(rx-1)} cy={y} r="2.1" fill="#e8eff2"/>)}
    <path d={`M${x-9} ${y-ry+1}h5m4 0h4`} stroke="#173c56" strokeWidth="2"/>
  </g>)}
</g>;}
function Face({points,fill,stroke}){return <polygon points={svgPoints(points.map(project))} fill={fill} stroke={stroke||fill} strokeWidth=".6"/>;}
export function AuthoredAnvil({id}){
 const top=[[-190,-110],[160,-110],[245,-55],[295,0],[235,50],[160,110],[-190,110]];
 const rings=[{y:-22,x1:-145,x2:120,z:80},{y:-67,x1:-57,x2:49,z:44},{y:-97,x1:-108,x2:87,z:54},{y:-111,x1:-112,x2:91,z:56}];
 const corners=r=>[[r.x1,r.y,-r.z],[r.x2,r.y,-r.z],[r.x2,r.y,r.z],[r.x1,r.y,r.z]];
 return <g data-workshop-support="anvil" data-model-source="authored-sial">
   {rings.slice(0,-1).map((r,i)=>{const a=corners(r),b=corners(rings[i+1]);return <g key={i}><Face points={[a[0],a[1],b[1],b[0]]} fill="#234f73"/><Face points={[a[0],a[3],b[3],b[0]]} fill="#4d7897"/><Face points={[a[1],a[2],b[2],b[1]]} fill="#173f62"/><Face points={[a[3],a[2],b[2],b[3]]} fill={i===0?'#7295ad':'#315f82'}/></g>;})}
   {top.map((p,i)=>{const q=top[(i+1)%top.length];return <Face key={i} points={[[p[0],0,p[1]],[q[0],0,q[1]],[q[0],-22,q[1]],[p[0],-22,p[1]]]} fill={i>3?'#214d70':'#537c99'}/>;})}
   <Face points={top.map(([x,z])=>[x,0,z])} fill={`url(#${id}-metal)`} stroke="#b9ccd8"/>
   {[-80,-30,30,85].map((z,i)=><path key={i} d={`M${svgPoints([project([-155,.2,z]),project([135,.2,z+4])]).replace(' ','L')}`} stroke="#e3edf2" opacity=".18" fill="none" strokeWidth="1"/>)}
   <Face points={[[110,.5,70],[136,.5,70],[136,.5,94],[110,.5,94]]} fill="#143650"/><Face points={[[115,1,73],[132,1,73],[132,1,90],[115,1,90]]} fill="#081e31"/>
   <Face points={[[-60,-74,54],[24,-74,54],[24,-91,54],[-60,-91,54]]} fill="#123b5d"/>
   {[-70,50].map(x=>{const p=project([x,-105,55]);return <g key={x}><path d={`m${p.x} ${p.y-4} 5 2v5l-5 3-5-3v-5Z`} fill="#96afc1"/><path d={`M${p.x-2} ${p.y}h4`} stroke="#244b69" strokeWidth="1.5"/></g>;})}
 </g>;
}
const clamp=t=>Math.max(0,Math.min(1,t));
export function BlastCloud({frame,id,point}){
 const t=clamp((frame-300)/88);if(frame<300||frame>425)return null;
 const burst=clamp((frame-300)/5),burstRadius=20+140*burst;
 const burstPoints=Array.from({length:28},(_,i)=>{const a=i*Math.PI/14,r=burstRadius*(i%2?.45:1+(i%3)*.13);return {x:Math.cos(a)*r,y:Math.sin(a)*r*.82};});
 return <g data-workshop-explosion="authored">
  {frame<318&&<g transform={`translate(${point.x} ${point.y-16}) rotate(-12)`} opacity={1-clamp((frame-308)/10)} data-comic-burst="true"><polygon points={svgPoints(burstPoints)} fill="#f8b932" stroke="#b96a28" strokeWidth="4" strokeLinejoin="round"/><polygon points={svgPoints(burstPoints.map(p=>({x:p.x*.65,y:p.y*.65})))} fill="#fff4c5"/>{[-70,-30,20,65,120,165,210].map(a=><path key={a} transform={`rotate(${a})`} d={`M${burstRadius+12} 0h${22*burst}`} stroke="#e8aa35" strokeWidth="5" strokeLinecap="round"/>)}</g>}
  {[0,9,19].map((delay,i)=>{const a=clamp((frame-300-delay)/50);return <ellipse key={i} cx={point.x} cy={point.y} rx={20+a*240} ry={8+a*95} stroke={i?'#d4b37a':'#f3bf53'} strokeWidth={(1-a)*7} fill="none" opacity={(1-a)*.65}/>;})}
  {Array.from({length:8},(_,i)=>{const age=clamp((frame-303-i*2)/92),a=(i*43+15)*Math.PI/180,x=point.x+Math.cos(a)*age*155,y=point.y+Math.sin(a)*age*90-age*62,s=27+age*60;return <g key={i} opacity={Math.sin(Math.PI*age)*.8}><path d={`M${x-s} ${y}c${-s*.6} ${-s*.6} 0 ${-s*1.3} ${s*.55} ${-s*.9}c${s*.4} ${-s*.9} ${s*1.3} ${-s*.4} ${s*1.05} ${s*.2}c${s} ${-s*.1} ${s} ${s} ${s*.25} ${s*.9}c${-s*.2} ${s*.7} ${-s*1.2} ${s*.65} ${-s*1.5} ${s*.15}c${-s*.8} ${s*.4} ${-s*1.1} ${-s*.2} ${-s*.35} ${-s*.35}Z`} fill="#dce6ed" stroke="#839bac" strokeWidth="1.8"/></g>;})}
  {Array.from({length:18},(_,i)=>{const age=clamp((frame-300)/65),a=(i*20+12)*Math.PI/180,r=age*(110+i%4*26),x=point.x+Math.cos(a)*r,y=point.y+Math.sin(a)*r+age*age*65;return <path key={i} transform={`translate(${x} ${y}) rotate(${i*31+age*180})`} d="m-3-6 9 3-3 8-8-2Z" fill={i%3?'#edb349':'#3d6889'} opacity={1-age}/>;})}
  {frame<311&&<circle cx={point.x} cy={point.y} r={28*(1-clamp((frame-300)/11))} fill="#fff8dc"/>}
 </g>;
}
export function WeldSprite({point,power}){return <g opacity={power}><circle cx={point.x} cy={point.y} r="17" fill="#b2dfe9" opacity=".16"/><circle cx={point.x} cy={point.y} r="7" fill="#d7f2f6" opacity=".6"/><circle cx={point.x} cy={point.y} r="3" fill="#fffbe5"/></g>;}
