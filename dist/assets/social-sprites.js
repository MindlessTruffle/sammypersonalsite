// Original pixel sprites, rasterized once and reused. No emoji or font-dependent icons.
const cache = new Map();
const palette = { b:'#449ddb', d:'#246197', l:'#c4ecff', w:'#fff3ce',
  k:'#293846', g:'#a3cbb2', s:'#e0ac7a', t:'#a86e4e', p:'#e7dbb7',
  c:'#548bba', n:'#577462' };
const maps = {
  bird: [
    '............','.......bb...','......blkb..','...bb.bbbbww',
    '.bbbbbbbb...', '..dbbbbbb...', '...ddbbb....','....dd......',
  ],
  zero: ['.ggg.','gg.gg','gg.gg','gg.gg','.ggg.'],
  one: ['..g..','.gg..','..g..','..g..','.ggg.'],
  hands: [
    '................','ccc..........ddd','cclsss....sssldd','cclssstttssssldd',
    'cclssstsstsssldd','ccc.sstsstss.ddd','.....tsstss.....','......tttt......',
    '................',
  ],
  paper: [
    '.pppppppp...','.pwwwwwwpp..','.pwwwwwwwwp.','.pwnnnnnwwp.',
    '.pwwwwwwwwp.','.pwnnnwwwwp.','.pwwwwwwwkp.','.pwwwwwwckp.',
    '.pwwwwwckwp.','.pwwwsckwwp.','.pwnnswwwwp.','.pppppppppp.',
  ],
  contract: [
    '.pppppppp...', '.pwwwwwwpp..', '.pwwwwwwwwp.', '.pwwwwwwwwp.',
    '.pwnnnnnwwp.', '.pwwwwwwwwp.', '.pwnnnnwwwp.', '.pwwwwwwwwp.',
    '.pwwwwwwwwp.', '.pwwwwwwwwp.', '.pwwwwwwwwp.', '.pwwwwwwwwp.',
    '.pwwwwwwwwp.', '.pppppppppp.',
  ],
  quill: [
    '...........ll..', '.........llll..', '........llwl...', '.......llwwl...',
    '......llwwl....', '.....llwwl.....', '.....lwwl......', '....lwwl.......',
    '....lwl........', '...lwl.........', '...wl..........', '..wl...........',
    '..p............', '.n.............',
  ],
};
export function socialSprite(kind, frame = 0) {
  const key = `${kind}:${frame % 2}`;
  if (cache.has(key)) return cache.get(key);
  const canvas = document.createElement('canvas');
  canvas.width = 18; canvas.height = 16;
  const ctx = canvas.getContext('2d');
  const rows = maps[kind];
  const unit = kind === 'zero' || kind === 'one' ? 2 : 1;
  const left = unit === 2 ? 4 : 1;
  rows.forEach((row,y) => [...row].forEach((color,x) => {
    if (!palette[color]) return;
    ctx.fillStyle = palette[color]; ctx.fillRect(x * unit + left, y * unit + 1, unit, unit);
  }));
  if (kind === 'bird') {
    ctx.fillStyle = '#71bceb';
    if (frame % 2) {ctx.fillRect(5,2,2,4);ctx.fillRect(4,1,2,2);}
    else {ctx.fillRect(5,6,3,2);ctx.fillRect(4,7,2,2);}
  }
  if (kind === 'paper' && frame % 2) {
    ctx.fillStyle = '#577462';ctx.fillRect(4,11,4,1);
  }
  if (kind === 'hands' && frame % 2) {
    ctx.fillStyle = '#e0ac7a';ctx.fillRect(7,7,3,1);
  }
  cache.set(key,canvas);return canvas;
}
