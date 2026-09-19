const colours={o:'#27313f',a:'#e6b979',b:'#af754d',c:'#fff0cb',d:'#a8bac5',e:'#758b9c',f:'#ef9853',g:'#aa523c',h:'#75b9cf',i:'#3d779f',j:'#d29b92'};
const sprites={
cat:['     oo       oo    ','     oao     oao    ','     oajo   ojco    ','     oaaaaoaaaao    ','     oaaaaaaaaao    ','     oaocaaocaco    ','      oaccjccao     ','      oaccccco      ','    oooaaaaaao      ','   oabaaaaaaco      ','  oabbaaaaacco      ','  obbaaaaaacco      ','  obbaaaaaacco      ','   obaaccccco       ','    oooooooo        '],
fox:['         oo    oo    ','         ofo  ofo    ','         ofjoojo     ','         offfffo     ','         ofoffoco    ','        offccccco    ','       offfcccco     ','    ooooffffco       ','   ofgffffffco       ','  ofggffffffco       ','  ofggffffffco       ','   offggffcco        ','    oooooooo         '],
rabbit:['       oo   oo       ','      oco  oco       ','      ocjo ocjo      ','      ocjo ocjo      ','      ocdo ocdo      ','       ocooco        ','       occcco        ','      occcccco       ','      occoccoco      ','       occcjcco      ','      odccccco       ','    ooddccccco       ','   oddddccccco       ','  odddddccccco       ','  odddddccccco       ','   oddcccccdo        ','    oooooooo         '],
bird:['           ooo       ','         oohhho      ','        ohhhcoco     ','        ohhhcccoaa   ','       ohhhhcco      ','    ooohhhhcco       ','   oiiihhhccco       ','  oiiiihhccco        ',' oiiiihhccco         ',' oooohcccco          ','    oooooo           ']};
const cache=new Map();
export function animalFrame(kind,pose='idle',step=0,blink=false){
 const key=[kind,pose,step%4,blink].join(':');if(cache.has(key))return cache.get(key);
 const canvas=document.createElement('canvas');canvas.width=32;canvas.height=28;
 const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
 const rect=(c,x,y,w,h)=>{ctx.fillStyle=colours[c];ctx.fillRect(x,y,w,h);};
 const map=sprites[kind],ox=5,oy=25-map.length;
 if(kind==='cat'){rect('o',2,15+step%2,4,7);rect('a',3,16+step%2,2,5);rect('o',1,14+step%2,4,3);rect('c',2,15+step%2,2,1);}
 if(kind==='fox'){rect('o',0,17,8,6);rect('f',1,18,7,4);rect('c',0,18,3,3);rect('o',2,15+step%2,4,3);rect('f',3,16+step%2,3,2);}
 if(kind==='rabbit'){rect('o',4,20,4,4);rect('c',4,20,3,3);}
 map.forEach((row,y)=>[...row].forEach((c,x)=>{if(colours[c])rect(c,x+ox,y+oy,1,1);}));
 if(kind==='bird'){
  rect('a',13,24,1,3);rect('a',17,24,1,3);
  if(pose==='fly'){const high=step%2===0;rect('o',10,high?7:16,6,7);rect('i',11,high?8:17,4,5);rect('h',12,high?8:18,3,3);}
  else{rect('i',10,17,6,4);rect('h',11,17,5,2);}
 }else{
  const walk=pose==='walk',jump=pose==='jump',a=walk&&step%2?1:0;
  rect('o',9-a,24,3,jump?1:3);rect('o',17+a,24,3,jump?1:3);
  rect(kind==='fox'?'g':'c',9-a,25,3,1);rect(kind==='fox'?'g':'c',17+a,25,3,1);
  if(pose==='hang'){rect('o',18,oy-1,2,5);rect('c',18,oy-1,2,2);}
 }
 if(blink){if(kind==='cat'){rect('a',12,oy+5,1,1);rect('b',12,oy+6,2,1);rect('a',17,oy+5,1,1);rect('b',17,oy+6,2,1);}else if(kind==='rabbit'){rect('c',14,oy+8,1,1);rect('e',14,oy+9,2,1);}}
 cache.set(key,canvas);return canvas;
}
