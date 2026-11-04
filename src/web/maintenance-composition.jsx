import React,{useId} from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import master from './session-master.json';
import {workshopAt,toolPoint,actorPoint,freeHandPoint,freeArmTransform,WORK_CONTACT,WORKSHOP_FPS} from './maintenance-rig.mjs';
import {LegJoin} from './session-composition.jsx';
import {WorkshopResourceDefs,GogglesBack,GogglesFront,AuthoredAnvil,BlastCloud,WeldSprite} from './workshop-owned-resources.jsx';
import {WorkshopBrand3D} from './workshop-brand-3d.jsx';
import {flightStreakAt} from './cartoon-flight.mjs';

const ink='#123f70',steel='#5781a6',light='#cbddeb';
function Part({name,id,...props}){return <g {...props} dangerouslySetInnerHTML={{__html:master[name].replaceAll('MASTER',id)}}/>;}
function Hammer(){return <g data-workshop-tool="hammer">
  <path d="M445 343q9-5 17 0l3 104q-1 10-13 10t-11-10Z" fill={ink}/><path d="m449 350 10-1 2 94q0 7-8 7t-8-7Z" fill={steel}/>
  <path d="m450 356-2 57" stroke={light} strokeWidth="3" strokeLinecap="round"/>
  <path d="M413 315h66l21 10v30h-76l-23-15 12-6-23 1Z" fill={ink}/>
  <path d="m416 321 57 1 17 7-63 2-24-4Z" fill={light}/><path d="m427 333 60-1v16h-60l-18-9Z" fill={steel}/>
  <path d="m479 321 21 9v20l-21 5Z" fill={ink}/><path d="m484 328 11 5v12l-11 4Z" fill="#e8f1f8"/>
  <path d="m391 335 18 1 9 5-18 3Z" fill={light}/>
  <path d="m432 337 15-1m-10 5 16-1m-9 23-1 12m0 6-1 10" stroke="#a8c0d0" strokeWidth="1.5" strokeLinecap="round"/>
  <path d="m447 394 16 1m-16 8 16 1m-16 33 16 1" stroke={ink} strokeWidth="3"/>
</g>;}
function Torch(){return <g data-workshop-tool="torch">
  <path d="M449 434q-23 49 9 72" fill="none" stroke={ink} strokeWidth="8" strokeLinecap="round"/>
  <path d="m442 432 17 6 20-40-19-8Z" fill={ink}/><path d="m448 429 8 2 15-29-8-4Z" fill={steel}/>
  <path d="m465 396 10-33 16-19" fill="none" stroke={ink} strokeWidth="16" strokeLinejoin="round"/>
  <path d="m467 391 10-27 14-16" fill="none" stroke={light} strokeWidth="6"/>
  <path d="m486 344 9-9 7 7-10 9Z" fill="#e4ab50"/>
  <path d="m477 358 8 7m-12 1 8 7m-12 1 8 7" stroke="#e0b16e" strokeWidth="3"/>
  <path d="m455 390-10-8-4 15 7 6" stroke={ink} strokeWidth="4" fill="none" strokeLinejoin="round"/>
</g>;}
function WorkingArm({p,id}){return <g data-workshop-rig="right" transform={`rotate(${p.arm} 365 425)`}><Part name="arm" id={id}/><g opacity={1-p.torch}><Hammer/><Part name="grip" id={id}/></g><g opacity={p.torch} transform={`rotate(${p.wrist} 453 420)`}><Torch/><Part name="grip" id={id}/></g></g>;}
export function MaintenanceWorker({p,id}){
  const end=freeHandPoint(p),t=.62;
  const local=point=>{const r=-p.bodyAngle*Math.PI/180,x=point.x-p.x-322,y=point.y-p.y-604-p.bob;return {x:322+x*Math.cos(r)-y*Math.sin(r),y:604+x*Math.sin(r)+y*Math.cos(r)};};
  const tailStart=local({x:(1-t)**2*562+2*(1-t)*t*400+t*t*end.x,y:(1-t)**2*640+2*(1-t)*t*612+t*t*end.y}),tailControl=local({x:(1-t)*400+t*end.x,y:(1-t)*612+t*end.y}),tailEnd=local(end);
  return <g data-workshop-actor="true" data-depth-scale={p.scale} transform={`translate(${p.x+(p.airOffsetX??0)} ${p.y+(p.airOffsetY??0)}) translate(322 645) scale(${p.scale}) scale(${p.elasticX??1} ${p.elasticY??1}) translate(-322 -645) rotate(${p.flightAngle} 322 ${p.flightPivotY??604})`}>
  <g fill={ink}>
    <LegJoin pose={p} side="left"/><Part name="leftFoot" id={id} data-workshop-foot="left" transform={`translate(${p.left.x} ${p.left.y}) rotate(${p.left.angle} 289 625) translate(289 625) scale(-1 1) translate(-289 -625)`}/>
    <LegJoin pose={p} side="right"/><Part name="rightFoot" id={id} data-workshop-foot="right" transform={`translate(${p.right.x} ${p.right.y}) rotate(${p.right.angle} 379 625)`}/>
  </g>
  <g data-workshop-torso="true" transform={`translate(0 ${p.bob}) rotate(${p.bodyAngle} 322 604)`}>
  <WorkingArm p={p} id={id}/>
  <g data-free-arm="true" transform={freeArmTransform(p)}><Part name="arm" id={id}/></g>
  <GogglesBack amount={p.goggles}/>
  <Part name="body" id={id} data-workshop-body="true"/>
  {p.torch>.1&&<path data-cable-front-grip="true" d={`M${tailStart.x} ${tailStart.y}Q${tailControl.x} ${tailControl.y} ${tailEnd.x} ${tailEnd.y}`} fill="none" stroke="#2e485c" strokeWidth="6" opacity={p.torch}/ >}
  <g data-free-hand-context={p.dustOff>.1?'brushing-dust':p.runAmount>.1?'carrying-low':p.torch>.5?'guiding-cable':p.freePalm>.1?'surprised':'balancing-effort'} transform={freeArmTransform(p)}><Part name="grip" id={id} data-free-hand-shape="grip" opacity={1-p.freePalm}/><Part name="palm" id={id} data-free-hand-shape="palm" opacity={p.freePalm}/></g>
  {p.dustOff>0&&<g data-comic-dust-off="true">{[504,532].flatMap(hit=>Array.from({length:7},(_,i)=>{const age=(p.f-hit)/25;if(age<0||age>1)return null;return <ellipse key={`${hit}-${i}`} cx={212-age*(40+i*10)} cy={504+age*(20+i*6)-Math.sin(age*Math.PI)*24} rx={6+age*(7+i%3)} ry={4+age*6} fill="#b3bbc3" stroke="#718594" strokeWidth="1.1" opacity={(1-age)*.85}/>;}))}</g>}
  <g transform={`translate(${p.gaze} 0)`}>
    <path d={`M285 ${316-6*p.shock}q9 ${-7+14*p.effort+6*p.runAmount} 18 ${-1+7*p.effort}m60 ${-15-5*p.shock}q9 ${-4+12*p.effort} 16 ${2-6*p.effort}`} fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round"/>
    {p.dazed>.1?<path d="m289 338 16 18m-16 0 16-18m57-15 16 18m-16 0 16-18" stroke={ink} strokeWidth="5" strokeLinecap="round"/>:<g transform={`translate(334 340) scale(1 ${p.blink*(1-.6*p.effort+.3*p.shock-.15*p.runAmount)}) translate(-334 -340)`} fill={ink}><ellipse cx="297" cy="347" rx={8.5+p.shock*1.5} ry="15"/><ellipse cx="370" cy="332" rx={8+p.shock*1.5} ry="15"/></g>}
    {p.shock>.1?<ellipse cx="338" cy="373" rx={5+5*p.shock} ry={6+7*p.shock} fill={ink}/>:p.effort>.12?<><path d="M329 369q11-3 20 0v7q-11 3-20-1Z" fill={ink}/><path d="M332 371h13" stroke="#fff4c9" strokeWidth="2"/></>:p.runAmount>.1?<path d="M331 371q10-8 17 0q-2 8-10 7" fill={ink}/>:<path d={p.dazed>.1?'M328 370q10-6 18 1':p.arc>.1?'M331 373q9-3 15-1':'M329 370q9 5 18-2'} fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round"/>}
  </g>
  <GogglesFront id={id} amount={p.goggles} arc={p.arc}/>
  {p.dazed>0&&<g opacity={p.dazed} data-comic-dazed="true">{[0,1,2].map(i=>{const a=(p.f-398)*.15+i*Math.PI*2/3;return <path key={i} transform={`translate(${330+50*Math.cos(a)} ${248+16*Math.sin(a)}) rotate(${p.f*2+i*25})`} d="m0-9 3 6 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1Z" fill="#ffcf31" stroke={ink} strokeWidth="1.6"/>;})}</g>}
  </g>
</g>;}
function Sparks({point,frame,power=1,weld=false}){return <g transform={`translate(${point.x} ${point.y})`} data-workshop-sparks="true" opacity={power}>
  {Array.from({length:weld?9:7},(_,i)=>{const age=((frame+i*7)%32)/32,a=(-155+i*43)*Math.PI/180,r=12+age*(weld?55:65),x=Math.cos(a)*r,y=Math.sin(a)*r+age*age*40;return <path key={i} d={`M${x} ${y}l${Math.cos(a)*8} ${Math.sin(a)*8}`} fill="none" stroke={i%2?'#ffcc24':'#ed9b37'} strokeWidth={weld?3:4} strokeLinecap="round" opacity={1-age}/>;})}
  {weld?<><circle r={8+Math.sin(frame*.32)*1.2} fill="#b8dce6" opacity=".6"/><circle r="4" fill="#fff5ce"/></>:<path d="m0-28 7 17 17-7-9 16 20 8-23 3 1 21-13-15-15 15 3-21-23-3 20-8-9-16 17 7Z" fill="#ffce28"/>}
</g>;}
function ImpactSparks({point,age}){
 if(age<0||age>=24)return null;
 const fade=(1-age/24)**.7;
 return <g transform={`translate(${point.x} ${point.y})`} data-impact-age={age} data-workshop-sparks="impact">
  {Array.from({length:16},(_,i)=>{
    const a=(-174+i*11.3)*Math.PI/180,speed=2.2+(i%5)*.7,t=age,prev=Math.max(0,t-2.5);
    const at=n=>[Math.cos(a)*speed*n,Math.sin(a)*speed*n+.085*n*n];
    const [x,y]=at(t),[px,py]=at(prev);
    return <g key={i} opacity={fade}><path d={`M${px} ${py}L${x} ${y}`} stroke={i%3?'#ffb62e':'#f27a23'} strokeWidth={i%4===0?3:1.8} strokeLinecap="round"/><circle cx={x} cy={y} r={i%3===0?1.8:1.1} fill="#fff3b1"/></g>;
  })}
  {age<7&&<g opacity={1-age/7}><path d="m0-14 3 10 11-2-9 7 6 10-12-6-9 9 3-13-11-5 14-1Z" fill="#ffcf36"/><circle r={5-age*.45} fill="#fff8d6"/></g>}
 </g>;
}
export function MaintenanceComposition({mode='workshop',inspectionFrame=null,reduced=false}){
  const current=useCurrentFrame(),{fps}=useVideoConfig(),f=inspectionFrame??current/fps*WORKSHOP_FPS,p=workshopAt(f,mode),id='work'+useId().replace(/[^a-zA-Z0-9]/g,'');
  const nozzle=toolPoint(p),cable=toolPoint(p,{x:458,y:506}),free=freeHandPoint(p);
  const streak=p.trail>0?flightStreakAt(p.f,actorPoint({x:322,y:390},p),actorPoint({x:322,y:390},workshopAt(p.f-1,mode))):null;
  return <svg className="maintenance-scene" data-workshop-frame={Math.round(p.f)} data-workshop-phase={p.phase} viewBox="0 80 1200 620" width="100%" height="100%" aria-hidden="true" style={{'--bui-mascot-ink':ink,'--bui-mascot-tip':'#433a32'}}>
    <defs><linearGradient id={`${id}-peel`} x1="200" y1="260" x2="409" y2="555" gradientUnits="userSpaceOnUse"><stop stopColor="#ffb911"/><stop offset="1" stopColor="#f7bd13"/></linearGradient><radialGradient id={`${id}-front`} cx="318" cy="396" r="260" gradientUnits="userSpaceOnUse"><stop stopColor="#ffdf31"/><stop offset="1" stopColor="#ffd523"/></radialGradient><radialGradient id={`${id}-shadow`}><stop stopColor={ink} stopOpacity=".14"/><stop offset="1" stopColor={ink} stopOpacity="0"/></radialGradient></defs>
    <defs><WorkshopResourceDefs id={id}/></defs>
    <ellipse cx="790" cy="651" rx="250" ry="13" fill={`url(#${id}-shadow)`}/>
    <ellipse cx={p.x+322} cy={p.groundY+4} rx={100*p.scale*p.shadowWidth} ry={12*p.scale} opacity={p.shadowOpacity} fill={`url(#${id}-shadow)`}/>
    {!reduced&&streak&&<g stroke={ink} strokeWidth="3" strokeLinecap="round" fill="none" data-comic-flight="true">{[-1,0,1].map(i=>{const t=streak,x=t.center.x+t.back.x*t.offset+t.normal.x*i*9,y=t.center.y+t.back.y*t.offset+t.normal.y*i*9;return <path key={i} opacity={t.opacity} d={`M${x} ${y}l${t.back.x*t.length} ${t.back.y*t.length}`}/>;})}</g>}
    <AuthoredAnvil id={id}/>
    <WorkshopBrand3D p={p} id={id}/>
    {p.torch>.1&&<path data-guided-cable="true" d={`M${cable.x} ${cable.y}Q720 650 562 640Q400 612 ${free.x} ${free.y}`} fill="none" stroke={ink} strokeWidth="5" opacity={p.torch*.75}/>}
    <MaintenanceWorker p={p} id={id}/>
    {!reduced&&p.impact>0&&<ImpactSparks point={WORK_CONTACT} age={p.hitAge}/>}
    {!reduced&&p.arc>0&&<><WeldSprite point={nozzle} id={id} power={p.arc}/><Sparks point={nozzle} frame={p.f} power={p.arc} weld/></>}
    {!reduced&&mode==='workshop'&&<BlastCloud frame={p.f} point={WORK_CONTACT} id={id}/>}
    {!reduced&&(p.landing>0||p.secondLanding>0)&&<g data-comic-landing="true" transform={`translate(${p.x+322} ${p.groundY})`} fill="none" stroke="#8ba2b6" strokeLinecap="round" opacity={Math.max(p.landing,p.secondLanding)}><ellipse rx={28+(1-Math.max(p.landing,p.secondLanding))*62} ry={5+(1-Math.max(p.landing,p.secondLanding))*8} strokeWidth="3"/>{[-1,1].map(s=><g key={s}><path d={`M${s*22} -2q${s*18} -29 ${s*35} -8m${s*20} -5 ${s*8} -17m${s*32} 14 ${s*18} 5`} strokeWidth="3.5"/><ellipse cx={s*(30+(1-Math.max(p.landing,p.secondLanding))*36)} cy="-5" rx="15" ry="9" fill="#e2e8ea" strokeWidth="1.5"/></g>)}</g>}
  </svg>;
}
