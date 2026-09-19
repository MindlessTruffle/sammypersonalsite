const dialog=document.querySelector('#command-dialog');
const effectsBlocked=()=>document.hidden||Boolean(document.querySelector('dialog[open]'));
new MutationObserver(()=>document.dispatchEvent(new Event('portfolio:overlay'))).observe(dialog,{attributes:true,attributeFilter:['open']});
const search=document.querySelector('#command-search');
const results=document.querySelector('.command-results');
const modifier=/Mac|iPhone|iPad/.test(navigator.platform)?'cmd':'ctrl';
const buyButton=document.querySelector('.storefront-link');
if(buyButton){
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const animations=new Set();
  let visible=false,orbitFrames=null;
  const cancel=()=>{animations.forEach(animation=>animation.cancel());animations.clear();buyButton.querySelectorAll('.money-bill').forEach(bill=>bill.remove());};
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible)cancel();}).observe(buyButton);
  new ResizeObserver(()=>{orbitFrames=null;cancel();}).observe(buyButton);
  reducedMotion.addEventListener('change',cancel);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
  document.addEventListener('portfolio:overlay',cancel);
  function orbitMoney(){
    if(!visible||effectsBlocked()||reducedMotion.matches)return;
    if(!orbitFrames){
      const width=buyButton.clientWidth,height=buyButton.clientHeight,outline=buyButton.querySelector('.drawn-button-edge');
      if(!outline)return;
      const length=outline.getTotalLength();
      orbitFrames=[0,1].map(billIndex=>Array.from({length:129},(_,step)=>{
        const progress=step/128,fraction=(billIndex/8+progress*2)%1,point=outline.getPointAtLength(fraction*length);
        return {transform:`translate(${point.x/200*width-9}px,${point.y/54*height-9}px) rotate(${-4+Math.sin(progress*Math.PI*8)*3}deg)`,opacity:.48*Math.min(1,progress/.14,(1-progress)/.14),offset:progress};
      }));
    }
    for(let billIndex=0;billIndex<2;billIndex++){
      const bill=document.createElement('span');bill.className='money-bill';bill.setAttribute('aria-hidden','true');
      bill.innerHTML='<svg viewBox="0 0 24 24" fill="#d6eecb" stroke="#46733e" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>';
      buyButton.append(bill);
      const animation=bill.animate(orbitFrames[billIndex],{duration:7800,delay:billIndex*300,easing:'linear',fill:'both'});
      animations.add(animation);
      const finish=()=>{animations.delete(animation);bill.remove();};
      animation.finished.then(finish,finish);
    }
  }
  setInterval(orbitMoney,10000);
}
const preview=document.querySelector('.storefront-preview');
if(preview){
  let previewVisible=false,previewPending=false;
  new IntersectionObserver(([entry])=>{previewVisible=entry.isIntersecting;if(previewVisible&&!effectsBlocked())syncPreview();}).observe(preview);
  const frame=preview.querySelector('iframe');
  const status=preview.querySelector('.preview-status');
  const resize=()=>{const scale=Math.min(preview.clientWidth/500,preview.clientHeight/370);frame.style.transform=`translate(-50%,-50%) scale(${scale})`;};
  new ResizeObserver(resize).observe(preview);
  resize();
  function syncPreview(){if(previewPending)return;previewPending=true;return fetch('/api/number-company-status',{signal:AbortSignal.timeout(8000)}).then(response=>response.json()).then(({available,number})=>{
    if(!available)throw Error('Local storefront offline');
    const label=document.querySelector('.purchase-label');
    if(label)label.textContent=number?`Purchase Shirt #${number}`:'Purchase Shirt';
    if(!frame.getAttribute('src')){frame.addEventListener('load',()=>preview.classList.add('preview-ready'),{once:true});frame.src=frame.dataset.previewSrc;}
  }).catch(()=>{if(status)status.textContent='Local storefront offline. Start Number Company to see the live preview.';}).finally(()=>{previewPending=false;});}
  setInterval(()=>{if(previewVisible&&!effectsBlocked())syncPreview();},20000);
}
document.querySelectorAll('.modifier').forEach(el=>el.textContent=modifier);
let commands=[];
let selected=0;
let openedBy=null;
let loadPromise;
const shortcuts=['/','https://www.linkedin.com/in/sammyhawari/','https://github.com/MindlessTruffle','https://x.com/mindlesstruffle'];
function close(){dialog.close();openedBy?.focus();}
function visibleOptions(){return [...results.querySelectorAll('.command-option')];}
function select(index){const options=visibleOptions();selected=options.length?(index+options.length)%options.length:0;options.forEach((el,i)=>{el.classList.toggle('selected',i===selected);if(i===selected)el.setAttribute('aria-current','true');else el.removeAttribute('aria-current');});options[selected]?.scrollIntoView({block:'nearest'});}
function render(){const query=search.value.trim().toLocaleLowerCase();const matches=commands.filter(c=>(c.title+' '+(c.description||'')).toLocaleLowerCase().includes(query));results.replaceChildren();let group='';for(const command of matches){if(command.group!==group){const h=document.createElement('p');h.className='command-group';h.textContent=command.group;results.append(h);group=command.group;}const a=document.createElement('a');a.className='command-option';a.href=command.url;const span=document.createElement('span');span.textContent=command.title;a.append(span);if(command.shortcut){const kbd=document.createElement('kbd');kbd.textContent=command.shortcut;a.append(kbd);}if(command.url.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer';}a.addEventListener('click',close);results.append(a);}if(!matches.length){const p=document.createElement('p');p.className='no-results';p.textContent='no matches. try a project name.';results.append(p);}select(0);}
async function open(trigger){openedBy=trigger||document.activeElement;search.value='';dialog.showModal();search.focus();if(commands.length){render();return;}results.textContent='loading…';try{loadPromise??=fetch('/assets/search.json').then(r=>{if(!r.ok)throw Error('Search unavailable');return r.json();});commands=await loadPromise;render();}catch{loadPromise=null;results.textContent='Search unavailable. Project links remain available on the page.';}}
document.querySelectorAll('.command-trigger').forEach(el=>el.addEventListener('click',()=>open(el)));
document.querySelector('.close-command').addEventListener('click',close);
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();});
dialog.addEventListener('cancel',()=>{openedBy?.focus();});
search.addEventListener('input',render);
search.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close();}else if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();select(selected+(event.key==='ArrowDown'?1:-1));}else if(event.key==='Enter'){event.preventDefault();visibleOptions()[selected]?.click();}});
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();dialog.open?close():open();return;}if(event.target instanceof Element&&event.target.closest('input,textarea,select,[contenteditable="true"]'))return;if(event.shiftKey&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&/^Digit[0-3]$/.test(event.code)){event.preventDefault();const url=shortcuts[Number(event.code.slice(-1))];if(url.startsWith('https:'))window.open(url,'_blank','noopener,noreferrer');else location.assign(url);}});
