import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {tearDestination} from '../dist/assets/tear-routes.js';

const root=fileURLToPath(new URL('../docs/',import.meta.url));
const base=(await readFile(path.join(root,'index.html'),'utf8')).match(/name="site-root" content="([^"]+)"/)[1];let pages=0,refs=0;
async function check(dir){
 for(const entry of await readdir(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()){await check(file);continue;}
  if(!/\.(html|css)$/.test(file))continue;
  const text=await readFile(file,'utf8');
  if(file.endsWith('.html')){
   pages++;assert.ok(text.includes('name="site-root" content="'+base+'"'));
   assert.ok(!text.includes('127.0.0.1'),'Public pages never point to a visitor’s localhost');
   assert.ok(!text.includes('<iframe'),'Public shirt preview is static');
  }
  const urls=[...text.matchAll(/(?:\b(?:href|src)="|url\(['"]?)(\/[^\s"')>]+)/g)].map(m=>m[1]);
  for(const url of urls){
   assert.ok(url.startsWith(base),`Root-relative URL escapes Pages base: ${url}`);
   const pathname=url.slice(base.length).split(/[?#]/)[0];
   const target=path.join(root,pathname.endsWith('/')?pathname+'index.html':pathname||'index.html');
   assert.ok((await stat(target)).isFile(),`Missing Pages resource: ${url}`);refs++;
  }
 }
}
await check(root);assert.equal(pages,9);
const home=await readFile(path.join(root,'index.html'),'utf8');
assert.ok(home.includes('data-preview-mode="static"'));
assert.ok(home.includes('View shirt project'));
const index=JSON.parse(await readFile(path.join(root,'assets/search.json'),'utf8'));
for(const item of index)if(item.url.startsWith('/'))assert.ok(item.url.startsWith(base));
for(const route of ['icon-emulator/','larpmegle/','notes/one-shirt-one-number/']){
 assert.equal(tearDestination(base+route,'https://mindlesstruffle.github.io'+base,{root:base}),base+route);
}
for(const route of [base,base+'icon-emulator/?x=1'])assert.equal(tearDestination(route,'https://mindlesstruffle.github.io'+base,{root:base}),null);
assert.equal(tearDestination('/other/','https://mindlesstruffle.github.io/sammypersonalsite/',{root:'/sammypersonalsite/'}),null);
await stat(path.join(root,'.nojekyll'));
console.log(`Pages checks pass: ${pages} pages, ${refs} local references, prefixed search/portal routes, static shirt fallback.`);
