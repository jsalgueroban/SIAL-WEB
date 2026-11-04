import test from 'node:test';
import assert from 'node:assert/strict';
import {logoPoint,logoMatrix,screenToLogo,LOGO_THICKNESS,fragmentPolygons,insidePolygon,brandOutline,wallQuad,fragmentFootprints,movedUV,WORK_FACE} from '../../src/web/workshop-space.mjs';
import {WORK_CONTACT,CONTACT_FRAGMENT,workshopAt,freeHandPoint,freeArmLocalPoint,FREE_SHOULDER,WORKSHOP_FRAMES,WELD_FRAMES,HAMMER_HITS} from '../../src/web/maintenance-rig.mjs';
test('the mark lies on one shared 3D plane with a real fourteen-unit extrusion',()=>{
 for(const [u,v] of [[0,0],[200,0],[0,200],[200,200],[80,95]]){
  const p=logoPoint(u,v),[a,b,c,d,e,f]=logoMatrix,x=641+u,y=320+v;
  assert.ok(Math.hypot(p.x-(a*x+c*y+e),p.y-(b*x+d*y+f))<1e-8);
  const ground=logoPoint(u,v,0);assert.equal(ground.y-p.y,LOGO_THICKNESS);
  const uv=screenToLogo(p);assert.ok(Math.hypot(uv.u-u,uv.v-v)<1e-8);
 }
 assert.ok(logoMatrix[0]*logoMatrix[3]-logoMatrix[1]*logoMatrix[2]>0,'preserve mark orientation');
 assert.equal(wallQuad([[670,420],[690,440]],{x:0,y:0,angle:0}).length,4);
});
test('hammer contact is on the actual mark and its held fragment',()=>{
 const uv=screenToLogo(WORK_CONTACT),point=[641+uv.u,320+uv.v];
 assert.ok(insidePolygon(point,brandOutline));assert.ok(CONTACT_FRAGMENT>=0);
 assert.ok(insidePolygon(point,fragmentPolygons[CONTACT_FRAGMENT]));
});
test('free hand and expression have distinct working, blast and running contexts',()=>{
 const hit=workshopAt(90),shock=workshopAt(305),run=workshopAt(650),weld=workshopAt(1150);
 assert.ok(hit.effort>.4);assert.ok(shock.shock>.8);assert.ok(run.runAmount>.9);
 assert.ok(run.arm>90);assert.ok(run.leftArm>=-92&&run.leftArm<=-68);
 assert.ok(hit.leftArm>=-82&&hit.leftArm<=-68);assert.ok(weld.leftArm>=-80&&weld.leftArm<=-70);
 assert.ok(weld.arm<25,'welding elbow stays outside the torso');
 for(const p of [hit,shock,run,weld]){const hand=freeHandPoint(p);assert.ok(Number.isFinite(hand.x)&&Number.isFinite(hand.y));}
 assert.ok(workshopAt(312).scale<.85,'depth reads after the four-frame hit pause');
});
test('every fragment remains within the usable anvil face through the entire story',()=>{
 for(const mode of ['workshop','weld'])for(let f=0;f<(mode==='weld'?WELD_FRAMES:WORKSHOP_FRAMES);f++){
  const p=workshopAt(f,mode);
  p.pieces.forEach((piece,i)=>{
   for(const point of fragmentFootprints[i]){
    const [x,y]=movedUV(point,piece),u=x-641,v=y-320;
    assert.ok(u>=WORK_FACE.minU-1e-8&&u<=WORK_FACE.maxU+1e-8&&v>=WORK_FACE.minV-1e-8&&v<=WORK_FACE.maxV+1e-8,`${mode} frame ${f} piece ${i}`);
   }
   const causedByHit=mode==='workshop'&&HAMMER_HITS.some(hit=>f>hit&&f<hit+24);
   if((mode==='weld'||f<300||f>=400)&&!causedByHit)assert.ok(Math.abs(piece.height)<1e-8);
  });
  assert.deepEqual(p.pieces[CONTACT_FRAGMENT],{x:0,y:0,angle:0,height:0});
 }
});
test('free shoulder is embedded in the torso while elbow and wrist retain master dimensions',()=>{
 // The root overlaps the torso: no exposed 24-unit shoulder ball at the edge.
 assert.ok(FREE_SHOULDER.x-193>=18&&FREE_SHOULDER.x-193<24);
 assert.ok(193-(FREE_SHOULDER.x-24)<=6);
 assert.ok(Math.abs(FREE_SHOULDER.y-411)<5);
 const grip={x:453,y:420},elbow={x:423,y:461.625};
 for(const mode of ['workshop','weld'])for(let f=0;f<(mode==='weld'?WELD_FRAMES:WORKSHOP_FRAMES);f++){
  const pose=workshopAt(f,mode),root=freeArmLocalPoint({x:365,y:425},pose),hand=freeArmLocalPoint(grip,pose),bend=freeArmLocalPoint(elbow,pose);
  assert.deepEqual(root,FREE_SHOULDER);
  assert.ok(Math.abs(Math.hypot(hand.x-root.x,hand.y-root.y)-Math.hypot(88,-5))<1e-8);
  assert.ok(Math.abs(Math.hypot(hand.x-bend.x,hand.y-bend.y)-Math.hypot(grip.x-elbow.x,grip.y-elbow.y))<1e-8);
  if(pose.leftArm>=-85&&pose.leftArm<=-60){
   assert.ok(bend.x<root.x-24,`hidden elbow ${mode} ${f}`);
   assert.ok(hand.y>root.y+70,`hand no longer hanging below shoulder ${mode} ${f}`);
  }
 }
});
test('free arm counterbalances the strike, swings with the stride and guides the cable steadily',()=>{
 const idle=workshopAt(0),ready=workshopAt(90),hit=workshopAt(114);
 assert.ok(ready.leftArm>idle.leftArm+7);
 assert.ok(hit.leftArm<idle.leftArm-2);
 const run=Array.from({length:33},(_,i)=>workshopAt(674+i).leftArm);
 assert.ok(Math.max(...run)-Math.min(...run)>23);
 for(let f=674;f<=706;f++){const p=workshopAt(f);assert.ok(p.left.x*(p.leftArm+80)>=-1e-8,`arm must counterbalance left foot at ${f}`);}
 const welding=Array.from({length:231},(_,i)=>workshopAt(1050+i).leftArm);
 assert.ok(Math.max(...welding)-Math.min(...welding)<=4.001);
 for(const f of [0,90,114,644,660,1150])assert.equal(workshopAt(f).freePalm,0);
 assert.ok(workshopAt(1537).freePalm>.9);
});
