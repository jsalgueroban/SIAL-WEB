import test from 'node:test';
import assert from 'node:assert/strict';
import {workshopAt,toolPoint,WORK_CONTACT,WELD_CONTACT,HAMMER_HITS,WORKSHOP_FRAMES,WELD_FRAMES,RELAPSE_FRAME} from '../../src/web/maintenance-rig.mjs';
test('every blow reaches the same actual point on the logo',()=>{
  for(const frame of HAMMER_HITS){
    const pose=workshopAt(frame),tip=toolPoint(pose);
    assert.ok(Math.hypot(tip.x-WORK_CONTACT.x,tip.y-WORK_CONTACT.y)<1e-8);
    assert.equal(pose.impact,1);assert.equal(pose.torch,0);
    assert.ok(workshopAt(frame-18).arm<pose.arm-100);
  }
});
test('the weld emitter follows its rigid tool and stays on the seam',()=>{
  for(const mode of ['workshop','weld'])for(let f=0;f<(mode==='weld'?WELD_FRAMES:WORKSHOP_FRAMES);f++){
    const pose=workshopAt(f,mode),tip=toolPoint(pose);
    if(pose.arc>.999)assert.ok(Math.hypot(tip.x-pose.weldTarget.x,tip.y-pose.weldTarget.y)<.01);
    assert.ok(Number.isFinite(tip.x)&&Number.isFinite(tip.y));
  }
});
test('the gag has a complete fall, recovery and return to repair',()=>{
  const standing=workshopAt(0),down=workshopAt(390),up=workshopAt(804);
  assert.ok(down.x<standing.x-200);assert.ok(down.flightAngle<-65);assert.ok(down.scale<.25);
  assert.equal(up.x,standing.x);assert.equal(up.bodyAngle,0);
  assert.equal(workshopAt(650).phase,'returning');
  assert.equal(workshopAt(1150).phase,'welding');assert.equal(workshopAt(1320).phase,'inspecting');
  let previous=workshopAt(604);
  for(let f=605;f<=804;f++){const p=workshopAt(f);assert.ok(p.scale>=previous.scale);assert.ok(p.x>=previous.x);assert.ok(Math.abs(p.flightAngle)<1e-9);previous=p;}
  assert.ok(workshopAt(650).left.y<0||workshopAt(650).right.y<0);
});
test('pieces assemble to the real unmodified brand and all frames stay continuous',()=>{
  for(const [mode,duration,complete] of [['workshop',WORKSHOP_FRAMES,1320],['weld',WELD_FRAMES,470]]){
    for(const piece of workshopAt(complete,mode).pieces){assert.ok(Math.hypot(piece.x,piece.y)<1e-8);assert.ok(Math.abs(piece.angle)<1e-8);}
    assert.deepEqual(workshopAt(duration,mode),workshopAt(duration-1,mode));
    let previous=workshopAt(0,mode);
    for(let f=1;f<=duration;f++){
      const pose=workshopAt(f,mode);
      for(const key of ['x','y','bodyAngle','arm','leftArm']){assert.ok(Number.isFinite(pose[key]));const launch=mode==='workshop'&&f>=305&&f<=329;const budget=launch&&key==='x'?20:launch&&key==='y'?26:13;assert.ok(Math.abs(pose[key]-previous[key])<budget,`${mode} ${f} ${key}`);}
      for(let i=0;i<8;i++)assert.ok(Math.hypot(pose.pieces[i].x-previous.pieces[i].x,pose.pieces[i].y-previous.pieces[i].y)<5,`${mode} ${f} piece ${i}`);
      previous=pose;
    }
  }
});
test('fragments wait for contact or the explicitly timed relapse',()=>{
 for(const [a,b] of [[0,108],[134,204],[230,300],[400,876],[924,972],[1020,1050],[1280,RELAPSE_FRAME]]){
  const expected=workshopAt(a).pieces;
  for(let f=a;f<=b;f++)assert.deepEqual(workshopAt(f).pieces,expected,`unprompted displacement at ${f}`);
 }
 for(const hit of [108,204,876,972]){
  assert.notDeepEqual(workshopAt(hit+6).pieces,workshopAt(hit).pieces,`no response to ${hit}`);
  assert.equal(workshopAt(hit-1).impact,0);assert.equal(workshopAt(hit).hitAge,0);assert.equal(workshopAt(hit+6).hitAge,6);
 }
});
test('hammer recoils above the work surface rather than penetrating the logo',()=>{
 for(const hit of HAMMER_HITS.filter(f=>f!==300)){
  let previous=toolPoint(workshopAt(hit-12));
  for(let f=hit-11;f<=hit+26;f++){
   const point=toolPoint(workshopAt(f));
   assert.ok(point.y<=WORK_CONTACT.y+.001,`tip below work face at ${f}`);
   if(f<=hit)assert.ok(Math.hypot(point.x-WORK_CONTACT.x,point.y-WORK_CONTACT.y)<=Math.hypot(previous.x-WORK_CONTACT.x,previous.y-WORK_CONTACT.y)+1e-8,`strike reverses before contact at ${f}`);
   else assert.ok(Math.hypot(point.x-previous.x,point.y-previous.y)<5,`oversized rebound at ${f}`);
   previous=point;
  }
  const before=workshopAt(hit).pieces,after=workshopAt(hit+3).pieces;
  assert.ok(after.some((piece,i)=>piece.height>before[i].height),'slight impact lift');
 }
});
test('complete logo breaks again, surprises the worker, and returns to the original pose without a cut',()=>{
 for(const [mode,duration,breakAt] of [['workshop',WORKSHOP_FRAMES,RELAPSE_FRAME],['weld',WELD_FRAMES,570]]){
  assert.ok(workshopAt(breakAt-1,mode).pieces.every(p=>Math.hypot(p.x,p.y)<1e-8));
  assert.ok(workshopAt(breakAt+20,mode).pieces.some(p=>Math.hypot(p.x,p.y)>5));
  assert.ok(workshopAt(breakAt+25,mode).shock>.9);
  assert.equal(workshopAt(breakAt+25,mode).phase,'surprised');
  const first=workshopAt(0,mode),last=workshopAt(duration-1,mode);
  for(const key of ['x','y','scale','bodyAngle','arm','wrist','leftArm','freePalm','shock','goggles','torch','gaze'])assert.ok(Math.abs(first[key]-last[key])<1e-8,`${mode}: loop ${key}`);
  assert.deepEqual(last.pieces,first.pieces);
 }
});
test('recovery acting keeps both feet planted and redirects attention before running',()=>{
 for(let f=488;f<=604;f++){
  const p=workshopAt(f);
  assert.equal(p.walkAmount,0);
  for(const side of ['left','right'])for(const key of ['x','y','angle'])assert.ok(Math.abs(p[side][key])<1e-9,`${side} ${key} slides at ${f}`);
 }
 const brush=workshopAt(510),glance=workshopAt(566),run=workshopAt(650);
 assert.equal(brush.phase,'dusting-off');assert.ok(brush.freePalm>.9);
 assert.equal(glance.phase,'looking-at-anvil');assert.ok(glance.gaze>brush.gaze+8);assert.equal(glance.freePalm,0);
 assert.equal(run.phase,'returning');assert.ok(run.walkAmount>.9);
});
