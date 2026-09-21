import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {scenePose, easeScroll} from '../dist/assets/scene-depth-math.js';

for (const scroll of [-1000, 0, 500, 100000]) {
  for (let t = 0; t < 500; t += .7) {
    const p = scenePose(t, scroll);
    assert.ok(Math.abs(p.skyX) <= 3 && Math.abs(p.skyY) <= 22, 'Background remains within its 48px overscan');
    assert.ok(Math.abs(p.ivyY) <= 37 && Math.abs(p.dustY) <= 54);
    const mobile = scenePose(t, scroll, true);
    assert.equal(mobile.skyY, p.skyY * .45);
  }
}
assert.equal(easeScroll(20, 20, 33), 20);
assert.ok(easeScroll(0, 100, 33) > 0 && easeScroll(0, 100, 33) < 100);

const events = new Map(), frames = new Map();
let nextFrame = 0, overlay = false;
const listen = (name, fn) => events.set(name, fn);
const node = () => ({style:{},children:[],setAttribute(){},append(child){this.children.push(child);}});
const sceneNodes = [];
const reduced = {matches:false,addEventListener(_,fn){this.change=fn;}};
const compact = {matches:false,addEventListener(){}};
const document = {
  hidden:false, body:{prepend(el){sceneNodes.push(el);},classList:{add(){},toggle(){}}},
  createElement:node,addEventListener:listen,querySelector:()=>overlay?{}:null
};
const window = {scrollY:0,addEventListener:listen};
const context = vm.createContext({document,window,scenePose,easeScroll,
  matchMedia:q=>q.includes('reduced')?reduced:compact,
  requestAnimationFrame:fn=>{frames.set(++nextFrame,fn);return nextFrame;},
  cancelAnimationFrame:id=>frames.delete(id)
});
const source = await readFile(new URL('../dist/assets/scene-depth.js',import.meta.url),'utf8');
vm.runInContext(source.replace(/^import[^\n]+\n/,''),context);
assert.equal(frames.size,1);
events.get('pageshow')();events.get('pageshow')();
assert.equal(frames.size,1,'Resume never duplicates animation loops');
function step(now){const [id,callback]=frames.entries().next().value;frames.delete(id);callback(now);}
step(0);window.scrollY=10000;events.get('scroll')();step(40);step(80);
assert.match(sceneNodes[0].children[0].style.transform,/translate3d/);
overlay=true;events.get('portfolio:overlay')();assert.equal(frames.size,0);
overlay=false;events.get('portfolio:overlay')();assert.equal(frames.size,1);
document.hidden=true;events.get('visibilitychange')();assert.equal(frames.size,0);
document.hidden=false;events.get('visibilitychange')();assert.equal(frames.size,1);
reduced.matches=true;reduced.change();assert.equal(frames.size,0);assert.equal(sceneNodes[0].hidden,true);
reduced.matches=false;reduced.change();assert.equal(frames.size,1);
events.get('pagehide')();assert.equal(frames.size,0);
events.get('pageshow')();assert.equal(frames.size,1);
console.log('Scene depth: bounded offsets, mobile scaling, eased scroll, reduced motion, dialog/hidden pauses, and single-loop resume pass.');
