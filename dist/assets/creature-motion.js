import {catPose} from './banner-physics.js';
import {animalFrame} from './pixel-animals.js';
const stage=document.querySelector('.product-stage');
if(stage){let seen=false;const sync=()=>stage.classList.toggle('effects-paused',document.hidden||!seen||Boolean(document.querySelector('dialog[open]')));new IntersectionObserver(([e])=>{seen=e.isIntersecting;sync();}).observe(stage);document.addEventListener('visibilitychange',sync);document.addEventListener('portfolio:overlay',sync);sync();}
const shell=document.querySelector('.site-shell');
const banners=['.banner-forest','.banner-fire','.banner-water'].map(s=>document.querySelector(s));
if(shell&&banners.every(Boolean))animals();
function animals(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const layer=document.createElement('div');layer.className='pet-stage';layer.setAttribute('aria-hidden','true');shell.append(layer);
 const pets={};
 for(const kind of ['cat','fox','rabbit','bird']){const node=document.createElement('div');node.className='pet pet-'+kind;const canvas=document.createElement('canvas');canvas.width=32;canvas.height=28;const ctx=canvas.getContext('2d');if(!ctx)return;ctx.imageSmoothingEnabled=false;node.append(canvas);layer.append(node);pets[kind]={node,canvas,ctx,frame:null};}
 const rope=document.createElementNS('http://www.w3.org/2000/svg','svg');rope.classList.add('pet-rope');const line=document.createElementNS(rope.namespaceURI,'line');rope.append(line);layer.prepend(rope);
 let geometry,visible=false,covered=false,time=0,last=0,frame=0;const seen=new Set();
 function measure(){const origin=shell.getBoundingClientRect();geometry=banners.map(el=>{const r=el.getBoundingClientRect();return {x:r.left-origin.left,y:r.top-origin.top,width:r.width,height:r.height};});rope.setAttribute('viewBox',`0 0 ${origin.width} ${origin.height+40}`);rope.style.height=(origin.height+40)+'px';render();}
 function paint(kind,x,y,pose,face=1,rotation=0,scale=1){const pet=pets[kind],step=Math.floor(time*8)%4,blink=time%6.7>6.52;const image=animalFrame(kind,pose,step,blink);if(pet.frame!==image){pet.ctx.clearRect(0,0,32,28);pet.ctx.drawImage(image,0,0);pet.frame=image;}pet.node.style.transform=`translate3d(${Math.round(x)-32}px,${Math.round(y)-56}px,0) rotate(${rotation}deg)`;pet.canvas.style.transform=`scale(${face*scale},${1/scale})`;}
 function render(){
  if(!geometry)return;const [left,middle,right]=geometry;
  const cat=catPose(reduced.matches?12:time,left,middle),flip=cat.phase>=7&&cat.phase<9?Math.sin((cat.phase-7)/2*Math.PI)*-20:0;paint('cat',cat.x,cat.y,cat.mode,cat.face,flip);
  rope.style.display=cat.mode==='hang'&&!reduced.matches?'block':'none';if(cat.mode==='hang'){line.setAttribute('x1',cat.anchor.x);line.setAttribute('y1',cat.anchor.y);line.setAttribute('x2',cat.x+3);line.setAttribute('y2',cat.y-38);}
  const ft=reduced.matches?0:time%20,travel=(1-Math.cos(ft/20*Math.PI*2))*.5,pounce=ft>7&&ft<9?Math.sin((ft-7)/2*Math.PI)*28:0;
  paint('fox',right.x+30+travel*(right.width-60),right.y+right.height+22-pounce,pounce?'jump':'walk',ft<10?1:-1,pounce?-8:0,pounce?1.04:1);
  const ht=reduced.matches?0:time%7,hop=ht<1.8?Math.abs(Math.sin(ht/1.8*Math.PI*2))*17:0;paint('rabbit',left.x+44+(ht<1.8?Math.sin(ht/1.8*Math.PI)*18:0),left.y+left.height+23-hop,hop?'jump':'idle',1,0,ht>1.7&&ht<1.95?1.08:1);
  const bt=reduced.matches?0:time%32;let x=left.x+32,y=left.y-13,flight=false,face=1;const to={x:right.x+right.width-35,y:right.y-14};
  if(bt>=8&&bt<14){const t=(bt-8)/6;x+=(to.x-x)*t;y+=(to.y-y)*t-Math.sin(t*Math.PI)*38;flight=true;}else if(bt>=14&&bt<24){x=to.x;y=to.y;face=-1;}else if(bt>=24){const t=(bt-24)/8;x=to.x+(x-to.x)*t;y=to.y+(y-to.y)*t-Math.sin(t*Math.PI)*28;flight=true;face=-1;}
  paint('bird',x,y,flight?'fly':'idle',face,flight?Math.sin(time*3)*4:0);
 }
 function tick(now){frame=0;if(!visible||document.hidden||reduced.matches||covered)return;if(!last)last=now;if(now-last>=1000/24){time+=Math.min((now-last)/1000,.1);last=now;render();}frame=requestAnimationFrame(tick);}
 function sync(){covered=Boolean(document.querySelector('dialog[open]'));cancelAnimationFrame(frame);frame=0;last=0;if(reduced.matches){render();return;}if(visible&&!document.hidden&&!covered)frame=requestAnimationFrame(tick);}
 new ResizeObserver(measure).observe(shell);const observer=new IntersectionObserver(entries=>{for(const e of entries)e.isIntersecting?seen.add(e.target):seen.delete(e.target);visible=seen.size>0;sync();});banners.forEach(el=>observer.observe(el));document.addEventListener('visibilitychange',sync);document.addEventListener('portfolio:overlay',sync);reduced.addEventListener('change',sync);addEventListener('pagehide',()=>cancelAnimationFrame(frame));addEventListener('pageshow',sync);measure();
}
