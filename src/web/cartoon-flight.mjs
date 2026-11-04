const clamp=t=>Math.max(0,Math.min(1,t));
const smooth=(f,a,b)=>{const t=clamp((f-a)/(b-a));return t*t*t*(t*(t*6-15)+10);};
const beat=(f,a,b,c,d)=>smooth(f,a,b)-smooth(f,c,d);
export const CARTOON_CUES={hit:300,release:304,land:360,bounce:390,settle:412,rise:440,stand:488,dustEnd:548,lookEnd:584,run:604,arrive:804};
export function cartoonFlightAt(f){
 const u=clamp((f-304)/56),distance=1-(1-u)**3,rise=smooth(f,440,488),back=smooth(f,604,804);
 const b1=f>=360&&f<390?(f-360)/30:0,b2=f>=390&&f<412?(f-390)/22:0;
 const arc=f>=304&&f<360?-135*4*u*(1-u):f>=360&&f<390?-100*4*b1*(1-b1):f>=390&&f<412?-45*4*b2*(1-b2):0;
 const landed=f>=360?1:0,lying=landed*(1-rise);
 const impact=f>=360&&f<374?1-(f-360)/14:0,second=f>=390&&f<402?1-(f-390)/12:0;
 const hitPause=beat(f,300,301,303,304),stretch=beat(f,304,309,316,330);
 const elasticX=1+.08*hitPause-.1*stretch+.22*impact+.12*second;
 const angle=f>=488?0:f<360?-360*smooth(f,304,332)-90*smooth(f,328,360):(-90-20*Math.sin(Math.PI*b1)+10*Math.sin(Math.PI*b2))*(1-rise)+10*Math.sin(Math.PI*rise);
 const inAir=f>=304&&f<360,flightPivotY=inAir?390:604;
 // Rotate about the torso in flight. Reconcile the pivot gradually before
 // contact, so the already-approved landing transform remains identical.
 const align=inAir?smooth(f,330,360):0,radians=angle*Math.PI/180,size=1-.78*distance*(1-back);
 const pivotX=214*Math.sin(radians)*size*elasticX*align,pivotY=214*(1-Math.cos(radians))*size/elasticX*align;
 const dustOff=beat(f,488,496,540,548),brush=beat(f,490,502,508,516)+beat(f,518,530,536,544);
 return {
  x:170-270*distance*(1-back)-18*smooth(f,360,412)*(1-rise),
  y:-240*distance*(1-back)+arc,
  scale:size,flightAngle:angle,flightPivotY,airOffsetX:pivotX,airOffsetY:pivotY,elasticX,elasticY:1/elasticX,
  groundY:645-240*distance*(1-back)+22*lying,
  shadowWidth:1+2*lying,shadowOpacity:1-.65*(f>=304&&f<360?Math.sin(Math.PI*u):b1?Math.sin(Math.PI*b1)*.6:b2?Math.sin(Math.PI*b2)*.3:0),
  trail:beat(f,304,307,326,350),landing:impact,secondLanding:second,
  dazed:beat(f,410,419,431,442),getUp:beat(f,436,448,474,488),dustOff,brush,
  dustShake:dustOff*Math.sin((f-488)*Math.PI/7),lookAt:beat(f,548,560,580,594),readyRun:beat(f,584,596,604,622),
  phase:f<300?null:f<304?'hit-pause':f<360?'flying':f<390?'first-bounce':f<412?'second-bounce':f<440?'dazed':f<488?'getting-up':f<548?'dusting-off':f<584?'looking-at-anvil':f<604?'ready-to-run':null,
 };
}
export function flightCenter(p){
 const a=p.flightAngle*Math.PI/180,pivot=p.flightPivotY??604;
 return {x:p.x+(p.airOffsetX??0)+322-(390-pivot)*Math.sin(a)*p.scale*p.elasticX,y:p.y+(p.airOffsetY??0)+645+(pivot+(390-pivot)*Math.cos(a)-645)*p.scale*p.elasticY};
}
export function flightStreakAt(frame,current=null,prior=null){
 const p=cartoonFlightAt(frame),center=current??flightCenter(p),previous=prior??flightCenter(cartoonFlightAt(frame-1));
 const dx=previous.x-center.x,dy=previous.y-center.y,speed=Math.hypot(dx,dy),back={x:dx/(speed||1),y:dy/(speed||1)};
 const angle=p.flightAngle*Math.PI/180,localX=back.x*Math.cos(angle)+back.y*Math.sin(angle),localY=-back.x*Math.sin(angle)+back.y*Math.cos(angle);
 const radius=1/Math.sqrt((localX/(115*p.scale))**2+(localY/(255*p.scale))**2||1);
 return {center,back,normal:{x:-back.y,y:back.x},speed,length:Math.min(100,Math.max(18,speed*4)),offset:radius+6,opacity:p.trail*Math.min(1,speed/8)*.65};
}
