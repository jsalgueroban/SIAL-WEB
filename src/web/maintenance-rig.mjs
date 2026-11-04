import {sessionRigAt} from './session-rig.mjs';
import {cartoonFlightAt,CARTOON_CUES} from './cartoon-flight.mjs';
import {logoPoint,screenToLogo,fragmentPolygons,insidePolygon,containFragment} from './workshop-space.mjs';
const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=(f,a,b)=>{const t=clamp((f-a)/(b-a));return t*t*t*(t*(t*6-15)+10);};
const beat=(f,a,b,c,d)=>smooth(f,a,b)-smooth(f,c,d);
const settle=(f,hit,duration)=>1-(1-clamp((f-hit)/duration))**3;
export const WORKSHOP_FPS=60;
export const WORKSHOP_FRAMES=1740;
export const WELD_FRAMES=840;
export const RELAPSE_FRAME=1512;
export const HAMMER_HITS=[108,204,300,876,972];
export const TOOL_TIP={x:500,y:340};
export function actorPoint(point,pose){
  const r=pose.bodyAngle*Math.PI/180,dx=point.x-322,dy=point.y-604;
  const body={x:322+dx*Math.cos(r)-dy*Math.sin(r),y:604+(pose.bob||0)+dx*Math.sin(r)+dy*Math.cos(r)};
  const a=(pose.flightAngle||0)*Math.PI/180,s=pose.scale??1,pivot=pose.flightPivotY??604;
  const x=322+(body.x-322)*Math.cos(a)-(body.y-pivot)*Math.sin(a),y=pivot+(body.x-322)*Math.sin(a)+(body.y-pivot)*Math.cos(a);
  return {x:pose.x+(pose.airOffsetX??0)+322+(x-322)*s*(pose.elasticX??1),y:pose.y+(pose.airOffsetY??0)+645+(y-645)*s*(pose.elasticY??1)};
}
export function toolPoint(pose,point=TOOL_TIP){
  const w=(pose.wrist||0)*Math.PI/180,wx=point.x-453,wy=point.y-420;
  const px=453+wx*Math.cos(w)-wy*Math.sin(w),py=420+wx*Math.sin(w)+wy*Math.cos(w);
  const r=pose.arm*Math.PI/180,dx=px-365,dy=py-425;
  return actorPoint({x:365+dx*Math.cos(r)-dy*Math.sin(r),y:425+dx*Math.sin(r)+dy*Math.cos(r)},pose);
}
export const WORK_CONTACT=toolPoint({x:170,y:0,bodyAngle:0,arm:54});
export const WELD_CONTACT=WORK_CONTACT;
export const CONTACT_UV=screenToLogo(WORK_CONTACT);
export const CONTACT_FRAGMENT=fragmentPolygons.findIndex(poly=>insidePolygon([641+CONTACT_UV.u,320+CONTACT_UV.v],poly));
const weldPath=[[WELD_CONTACT.x,WELD_CONTACT.y],...[ [69,98],[30,106],[69,98],[41,147],[69,98] ].map(p=>{const q=logoPoint(...p);return[q.x,q.y];})];
export const FREE_SHOULDER={x:214,y:414};
// Turn the complete master arm over: its elbow must bend outside the torso
// when hanging down. A horizontal reflection alone buries that bend inside it.
export function freeArmLocalPoint(point,pose){
 const r=pose.leftArm*Math.PI/180,dx=point.x-365,dy=point.y-425;
 return {x:FREE_SHOULDER.x-dx*Math.cos(r)+dy*Math.sin(r),y:FREE_SHOULDER.y-dx*Math.sin(r)-dy*Math.cos(r)};
}
export const freeArmTransform=pose=>`translate(${FREE_SHOULDER.x} ${FREE_SHOULDER.y}) rotate(${pose.leftArm}) scale(-1 -1) translate(-365 -425)`;
export function freeHandPoint(pose){return actorPoint(freeArmLocalPoint({x:453,y:420},pose),pose);}
function weldingTarget(progress){
  const part=Math.min(weldPath.length-2,Math.floor(progress*(weldPath.length-1))),t=smooth(progress*(weldPath.length-1)-part,0,1),a=weldPath[part],b=weldPath[part+1];
  return {x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t};
}
function aimTorch(pose,target){
  // Two rigid lengths: original shoulder-to-grip and grip-to-nozzle. The
  // mitten rotates with the torch about its centre, never away from the arm.
  const r=-pose.bodyAngle*Math.PI/180,dx=target.x-pose.x-322,dy=target.y-pose.y-604-pose.bob;
  const x=322+dx*Math.cos(r)-dy*Math.sin(r)-365,y=604+dx*Math.sin(r)+dy*Math.cos(r)-425;
  const a=Math.hypot(88,-5),b=Math.hypot(47,-80),distance=Math.min(a+b-.001,Math.hypot(x,y));
  const elbow=Math.acos(Math.max(-1,Math.min(1,(distance*distance-a*a-b*b)/(2*a*b))));
  const shoulder=Math.atan2(y,x)-Math.atan2(b*Math.sin(elbow),a+b*Math.cos(elbow));
  return {arm:(shoulder-Math.atan2(-5,88))*180/Math.PI,wrist:(elbow-Math.atan2(-80,47)+Math.atan2(-5,88))*180/Math.PI};
}
export function workshopAt(frame,mode='workshop'){
  const weldOnly=mode==='weld',duration=weldOnly?WELD_FRAMES:WORKSHOP_FRAMES;
  const f=Math.max(0,Math.min(duration-1,frame));
  let windup=0,follow=0,impact=0,jolt=0;
  if(!weldOnly)for(const hit of HAMMER_HITS){
    windup+=beat(f,hit-56,hit-18,hit-18,hit);
    follow+=beat(f,hit,hit+6,hit+6,hit+26);
    impact=Math.max(impact,Math.max(0,1-(f-hit)/24)*(f>=hit?1:0));
    const age=f-hit;
    if(age>0&&age<24)jolt+=Math.sin(age*Math.PI/5)*Math.exp(-age/7)*(1-smooth(age,17,24));
  }
  const flight=weldOnly?{x:170,y:0,scale:1,flightAngle:0,elasticX:1,elasticY:1,groundY:645,shadowWidth:1,shadowOpacity:1,trail:0,landing:0,secondLanding:0,dazed:0,getUp:0,dustOff:0,brush:0,dustShake:0,lookAt:0,readyRun:0,phase:null}:cartoonFlightAt(f);
  const walkAmount=weldOnly?0:beat(f,CARTOON_CUES.run,622,778,804),walk=sessionRigAt(Math.max(0,f-CARTOON_CUES.run)*1.25%40);
  const weldStart=weldOnly?80:1050,weldEnd=weldOnly?430:1280;
  const reset=0;
  const weld=smooth(f,weldStart,weldEnd)*(1-reset);
  const arc=beat(f,weldStart,weldStart+14,weldEnd-12,weldEnd);
  const torch=weldOnly?1:beat(f,1000,1038,1376,1420);
  const goggles=weldOnly?1:beat(f,1014,1050,1320,1360);
  const readyArm=54-30*beat(f,990,1015,1028,1050);
  const flightArm=weldOnly?0:-35*beat(f,300,330,426,474);
  const relapseAt=weldOnly?570:RELAPSE_FRAME;
  const surprise=beat(f,relapseAt+3,relapseAt+13,relapseAt+90,relapseAt+155);
  const bodyAngle=(weldOnly?3*arc:-5*windup-.6*follow+8*walkAmount+3*arc)-2*surprise-4*flight.getUp+1.8*flight.dustShake+4*flight.lookAt+6*flight.readyRun*(1-walkAmount);
  const shock=Math.max(weldOnly?0:beat(f,300,302,354,368),surprise);
  const pose={...flight,f,mode,x:flight.x+40*torch,bodyAngle,bob:walk.bob*walkAmount+3*flight.readyRun*(1-walkAmount),
    arm:(weldOnly?54:readyArm-108*windup-4*follow+flightArm+48*walkAmount+5*Math.sin(f*Math.PI/16)*walkAmount)-14*surprise,wrist:0,
    leftArm:-84+5*torch+8*windup-3*follow+(4+12*Math.cos((f-CARTOON_CUES.run)*Math.PI/16))*walkAmount+55*(weldOnly?0:beat(f,300,318,416,438))+30*flight.getUp-22*flight.brush+14*surprise+2*arc*Math.sin(clamp((f-weldStart)/(weldEnd-weldStart))*Math.PI*2),
    freePalm:Math.max(shock,flight.dustOff)*(1-torch),
    left:{x:walk.left.x*walkAmount,y:walk.left.y*walkAmount,angle:walk.left.angle*walkAmount,facing:-1},
    right:{x:walk.right.x*walkAmount,y:walk.right.y*walkAmount,angle:walk.right.angle*walkAmount,facing:1},walkAmount,
    torch,goggles,weld,arc,impact:torch>.5?0:impact,
    hitAge:weldOnly?-1:Math.min(...HAMMER_HITS.filter(hit=>f>=hit&&f<hit+24).map(hit=>f-hit),Infinity),
    blast:weldOnly?0:beat(f,300,304,312,340),
    smoke:weldOnly?0:beat(f,302,322,378,440),
    gaze:5+6*walkAmount+4*arc-8*flight.dustOff+2*flight.lookAt,blink:1-.9*Math.max(0,1-Math.abs(f-(weldOnly?470:448))/5),
    effort:Math.max(windup,.85*impact,.65*flight.getUp)*(1-shock),shock,runAmount:walkAmount,
    phase:f>=relapseAt?(surprise>.05?'surprised':f<relapseAt+30?'relapse':'ready-again'):weldOnly?(f<80?'preparing':f<430?'welding':'inspecting'):
      flight.phase??(f<64?'preparing':f<300?'hammering':f<804?'returning':f<1000?'hammering':f<1050?'goggles':f<1280?'welding':'inspecting')};
  const base=[[-10,-9],[15,-15],[20,-3],[18,8],[8,13],[-9,15],[-18,3],[0,0]],blast=[[-36,-36],[18,-48],[44,-20],[37,14],[17,34],[-16,31],[-32,11],[-20,-8]];
  pose.pieces=base.map(([x,y],i)=>{
    const firstRepair=i===0?1:i<3?settle(f,108,26):i<5?settle(f,204,26):0;
    const secondRepair=i<4?settle(f,i<2?876:972,48):0;
    const welded=smooth(f,weldStart+12*i,weldEnd-65+9*i);
    const assembled=weldOnly?welded:f<300?firstRepair:firstRepair*(1-smooth(f,300,348))+secondRepair;
    const scatter=weldOnly?0:smooth(f,300,348)*(1-secondRepair)*(1-welded)*(1-reset);
    const gap=(1-assembled)*(1-welded)*(1-reset)+reset;
    return {x:x*gap+blast[i][0]*scatter,y:y*gap+blast[i][1]*scatter,angle:(i-3.5)*5*(weldOnly?gap:scatter),height:weldOnly?0:Math.sin(Math.PI*smooth(f,300,400))*(16+i*4)};
  });
  // The datum and contact fragment stay fixed. Each remaining fragment reacts
  // to a blow or sustained welding, then rests within the anvil work face.
  for(const i of [0,CONTACT_FRAGMENT])pose.pieces[i]={x:0,y:0,angle:0,height:0};
  pose.pieces=pose.pieces.map((piece,i)=>{
    if(i===0||i===CONTACT_FRAGMENT)return containFragment(piece,i);
    const failure=settle(f,relapseAt,30),[x,y]=base[i];
    const initialAngle=weldOnly?(i-3.5)*5:0;
    return containFragment({...piece,x:piece.x*(1-failure)+x*failure+jolt*2,y:piece.y*(1-failure)+y*failure-jolt*.7,angle:piece.angle*(1-failure)+initialAngle*failure+jolt*.35,height:piece.height*(1-failure)+Math.max(0,jolt)*.8},i);
  });
  const target=weldingTarget(clamp((f-weldStart)/(weldEnd-weldStart)));
  const restart=smooth(f,relapseAt+155,duration-1);
  pose.weldTarget={x:target.x+(WELD_CONTACT.x-target.x)*restart,y:target.y+(WELD_CONTACT.y-target.y)*restart};
  if(torch>0){const aim=aimTorch(pose,pose.weldTarget);pose.arm+=(aim.arm-pose.arm)*torch;pose.wrist=aim.wrist*torch;}
  return pose;
}
