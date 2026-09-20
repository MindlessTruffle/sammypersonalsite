import './build.mjs';
import {cp,readdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.join(root,'docs');
// GitHub's custom-domain CNAME is preserved; custom domains serve from the root.
const customDomain=await readFile(path.join(output,'CNAME'),'utf8').then(value=>value.trim()).catch(error=>{if(error.code==='ENOENT')return '';throw error;});
const base=customDomain?'/':'/sammypersonalsite/';
await cp(path.join(root,'dist'),output,{recursive:true});
async function rewrite(dir){
 for(const entry of await readdir(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()){await rewrite(file);continue;}
  if(!/\.(html|css|json)$/.test(file))continue;
  let text=await readFile(file,'utf8');
  if(file.endsWith('.html')){
   text=text.replace('<head>','<head><meta name="site-root" content="'+base+'">')
    .replace(/<iframe\b[^>]*class="storefront-frame"[^>]*><\/iframe>/g,'')
    .replace('class="storefront-preview"','class="storefront-preview" data-preview-mode="static"')
    .replace(/<p class="preview-status"[^>]*>.*?<\/p>/g,'')
    .replace(/<a\b[^>]*href="http:\/\/127\.0\.0\.1:3000\/[^\"]*"[^>]*>/g,tag=>tag.replace(/href="[^"]*"/,'href="/number-company/"').replace(/ target="[^"]*"| rel="[^"]*"/g,'').replace('Open The Number Company website','View The Number Company project'))
    .replace('<span class="purchase-label">Purchase Shirt</span>','<span class="purchase-label">View shirt project</span>')
    .replace(/<span class="purchase-price">.*?<\/span>/g,'')
    .replace(/\b(href|src)="\/(?!\/)/g,'$1="'+base);
  }else if(file.endsWith('.css')){
   text=text.replace(/url\((['"]?)\/(?!\/)/g,'url($1'+base);
  }else if(entry.name==='search.json'){
   text=JSON.stringify(JSON.parse(text).map(item=>({...item,url:item.url.startsWith('/')?base+item.url.slice(1):item.url})));
  }
  await writeFile(file,text);
 }
}
await rewrite(output);
await writeFile(path.join(output,'.nojekyll'),'');
console.log('GitHub Pages static output: docs/ at '+base);
