import {tearDestination} from './tear-routes.js';
import {tearTiming as timing} from './tear-timing.js';
import {katanaMarkup,shardClip} from './katana-vfx.js';

const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const baseTitle=document.title,baseURL=location.href;
const siteRoot=document.querySelector('meta[name="site-root"]')?.content||'/';
const cache=new Map();
let portal,content,opener,scroll=0,controller=null,revision=0,closing=false,current=null;
let openingTimer=0;
let closingWipe=null,closingTransition=null;
const animations=new Set();
const cross='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5 19 19M19 5 5 19" fill="none" stroke="currentColor" stroke-width="3"/></svg>';

function ensure(){
 if(portal)return;
 portal=document.createElement('dialog');portal.id='sword-portal';portal.setAttribute('aria-label','Project page');
 portal.innerHTML=`<div class="tear-layout"><button class="tear-close tear-close-top" type="button" aria-label="Close project page">${cross}<span>Close page</span><kbd>esc</kbd></button><div class="tear-window detail" tabindex="-1"><div class="tear-content"></div></div><button class="tear-close tear-close-bottom" type="button" aria-label="Close project page">${cross}<span>Close page</span></button></div><div class="slash-fx" aria-hidden="true"><div class="slash-anticipation"></div>${katanaMarkup}<div class="slash-flash"></div></div>`;
 const fx=portal.querySelector('.slash-fx');
 for(let i=0;i<6;i++){const spark=document.createElement('i');spark.className='slash-spark';spark.style.left=(20+i*12)+'%';spark.style.top=(52-i*.65)+'%';fx.append(spark);}
 document.body.append(portal);content=portal.querySelector('.tear-content');
 portal.querySelectorAll('.tear-close').forEach(b=>b.addEventListener('click',requestClose));
 portal.addEventListener('cancel',e=>{e.preventDefault();requestClose();});
}
function motion(el,frames,options){
 const animation=el.animate(frames,options);animations.add(animation);
 animation.finished.catch(()=>{}).finally(()=>{animations.delete(animation);animation.cancel();});return animation;
}
function cancelMotion(){
 clearTimeout(openingTimer);openingTimer=0;
 for(const animation of animations)animation.cancel();animations.clear();
 portal?.querySelectorAll('.tear-shard').forEach(n=>n.remove());
 portal?.querySelector('.slash-fx').classList.remove('is-cutting');
 if(portal)portal.querySelector('.tear-window').inert=false;
}
function snapshot(){
 const shell=document.querySelector('body > .site-shell');if(!shell)return;
 const rect=shell.getBoundingClientRect();
 for(const side of ['top','bottom']){
  const shard=document.createElement('div');shard.className='tear-shard tear-shard-'+side;shard.setAttribute('aria-hidden','true');shard.inert=true;shard.style.clipPath=shardClip(side);
  const copy=shell.cloneNode(true);copy.classList.add('tear-copy');
  copy.querySelectorAll('iframe,.pet-stage,canvas,script').forEach(n=>n.remove());
  copy.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
  copy.querySelectorAll('.preview-ready').forEach(n=>n.classList.remove('preview-ready'));
  copy.style.cssText=`position:absolute;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;margin:0;pointer-events:none;`;
  shard.append(copy);portal.append(shard);
 }
}
function slash(split){
 cancelMotion();if(reduced.matches)return;
 if(split)snapshot();
 const fx=portal.querySelector('.slash-fx');fx.classList.add('is-cutting');
 // Phase 1: a tapered crescent and offset afterimage, not a traveling weapon.
 motion(portal.querySelector('.slash-anticipation'),[{opacity:0},{opacity:.2,offset:.16},{opacity:.2,offset:.7},{opacity:0}],{duration:1200,fill:'both'});
 motion(portal.querySelector('.katana-arc'),[
  {clipPath:'inset(0 100% 0 0)',opacity:0,transform:'scale(1,.92)'},
  {clipPath:'inset(0 86% 0 0)',opacity:1,transform:'scale(1,.96)',offset:.12},
  {clipPath:'inset(0 -5% 0 -5%)',opacity:1,transform:'scale(1,1)',offset:.6},
  {clipPath:'inset(0 -5% 0 -5%)',opacity:0,transform:'scale(1,1.06)'},
 ],{duration:timing.sweep+240,delay:timing.windup,easing:'cubic-bezier(.16,.65,.25,1)',fill:'both'});
 motion(portal.querySelector('.katana-echo'),[{strokeDashoffset:1000,opacity:0},{strokeDashoffset:0,opacity:.65,offset:.6},{strokeDashoffset:-1000,opacity:0}],{duration:560,delay:140,fill:'both'});
 motion(portal.querySelector('.slash-flash'),[{opacity:0},{opacity:.8,offset:.25},{opacity:0}],{duration:timing.flashDuration,delay:timing.flashStart,fill:'both'});
 // Phase 2: the cut becomes a jagged, white fissure. The article remains hidden.
 portal.querySelectorAll('.slash-rift path').forEach(path=>{
  const width=path.classList.contains('rift-shadow')?32:18;
  motion(path,[
   {strokeDashoffset:1000,strokeWidth:1,opacity:0},
   {strokeDashoffset:820,strokeWidth:2,opacity:1,offset:.12},
   {strokeDashoffset:0,strokeWidth:5,opacity:1,offset:.55},
   {strokeDashoffset:0,strokeWidth:width,opacity:1,offset:.83},
   {strokeDashoffset:0,strokeWidth:width+4,opacity:0},
  ],{duration:timing.tearDuration+160,delay:timing.tearStart,fill:'both',easing:'linear'});
 });
 portal.querySelectorAll('.slash-spark').forEach((spark,i)=>{
  spark.style.left=(12+i*15)+'%';spark.style.top=([51,46,41,39,40,42][i])+'%';
  motion(spark,[
   {opacity:0,transform:'translate(0,0) rotate(-25deg) scale(.2)'},
   {opacity:.85,transform:'translate(0,0) rotate(-25deg) scale(1)',offset:.16},
   {opacity:0,transform:'translate('+ (i%2?46:-46) +'px,'+(i%2?70:-70)+'px) rotate(-40deg) scale(.2)'},
  ],{duration:510,delay:timing.tearStart+i*65,fill:'both',easing:'ease-out'});
 });
 // Phase 3: both torn pieces move away before the menu content expands into the gap.
 const pane=portal.querySelector('.tear-window');pane.inert=true;
 motion(pane,[{clipPath:'inset(49.9% 0)'},{clipPath:'inset(32% 0)',offset:.28},{clipPath:'inset(0% 0)'}],{duration:timing.expandDuration,delay:timing.expandStart,easing:'cubic-bezier(.4,0,.16,1)',fill:'both'});
 motion(content,[{opacity:0,transform:'translateY(14px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:timing.contentDuration,delay:timing.contentStart,easing:'ease-out',fill:'both'});
 for(const side of ['top','bottom']){
  const direction=side==='top'?-1:1;
  const shard=portal.querySelector('.tear-shard-'+side);
  if(shard){const a=motion(shard,[
   {transform:'translateY(0)'},
   {transform:'translateY('+direction*1.5+'vh)',offset:.25,easing:'cubic-bezier(.2,.7,.2,1)'},
   {transform:'translateY('+direction*4+'vh)',offset:timing.tearDuration/(timing.total-timing.tearStart),easing:'cubic-bezier(.4,0,.16,1)'},
   {transform:'translateY('+direction*72+'vh)'},
  ],{duration:timing.total-timing.tearStart,delay:timing.tearStart,fill:'both'});a.finished.then(()=>shard.remove(),()=>shard.remove());}
  motion(portal.querySelector('.tear-close-'+side),[
   {transform:'translateY('+direction*120+'%)'},
   {transform:'translateY('+-direction*3+'%)',offset:.84},
   {transform:'translateY(0)'},
  ],{duration:timing.controlsDuration,delay:timing.controlsStart,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
 }
 const fxRevision=revision;openingTimer=setTimeout(()=>{
  if(revision===fxRevision){fx.classList.remove('is-cutting');pane.inert=false;}
  openingTimer=0;
 },timing.total);
}
async function page(url,signal){
 if(cache.has(url))return cache.get(url);
 const response=await fetch(url,{signal});if(!response.ok)throw Error('Page unavailable');
 const parsed=new DOMParser().parseFromString(await response.text(),'text/html');
 const article=parsed.querySelector('main.detail article');if(!article)throw Error('Project not found');
 article.querySelectorAll('script').forEach(n=>n.remove());
 const result={html:article.outerHTML,title:parsed.title};cache.set(url,result);return result;
}
async function openPage(url,trigger,push=true){
 cancelClosingWipe();
 ensure();const wasOpen=portal.open;
 if(!wasOpen){opener=trigger||document.activeElement;scroll=window.scrollY;portal.showModal();document.body.classList.add('tear-open');document.dispatchEvent(new Event('portfolio:overlay'));}
 closing=false;controller?.abort();controller=new AbortController();const id=++revision;current=url;
 content.innerHTML='<p class="tear-loading" role="status">Opening page…</p>';
 portal.querySelector('.tear-window').scrollTop=0;
 if(push){const state={...(history.state||{}),portfolioTear:true,tearURL:url,tearBase:baseURL};wasOpen?history.replaceState(state,'',url):history.pushState(state,'',url);}
 slash(!wasOpen);
 portal.querySelector('.tear-close-top').focus({preventScroll:true});
 try{
  const result=await page(url,controller.signal);if(id!==revision||!portal.open)return;
  content.innerHTML=result.html;document.title=result.title;portal.setAttribute('aria-label',content.querySelector('h1')?.textContent||'Project page');
 }catch(error){
  if(error.name==='AbortError'||id!==revision)return;
  content.replaceChildren();const p=document.createElement('p');p.className='tear-loading';p.setAttribute('role','alert');p.textContent='This page could not be opened here.';
  const link=document.createElement('a');link.href=url;link.dataset.nativeNavigation='';link.className='tear-native';link.textContent='Open full page';content.append(p,link);
 }
}
function requestClose(){
 if(closing||!portal?.open)return;closing=true;
 if(history.state?.portfolioTear&&history.state.tearBase===baseURL)history.back();else finishClose();
}
function restoreBase(){
 portal.close();document.body.classList.remove('tear-open');document.dispatchEvent(new Event('portfolio:overlay'));
 document.title=baseTitle;current=null;window.scrollTo(0,scroll);content.replaceChildren();
}
function restoreFocus(){
 const returnFocus=opener?.isConnected&&opener.getClientRects().length?opener:document.querySelector('.command-trigger,.name');
 returnFocus?.focus({preventScroll:true});
}
function cancelClosingWipe(){
 const run=closingTransition;closingTransition=null;
 run?.animation?.cancel();
 if(closingWipe?.open)closingWipe.close();
 closing=false;
}
function completeClose(){
 if(portal?.open)restoreBase();
 cancelClosingWipe();restoreFocus();
 document.dispatchEvent(new Event('portfolio:overlay'));
}
async function finishClose(){
 if(closingTransition)return;
 if(!portal?.open){closing=false;return;}
 closing=true;++revision;controller?.abort();cancelMotion();
 if(reduced.matches){completeClose();return;}
 if(!closingWipe){
  closingWipe=document.createElement('dialog');closingWipe.id='closing-wipe';
  closingWipe.setAttribute('aria-label','thanks for checking me out :)');closingWipe.tabIndex=-1;
  closingWipe.innerHTML='<div class="closing-wipe-sheet"><p>thanks for checking me out <span>:)</span></p></div>';
  closingWipe.addEventListener('cancel',event=>{event.preventDefault();completeClose();});
  document.body.append(closingWipe);
 }
 const run={animation:null};closingTransition=run;
 closingWipe.showModal();closingWipe.focus({preventScroll:true});
 const sheet=closingWipe.querySelector('.closing-wipe-sheet');
 try{
  run.animation=sheet.animate([{transform:'translateX(-105%)'},{transform:'translateX(0)'}],{duration:420,easing:'cubic-bezier(.65,0,.2,1)',fill:'forwards'});
  await run.animation.finished;if(closingTransition!==run)return;
  // Restore the underlying page only after the dark wipe completely covers it.
  restoreBase();
  const entering=run.animation;
  run.animation=sheet.animate([{transform:'translateX(0)'},{transform:'translateX(105%)'}],{duration:480,delay:650,easing:'cubic-bezier(.65,0,.2,1)',fill:'both'});
  entering.cancel();
  await run.animation.finished;if(closingTransition===run)completeClose();
 }catch{
  // Forward navigation can interrupt a close; it owns focus and the next transition.
  if(closingTransition===run)completeClose();
 }
}
document.addEventListener('click',event=>{
 const link=event.target.closest?.('a[href]');if(!link)return;
 if(portal?.open&&link.classList.contains('back-link')&&new URL(link.href).pathname===siteRoot){event.preventDefault();requestClose();return;}
 const url=tearDestination(link.href,location.href,{root:siteRoot,modified:event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey,download:link.hasAttribute('download'),native:link.hasAttribute('data-native-navigation'),target:link.target});
 if(!url||event.defaultPrevented)return;event.preventDefault();openPage(url,link);
});
addEventListener('popstate',()=>{if(history.state?.portfolioTear&&history.state.tearBase===baseURL)openPage(location.pathname,null,false);else finishClose();});
reduced.addEventListener('change',()=>{if(reduced.matches){cancelMotion();if(closingTransition)completeClose();}});
