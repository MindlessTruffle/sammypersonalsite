import {readdir,readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
let checked=0;const failures=[];
async function walk(dir){const output=[];for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())output.push(...await walk(file));else output.push(file);}return output;}
const files=await walk(root);
async function checkReference(url,source){if(!url.startsWith('/')||url.startsWith('//'))return;let local=path.join(root,url.split(/[?#]/)[0]);try{if((await stat(local)).isDirectory())local=path.join(local,'index.html');await stat(local);checked++;}catch{failures.push(`${path.relative(root,source)}: missing ${url}`);}}
for(const file of files){if(!/\.(html|css)$/.test(file))continue;const text=await readFile(file,'utf8');const urls=file.endsWith('.html')?[...text.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]):[...text.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map(m=>m[1]);for(const url of urls)await checkReference(url,file);if(file.endsWith('.html')){if(!text.includes('lang="en"')||!text.includes('name="viewport"'))failures.push(`${file}: document metadata missing`);if(!text.includes('https://jame.li'))failures.push(`${file}: attribution missing`);if(/maximum-scale=1|user-scalable=no/.test(text))failures.push(`${file}: zoom blocked`);if(text.includes('james siyuan')||text.includes('jli2007')||text.includes('G-T54T8RQLW5'))failures.push(`${file}: reference personal content leaked`);}}
for(const command of JSON.parse(await readFile(path.join(root,'assets/search.json'),'utf8')))await checkReference(command.url,'search.json');
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log(`OK: ${files.filter(f=>f.endsWith('.html')).length} HTML pages, ${checked} local references, command routes, attribution, and zoom metadata.`);
