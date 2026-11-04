import React from 'react';
import gogglesSvg from '../../assets/workshop/goggles.svg?raw';
import anvilSvg from '../../assets/workshop/anvil-model.svg?raw';
import smoke from '../../assets/workshop/smoke_04.png';
import flame from '../../assets/workshop/flame_01.png';
import spark from '../../assets/workshop/spark_05.png';

// Delapouite / Game-icons.net, CC BY 3.0. Original geometry, SIAL materials.
const gogglesPath=gogglesSvg.match(/fill="#fff" d="([^"]+)"/)[1];
const anvilInner=anvilSvg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
const clamp=x=>Math.max(0,Math.min(1,x));
export function WorkshopResourceDefs({id}){return <>
  <filter id={`${id}-particle-alpha`} x="0" y="0" width="100%" height="100%"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1.5 1.5 1.5 0 0"/></filter>
  <linearGradient id={`${id}-goggle-metal`} x1="0" y1="0" x2=".3" y2="1"><stop stopColor="#cedee8"/><stop offset=".45" stopColor="#6987a1"/><stop offset="1" stopColor="#123f70"/></linearGradient>
  <radialGradient id={`${id}-weld-glass`}><stop stopColor="#307d89"/><stop offset=".65" stopColor="#174c5b"/><stop offset="1" stopColor="#0c273e"/></radialGradient>
  <radialGradient id={`${id}-fire`}><stop stopColor="#fffbea"/><stop offset=".3" stopColor="#ffe273"/><stop offset=".68" stopColor="#f7ad32"/><stop offset="1" stopColor="#cc7443" stopOpacity="0"/></radialGradient>
  <mask id={`${id}-smoke-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512"><image href={smoke} width="512" height="512" filter={`url(#${id}-particle-alpha)`}/></mask>
  <mask id={`${id}-flame-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512"><image href={flame} width="512" height="512" filter={`url(#${id}-particle-alpha)`}/></mask>
  <mask id={`${id}-spark-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512"><image href={spark} width="512" height="512" filter={`url(#${id}-particle-alpha)`}/></mask>
</>;}
export function PublicGoggles({id,amount,arc}){return <g data-workshop-goggles="true" transform={`translate(0 ${-92*(1-amount)})`} opacity={amount}>
  <g transform="translate(297 347) rotate(6.2) scale(.392) translate(-259 -300)">
    <ellipse cx="259" cy="300" rx="48" ry="72" transform="rotate(11 259 300)" fill={`url(#${id}-weld-glass)`}/>
    <ellipse cx="440" cy="242" rx="48" ry="72" transform="rotate(11 440 242)" fill={`url(#${id}-weld-glass)`}/>
    <path d={gogglesPath} transform="translate(2 5)" fill="#123f70"/>
    <path d={gogglesPath} fill={`url(#${id}-goggle-metal)`}/>
    <path d="m247 270 22-24m157-45 25-19" stroke="#b6d9df" strokeWidth="5" opacity={.35+arc*.5} strokeLinecap="round"/>
  </g>
</g>;}
export function PublicAnvil(){return <g data-workshop-support="anvil" data-model-source="Innerscene-CC0">
  <ellipse cx="790" cy="646" rx="191" ry="11" fill="#123f70" opacity=".08"/>
  <svg x="625" y="472" width="310" height="172" viewBox="0 0 800 443.78" dangerouslySetInnerHTML={{__html:anvilInner}}/>
  <path d="M710 634h166v11H710Z" fill="#173e62"/>
  <path d="M718 635h148" stroke="#aec3d1" strokeWidth="2"/>
  {[728,852].map(x=><g key={x}><path d={`m${x} 630 6 3v6l-6 3-6-3v-6Z`} fill="#597d99"/><circle cx={x} cy="636" r="2" fill="#123f70"/></g>)}
</g>;}
// Kenney Particle Pack, CC0. The luminance masks preserve transparent output
// without putting black sprite backgrounds into the white/dark interface.
export function BlastCloud({frame,id,point}){
  const t=clamp((frame-300)/100);
  if(frame<300||frame>440)return null;
  return <g data-workshop-explosion="true" transform={`translate(${point.x} ${point.y})`}>
    <ellipse rx={20+t*205} ry={10+t*80} fill="none" stroke="#e4a646" strokeWidth={5*(1-t)} opacity={(1-t)*.45}/>
    {Array.from({length:9},(_,i)=>{const age=clamp((frame-302-i*2)/90),a=(i*40-165)*Math.PI/180,r=age*135,size=75+age*95;return <g key={i} transform={`translate(${Math.cos(a)*r-size/2} ${Math.sin(a)*r-age*30-size/2}) scale(${size/512})`} opacity={Math.sin(Math.PI*age)*.52}><rect width="512" height="512" fill={i%2?'#536e85':'#afbec8'} mask={`url(#${id}-smoke-mask)`}/></g>;})}
    {frame<348&&<g transform={`translate(${-165-t*130} ${-175-t*130}) scale(${(330+t*260)/512})`} opacity={1-clamp((frame-314)/34)}><rect width="512" height="512" fill={`url(#${id}-fire)`} mask={`url(#${id}-flame-mask)`}/></g>}
    {Array.from({length:12},(_,i)=>{const age=clamp((frame-300)/50),a=(i*30+13)*Math.PI/180,r=age*(90+i%3*25);return <path key={i} transform={`translate(${Math.cos(a)*r} ${Math.sin(a)*r+age*age*40}) rotate(${i*31+age*140})`} d="m-3-5 8 2-2 8-7-2Z" fill={i%3?'#f0b73d':'#446c8b'} opacity={1-age}/>;})}
    <circle r={24*(1-clamp((frame-300)/16))} fill="#fff1b8" opacity={1-clamp((frame-300)/16)}/>
  </g>;
}
export function WeldSprite({point,id,power}){return <g transform={`translate(${point.x-31} ${point.y-31}) scale(${62/512})`} opacity={power*.8}><rect width="512" height="512" fill="#e8f7fb" mask={`url(#${id}-spark-mask)`}/></g>;}
