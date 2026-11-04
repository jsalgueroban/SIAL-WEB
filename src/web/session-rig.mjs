const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const ease=(f,a,b)=>{const t=clamp((f-a)/(b-a),0,1);return t*t*(3-2*t);};
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=(f,a,b)=>{const t=clamp((f-a)/(b-a),0,1);return t*t*t*(t*(t*6-15)+10);};
export const SESSION_FPS=60;
export const SESSION_LOOP_START=336;
export const SESSION_LOOP_FRAMES=480;
export const SESSION_FRAMES=SESSION_LOOP_START+SESSION_LOOP_FRAMES;
// The complete curved master is a single rigid silhouette. Placements match
// the existing forbidden model; wrist coordinates follow that same matrix.
function placeArm(side,angle){
  const left=side==='left',scale=left ? .9 : .92,shoulder={x:left?215:365,y:425};
  const x=(left?-88:88)*scale,y=-5*scale,r=angle*Math.PI/180;
  return {angle,scale,shoulder,mirrored:left,wrist:{x:shoulder.x+x*Math.cos(r)-y*Math.sin(r),y:shoulder.y+x*Math.sin(r)+y*Math.cos(r)}};
}
export function sessionRigAt(input){
  const f=Math.max(0,input),stride=40;
  // Constant approach, then constant deceleration. Position and velocity match
  // at 100; the root stops at 140 while the final support finishes at 150.
  const braking=clamp(f-100,0,40);
  const travel=f<100?-240+f*2:-40+2*braking-.025*braking*braking;
  const foot=(offset)=>{const p=((f+offset)%40)/40;
    if(p<.5)return {x:stride/2-stride*p*2,y:0,angle:0};
    const t=(p-.5)*2;return {x:-stride/2+stride*t,y:-16*Math.sin(Math.PI*t),angle:-9*Math.sin(Math.PI*t)};};
  const closingLeft=clamp((f-100)/24,0,1),closingRight=clamp((f-124)/26,0,1);
  // These are world-space landing targets minus root travel. A planted foot
  // therefore remains still even while the torso is finishing its braking.
  const left=f<100?foot(0):{x:lerp(-60,0,ease(f,100,124))-travel,y:f<=100||f>=124?0:-16*Math.sin(Math.PI*closingLeft),angle:f<=100||f>=124?0:-8*Math.sin(Math.PI*closingLeft)};
  const right=f<124?(f<100?foot(20):{x:-20-travel,y:0,angle:0}):{x:lerp(-20,0,ease(f,124,150))-travel,y:f<=124||f>=150?0:-12*Math.sin(Math.PI*closingRight),angle:f<=124||f>=150?0:-6*Math.sin(Math.PI*closingRight)};
  // Both shoes keep pointing toward the approach. No intermediate X scaling:
  // the complete master silhouette only translates, reflects and rotates.
  left.facing=-1;
  right.facing=1;
  const approach=1-smooth(f,100,150);
  const walk=Math.sin(f*Math.PI/20)*approach,lift=smooth(f,164,236);
  // One entry, then an exactly periodic attention gesture. Both position and
  // velocity match at the wrap; feet and root travel stay planted throughout.
  const idle=Math.max(0,f-SESSION_LOOP_START)%SESSION_LOOP_FRAMES;
  const resting=f>=SESSION_LOOP_START;
  const beat=(a,b,c,d)=>smooth(idle,a,b)-smooth(idle,c,d);
  // An eight-second phrase: look towards the action, two clear attention beats,
  // then look back and rest. Each beat settles before the next; no hand-only
  // shake, scale changes or accumulating rotation at the loop boundary.
  const gesture=resting?(beat(24,64,78,118)+.85*beat(118,158,170,214)):0;
  const bodyLead=resting?beat(8,56,174,238):0;
  const breath=resting?.5*(1-Math.cos(idle*2*Math.PI/SESSION_LOOP_FRAMES)):0;
  const glance=resting?-6*beat(16,48,92,128)+4*beat(142,174,190,224)+8*beat(250,288,326,366):0;
  const blinkAt=(center)=>Math.max(0,1-Math.abs(idle-center)/5);
  const shield=smooth(f,204,248);
  const landingDip=2.2*(smooth(f,142,154)-smooth(f,166,184));
  const rise=1.4*(lift-smooth(f,238,272));
  return {left,right,travel,farFootOpacity:1-.1*approach,
    bob:(f<100?-2.5*(1-Math.cos(f*Math.PI/10)):(left.y+right.y)*.12)+landingDip-rise-1.8*bodyLead-.45*breath,
    bodyAngle:2*approach+smooth(f,150,236)+.6*(smooth(f,156,182)-smooth(f,214,254))-.95*bodyLead-.12*breath,
    rightArm:placeArm('right',lerp(48+walk*3,-18,lift)+.25*gesture),
    leftArm:placeArm('left',lerp(-42-walk*3,28,lift)+16*gesture),
    signAngle:lerp(-10+walk,0,smooth(f,164,240))-7*gesture,
    palmAngle:lerp(12,0,lift),shield:f<204?0:1,
    shieldFace:Math.sin(shield*Math.PI/2),shieldTilt:-16*(1-shield),
    gaze:4*approach+lerp(0,6,ease(f,240,258))+lerp(0,-10,ease(f,274,294))+glance,
    blink:1-.92*Math.max(0,1-Math.abs(f-268)/4,resting?Math.max(blinkAt(138),blinkAt(246),blinkAt(398)):0),bubble:ease(f,294,318),
    phase:f<100?'walking':f<150?'settling':f<164?'arrived':f<240?'raising':f<294?'looking':f<318?'explaining':f<SESSION_LOOP_START?'ready':'idle'};
}
