// Deterministic idle timing and bounded spring recoil.
export function phase(time, period, offset=0) {
 const p=((time/period+offset)%1+1)%1;
 return p-Math.sin(p*Math.PI*2)*.1;
}
export function spring(state, x, y, elapsed) {
 const dt=Math.max(0,Math.min(.05,elapsed)),steps=Math.max(1,Math.ceil(dt*120)),h=dt/steps;
 for(let i=0;i<steps;i++){
  state.vx+=((x-state.x)*95-state.vx*17)*h;
  state.vy+=((y-state.y)*95-state.vy*17)*h;
  state.x+=state.vx*h;state.y+=state.vy*h;
 }
 return state;
}
export const restingSpring=()=>({x:0,y:0,vx:0,vy:0});

export function birdFlight(time,index=0){
 const angle=phase(time,6.8,index*.46)*Math.PI*2;
 const vx=-25*Math.sin(angle),vy=14*Math.cos(angle*2),flip=vx<0;
 return {x:44+25*Math.cos(angle),y:22+7*Math.sin(angle*2),flip,
  bank:Math.max(-.58,Math.min(.58,Math.atan2(vy,Math.abs(vx)+5)))*(flip?-1:1)*Math.abs(Math.sin(angle)),
  turn:.2+.8*Math.abs(Math.sin(angle)),
  flap:Math.floor(time*(vy<0?7:3))+index};
}
