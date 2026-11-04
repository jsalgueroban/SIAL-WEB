import React from 'react';
import {SialIsotype} from './christmas-isotype/sial_isotype';
import {fragmentPolygons,fragmentWalls,brandOutline,wallQuad,svgPoints,logoMatrix,LOGO_THICKNESS} from './workshop-space.mjs';
import {CONTACT_UV} from './maintenance-rig.mjs';
export function WorkshopBrand3D({p,id}){
 const damage=Math.min(1,p.pieces.reduce((n,v)=>n+Math.hypot(v.x,v.y),0)/90),complete=damage<.0001;
 const walls=complete?brandOutline.slice(0,-1).map((a,i)=>wallQuad([a,brandOutline[i+1]],{x:0,y:0,angle:0})):fragmentWalls.flatMap((sides,i)=>sides.map(side=>wallQuad(side,p.pieces[i])));
 return <g data-workshop-brand="true" data-assembly={complete?'assembled':'fractured'} data-brand-depth={LOGO_THICKNESS}>
  <defs>{fragmentPolygons.map((poly,i)=><clipPath id={`${id}-flat-piece-${i}`} key={i}><polygon points={poly.map(v=>v.join(',')).join(' ')}/></clipPath>)}<clipPath id={`${id}-flat-outline`}><polygon points={brandOutline.map(v=>v.join(',')).join(' ')}/></clipPath></defs>
  {walls.map((points,i)=><polygon key={i} data-extrusion-face="true" points={svgPoints(points)} fill={i%3?'#315e7d':'#7194ab'} stroke="#244e6e" strokeWidth=".3"/>)}
  {complete?<g transform={`matrix(${logoMatrix.join(' ')})`}><SialIsotype x={641} y={320} size={200}/></g>:p.pieces.map((piece,i)=>{const m=[...logoMatrix];m[5]-=piece.height;return <g key={i} data-workshop-piece={i} transform={`matrix(${m.join(' ')})`}><g transform={`translate(${piece.x} ${piece.y}) rotate(${piece.angle} 710 418)`}><g clipPath={`url(#${id}-flat-piece-${i})`}><SialIsotype x={641} y={320} size={200}/><g clipPath={`url(#${id}-flat-outline)`}><polygon points={fragmentPolygons[i].map(v=>v.join(',')).join(' ')} stroke="#b8d0dc" strokeWidth="3" fill="none" opacity={damage*.8}/><path d="m678 434 10-2m-8 6 8-1" stroke="#0f395a" strokeWidth="2" opacity={damage*.5}/></g></g></g></g>;})}
  <g transform={`matrix(${logoMatrix.join(' ')})`} clipPath={`url(#${id}-flat-outline)`} fill="none" strokeLinecap="round">
    <path d={`M${641+CONTACT_UV.u} ${320+CONTACT_UV.v}L710 418 671 426 710 418 682 467 710 418`} stroke="#f0c075" strokeWidth="3.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p.weld} opacity={p.arc*.8}/>
    {Array.from({length:10},(_,i)=><ellipse key={i} cx={710-28*i/9} cy={418+49*i/9} rx="2.7" ry="1.5" fill="#b3cad6" stroke="none" opacity={p.arc*(i/10<p.weld?.8:0)}/>)}
  </g>
 </g>;
}
