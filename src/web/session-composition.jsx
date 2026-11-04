import React,{useId} from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import master from './session-master.json';
import {sessionRigAt,SESSION_FPS} from './session-rig.mjs';

function Contour({part,id,...props}){
  return <g {...props} dangerouslySetInnerHTML={{__html:master[part].replaceAll('MASTER',id)}}/>;
}
export function LegJoin({pose,side}){
  const left=side==='left',foot=left?pose.left:pose.right;
  const torso=pose.bodyAngle*Math.PI/180,ankle=foot.angle*Math.PI/180;
  const hipPoint=(x,y)=>({x:322+(x-322)*Math.cos(torso)-(y-604)*Math.sin(torso),y:604+(x-322)*Math.sin(torso)+(y-604)*Math.cos(torso)+pose.bob});
  const footPoint=([x,y])=>{
    const pivotX=left?289:379,dx=(x-pivotX)*(left?foot.facing:1),dy=y-625;
    return {x:pivotX+dx*Math.cos(ankle)-dy*Math.sin(ankle)+foot.x,y:625+dx*Math.sin(ankle)+dy*Math.cos(ankle)+foot.y};
  };
  // Cover the whole original upper edge and overlap inside the leg. A narrow
  // centre stroke left its outside corner exposed when the foot was mirrored.
  const edge=left?[[303.8,598.8],[302,613],[276,613],[276.2,590.8]]:[[391,600],[390,613],[365,613],[365,601]];
  if(left&&foot.facing<0)edge.reverse();
  const points=[hipPoint(left?272:360,568),hipPoint(left?308:396,568),...edge.map(footPoint)];
  return <path data-session-leg-join={side} d={points.map((p,i)=>`${i?'L':'M'}${p.x} ${p.y}`).join('')+'Z'} fill="#123f70"/>;
}
function Arm({rig,side,id,signAngle,shield,palmAngle,shieldFace,shieldTilt,bodyAngle}){
  return <g data-arm={side} transform={`translate(${rig.shoulder.x} ${rig.shoulder.y}) rotate(${rig.angle}) scale(${rig.mirrored?-rig.scale:rig.scale} ${rig.scale}) translate(-365 -425)`}>
    <Contour part="arm" id={id} data-master-arm="whole"/>
    <g data-wrist={side} transform="translate(453 420)">
      {side==='left'?<>
        <g transform={`rotate(${rig.angle-signAngle}) scale(-1 1)`}><Contour part="sign" id={id} transform="translate(-127 -420)"/></g>
        <Contour part="grip" id={id} transform="translate(-453 -420)"/>
      </>:<g transform={`rotate(${palmAngle})`}>
        <g opacity={shield} data-shield="true" transform={`translate(10 0) rotate(${-rig.angle-palmAngle-bodyAngle+shieldTilt}) scale(${shieldFace} 1) translate(-10 0)`}><Contour part="shield" id={id} transform="translate(-472 -421)"/></g>
        <Contour part="palm" id={id} transform="translate(-453 -420)"/>
      </g>}
    </g>
  </g>;
}
export function SessionActor({pose,feetDetail=false}){
  const id='session'+useId().replace(/[^a-zA-Z0-9]/g,'');
  return <svg data-session-actor="true" viewBox={feetDetail?'230 545 210 120':'65 110 485 560'} width="100%" height="100%" style={{overflow:feetDetail?'hidden':'visible','--bui-mascot-ink':'#123f70','--bui-mascot-yellow':'#ffd523','--bui-mascot-tip':'#433a32'}}>
    <defs>
      <linearGradient id={`${id}-peel`} x1="200" y1="260" x2="409" y2="555" gradientUnits="userSpaceOnUse"><stop stopColor="#ffb911"/><stop offset="1" stopColor="#f7bd13"/></linearGradient>
      <radialGradient id={`${id}-front`} cx="318" cy="396" r="260" gradientUnits="userSpaceOnUse"><stop stopColor="#ffdf31"/><stop offset="1" stopColor="#ffd523"/></radialGradient>
      <radialGradient id={`${id}-shadow`}><stop stopColor="#123f70" stopOpacity=".18"/><stop offset="1" stopColor="#123f70" stopOpacity="0"/></radialGradient>
    </defs>
    <g transform={`translate(${pose.travel} 0)`}>
      <ellipse cx="322" cy="645" rx="126" ry="14" fill={`url(#${id}-shadow)`}/>
      <g fill="#123f70">
        <g opacity={pose.farFootOpacity}><LegJoin pose={pose} side="left"/>
          <Contour part="leftFoot" data-session-foot="left" id={id} transform={`translate(${pose.left.x} ${pose.left.y}) rotate(${pose.left.angle} 289 625) translate(289 625) scale(${pose.left.facing} 1) translate(-289 -625)`}/>
        </g>
        <g><LegJoin pose={pose} side="right"/>
          <Contour part="rightFoot" data-session-foot="right" id={id} transform={`translate(${pose.right.x} ${pose.right.y}) rotate(${pose.right.angle} 379 625)`}/>
        </g>
      </g>
      <g data-session-torso="true" transform={`translate(0 ${pose.bob}) rotate(${pose.bodyAngle} 322 604)`}>
        <Arm rig={pose.rightArm} side="right" id={id} shield={pose.shield} palmAngle={pose.palmAngle} shieldFace={pose.shieldFace} shieldTilt={pose.shieldTilt} bodyAngle={pose.bodyAngle}/><Arm rig={pose.leftArm} side="left" id={id} signAngle={pose.signAngle}/>
        <Contour part="body" id={id}/>
        <g transform={`translate(${pose.gaze*.3} 0)`}>
          <g fill="none" stroke="#123f70" strokeWidth="5" strokeLinecap="round"><path d="M287 317q9-5 17-2M362 302q7-3 14 2"/></g>
          <g transform={`translate(${pose.gaze} 0) translate(334 340) scale(1 ${pose.blink}) translate(-334 -340)`} fill="#123f70"><ellipse cx="297" cy="347" rx="8.5" ry="15"/><ellipse cx="370" cy="332" rx="8" ry="15"/></g>
          <path d="M329 370q9 3 18-2" fill="none" stroke="#123f70" strokeWidth="5" strokeLinecap="round"/>
        </g>
      </g>
    </g>
  </svg>;
}
export function SessionComposition({inspectionFrame=null,frameOffset=0}){
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),absoluteFrame=inspectionFrame??frame/fps*SESSION_FPS+frameOffset,pose=sessionRigAt(absoluteFrame);
  return <div className="session-scene__stage" data-scene-phase={pose.phase} data-scene-frame={Math.round(absoluteFrame)}>
    <div className="session-scene__door"><span className="session-scene__door-label">ACCESO A SIAL</span><svg className="session-scene__lock" viewBox="0 0 48 48" fill="none"><rect x="10" y="21" width="28" height="23" rx="7"/><path d="M16 21v-8a8 8 0 0 1 16 0v8M24 30v6"/></svg><span className="session-scene__door-state"><i/>Sesión no activa</span></div>
    <div className="session-scene__floor"/><div className="session-scene__bubble" style={{opacity:pose.bubble,transform:`translateY(${6*(1-pose.bubble)}px)`}}>Necesitamos identificarte<br/>para continuar.</div>
    <div className="session-scene__actor"><SessionActor pose={pose}/></div>
  </div>;
}
