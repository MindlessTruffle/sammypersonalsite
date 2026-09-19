import assert from 'node:assert/strict';
import {catPose,LOOP_SECONDS} from '../dist/assets/banner-physics.js';
const layouts=[
  [{x:0,y:80,width:366,height:960},{x:404,y:80,width:366,height:960}],
  [{x:0,y:80,width:282,height:1050},{x:0,y:1234,width:282,height:1030}]
];
for(const [left,right] of layouts){
  const initial=catPose(0,left,right),end=catPose(LOOP_SECONDS,left,right);
  assert.deepEqual(initial,end,'Cat route must close without teleporting');
  for(const boundary of [5,7,9,12,14,18,20,22,24]){
    const a=catPose(boundary-1e-5,left,right),b=catPose(boundary+1e-5,left,right);
    assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<.1,'Continuous transition at '+boundary);
  }
  for(let t=0;t<24;t+=1/30){
    const p=catPose(t,left,right);
    assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
    assert.ok(p.x>=0&&p.x<Math.max(left.x+left.width,right.x+right.width)+20);
    assert.ok(p.y>=0&&p.y<right.y+right.height);
  }
}
console.log('Cat loop continuity and desktop/mobile bounds pass.');