import React,{useId} from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import master from './session-master.json';
import neutral from './neutral-master.json';
import {LegJoin} from './session-composition.jsx';
import {neutral404At,neutralLensAt,NEUTRAL_FPS} from './neutral-404-rig.mjs';
const ink='#123f70';
function Part({name,id,...props}){return <g {...props} dangerouslySetInnerHTML={{__html:(name==='restArm'?neutral.restArm:master[name]).replaceAll('MASTER',id)}}/>;}
function Magnifier(){return <g data-neutral-tool="magnifier"><path d="m450 424 33-49" stroke={ink} strokeWidth="13" strokeLinecap="round"/><path d="m453 415 25-37" stroke="#5781a6" strokeWidth="5" strokeLinecap="round"/><circle cx="500" cy="350" r="30" fill="#e8f4fb" fillOpacity=".72" stroke={ink} strokeWidth="7"/><circle cx="500" cy="350" r="23" fill="none" stroke="#a9d1e9" strokeWidth="2"/><path d="M485 344q3-10 13-11" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round"/></g>;}
function NativeLeftArm({p,id}){return <g data-neutral-left="true" transform={`translate(7 6) rotate(${p.leftAngle} 211 414)`}>
 <defs><clipPath id={`${id}-upper`}><rect x="140" y="390" width="110" height="76"/></clipPath><clipPath id={`${id}-lower`}><rect x="140" y="449" width="110" height="90"/></clipPath><linearGradient id={`${id}-joint-fade`} x1="0" x2="0" y1="449" y2="463" gradientUnits="userSpaceOnUse"><stop stopColor="white" stopOpacity="0"/><stop offset="1" stopColor="white"/></linearGradient><mask id={`${id}-joint-blend`} maskUnits="userSpaceOnUse" x="140" y="449" width="110" height="90"><rect x="140" y="449" width="110" height="90" fill={`url(#${id}-joint-fade)`}/></mask></defs>
 <g data-native-upper="true" clipPath={`url(#${id}-upper)`}><Part name="restArm" id={id}/></g>
 <g data-native-forearm="true" transform={`rotate(${p.elbowAngle} 188 456)`}>
  <circle data-native-elbow="true" cx="188" cy="456" r="12" fill={`url(#${id}-front)`}/>
  <g clipPath={`url(#${id}-lower)`} mask={`url(#${id}-joint-blend)`}><Part name="restArm" id={id}/></g>
 </g>
 </g>;}
export function Neutral404Actor({p,id}){
 const rightTransform=`rotate(${p.rightAngle} 365 425)`;
 return <g data-neutral-actor="true" transform={`translate(${p.travel+p.offset} 0)`}>
  <g fill={ink}><LegJoin pose={p} side="left"/><Part name="leftFoot" id={id} transform={`translate(${p.left.x} ${p.left.y}) rotate(${p.left.angle} 289 625) translate(289 625) scale(-1 1) translate(-289 -625)`}/><LegJoin pose={p} side="right"/><Part name="rightFoot" id={id} transform={`translate(${p.right.x} ${p.right.y}) rotate(${p.right.angle} 379 625)`}/></g>
  <g data-neutral-torso="true" transform={`translate(0 ${p.bob}) rotate(${p.bodyAngle} 322 604)`}>
   {p.mode!=='search'&&<g data-neutral-left="true" transform={`rotate(${p.leftAngle} 211 414)`}><Part name="restArm" id={id}/></g>}
   <g data-neutral-right="true" transform={rightTransform}><Part name="arm" id={id}/>{p.glass?<><Magnifier/><Part name="grip" id={id}/></>:<Part name="palm" id={id}/>}</g>
   <Part name="body" id={id} data-neutral-body="true"/>
   {p.mode==='search'&&<NativeLeftArm p={p} id={id}/>}
   <g transform={`translate(${p.gaze*.25} ${(p.gazeY||0)*.25})`}>
    <path d={`M287 ${317-4*p.puzzled-(p.browLift||0)}q9 ${-5-5*p.puzzled} 17-2M362 ${302+4*p.puzzled-(p.browLift||0)}q7 ${-3+4*p.puzzled} 14 2`} fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round"/>
    <g transform={`translate(${p.gaze*.6} ${(p.gazeY||0)*.6}) translate(334 340) scale(1 ${p.blink}) translate(-334 -340)`} fill={ink}><ellipse cx="297" cy="347" rx="8.5" ry="15"/><ellipse cx="370" cy="332" rx="8" ry="15"/></g>
    <path d={`M${328+2*p.puzzled} ${370+2*p.puzzled}q${10-2*p.puzzled} ${9-13*p.puzzled} ${20-3*p.puzzled} ${-3+2*p.puzzled}`} fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round"/>
   </g>
  </g>
 </g>;
}
function SearchWindow({compact,windowX,windowY}){return (<g data-neutral-context="application-window" transform={`translate(${windowX} ${windowY})`} stroke="#b5c7d8" strokeWidth="2.5" fill="var(--neutral-window,#f7fafd)">
   <rect width={compact?270:245} height={compact?265:230} rx="16"/>
   <path d={`M0 40h${compact?270:245}`} fill="none"/><circle cx="20" cy="20" r="3" fill="#5781a6" stroke="none"/><circle cx="33" cy="20" r="3" fill="#b5c7d8" stroke="none"/><path d="M55 20h90" strokeLinecap="round"/>
   <g transform={`translate(${compact?96:60} 76)`}><path d="M0 0h54l21 21v71H0Z" fill="var(--neutral-page,#fff)"/><path d="M54 0v22h21M18 48h39M18 62h25" fill="none" strokeLinecap="round"/><circle cx="38" cy="78" r="14" fill="var(--neutral-window,#f7fafd)" strokeDasharray="3 4"/></g>
   <text x={compact?135:98} y={compact?220:205} textAnchor="middle" fill="#5781a6" stroke="none" fontSize="24" fontFamily="inherit" fontWeight="600">404</text>
  </g>);}
export function Neutral404Composition({mode='search',inspectionFrame=null,frameOffset=0}){
 const current=useCurrentFrame(),{fps}=useVideoConfig(),p=neutral404At(inspectionFrame??current/fps*NEUTRAL_FPS+frameOffset,mode),id='neutral'+useId().replace(/[^a-zA-Z0-9]/g,'');
 const compact=mode==='quiet',windowX=compact?600:565,windowY=compact?230:265,lens=neutralLensAt(p);
 return <svg viewBox="0 100 1000 620" width="100%" height="100%" className="neutral-scene" data-neutral-phase={p.phase} data-neutral-frame={Math.round(p.f)} aria-hidden="true" style={{'--bui-mascot-ink':ink,'--bui-mascot-tip':'#433a32'}}>
  <defs><linearGradient id={`${id}-peel`} x1="200" y1="260" x2="409" y2="555" gradientUnits="userSpaceOnUse"><stop stopColor="#ffb911"/><stop offset="1" stopColor="#f7bd13"/></linearGradient><radialGradient id={`${id}-front`} cx="318" cy="396" r="260" gradientUnits="userSpaceOnUse"><stop stopColor="#ffdf31"/><stop offset="1" stopColor="#ffd523"/></radialGradient><radialGradient id={`${id}-shadow`}><stop stopColor={ink} stopOpacity=".16"/><stop offset="1" stopColor={ink} stopOpacity="0"/></radialGradient><clipPath id={`${id}-lens`}><circle cx={lens.x} cy={lens.y} r="22"/></clipPath></defs>
  <SearchWindow compact={compact} windowX={windowX} windowY={windowY}/>
  {!compact&&<g data-neutral-context="broken-route" fill="none" stroke="#a9bed1" strokeWidth="3" strokeLinecap="round"><path d="M120 650h430q32 0 32-32v-60q0-24 25-24h24" strokeDasharray="7 10"/><path d="M657 534h30m-13-10 13 10-13 10"/><circle cx="643" cy="534" r="6" fill="#ffcc23" stroke="none"/></g>}
  <ellipse cx={p.travel+p.offset+322} cy="647" rx="115" ry="13" fill={`url(#${id}-shadow)`}/>
  <Neutral404Actor p={p} id={id}/>
  {!compact&&p.attention>.01&&<g data-neutral-optics="magnified-window" clipPath={`url(#${id}-lens)`} opacity={p.attention}><g transform={`translate(${lens.x} ${lens.y}) scale(1.65) translate(${-lens.x} ${-lens.y})`}><SearchWindow compact={false} windowX={windowX} windowY={windowY}/></g></g>}
  {p.puzzled>.05&&<g opacity={p.puzzled} transform={`translate(${p.travel+p.offset+418} 220)`} fill="#5781a6"><text fontSize="40" fontWeight="600" fontFamily="inherit">?</text></g>}
 </svg>;
}
