// Scroll is bounded independently of page length, keeping the backdrop overscan safe.
export function scenePose(time, scroll, compact = false) {
  const scale = compact ? .45 : 1;
  const depth = Math.tanh(Math.max(0, scroll) / 900);
  return {
    skyX: Math.sin(time / 11) * 3 * scale,
    skyY: (Math.cos(time / 15) * 2 - depth * 20) * scale,
    ivyX: Math.sin(time / 8) * 2 * scale,
    ivyY: (Math.sin(time / 13) * 3 - depth * 34) * scale,
    dustX: Math.sin(time / 9) * 5 * scale,
    dustY: (Math.cos(time / 12) * 6 - depth * 48) * scale
  };
}

export function easeScroll(current, target, elapsed) {
  return current + (target - current) * (1 - Math.exp(-Math.min(100, elapsed) / 180));
}
