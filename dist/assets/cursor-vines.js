import {imprintEnvelope,imprintSegments,clipImprintStroke,smoothImprint,IMPRINT_LIFETIME,IMPRINT_BATCH_MS,IMPRINT_OPACITY} from './cursor-vine-physics.js';
const fine=matchMedia('(hover: hover) and (pointer: fine)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const NS='http://www.w3.org/2000/svg',surfaces=new Map(),marks=[],pending=[];
const surfaceSelector='.school,.work-section,.recent-section,.roblox-panel,.social-panel,.notes,.project-entry,.number-demo,.banner';
const clothElements=[...document.querySelectorAll(surfaceSelector)].filter(element=>element.closest('.banner'));
let geometry=null;
let previous=null,filter=null,target=null,inputTime=0,frame=0,last=0,sequence=0,blocked=false,pointerInside=false,glitchTimer=0;
function resetStroke(){previous=null;filter=null;target=null;inputTime=0;}
function advanceStroke(point,now){
 const result=smoothImprint(filter,point,inputTime?now-inputTime:16);
 filter=result.state;target=point;inputTime=now;
 pending.push(...result.segments.map(segment=>({...segment,born:now})));
}
const allowed=()=>fine.matches&&!reduced.matches&&!document.hidden&&!blocked;
const node=(name,attrs={})=>{const el=document.createElementNS(NS,name);for(const [key,value] of Object.entries(attrs))el.setAttribute(key,value);return el;};
function clearGlitch(){clearTimeout(glitchTimer);glitchTimer=0;document.documentElement.removeAttribute('data-cursor-glitch');}
function scheduleGlitch(){
 if(glitchTimer||!allowed()||!pointerInside)return;
 glitchTimer=setTimeout(()=>{
  glitchTimer=0;if(!allowed()||!pointerInside)return;
  document.documentElement.setAttribute('data-cursor-glitch','');
  glitchTimer=setTimeout(()=>{glitchTimer=0;document.documentElement.removeAttribute('data-cursor-glitch');scheduleGlitch();},110);
 },2800);
}
function clearMarks(){
 cancelAnimationFrame(frame);frame=0;last=0;resetStroke();
 marks.splice(0).forEach(mark=>mark.group.remove());pending.length=0;surfaces.forEach(surface=>{surface.batch=null;});
}
function sync(){blocked=Boolean(document.querySelector('dialog[open]'));clearMarks();clearGlitch();scheduleGlitch();}
function surfaceFor(element){
 let surface=surfaces.get(element);
 if(!surface){
  const svg=node('svg',{'aria-hidden':'true',class:'banner-imprint',preserveAspectRatio:'none'});
  element.classList.add('imprint-surface');element.prepend(svg);
  surface={element,svg,rect:null,width:element.clientWidth,height:element.clientHeight,batch:null,spacing:0,symbols:[]};surfaces.set(element,surface);
  const defs=node('defs'),prefix='vine-'+surfaces.size;
  for(let i=0;i<6;i++){
   const symbol=node('g',{id:prefix+'-'+i});
   if(i<2){
    symbol.append(node('path',{d:'M0 0C-7-3-6-10-1-12C4-8 5-3 0 0Z',fill:i?'#bdd494':'#90bf9b'}));
    symbol.append(node('path',{d:'M0 0-1-10M-1-5-4-7M-1-4 2-6',fill:'none',stroke:'#e5eac1','stroke-width':.55}));
   }else{
    symbol.append(node('path',{d:'M-2-6H2V-3H5V-1H6V2H3V5H1V6H-2V3H-5V1H-6V-2H-3V-5H-2Z',fill:['#e9a9cb','#a5d9ef','#f1d17b','#cab4ec'][i-2]}));
    symbol.append(node('path',{d:'M-2-2H2V2H-2Z',fill:'#fff0b6'}));
    symbol.append(node('path',{d:'M-1-1H1V1H-1Z',fill:'#c8956e'}));
   }
   defs.append(symbol);surface.symbols.push('#'+prefix+'-'+i);
  }
  svg.append(defs);svg.setAttribute('viewBox','0 0 '+surface.width+' '+surface.height);
  new ResizeObserver(()=>{
   if(element.clientWidth!==surface.width||element.clientHeight!==surface.height){
    surface.width=element.clientWidth;surface.height=element.clientHeight;surface.rect=null;surface.batch=null;geometry=null;
    svg.setAttribute('viewBox','0 0 '+surface.width+' '+surface.height);
    pending.length=0;
    for(let i=marks.length-1;i>=0;i--)if(marks[i].surface===surface){marks[i].group.remove();marks.splice(i,1);}
    resetStroke();
   }
  }).observe(element);
 }
 if(!surface.rect)surface.rect=element.getBoundingClientRect();
 return surface;
}
const coord=value=>Math.round(value*10)/10;
function batchFor(surface,born){
 let mark=surface.batch;
 if(!mark||born-mark.born>=IMPRINT_BATCH_MS){
  const group=node('g'),stem=node('path',{class:'imprint-stem',pathLength:1}),highlight=node('path',{class:'imprint-highlight',pathLength:1}),sprout=node('path',{class:'imprint-branch',pathLength:1});
  for(const path of [stem,highlight,sprout]){path.style.strokeDasharray='1';path.style.strokeDashoffset=path===sprout?'1':'0';group.append(path);}
  group.style.opacity=String(IMPRINT_OPACITY);surface.svg.append(group);
  mark={surface,group,stem,highlight,sprout,buds:[],stems:[],twigs:[],born,budDone:false};
  surface.batch=mark;marks.push(mark);
 }
 return mark;
}
function appendSegment(mark,start,end){
 const {surface}=mark,dx=end.x-start.x,dy=end.y-start.y,length=Math.hypot(dx,dy);
 const ux=dx/length,uy=dy/length,nx=-uy,ny=ux,mx=(start.x+end.x)/2,my=(start.y+end.y)/2;
 mark.stems.push('M'+coord(start.x)+' '+coord(start.y)+' L'+coord(end.x)+' '+coord(end.y));
 surface.spacing+=length;
 if(surface.spacing<52)return;
 surface.spacing%=52;
 const index=sequence++,side=index%2?1:-1,reach=9+(index%3)*2;
 const bx=mx+nx*side*reach+ux*3,by=my+ny*side*reach+uy*3;
 mark.twigs.push('M'+coord(mx)+' '+coord(my)+' Q'+coord(mx+nx*side*reach)+' '+coord(my+ny*side*reach)+' '+coord(bx)+' '+coord(by));
 // A smaller counter-leaf creates a fork rather than a row of identical dots.
 for(let j=0;j<2;j++){
  const x=j?mx-nx*5:bx,y=j?my-ny*5:by;
  if(j)mark.twigs.push('M'+coord(mx)+' '+coord(my)+' Q'+coord(mx-nx*6-ux*2)+' '+coord(my-ny*6-uy*2)+' '+coord(x)+' '+coord(y));
  const angle=Math.atan2(j?-ny:ny*side,j?-nx:nx*side)*180/Math.PI+90;
  const anchor=node('g',{transform:'translate('+coord(x)+' '+coord(y)+') rotate('+coord(angle)+')'});
  const bud=node('use',{href:surface.symbols[j?index%2:index%4===0?2+(Math.floor(index/4)%4):index%2],transform:'scale(0)'});
  anchor.append(bud);mark.group.append(anchor);mark.buds.push({node:bud,size:j?.48:.76});
 }
}
function flushInput(){
 const dirty=new Set();
 if(!geometry)geometry=clothElements.map(element=>{const rect=element.getBoundingClientRect();return {element,x:rect.left+element.clientLeft,y:rect.top+element.clientTop,width:element.clientWidth,height:element.clientHeight};});
 for(const item of pending.splice(0)){
  for(const piece of clipImprintStroke(item.start,item.end,geometry)){
   const parts=imprintSegments(piece.start,piece.end);if(!parts.length)continue;
   const mark=batchFor(surfaceFor(piece.element),item.born);
   parts.forEach(part=>appendSegment(mark,part.start,part.end));dirty.add(mark);
  }
 }
 // One geometry write per batch per frame, regardless of pointer event frequency.
 for(const mark of dirty){const d=mark.stems.join('');mark.stem.setAttribute('d',d);mark.highlight.setAttribute('d',d);mark.sprout.setAttribute('d',mark.twigs.join(''));}
}
function tick(now){
 if(!allowed()){clearMarks();return;}
 // Ease the short tail all the way to a stopped pointer; no extra movement required.
 if(target&&filter&&Math.hypot(target.x-filter.midpoint.x,target.y-filter.midpoint.y)>.25)advanceStroke(target,now);
 frame=0;if(!marks.length&&!pending.length){last=0;return;}
 frame=requestAnimationFrame(tick);
 // Fresh vine geometry follows every display frame; only growth/fading use the slower clock.
 if(pending.length)flushInput();
 if(last&&now-last<1000/24)return;last=now;
 for(let i=marks.length-1;i>=0;i--){
  const mark=marks[i],age=now-mark.born;
  if(age>=IMPRINT_LIFETIME){mark.group.remove();if(mark.surface.batch===mark)mark.surface.batch=null;marks.splice(i,1);continue;}
  const state=imprintEnvelope(age);
  const opacity=(state.opacity*IMPRINT_OPACITY).toFixed(3);
  if(mark.opacity!==opacity){mark.group.style.opacity=opacity;mark.opacity=opacity;}
  if(!mark.budDone){mark.sprout.style.strokeDashoffset=String(1-state.bud);mark.buds.forEach(bud=>bud.node.setAttribute('transform','scale('+(state.bud*bud.size).toFixed(3)+')'));mark.budDone=state.bud===1;}
 }
}
document.addEventListener('pointermove',event=>{
 if(event.pointerType==='touch'||!allowed())return;
 if(event.target.closest?.('input,textarea,[contenteditable=true]')){resetStroke();pointerInside=false;clearGlitch();return;}
 pointerInside=true;scheduleGlitch();
 const samples=event.getCoalescedEvents?.()||[];
 // Preserve intermediate turns delivered in a single high-speed pointer event.
 for(const sample of samples.length?samples:[event]){
  const point={x:sample.clientX,y:sample.clientY};
  if(previous&&Math.hypot(point.x-previous.x,point.y-previous.y)<1)continue;
  advanceStroke(point,sample.timeStamp||performance.now());
  if(!frame)frame=requestAnimationFrame(tick);
  previous=point;
 }
},{passive:true});
function leave(){pointerInside=false;resetStroke();clearGlitch();}
document.documentElement.addEventListener('pointerleave',leave);
document.addEventListener('pointerout',event=>{if(!event.relatedTarget)leave();});
function invalidate(){geometry=null;surfaces.forEach(surface=>{surface.rect=null;});resetStroke();}
window.addEventListener('scroll',invalidate,{passive:true,capture:true});window.addEventListener('resize',invalidate,{passive:true});
document.addEventListener('visibilitychange',sync);document.addEventListener('portfolio:overlay',sync);

fine.addEventListener('change',sync);reduced.addEventListener('change',sync);
window.addEventListener('blur',()=>{leave();clearMarks();});window.addEventListener('pagehide',()=>{leave();clearMarks();});window.addEventListener('pageshow',sync);
