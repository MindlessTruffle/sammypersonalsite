import assert from 'node:assert/strict';
import {capturePageMetadata,applyPageMetadata} from '../dist/assets/page-metadata.js';
function node(value,managed=true){return {value,managed,owner:null,cloneNode(){return node(this.value,this.managed);},remove(){this.owner.items=this.owner.items.filter(n=>n!==this);}};}
function doc(values){const head={items:values.map(v=>node(v)),querySelectorAll(){return this.items.filter(n=>n.managed);},append(...nodes){for(const n of nodes){n.owner=this;this.items.push(n);}}};head.items.forEach(n=>n.owner=head);return {head};}
const home=doc(['home canonical','home description','home schema']),project=doc(['project canonical','project description','project schema']);
const stylesheet=node('stylesheet',false);home.head.append(stylesheet);
const original=capturePageMetadata(home),incoming=capturePageMetadata(project);
applyPageMetadata(incoming,home);
assert.deepEqual(home.head.querySelectorAll().map(n=>n.value),incoming.map(n=>n.value));
assert.ok(home.head.items.includes(stylesheet),'Styles and scripts remain untouched');
assert.equal(project.head.items.length,3,'Parsed document is not consumed');
applyPageMetadata(original,home);applyPageMetadata(original,home);
assert.deepEqual(home.head.querySelectorAll().map(n=>n.value),original.map(n=>n.value));
assert.equal(home.head.items.length,4,'Repeated restoration does not duplicate tags');
console.log('Portal metadata: project swap, original-page restore, and unrelated head elements pass.');
