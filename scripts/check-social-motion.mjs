import assert from 'node:assert/strict';
import {phase,spring,restingSpring} from '../dist/assets/social-physics.js';
import {imprintEnvelope,imprintSegments,clipImprintStroke,smoothImprint,IMPRINT_LIFETIME} from '../dist/assets/cursor-vine-physics.js';

for(const fps of [24,60,120]){
 const state=restingSpring();
 for(let i=0;i<fps*10;i++)spring(state,.6,-.7,1/fps);
 assert.ok(Math.abs(state.x-.6)<.01&&Math.abs(state.y+.7)<.01,'Idle recoil follows its small target');
 for(let i=0;i<fps*3;i++)spring(state,0,0,1/fps);
 assert.ok(Math.hypot(state.x,state.y)<.001,'Recoil settles on interaction');
}
let previous=-1;
for(let i=0;i<1000;i++){const value=phase(i/100,10);assert.ok(value>=previous&&value<1,'Idle phase advances smoothly without reversal');previous=value;}
const a=restingSpring(),b=restingSpring();spring(a,1,1,20);spring(b,1,1,.05);assert.deepEqual(a,b,'A long frame cannot amplify recoil');
const start={x:10,y:20},end={x:70,y:80},segments=imprintSegments(start,end);
const saved=JSON.stringify(segments);start.x=900;end.y=900;
assert.equal(JSON.stringify(segments),saved,'Banner imprints retain fixed local coordinates');
const longTrail=imprintSegments({x:0,y:0},{x:5000,y:0});
assert.equal(longTrail.at(-1).end.x,5000,'Long same-surface movement is never truncated');
assert.ok(longTrail.length>90,'Trail has no former 90-mark cap');
for(const s of segments)assert.ok(Math.hypot(s.end.x-s.start.x,s.end.y-s.start.y)<=16.01);
for(let age=0;age<=IMPRINT_LIFETIME;age+=10){
 const state=imprintEnvelope(age);
 for(const value of Object.values(state))assert.ok(value>=0&&value<=1);
}
assert.equal(imprintEnvelope(0).stem,1,'Vine is fully drawn immediately');
assert.equal(imprintEnvelope(0).opacity,1,'Vine has no hidden fade-in delay');
assert.equal(imprintSegments({x:0,y:0},{x:1,y:0}).length,1,'Fine pointer movement draws immediately');
assert.equal(imprintEnvelope(1000).bud,0,'Leaves and flowers appear after the stem');
assert.equal(imprintEnvelope(2000).bud,1);
assert.equal(imprintEnvelope(IMPRINT_LIFETIME).opacity,0,'Marks completely fade');
console.log('Social idle motion and stationary banner imprint growth/fading pass.');

const cloth=[{element:'banner',x:10,y:0,width:100,height:100},{element:'section',x:10,y:30,width:100,height:30},{element:'next',x:140,y:0,width:100,height:100}];
const fast=clipImprintStroke({x:-1000,y:45},{x:1500,y:45},cloth);
assert.equal(fast.length,2,'Fast sweeps cross both banners without filling the gap');
assert.equal(fast[0].element,'section','Nested section receives its own imprint');
assert.equal(fast[1].element,'next');
for(const piece of fast){assert.ok(Math.abs(piece.start.x)<.001);assert.ok(Math.abs(piece.end.x-100)<.001);}
const turns=clipImprintStroke({x:30,y:90},{x:30,y:10},cloth);
assert.deepEqual(turns.map(piece=>piece.element),['banner','section','banner'],'Fast reversed movement stays continuous through section boundaries');
assert.equal(clipImprintStroke({x:0,y:200},{x:300,y:200},cloth).length,0,'Scenery never receives an imprint');
console.log('Fast mouse sweeps, reversals, nested sections, and banner-gap clipping pass.');

for(const hz of [60,120,240]){
 let state=null,peak=0;
 for(let i=0;i<hz;i++){
  const result=smoothImprint(state,{x:i*60/hz,y:i%2?3:-3},1000/hz);state=result.state;
  if(i>hz/2)peak=Math.max(peak,Math.abs(state.point.y));
 }
 assert.ok(peak<1.1,'Small hand tremors are damped across pointer sample rates');
}
let smooth=smoothImprint(null,{x:0,y:0}).state;
const sweep=smoothImprint(smooth,{x:5000,y:0},8);smooth=sweep.state;
assert.ok(sweep.segments.length>100,'Fast strokes preserve full geometry without a length cap');
assert.ok(smooth.point.x>4999,'Fast movement releases stabilization lag');
for(let i=0;i<4;i++)smooth=smoothImprint(smooth,{x:5000,y:0},16).state;
assert.ok(Math.abs(smooth.midpoint.x-5000)<.25,'Tail catches a stationary pointer');
const turn=smoothImprint(smooth,{x:4800,y:200},16);
for(let i=1;i<turn.segments.length;i++)assert.deepEqual(turn.segments[i].start,turn.segments[i-1].end,'Curved samples remain connected');
const fine=clipImprintStroke({x:20,y:20},{x:20.1,y:20.1},cloth);
assert.equal(imprintSegments(fine[0].start,fine[0].end).length,1,'Subpixel eased strokes are not discarded');
console.log('Vine stabilization: jitter damping, fast sweeps, smooth joins, and stopped-pointer settling pass.');
