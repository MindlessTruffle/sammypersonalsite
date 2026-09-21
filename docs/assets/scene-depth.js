// Ambient scenery only: the courtyard and banner surfaces remain completely still.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const scene = document.createElement('div');
scene.className = 'background-life';
scene.setAttribute('aria-hidden', 'true');
const svgNS = 'http://www.w3.org/2000/svg';
function sprite(kind, top, duration, delay, drift = 0) {
  const flight = document.createElement('div');
  flight.className = `background-flight ${kind}-flight`;
  flight.style.cssText = `--altitude:${top}%;--duration:${duration}s;--delay:${delay}s;--drift:${drift}px`;
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', kind === 'leaf' ? '0 0 18 12' : '0 0 24 12');
  if (kind === 'leaf') {
    svg.innerHTML = '<path class="leaf-shape" d="M2 9Q3 1 15 2Q16 10 2 9Z"/><path class="leaf-vein" d="m2 9 10-5"/>';
  } else {
    svg.innerHTML = '<path class="bird-wing wing-left" d="M12 8Q7 2 2 4"/><path class="bird-wing wing-right" d="M12 8Q17 2 22 4"/>';
  }
  flight.append(svg);
  scene.append(flight);
}
// Leaves enter above the viewport at varied horizontal positions. Staggered phases
// keep the breeze populated without synchronized entrances or new allocations.
[[2,32,-8],[10,39,-31],[19,35,-19],[28,43,-37],[37,30,-5],[46,38,-24],
 [55,34,-15],[64,41,-34],[73,31,-11],[82,37,-28],[90,44,-20],[98,36,-3]]
  .forEach(([x,duration,delay],i)=>sprite('leaf',x,duration,delay,(i%2?-1:1)*(45+i*7)));
[[10,24,-9],[17,29,-20],[25,27,-3],[35,32,-18],[43,23,-15],[57,30,-7],[69,26,-22]]
  .forEach(([top,duration,delay])=>sprite('bird',top,duration,delay));
document.body.prepend(scene);
let suspended = false;
function sync() {
  scene.hidden = reduced.matches;
  scene.classList.toggle('is-paused', suspended || document.hidden || reduced.matches || Boolean(document.querySelector('dialog[open]')));
}
document.addEventListener('visibilitychange', sync);
document.addEventListener('portfolio:overlay', sync);
reduced.addEventListener('change', sync);
window.addEventListener('pagehide', () => { suspended = true; sync(); });
window.addEventListener('pageshow', () => { suspended = false; sync(); });
sync();
