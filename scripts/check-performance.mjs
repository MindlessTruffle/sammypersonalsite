import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

// Check actual app scheduling with controlled observers and pending network work.
let samples=0,fetches=0,dialogOpen=false,resolveFetch;
const intervals=[],observers=[],animations=[];
const inert={addEventListener(){},focus(){},style:{}};
const iframe={...inert,dataset:{previewSrc:'http://127.0.0.1:3000/shop'},getAttribute(){return this.src;}};
const outline={getTotalLength:()=>100,getPointAtLength(t){samples++;return {x:t,y:t/2};}};
const buy={clientWidth:200,clientHeight:54,querySelector:()=>outline,querySelectorAll:()=>[],append(){}};
const preview={clientWidth:500,clientHeight:370,querySelector:s=>s==='iframe'?iframe:inert,classList:{add(){}}};
const document={hidden:false,querySelector(s){if(s==='.storefront-link')return buy;if(s==='.storefront-preview')return preview;if(s==='dialog[open]')return dialogOpen?inert:null;return inert;},querySelectorAll:()=>[],addEventListener(){},dispatchEvent(){},createElement(){return {setAttribute(){},remove(){},animate(frames){animations.push(frames);return {finished:new Promise(()=>{}),cancel(){}};}};}};
const context=vm.createContext({document,navigator:{platform:'Windows'},matchMedia:()=>({matches:false,addEventListener(){}}),MutationObserver:class{observe(){}},IntersectionObserver:class{constructor(fn){observers.push(fn);}observe(){}},ResizeObserver:class{observe(){}},setInterval(fn){intervals.push(fn);},AbortSignal,fetch(){fetches++;return new Promise(resolve=>{resolveFetch=resolve;});},Event});
vm.runInContext(await readFile(new URL('../dist/assets/app.js',import.meta.url),'utf8'),context);
assert.equal(fetches,0,'Offscreen shirt preview does not start loading');
observers[0]([{isIntersecting:true}]);intervals[0]();intervals[0]();
assert.equal(samples,258,'Two money effects share one geometry sampling pass');
assert.equal(animations[0],animations[2],'Orbit keyframes are reused');
observers[1]([{isIntersecting:true}]);intervals[1]();
assert.equal(fetches,1,'Only one preview request can be in flight');
resolveFetch({json:async()=>({available:true,number:14})});
await new Promise(resolve=>setImmediate(resolve));
assert.equal(iframe.src,'http://127.0.0.1:3000/shop');
dialogOpen=true;intervals[0]();intervals[1]();
assert.equal(animations.length,4,'Money effects pause behind all dialogs');
assert.equal(fetches,1,'Preview polling pauses behind all dialogs');
console.log('Performance checks: deferred preview, no overlapping requests, reused orbit geometry, and dialog pauses pass.');
