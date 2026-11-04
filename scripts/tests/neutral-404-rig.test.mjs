import {test} from 'node:test';
import assert from 'node:assert/strict';
import {neutral404At,neutralLensAt,NEUTRAL_ENTRY,NEUTRAL_LOOP,NEUTRAL_FRAMES} from '../../src/web/neutral-404-rig.mjs';

test('La entrada frena y planta ambos pies antes de examinar la ventana',()=>{
 assert.ok(neutral404At(0).travel<neutral404At(100).travel);
 for(let f=150;f<NEUTRAL_FRAMES+NEUTRAL_LOOP*3;f++){
  const p=neutral404At(f);
  assert.equal(p.travel,0);
  for(const foot of [p.left,p.right]){
   assert.equal(foot.x,0);assert.equal(foot.y,0);assert.equal(foot.angle,0);
  }
 }
});
test('La lupa recorre zonas altas, centrales y bajas de la ventana sin trasladar el hombro',()=>{
 const poses=[240,280,328].map(f=>neutral404At(f));
 const lens=poses.map(neutralLensAt);
 for(const point of lens){assert.ok(point.x>565&&point.x<810);assert.ok(point.y>265&&point.y<495);}
 assert.ok(lens[2].y-lens[0].y>110);
 assert.ok(lens[2].x-lens[0].x>45);
 for(const p of poses){assert.equal(p.travel,0);assert.ok(p.gaze>5);}
 assert.ok(poses[0].gazeY<0);
 assert.ok(poses[2].gazeY>0);
});
test('La reacción baja la herramienta y la boca cambia continuamente',()=>{
 assert.ok(neutral404At(400).rightAngle>neutral404At(356).rightAngle);
 assert.ok(neutral404At(400).puzzled>.8);
 assert.ok(neutral404At(440).attention<.01);
 for(let f=1;f<600;f++){
  assert.ok(Math.abs(neutral404At(f).gazeY-neutral404At(f-1).gazeY)<1);
 }
});
test('Las fases presentan búsqueda, duda y orientación sin reiniciar la caminata',()=>{
 assert.equal(neutral404At(40).phase,'walking');
 assert.ok(neutral404At(250).scan>.9);
 assert.ok(neutral404At(390).puzzled>.9);
 assert.ok(neutral404At(510).guide>.9);
 assert.equal(neutral404At(600).phase,'idle');
 assert.equal(neutral404At(950).phase,'guiding');
 assert.equal(neutral404At(240,'quiet').glass,0);
 assert.equal(neutral404At(240,'search').glass,1);
});
test('No hay saltos de pose ni giros de pie repentinos entre cuadros',()=>{
 for(let f=1;f<NEUTRAL_FRAMES+NEUTRAL_LOOP*3;f++){
  const a=neutral404At(f-1),b=neutral404At(f);
  for(const key of ['bodyAngle','leftAngle','elbowAngle','rightAngle'])assert.ok(Math.abs(b[key]-a[key])<2,`${key} en ${f}`);
  for(const side of ['left','right'])assert.ok(Math.abs(b[side].angle-a[side].angle)<3,`${side} en ${f}`);
  for(const key of ['bodyAngle','bob','gaze','blink'])assert.ok(Number.isFinite(b[key]));
 }
});
test('La espera cierra con la misma geometría y velocidad suave',()=>{
 const start=neutral404At(NEUTRAL_ENTRY),end=neutral404At(NEUTRAL_ENTRY+NEUTRAL_LOOP);
 for(const key of ['travel','bodyAngle','bob','leftAngle','rightAngle','gaze','blink','scan','puzzled','guide'])assert.equal(start[key],end[key],key);
 for(const key of ['bodyAngle','bob','leftAngle','rightAngle','gaze'])assert.ok(Math.abs(neutral404At(NEUTRAL_FRAMES-1)[key]-end[key])<.01,key);
});
test('Se inclina al buscar y mira al usuario antes de presentar el regreso',()=>{
 assert.ok(neutral404At(260).bodyAngle>4);
 const facing=neutral404At(440),guide=neutral404At(510);
 assert.equal(facing.gaze,0);assert.equal(facing.gazeY,0);
 assert.equal(guide.gaze,0);assert.equal(guide.gazeY,0);
 assert.ok(guide.leftAngle-neutral404At(430).leftAngle>35);
 assert.equal(guide.elbowAngle,15);
 assert.ok(Math.abs(guide.bodyAngle)<1);
 // Native left rest contour: one continuous arm/hand, no reflection.
 const r=(guide.leftAngle+guide.elbowAngle)*Math.PI/180,x=-31,y=76;
 assert.ok(x*Math.cos(r)-y*Math.sin(r)<-70);
 assert.ok(x*Math.sin(r)+y*Math.cos(r)>0);
});
test('Cada vuelta repite búsqueda, duda y regreso sin volver a caminar',()=>{
 for(let cycle=1;cycle<=3;cycle++){
  for(const f of [164,240,280,328,400,510,600]){
   const a=neutral404At(f),b=neutral404At(f+cycle*NEUTRAL_LOOP);
   for(const key of ['bodyAngle','bob','leftAngle','elbowAngle','rightAngle','gaze','gazeY','puzzled','guide','attention'])assert.equal(a[key],b[key],`${key}: ${f}/${cycle}`);
   assert.notEqual(b.phase,'walking');
  }
 }
});
