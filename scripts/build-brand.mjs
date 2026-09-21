import {writeFile} from 'node:fs/promises';
import {deflateSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
const assets=fileURLToPath(new URL('../dist/assets/',import.meta.url));
// One rectangular pixel drawing drives both SVG and PNG; no runtime dependencies.
const glyph=['001111100','011111110','111000111','111000000','111100000','011111100','000011110','000000111','111000111','011111110','001111100'];
const rect=(ops,x,y,w,h,fill,opacity=1)=>ops.push({x,y,w,h,fill,opacity});
function logo(){
 const ops=[];
 // Same warm red checks and raised edges as the submenu close buttons.
 rect(ops,0,0,64,64,'#962e35');
 for(let y=0;y<64;y+=8)for(let x=0;x<64;x+=8)if((x/8+y/8)%2===0)rect(ops,x,y,8,8,'#511f2c',1/3);
 rect(ops,0,0,64,2,'#d57159',.5);rect(ops,0,62,64,2,'#491d2e');
 rect(ops,0,2,2,60,'#d57159',.3);rect(ops,62,2,2,60,'#491d2e',.65);
 // Broad strokes with stepped round shoulders; letter only, no character face.
 const cells=[];glyph.forEach((row,y)=>[...row].forEach((on,x)=>{if(on==='1')cells.push([14+x*4,9+y*4,x,y]);}));
 for(const [x,y] of cells)rect(ops,x+2,y+3,5,5,'#491d2e');
 for(const [x,y] of cells)rect(ops,x-1,y-1,6,6,'#471b25');
 for(const [x,y] of cells)rect(ops,x,y,4,4,'#fff1cf');
 for(const [x,y,gx,gy] of cells){
  if(!gy||glyph[gy-1][gx]!=='1')rect(ops,x,y,4,1,'#fffbee');
  if(gy===glyph.length-1||glyph[gy+1][gx]!=='1')rect(ops,x,y+3,4,1,'#e6bc87');
 }
 return ops;
}
const mark=logo();
const svg=(ops,w,h)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${ops.map(o=>`<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" fill="${o.fill}" opacity="${o.opacity}"/>`).join('')}</svg>`;
const table=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function chunk(type,data){const name=Buffer.from(type),input=Buffer.concat([name,data]);let crc=0xffffffff;for(const byte of input)crc=table[(crc^byte)&255]^(crc>>>8);const length=Buffer.alloc(4),checksum=Buffer.alloc(4);length.writeUInt32BE(data.length);checksum.writeUInt32BE((crc^0xffffffff)>>>0);return Buffer.concat([length,input,checksum]);}
function png(ops,w,h,viewW=w,viewH=h){
 const pixels=Buffer.alloc(w*h*3);const sx=w/viewW,sy=h/viewH;
 for(const o of ops){const color=[1,3,5].map(i=>parseInt(o.fill.slice(i,i+2),16));
  for(let y=Math.max(0,Math.round(o.y*sy));y<Math.min(h,Math.round((o.y+o.h)*sy));y++)for(let x=Math.max(0,Math.round(o.x*sx));x<Math.min(w,Math.round((o.x+o.w)*sx));x++){const p=(y*w+x)*3;for(let c=0;c<3;c++)pixels[p+c]=Math.round(pixels[p+c]*(1-o.opacity)+color[c]*o.opacity);}
 }
 const rows=Buffer.alloc((w*3+1)*h);for(let y=0;y<h;y++)pixels.copy(rows,y*(w*3+1)+1,y*w*3,(y+1)*w*3);
 const header=Buffer.alloc(13);header.writeUInt32BE(w,0);header.writeUInt32BE(h,4);header[8]=8;header[9]=2;
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(rows)),chunk('IEND',Buffer.alloc(0))]);
}
await writeFile(assets+'sammy-s-logo.svg',svg(mark,64,64));
await writeFile(assets+'favicon.svg',svg(mark,64,64));
await writeFile(assets+'sammy-s-cute.svg',svg(mark,64,64));
await writeFile(assets+'sammy-s-checkered.svg',svg(mark,64,64));
for(const [name,size] of [['sammy-s-logo.png',512],['sammy-s-favicon-32.png',32],['sammy-s-favicon-16.png',16],['apple-touch-icon.png',180],['sammy-s-cute-32.png',32],['sammy-s-cute-touch.png',180],['sammy-s-checkered-32.png',32],['sammy-s-checkered-touch.png',180]])await writeFile(assets+name,png(mark,size,size,64,64));
const iconImages=[16,32,48].map(size=>({size,data:png(mark,size,size,64,64)}));
const icoHeader=Buffer.alloc(6+16*iconImages.length);icoHeader.writeUInt16LE(1,2);icoHeader.writeUInt16LE(iconImages.length,4);let offset=icoHeader.length;
iconImages.forEach(({size,data},i)=>{const p=6+i*16;icoHeader[p]=size;icoHeader[p+1]=size;icoHeader.writeUInt16LE(1,p+4);icoHeader.writeUInt16LE(24,p+6);icoHeader.writeUInt32LE(data.length,p+8);icoHeader.writeUInt32LE(offset,p+12);offset+=data.length;});
await writeFile(new URL('../dist/favicon.ico',import.meta.url),Buffer.concat([icoHeader,...iconImages.map(i=>i.data)]));
console.log('Built bubbly checkered pixel S SVG/PNG/ICO favicons and touch icon. Share banner is a separately curated image asset.');
