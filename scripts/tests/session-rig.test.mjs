import test from 'node:test';
import assert from 'node:assert/strict';
import {sessionRigAt,SESSION_FRAMES,SESSION_LOOP_START,SESSION_LOOP_FRAMES} from '../../src/web/session-rig.mjs';
test('complete master arms retain dimensions and wrist continuity across every frame',()=>{
  let previous;
  for(let f=0;f<SESSION_FRAMES;f++){
    const p=sessionRigAt(f);
    for(const key of ['leftArm','rightArm']){
      const a=p[key];
      assert.ok(Math.abs(Math.hypot(a.wrist.x-a.shoulder.x,a.wrist.y-a.shoulder.y)-Math.hypot(88,-5)*a.scale)<1e-8);
      if(previous)assert.ok(Math.hypot(a.wrist.x-previous[key].wrist.x,a.wrist.y-previous[key].wrist.y)<4);
    }
    previous=p;
  }
});
test('sign stays upright and never spins while the arm rises',()=>{
  for(let f=0;f<SESSION_FRAMES;f++){
    const p=sessionRigAt(f),next=sessionRigAt(f+1);
    assert.ok(p.signAngle>=-12&&p.signAngle<=0);
    assert.ok(Math.abs(next.signAngle-p.signAngle)<.5);
  }
});
test('shield presents from its hand contact after opening the palm',()=>{
  const early=sessionRigAt(203),turn=sessionRigAt(224),shown=sessionRigAt(260);
  assert.equal(early.shield,0);assert.equal(early.shieldFace,0);
  assert.ok(turn.shieldFace>0&&turn.shieldFace<1);
  assert.ok(turn.shieldTilt<0);assert.ok(turn.palmAngle<early.palmAngle);
  assert.equal(shown.shield,1);assert.equal(shown.shieldFace,1);assert.ok(Math.abs(shown.shieldTilt)<1e-9);
});
test('idle is periodic, grounded, active and continuous across wrap',()=>{
  const start=sessionRigAt(SESSION_LOOP_START),peak=sessionRigAt(SESSION_LOOP_START+70);
  assert.deepEqual(sessionRigAt(SESSION_LOOP_START+SESSION_LOOP_FRAMES),start);
  assert.ok(peak.leftArm.wrist.y<start.leftArm.wrist.y-3);
  assert.ok(peak.bodyAngle<start.bodyAngle);assert.ok(peak.bob<start.bob);
  for(let f=SESSION_LOOP_START;f<SESSION_FRAMES+5;f++){
    const a=sessionRigAt(f),b=sessionRigAt(f+1);
    assert.equal(a.travel,0);assert.equal(a.left.x,0);assert.equal(a.right.y,0);assert.equal(a.shield,1);
    assert.ok(Math.abs(a.bodyAngle-b.bodyAngle)<.1);
    assert.ok(Math.hypot(a.leftArm.wrist.x-b.leftArm.wrist.x,a.leftArm.wrist.y-b.leftArm.wrist.y)<1.2);
  }
});
test('waiting alternates contextual looks and two reminders with a genuine rest',()=>{
  const p=offset=>sessionRigAt(SESSION_LOOP_START+offset);
  assert.ok(p(70).gaze<p(0).gaze-4);
  assert.ok(p(180).gaze>p(0).gaze+3);
  assert.ok(p(300).gaze>p(180).gaze+3);
  assert.ok(p(70).leftArm.wrist.y<p(0).leftArm.wrist.y-17);
  assert.ok(p(70).signAngle<=-6);
  assert.ok(p(162).leftArm.wrist.y<p(0).leftArm.wrist.y-14);
  assert.equal(p(400).leftArm.angle,p(0).leftArm.angle);
  for(let f=0;f<SESSION_LOOP_FRAMES;f++){
    const pose=p(f);
    assert.equal(pose.shieldFace,1);assert.ok(Math.abs(pose.shieldTilt)<1e-9);
    assert.ok(Math.abs(pose.rightArm.angle-p(0).rightArm.angle)<.3);
    assert.ok(pose.blink>=.08-1e-9&&pose.blink<=1);
  }
});
test('stance cancels root travel without sliding',()=>{
  const a=sessionRigAt(3),b=sessionRigAt(16);
  assert.ok(Math.abs(a.travel+a.left.x-b.travel-b.left.x)<1e-8);
});
test('arrival precedes raising and shield presentation',()=>{
  for(let f=0;f<=164;f++){
    const p=sessionRigAt(f);assert.equal(p.shield,0);assert.ok(p.rightArm.wrist.y>470);
  }
  const p=sessionRigAt(156);assert.equal(p.phase,'arrived');assert.equal(p.left.y,0);assert.equal(p.right.y,0);
  assert.equal(sessionRigAt(210).phase,'raising');assert.equal(sessionRigAt(260).phase,'looking');
  assert.equal(sessionRigAt(335).shield,1);assert.equal(sessionRigAt(335).bubble,1);
  assert.equal(sessionRigAt(335).phase,'ready');assert.equal(sessionRigAt(335).palmAngle,0);
});
test('braking preserves world-space supports and finishes on the two master feet',()=>{
  for(let f=100;f<=124;f++){
    const p=sessionRigAt(f);assert.ok(Math.abs(p.travel+p.right.x+20)<1e-8);assert.equal(p.right.y,0);
  }
  for(let f=124;f<=150;f++){
    const p=sessionRigAt(f);assert.ok(Math.abs(p.travel+p.left.x)<1e-8);assert.equal(p.left.y,0);
  }
  const speed=f=>sessionRigAt(f+.001).travel-sessionRigAt(f).travel;
  assert.ok(Math.abs(speed(99.999)-speed(100))<1e-6);
  assert.ok(Math.abs(speed(140))<1e-8);
  const end=sessionRigAt(150);
  assert.equal(end.travel,0);assert.equal(end.left.x,0);assert.equal(end.right.x,0);
});
test('both shoes retain full width and approach direction through entry and idle',()=>{
  for(let f=0;f<SESSION_FRAMES;f++){
    const p=sessionRigAt(f);
    assert.equal(p.left.facing,-1);assert.equal(p.right.facing,1);
    assert.ok(Number.isFinite(p.left.angle));assert.ok(Number.isFinite(p.right.angle));
  }
});
test('torso transfers weight and rises with the arms, then settles to the master',()=>{
  assert.ok(sessionRigAt(156).bob>1);
  assert.ok(sessionRigAt(216).bob<-.5);
  assert.ok(sessionRigAt(216).rightArm.angle<sessionRigAt(180).rightArm.angle);
  assert.equal(sessionRigAt(336).bob,0);assert.equal(sessionRigAt(336).bodyAngle,1);
});
test('presentation rests on the existing catalog placements',()=>{
  const p=sessionRigAt(336);
  assert.equal(p.rightArm.angle,-18);assert.equal(p.rightArm.scale,.92);
  assert.equal(p.leftArm.angle,28);assert.equal(p.leftArm.scale,.9);
  assert.deepEqual(p.rightArm.shoulder,{x:365,y:425});
  assert.deepEqual(p.leftArm.shoulder,{x:215,y:425});
});
