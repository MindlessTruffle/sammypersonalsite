import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const events = new Map(), scenes = [];
let overlay = false;
const node = () => ({style:{},children:[],setAttribute(){},append(child){this.children.push(child);},classList:{toggle(name,value){this[name]=value;}}});
const reduced = {matches:false,addEventListener(_,fn){this.change=fn;}};
const document = {hidden:false,body:{prepend(el){scenes.push(el);}},createElement:node,createElementNS:node,
  addEventListener:(name,fn)=>events.set(name,fn),querySelector:()=>overlay?{}:null};
const window = {addEventListener:(name,fn)=>events.set(name,fn)};
const source = await readFile(new URL('../dist/assets/scene-depth.js',import.meta.url),'utf8');
vm.runInNewContext(source,{document,window,matchMedia:()=>reduced});
const scene=scenes[0];
assert.equal(scene.children.length,19,'Twelve leaves and seven birds are allocated once');
assert.equal(events.has('scroll'),false,'No scroll handler or parallax');
assert.equal(scene.classList['is-paused'],false);
for (const reason of ['overlay','hidden','pagehide','reduced']) {
  if(reason==='overlay'){overlay=true;events.get('portfolio:overlay')();}
  if(reason==='hidden'){document.hidden=true;events.get('visibilitychange')();}
  if(reason==='pagehide')events.get('pagehide')();
  if(reason==='reduced'){reduced.matches=true;reduced.change();assert.equal(scene.hidden,true);}
  assert.equal(scene.classList['is-paused'],true,reason);
  overlay=false;document.hidden=false;reduced.matches=false;events.get('pageshow')();
  assert.equal(scene.classList['is-paused'],false);
}
console.log('Background leaves/birds: sparse allocation, no scroll handling, reduced motion and pause/resume checks pass.');
