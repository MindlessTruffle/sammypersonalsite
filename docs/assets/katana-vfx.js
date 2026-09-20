// The curved cut, jagged rift, and two page edges share one screen-space seam.
export const cutSeam = [
  [0,59],[12,51],[24,46],[26,46.5],[32,43],[43,40.5],[45,41],
  [57,39],[60,39.5],[72,39.5],[75,40],[86,41.5],[89,41],[100,44],
];
export function shardClip(side) {
  const edge = cutSeam.map(([x,y])=>`${x}% ${y}%`);
  return side === 'top' ? `polygon(0 0,100% 0,${edge.reverse().join(',')})` :
    `polygon(${edge.join(',')},100% 100%,0 100%)`;
}
const seamPath = cutSeam.map(([x,y],i)=>`${i?'L':'M'}${x*10} ${y*10}`).join(' ');
export const katanaMarkup = `<svg class="katana-arc" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
 <path class="katana-wake" d="M-80 650C220 400 570 300 1080 440C590 160 160 290-80 650Z"/>
 <path class="katana-crescent" d="M-80 650C220 400 570 300 1080 440C600 200 180 320-80 650Z"/>
 <path class="katana-edge" d="M-80 650C220 400 570 300 1080 440C600 260 205 367-80 650Z"/>
 <path class="katana-echo" d="M-40 660C240 426 590 330 1080 458" pathLength="1000"/>
</svg><svg class="slash-rift" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
 <path class="rift-shadow" d="${seamPath}" pathLength="1000"/>
 <path class="rift-light" d="${seamPath}" pathLength="1000"/>
</svg>`;
