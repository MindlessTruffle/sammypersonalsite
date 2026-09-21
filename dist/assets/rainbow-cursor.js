// Native cursor frames keep the pointer precise, including inside modal dialogs.
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const clickable = 'a[href],button,[role="button"],[role="link"],summary,label[for],input[type="button"],input[type="submit"],input[type="reset"],input[type="checkbox"],input[type="radio"]';
const disabled = '[inert],:disabled,[aria-disabled="true"]';
const shape = 'M4 3C3 2.4 2.7 3.3 2.8 4.5L4.1 21C4.2 22.5 5.1 22.9 6.2 21.8L10 17.9L13.5 25C14.1 26.2 15.3 26.5 16.5 25.9L18.3 25C19.5 24.4 19.8 23.1 19.1 22L15.3 15.7L21.7 15.1C23.3 15 23.6 13.8 22.3 12.8Z';
let frames, images, active = null, timer = 0, index = 0, focused = true;
function prepareFrames() {
  if (frames) return;
  frames = Array.from({length:36}, (_, frame) => {
    const stops = [0, .33, .66, 1].map((offset, i) => `<stop offset="${offset}" stop-color="hsl(${(frame * 10 + i * 80) % 360},88%,72%)"/>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="28" viewBox="0 0 26 28"><defs><linearGradient id="rainbow" x1="0" y1="0" x2="1" y2="1">${stops}</linearGradient></defs><path d="${shape}" fill="url(#rainbow)" stroke="#29323b" stroke-width="3.2" stroke-linejoin="round"/><path d="m6 8 .6 8M8 8l7 4" fill="none" stroke="#fffdf0" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/></svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  });
  // Decode once, then reuse the same tiny images across all links and buttons.
  images = frames.map(src => { const image = new Image(); image.src = src; return image; });
}
function stop() {
  clearInterval(timer); timer = 0;
  active?.style.removeProperty('--cursor-link');
  active = null;
}
function paint() {
  if (!active?.isConnected || active.closest(disabled) || document.hidden || !focused || !fine.matches || reduced.matches) { stop(); return; }
  active.style.setProperty('--cursor-link', `url("${frames[index]}")`);
  index = (index + 1) % frames.length;
}
function hover(target) {
  const next = target?.closest?.(clickable);
  if (next === active) return;
  stop();
  if (!next || next.closest(disabled) || document.hidden || !focused || !fine.matches || reduced.matches) return;
  prepareFrames(); active = next; paint();
  timer = setInterval(paint, 80);
}
const track = event => { if (event.pointerType !== 'touch') hover(event.target); };
document.addEventListener('pointerover', track, {passive:true});
document.addEventListener('pointermove', track, {passive:true});
document.addEventListener('pointerout', event => hover(event.relatedTarget), {passive:true});
document.addEventListener('visibilitychange', stop);
document.addEventListener('portfolio:overlay', stop);
fine.addEventListener('change', stop); reduced.addEventListener('change', stop);
window.addEventListener('blur', () => { focused = false; stop(); });
window.addEventListener('focus', () => { focused = true; });
window.addEventListener('pagehide', () => { focused = false; stop(); });
window.addEventListener('pageshow', () => { focused = true; });
