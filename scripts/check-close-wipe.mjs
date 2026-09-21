import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

// Exercise real closing code with controlled animation completion, without a browser.
const source=(await readFile(new URL('../dist/assets/sword-tear.js',import.meta.url),'utf8')).replace(/^import .*;\r?\n/gm,'');
function harness(){
 const animations=[];let focus=0;
 const pane={inert:false},fx={classList:{remove(){}}};
 const portal={open:true,close(){this.open=false;},querySelector(s){return s==='.tear-window'?pane:fx;},querySelectorAll(){return [];}};
 const wipe={open:false,setAttribute(){},addEventListener(){},showModal(){this.open=true;},close(){this.open=false;},focus(){},querySelector(){return {animate(frames,options){let resolve,reject;const finished=new Promise((a,b)=>{resolve=a;reject=b;});const animation={finished,resolve,cancel(){reject(new Error('Cancelled'));},options,frames};animations.push(animation);return animation;}};}};
 const document={title:'Portfolio',body:{classList:{remove(){}},append(){}},createElement(){return wipe;},dispatchEvent(){},addEventListener(){},querySelector(){return {focus(){focus++;}};}};
 const context=vm.createContext({capturePageMetadata:()=>[],applyPageMetadata(){},document,location:{href:'http://localhost/'},matchMedia:()=>({matches:false,addEventListener(){}}),addEventListener(){},Event,clearTimeout,setTimeout,window:{scrollTo(){}},testPortal:portal});
 vm.runInContext(source+`\nportal=testPortal;content={replaceChildren(){}};globalThis.api={finishClose,cancelClosingWipe,setReduced(){reduced.matches=true;}};`,context);
 return {api:context.api,portal,wipe,animations,focused:()=>focus};
}
const h=harness(),done=h.api.finishClose();
assert.equal(h.portal.open,true,'Subpage remains until fully covered');
assert.equal(h.wipe.open,true);
h.animations[0].resolve();await new Promise(resolve=>setImmediate(resolve));
assert.equal(h.portal.open,false,'Page restores beneath full coverage');
assert.equal(h.wipe.open,true,'Wipe remains during the message hold');
assert.ok(h.animations[1].options.delay>=600,'Thank-you message has a readable hold');
h.animations[1].resolve();await done;
assert.equal(h.wipe.open,false);assert.equal(h.focused(),1);
const interrupted=harness(),pending=interrupted.api.finishClose();
interrupted.api.cancelClosingWipe();await pending;
assert.equal(interrupted.portal.open,true,'Cancelled closing cannot close a newly resumed page');
assert.equal(interrupted.wipe.open,false);
const reduced=harness();reduced.api.setReduced();await reduced.api.finishClose();
assert.equal(reduced.portal.open,false);assert.equal(reduced.animations.length,0);
console.log('Closing wipe: covered page swap, message hold, focus restore, interruption, and reduced motion pass.');
