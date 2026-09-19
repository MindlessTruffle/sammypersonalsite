// Temporary marks expire by age, never by a distance or mark-count cap.
export const IMPRINT_LIFETIME=3400;
export const IMPRINT_BATCH_MS=240;
export function imprintEnvelope(age){
 const bud=Math.max(0,Math.min(1,(age-1050)/850));
 return {stem:1,bud:bud*bud*(3-2*bud),opacity:Math.max(0,Math.min(1,(IMPRINT_LIFETIME-age)/1000))};
}

// Split fast pointer jumps at cloth boundaries, leaving gaps between banners untouched.
// Rectangles are ordered parent first: the most specific cloth section owns each piece.
export function clipImprintStroke(start,end,rects){
 const dx=end.x-start.x,dy=end.y-start.y,intervals=[];
 if(Math.hypot(dx,dy)<1)return [];
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
 if(distance<1)return [];
 const count=Math.ceil(distance/16);
 return Array.from({length:count},(_,i)=>({
  start:{x:start.x+(end.x-start.x)*i/count,y:start.y+(end.y-start.y)*i/count},
  end:{x:start.x+(end.x-start.x)*(i+1)/count,y:start.y+(end.y-start.y)*(i+1)/count},
 }));
}
