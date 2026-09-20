import {phase,spring,restingSpring,birdFlight} from './social-physics.js';
import {socialSprite} from './social-sprites.js';

const stations=[...document.querySelectorAll('.social-station')];
if(stations.length){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),visible=new Set();
 const entries=stations.map(node=>({node,ctx:node.querySelector('canvas').getContext('2d'),motion:node.querySelector('.social-motion'),state:restingSpring(),interacting:false}));
 let frame=0,last=0,time=0,covered=false;
 const allowed=()=>!document.hidden&&!reduced.matches&&!covered&&visible.size>0;
 function sprite(ctx,kind,x,y,step=0,flip=false,alpha=.72){
  ctx.save();ctx.globalAlpha=alpha;ctx.translate(Math.round(x),Math.round(y));
  if(flip){ctx.translate(18,0);ctx.scale(-1,1);}
  ctx.drawImage(socialSprite(kind,step),0,0);ctx.restore();
 }
 function contract(ctx,t){
  const p=phase(t,10),write=Math.max(0,Math.min(1,(p-.16)/.42));
  const alpha=.85*Math.min(1,p/.08,(1-p)/.08);
  const signature=[[40,26],[43,22],[42,28],[46,24],[45,27],[49,24],[51,26],[55,24]];
  const at=write*(signature.length-1),index=Math.min(signature.length-2,Math.floor(at)),f=at-index;
  const nib=[signature[index][0]+(signature[index+1][0]-signature[index][0])*f,signature[index][1]+(signature[index+1][1]-signature[index][1])*f];
  ctx.save();ctx.globalAlpha=alpha;
  // An unfolded contract, an actual traced signature, then a wax seal pressed into place.
  ctx.drawImage(socialSprite('contract'),33,4,36,32);
  if(write>0){
   ctx.strokeStyle='#242831';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(...signature[0]);
   for(let i=1;i<=index;i++)ctx.lineTo(...signature[i]);
   ctx.lineTo(Math.round(nib[0]),Math.round(nib[1]));ctx.stroke();
  }
  if(p<.68){
   const lift=Math.max(0,(p-.58)/.1),hover=write===0?Math.sin(t*2)*1.5:0;
   ctx.save();ctx.globalAlpha=Math.min(1,alpha/.85)*.98*(1-lift);
   ctx.translate(Math.round(nib[0]-2+lift*8),Math.round(nib[1]-15-lift*9+hover));
   ctx.rotate(Math.sin(t*7)*.035);ctx.drawImage(socialSprite('pen'),0,0);ctx.restore();
  }
  if(p>.64){
   const stamp=Math.min(1,(p-.64)/.12),drop=(1-stamp)**2*10;
   ctx.save();ctx.translate(55,Math.round(29-drop));
   ctx.fillStyle='#c77777';ctx.fillRect(-3,-2,6,5);ctx.fillRect(-2,-3,4,7);
   ctx.fillStyle='#f0bca0';ctx.fillRect(-1,-1,2,2);
   ctx.fillStyle='#945765';ctx.fillRect(-2,4,2,3);ctx.fillRect(1,4,2,3);ctx.restore();
   if(stamp>.85&&p<.8){ctx.fillStyle='#f4dc9b';ctx.fillRect(62,27,2,1);ctx.fillRect(53,22,1,2);}
  }
  ctx.restore();
  const shake=p>.66&&p<.86?Math.sin(t*10)*1.5:Math.sin(t*.8)*.4;
  sprite(ctx,'hands',10,20+shake,p>.66?Math.floor(t*4):0,false,.64);
  return {x:(write-.5)*.7,y:p>.7&&p<.78?-.65:Math.sin(t*.8)*.25};
 }
 function draw(entry,t,dt){
  const {ctx,node,state,motion}=entry,type=node.dataset.social;
  ctx.clearRect(0,0,88,44);ctx.imageSmoothingEnabled=false;
  let x=0,y=0;
  if(type==='x'){
   // Banking figure-eight flights: quicker wingbeats while climbing, slower on the glide.
   for(let i=0;i<2;i++){
    const pose=birdFlight(t,i);
    ctx.save();ctx.globalAlpha=.82-i*.16;ctx.translate(pose.x,pose.y);ctx.rotate(pose.bank);
    ctx.scale((pose.flip?-1:1)*pose.turn,1);ctx.drawImage(socialSprite('bird',pose.flap),-8,-6);ctx.restore();
    x-=(pose.x-44)*.012;y+=(pose.y-22)*.035;
   }
  }else if(type==='github'){
   // Quiet commit-graph lanes: readable pixel bits climb toward the GitHub key.
   ctx.strokeStyle='#a7ceaf3b';ctx.lineWidth=1;ctx.beginPath();
   ctx.moveTo(44,39);ctx.lineTo(44,5);ctx.moveTo(22,33);ctx.lineTo(22,22);ctx.lineTo(44,12);ctx.moveTo(66,34);ctx.lineTo(66,22);ctx.lineTo(44,12);ctx.stroke();
   for(let i=0;i<3;i++){
    const p=phase(t,8,i/3),alpha=.25+.5*Math.sin(p*Math.PI);
    sprite(ctx,i%2?'one':'zero',13+i*22,29-p*26,0,false,alpha);
   }
   x=Math.sin(t*.75)*.45;y=Math.cos(t*.75)*.6;
  }else{
   ({x,y}=contract(ctx,reduced.matches?4:t));
  }
  spring(state,entry.interacting?0:x,entry.interacting?0:y,dt);
  motion.style.transform='translate('+state.x.toFixed(2)+'px,'+state.y.toFixed(2)+'px) rotate('+(state.x*.7).toFixed(2)+'deg)';
 }
 function stop(){cancelAnimationFrame(frame);frame=0;last=0;entries.forEach(e=>{e.motion.style.removeProperty('transform');e.state=restingSpring();});}
 function tick(now){
  if(!allowed()){stop();return;}
  frame=requestAnimationFrame(tick);
  if(last&&now-last<1000/24)return;
  const dt=last?Math.min(.05,(now-last)/1000):1/24;last=now;time+=dt;
  entries.forEach(entry=>{if(visible.has(entry.node))draw(entry,time,dt);});
 }
 function sync(){covered=Boolean(document.querySelector('dialog[open]'));stop();if(allowed())frame=requestAnimationFrame(tick);}
 const observer=new IntersectionObserver(changes=>{changes.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target));sync();});
 entries.forEach(e=>{
  observer.observe(e.node);draw(e,0,0);
  e.node.addEventListener('pointerenter',()=>{e.interacting=true;});
  e.node.addEventListener('pointerleave',()=>{e.interacting=e.node.matches(':focus-within');});
  e.node.addEventListener('focusin',()=>{e.interacting=true;});
  e.node.addEventListener('focusout',()=>{e.interacting=e.node.matches(':hover');});
 });
 document.addEventListener('visibilitychange',sync);document.addEventListener('portfolio:overlay',sync);
 reduced.addEventListener('change',sync);

 window.addEventListener('pagehide',stop);window.addEventListener('pageshow',sync);
}
