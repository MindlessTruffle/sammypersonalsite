import {scenePose, easeScroll} from './scene-depth-math.js';

// Change to false to remove the experiment and retain the original static background.
const ENABLED = true;
if (ENABLED) installDepth();

function installDepth() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 760px)');
  const scene = document.createElement('div');
  scene.className = 'scene-depth';
  scene.setAttribute('aria-hidden', 'true');
  const make = (name) => {
    const node = document.createElement('div');
    node.className = name;
    scene.append(node);
    return node;
  };
  const backdrop = make('scene-backdrop');
  const ivy = make('scene-ivy');
  const dust = make('scene-dust');
  // Fixed, sparse arrangement: no particle allocations or canvas redraws per frame.
  for (const [x, y] of [[4,18],[94,32],[8,64],[97,80],[2,91],[91,9]]) {
    const mote = document.createElement('i');
    mote.style.left = `${x}%`;
    mote.style.top = `${y}%`;
    dust.append(mote);
  }
  document.body.prepend(scene);
  document.body.classList.add('has-scene-depth');
  let frame = 0, last = null, time = 0, suspended = false;
  let target = Math.max(0, window.scrollY), scroll = target;
  const move = (node, x, y) => {
    node.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
  };
  function paint() {
    const p = scenePose(time, scroll, compact.matches);
    move(backdrop, p.skyX, p.skyY);
    move(ivy, p.ivyX, p.ivyY);
    move(dust, p.dustX, p.dustY);
  }
  function tick(now) {
    frame = 0;
    if (last === null) last = now;
    const elapsed = now - last;
    if (elapsed >= 1000 / 30) {
      time += Math.min(elapsed, 100) / 1000;
      scroll = easeScroll(scroll, target, elapsed);
      last = now;
      paint();
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = null;
    scene.hidden = reduced.matches;
    document.body.classList.toggle('has-scene-depth', !reduced.matches);
    if (!suspended && !document.hidden && !reduced.matches && !document.querySelector('dialog[open]')) {
      frame = requestAnimationFrame(tick);
    }
  }
  window.addEventListener('scroll', () => { target = Math.max(0, window.scrollY); }, {passive:true});
  window.addEventListener('pagehide', () => { suspended = true; sync(); });
  window.addEventListener('pageshow', () => { suspended = false; sync(); });
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('portfolio:overlay', sync);
  reduced.addEventListener('change', sync);
  compact.addEventListener('change', paint);
  paint();
  sync();
}
