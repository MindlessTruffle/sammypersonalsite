// Ambient scenery only: the courtyard and banner surfaces remain completely still.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const scene = document.createElement('div');
scene.className = 'background-life';
scene.setAttribute('aria-hidden', 'true');
const svgNS = 'http://www.w3.org/2000/svg';
function sprite(kind, top, duration, delay) {
  const flight = document.createElement('div');
  flight.className = `background-flight ${kind}-flight`;
  flight.style.cssText = `--altitude:${top}%;--duration:${duration}s;--delay:${delay}s`;
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
// Sparse, staggered flights. Negative delays prevent a synchronized entrance.
[[25,39,-8],[52,47,-31],[78,43,-19],[38,51,-43]].forEach(([top,duration,delay])=>sprite('leaf',top,duration,delay));
[[12,58,-21],[19,64,-44],[31,71,-5]].forEach(([top,duration,delay])=>sprite('bird',top,duration,delay));
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
