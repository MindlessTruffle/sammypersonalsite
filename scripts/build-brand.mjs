import {writeFile} from 'node:fs/promises';
import {deflateSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
const assets=fileURLToPath(new URL('../dist/assets/',import.meta.url));
// One rectangular pixel drawing drives both SVG and PNG; no runtime dependencies.
const glyph=['0111110','1100011','1100000','1100000','0111110','0000011','0000011','1100011','0111110'];
const rect=(ops,x,y,w,h,fill,opacity=1)=>ops.push({x,y,w,h,fill,opacity});
function cloth(ops,w,h){
 rect(ops,0,0,w,h,'#315e82');
 for(const [x,width,fill,a] of [[0,.13,'#102d46',.3],[.14,.17,'#eddfb3',.045],[.4,.14,'#17324c',.12],[.67,.1,'#eddfb3',.035],[.87,.13,'#102d46',.24]])rect(ops,x*w,0,width*w,h,fill,a);
 for(let x=0;x<w;x+=8){rect(ops,x,0,2,h,'#ffeac6',.035);rect(ops,x+4,0,1,h,'#ffeac6',.035);}
 for(let y=2;y<h;y+=4)rect(ops,0,y,w,1,'#132127',.08);
 for(let y=12;y<h;y+=96)for(let x=13;x<w;x+=96)rect(ops,x,y,2,7,'#ffedc5',.055);
}
function logo(){
 const ops=[];cloth(ops,64,64);
 rect(ops,0,0,64,3,'#132d45');rect(ops,0,61,64,3,'#132d45');rect(ops,0,0,3,64,'#132d45');rect(ops,61,0,3,64,'#132d45');
 rect(ops,4,4,56,1,'#d6ba72',.65);rect(ops,4,59,56,1,'#d6ba72',.4);rect(ops,4,4,1,56,'#d6ba72',.5);rect(ops,59,4,1,56,'#d6ba72',.4);
 for(let x=8;x<58;x+=6){rect(ops,x,7,2,1,'#e8d096',.38);rect(ops,x,56,2,1,'#e8d096',.3);}
 const cells=[];glyph.forEach((row,y)=>[...row].forEach((on,x)=>{if(on==='1')cells.push([14+x*5,9+y*5,x,y]);}));
 for(const [x,y] of cells)rect(ops,x+2,y+3,5,5,'#142b40');
 for(const [x,y] of cells)rect(ops,x-1,y-1,7,7,'#172f46');
 for(const [x,y] of cells)rect(ops,x,y,5,5,'#ead28e');
 for(const [x,y,gx,gy] of cells)if(!gy||glyph[gy-1][gx]!=='1')rect(ops,x,y,5,1,'#fff1bf');
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
for(const [name,size] of [['sammy-s-logo.png',512],['sammy-s-favicon-32.png',32],['sammy-s-favicon-16.png',16],['apple-touch-icon.png',180]])await writeFile(assets+name,png(mark,size,size,64,64));
const iconImages=[16,32,48].map(size=>({size,data:png(mark,size,size,64,64)}));
const icoHeader=Buffer.alloc(6+16*iconImages.length);icoHeader.writeUInt16LE(1,2);icoHeader.writeUInt16LE(iconImages.length,4);let offset=icoHeader.length;
iconImages.forEach(({size,data},i)=>{const p=6+i*16;icoHeader[p]=size;icoHeader[p+1]=size;icoHeader.writeUInt16LE(1,p+4);icoHeader.writeUInt16LE(24,p+6);icoHeader.writeUInt32LE(data.length,p+8);icoHeader.writeUInt32LE(offset,p+12);offset+=data.length;});
await writeFile(new URL('../dist/favicon.ico',import.meta.url),Buffer.concat([icoHeader,...iconImages.map(i=>i.data)]));
const letters={S:['01111','10000','10000','01110','00001','00001','11110'],A:['01110','10001','10001','11111','10001','10001','10001'],M:['10001','11011','10101','10101','10001','10001','10001'],Y:['10001','10001','01010','00100','00100','00100','00100'],H:['10001','10001','10001','11111','10001','10001','10001'],W:['10001','10001','10001','10101','10101','11011','10001'],R:['11110','10001','10001','11110','10100','10010','10001'],I:['111','010','010','010','010','010','111'],C:['01111','10000','10000','10000','10000','10000','01111'],O:['01110','10001','10001','10001','10001','10001','01110'],'.':['0','0','0','0','0','0','1'],' ':['000']};
function label(ops,text,y,scale,color){const width=[...text].reduce((sum,ch)=>sum+(letters[ch][0].length+1)*scale,0)-scale;let x=(1200-width)/2;for(const ch of text){const glyph=letters[ch];glyph.forEach((row,gy)=>[...row].forEach((bit,gx)=>{if(bit==='1')rect(ops,x+gx*scale,y+gy*scale,scale,scale,color);}));x+=(glyph[0].length+1)*scale;}}
const card=[];cloth(card,1200,630);
for(const y of [32,596]){rect(card,32,y,1136,2,'#bea76c',.48);for(let x=44;x<1156;x+=16)rect(card,x,y+(y===32?7:-7),6,2,'#dac48b',.3);}
for(const o of mark)card.push({...o,x:460+o.x*4.375,y:60+o.y*4.375,w:o.w*4.375,h:o.h*4.375});

label(card,'SAMMY HAWARI',384,7,'#f4e5b8');label(card,'SAMMYHAWARI.COM',468,3,'#bed7e4');
await writeFile(assets+'sammy-s-social.png',png(card,1200,630));
console.log('Built pixel S logo, SVG/PNG/ICO favicons, touch icon, and 1200x630 share image.');
