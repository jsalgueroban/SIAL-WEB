import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {cartoonFlightAt as at,flightCenter,flightStreakAt} from '../../src/web/cartoon-flight.mjs';
test('comic phrase has a held hit, an airborne arc, two diminishing bounces and a get-up',()=>{
 for(let f=300;f<=303;f++){assert.equal(at(f).x,170);assert.equal(at(f).y,0);assert.equal(at(f).scale,1);assert.equal(at(f).phase,'hit-pause');}
 assert.equal(at(320).phase,'flying');assert.ok(at(320).y<-150);assert.ok(at(320).scale<.7);
 assert.equal(at(360).phase,'first-bounce');assert.equal(at(390).phase,'second-bounce');
 assert.equal(at(420).phase,'dazed');assert.equal(at(450).phase,'getting-up');
 assert.ok(at(375).y<at(401).y-50);
 assert.equal(at(360).landing,1);assert.equal(at(390).secondLanding,1);
 assert.ok(at(424).dazed>.9);assert.ok(at(460).getUp>.9);
 assert.equal(at(488).flightAngle,0);
});
test('approved landing and all recovery frames remain identical after the launch edit',()=>{
 const approved=JSON.parse(fs.readFileSync(new URL('./fixtures/cartoon-recovery-approved.json',import.meta.url),'utf8'));
 assert.equal(approved.length,445);
 for(const {frame,pose} of approved){const actual=JSON.parse(JSON.stringify(at(frame)));for(const key of Object.keys(pose))assert.deepEqual(actual[key],pose[key],`approved ${frame} ${key}`);}
});
test('release covers more than half the distance in twelve frames and spins around the torso',()=>{
 assert.ok(at(316).x<35,'already more than half of270 units away after12 frames');
 assert.ok(at(316).scale<.61);
 assert.equal(at(316).flightPivotY,390);
 assert.ok(at(332).flightAngle<-360&&at(332).flightAngle>-365);
 assert.equal(at(360).flightPivotY,604);
 for(let f=305;f<330;f++){const p=at(f),c=flightCenter(p);assert.ok(Math.abs(c.x-(p.x+322))<1e-8,'spin must not orbit the feet');}
});
test('streaks point behind the actual path, fade with speed and stop before landing',()=>{
 for(let f=305;f<350;f++){
  const t=flightStreakAt(f),c=flightCenter(at(f)),previous=flightCenter(at(f-1));
  assert.ok(t.back.x*(previous.x-c.x)+t.back.y*(previous.y-c.y)>0);
  assert.ok(Number.isFinite(t.length+t.offset+t.opacity));
 }
 assert.equal(flightStreakAt(360).opacity,0);
});
test('elasticity is common to the complete rig and preserves area and resting proportions',()=>{
 for(let f=0;f<1740;f++){const p=at(f);assert.ok(Math.abs(p.elasticX*p.elasticY-1)<1e-12);assert.ok(p.elasticX>=.9&&p.elasticX<=1.22);assert.ok(Number.isFinite(p.x+p.y+p.flightAngle+p.scale));}
 for(const f of [0,299,412,488,804,1320,1739]){assert.equal(at(f).elasticX,1);assert.equal(at(f).elasticY,1);}
});
test('dusting and anvil glance precede the run while feet remain planted',()=>{
 assert.equal(at(510).phase,'dusting-off');assert.ok(at(502).brush>.9);assert.ok(at(530).brush>.9);
 assert.equal(at(566).phase,'looking-at-anvil');assert.ok(at(566).lookAt>.9);
 assert.equal(at(596).phase,'ready-to-run');assert.ok(at(596).readyRun>.9);
 for(let f=488;f<=604;f++){assert.equal(at(f).x,-100);assert.equal(at(f).y,-240);assert.ok(Math.abs(at(f).scale-.22)<1e-8);}
 assert.ok(at(650).x>at(604).x);assert.ok(at(650).scale>at(604).scale);
});
test('angle wrapping at ground contact preserves actual rotation',()=>{
 const a=at(360-1e-5).flightAngle*Math.PI/180,b=at(360).flightAngle*Math.PI/180;
 assert.ok(Math.abs(Math.cos(a)-Math.cos(b))<1e-6);assert.ok(Math.abs(Math.sin(a)-Math.sin(b))<1e-6);
});
