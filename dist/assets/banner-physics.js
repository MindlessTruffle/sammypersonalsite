export const LOOP_SECONDS = 24;
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
const mix=(a,b,t)=>({x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t)});
const jump=(a,b,t,height)=>({...mix(a,b,t),y:lerp(a.y,b.y,t)-Math.sin(Math.PI*t)*height});

export function catPose(seconds,left,right){
  const t=((seconds%LOOP_SECONDS)+LOOP_SECONDS)%LOOP_SECONDS;
  const stacked=right.y>left.y+left.height*.5;
  const anchor={x:left.x+left.width-(stacked?96:18),y:left.y-4};
  const length=Math.min(96,left.width*.3);
  const hanging=angle=>({x:anchor.x+Math.sin(angle)*length,y:anchor.y+Math.cos(angle)*length+19});
  const swingAngle=time=>-.55*Math.cos(time*Math.PI*2/3.2);
  const start=hanging(swingAngle(0));
  const release=hanging(1.42);
  const landing={x:right.x+(stacked?right.width-28:38),y:right.y-8};
  const stroll={x:right.x+right.width*.62,y:right.y-8};
  const returnEdge={x:stacked?right.x+right.width-20:right.x+12,y:right.y-8};
  const homeEdge={x:left.x+left.width-(stacked?20:12),y:left.y-8};
  const home={x:left.x+left.width*.67,y:left.y-8};
  let p,mode='walk',angle=0,weight=0,face=1;
  if(t<7){
    angle=t<5?swingAngle(t):lerp(swingAngle(5),1.42,smooth((t-5)/2));
    p=hanging(angle);mode='hang';weight=.55+.3*Math.cos(angle);face=1;
  }else if(t<9){p=jump(release,landing,(t-7)/2,stacked?20:45);mode='jump';}
  else if(t<12){p=mix(landing,stroll,(t-9)/3);face=stroll.x>landing.x?1:-1;}
  else if(t<14){p=stroll;mode='sit';face=-1;}
  else if(t<18){p=mix(stroll,returnEdge,(t-14)/4);face=returnEdge.x>stroll.x?1:-1;}
  else if(t<20){
    const u=(t-18)/2;
    p=jump(returnEdge,homeEdge,u,stacked?12:30);
    if(stacked)p.x=left.x+left.width+Math.sin(Math.PI*u)*6-20;
    mode=stacked?'climb':'jump';face=-1;
  }else if(t<22){p=mix(homeEdge,home,(t-20)/2);face=-1;}
  else{p=jump(home,start,smooth((t-22)/2),12);mode='jump';face=1;weight=(t-22)/2*.8;}
  return {...p,mode,angle,weight,face,anchor,phase:t};
}
