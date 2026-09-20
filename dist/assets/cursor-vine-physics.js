// Temporary marks expire by age, never by a distance or mark-count cap.
export const IMPRINT_LIFETIME=3400;
export const IMPRINT_BATCH_MS=240;
export const IMPRINT_OPACITY=.20;
// Speed-adaptive filtering absorbs tiny hand tremors, but releases on fast sweeps.
// Midpoint quadratics share tangents; sampling happens before cloth-boundary clipping.
export function smoothImprint(state,target,elapsed=16){
 if(!state)return {state:{point:{...target},midpoint:{...target}},segments:[]};
 const dt=Math.max(1,Math.min(32,elapsed)),distance=Math.hypot(target.x-state.point.x,target.y-state.point.y);
 const speed=distance/dt,alpha=1-Math.exp(-dt/(44/(1+1.5*speed*speed)));
 const point={x:state.point.x+(target.x-state.point.x)*alpha,y:state.point.y+(target.y-state.point.y)*alpha};
 const end={x:(state.point.x+point.x)/2,y:(state.point.y+point.y)/2},start=state.midpoint,control=state.point;
 const length=Math.hypot(control.x-start.x,control.y-start.y)+Math.hypot(end.x-control.x,end.y-control.y);
 const count=Math.max(1,Math.ceil(length/6)),segments=[];
 let previous=start;
 for(let i=1;i<=count;i++){
  const t=i/count,u=1-t,next={x:u*u*start.x+2*u*t*control.x+t*t*end.x,y:u*u*start.y+2*u*t*control.y+t*t*end.y};
  segments.push({start:previous,end:next});previous=next;
 }
 return {state:{point,midpoint:end},segments};
}
export function imprintEnvelope(age){
 const bud=Math.max(0,Math.min(1,(age-1050)/850));
 return {stem:1,bud:bud*bud*(3-2*bud),opacity:Math.max(0,Math.min(1,(IMPRINT_LIFETIME-age)/1000))};
}

// Split fast pointer jumps at cloth boundaries, leaving gaps between banners untouched.
// Rectangles are ordered parent first: the most specific cloth section owns each piece.
export function clipImprintStroke(start,end,rects){
 const dx=end.x-start.x,dy=end.y-start.y,intervals=[];
 if(Math.hypot(dx,dy)<.01)return [];
 for(const rect of rects){
  let lo=0,hi=1;
  for(const [origin,delta,min,max] of [[start.x,dx,rect.x,rect.x+rect.width],[start.y,dy,rect.y,rect.y+rect.height]]){
   if(Math.abs(delta)<1e-9){if(origin<min||origin>max){hi=-1;break;}}
   else{const a=(min-origin)/delta,b=(max-origin)/delta;lo=Math.max(lo,Math.min(a,b));hi=Math.min(hi,Math.max(a,b));}
  }
  if(hi>lo)intervals.push({rect,lo,hi});
 }
 const cuts=[...new Set(intervals.flatMap(i=>[i.lo,i.hi]))].sort((a,b)=>a-b),pieces=[];
 for(let i=1;i<cuts.length;i++){
  const lo=cuts[i-1],hi=cuts[i],mid=(lo+hi)/2;
  const owner=intervals.findLast(part=>mid>=part.lo&&mid<=part.hi);
  if(!owner)continue;
  const rect=owner.rect;
  pieces.push({element:rect.element,start:{x:start.x+dx*lo-rect.x,y:start.y+dy*lo-rect.y},end:{x:start.x+dx*hi-rect.x,y:start.y+dy*hi-rect.y}});
 }
 return pieces;
}
export function imprintSegments(start,end){
 const distance=Math.hypot(end.x-start.x,end.y-start.y);
 if(distance<.01)return [];
 const count=Math.ceil(distance/16);
 return Array.from({length:count},(_,i)=>({
  start:{x:start.x+(end.x-start.x)*i/count,y:start.y+(end.y-start.y)*i/count},
  end:{x:start.x+(end.x-start.x)*(i+1)/count,y:start.y+(end.y-start.y)*(i+1)/count},
 }));
}
