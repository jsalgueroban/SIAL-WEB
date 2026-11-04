import {sessionRigAt} from './session-rig.mjs';
const clamp=t=>Math.max(0,Math.min(1,t));
const smooth=(f,a,b)=>{const t=clamp((f-a)/(b-a));return t*t*t*(t*(t*6-15)+10);};
const beat=(f,a,b,c,d)=>smooth(f,a,b)-smooth(f,c,d);
export const NEUTRAL_FPS=60,NEUTRAL_ENTRY=164,NEUTRAL_LOOP=480,NEUTRAL_FRAMES=644;
export const NEUTRAL_LENS={x:500,y:350,r:30};
const turn=(point,angle,pivot)=>{const r=angle*Math.PI/180,c=Math.cos(r),s=Math.sin(r),x=point.x-pivot.x,y=point.y-pivot.y;return{x:pivot.x+x*c-y*s,y:pivot.y+x*s+y*c};};
export function neutralLensAt(p){
 const arm=turn(NEUTRAL_LENS,p.rightAngle,{x:365,y:425});
 const torso=turn(arm,p.bodyAngle,{x:322,y:604});
 return {x:torso.x+p.travel+p.offset,y:torso.y+p.bob};
}
export function neutral404At(frame,mode='search'){
 const raw=Math.max(0,frame),f=raw<NEUTRAL_FRAMES?raw:NEUTRAL_ENTRY+(raw-NEUTRAL_ENTRY)%NEUTRAL_LOOP,base=sessionRigAt(Math.min(f,164));
 const walk=1-smooth(f,100,150),arrive=smooth(f,150,164),scan=beat(f,184,232,300,352);
 const puzzled=beat(f,338,370,410,450),guide=beat(f,438,490,548,600);
 const idleGlance=0,idleGuide=0,breath=0;
 const search=mode==='search';
 // One rigid arm/tool sweeps three zones, pauses to inspect, then lowers.
 const sweep=-76*smooth(f,164,240)+28*smooth(f,244,280)+28*smooth(f,288,328)-14*smooth(f,336,356)+34*smooth(f,364,420);
 const right=search?48+3*Math.sin(f*Math.PI/20)*walk+sweep-12*guide-5*idleGlance:48+3*Math.sin(f*Math.PI/20)*walk+(-27-10*Math.sin((f-184)*Math.PI/84))*scan-20*puzzled-12*guide-5*idleGlance;
 const attention=search?beat(f,164,212,362,416):0;
 const lens=turn(NEUTRAL_LENS,right,{x:365,y:425}),dx=lens.x-334,dy=lens.y-340,distance=Math.hypot(dx,dy);
 const lookX=10*dx/distance,lookY=9*dy/distance;
 return {f:raw,cycleFrame:f,mode,travel:base.travel,offset:mode==='search'?140:165,
  left:base.left,right:base.right,farFootOpacity:base.farFootOpacity,
  bodyAngle:2*walk+.6*arrive+1.2*scan+(search?4*attention:0)-1.5*puzzled-.7*guide-.25*breath,
  bob:base.bob*walk-.8*scan-.4*breath,leftAngle:search?-3*Math.sin(f*Math.PI/20)*walk+4*attention+40*guide:-2*scan+14*puzzled+24*guide,
  elbowAngle:search?15*beat(f,446,498,540,592):0,
  rightAngle:right,puzzled,scan,guide,attention,glass:search?1:0,
  gaze:4*walk+lookX*attention+(search?0:-4*puzzled*(1-attention)-3*guide)+3*idleGlance-2*idleGuide,
  gazeY:lookY*attention+(search?0:2*puzzled*(1-attention)),
  browLift:search?2*attention+4*puzzled:0,
  blink:1-.9*Math.max(0,1-Math.abs(f-176)/5,1-Math.abs(f-388)/5),
  phase:f<100?'walking':f<164?'settling':f<232?'examining':f<352?'searching':f<450?'puzzled':f<600?'guiding':'idle'};
}
