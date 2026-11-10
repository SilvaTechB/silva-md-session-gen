(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.className = 'ambient-3d';
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0', width: '100%', height: '100%',
    zIndex: '0', pointerEvents: 'none', opacity: '.62'
  });
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  const points = [];
  const pointer = { x: 0, y: 0 };
  let width = 0, height = 0, frame = 0;
  const count = Math.min(220, Math.max(90, Math.floor(innerWidth * innerHeight / 6200)));
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push({ x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius, seed: Math.random() });
  }

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    width = innerWidth; height = innerHeight;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(0);
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    const t = reduceMotion ? 0 : time * 0.00018;
    const cx = width * .5 + pointer.x * width * .025;
    const cy = height * .48 + pointer.y * height * .025;
    const scale = Math.min(width, height) * (width < 600 ? .30 : .35);
    const sy = Math.sin(t), cyaw = Math.cos(t), sx = Math.sin(t * .63), cxr = Math.cos(t * .63);
    const projected = points.map(p => {
      const x1 = p.x * cyaw - p.z * sy;
      const z1 = p.x * sy + p.z * cyaw;
      const y2 = p.y * cxr - z1 * sx;
      const z2 = p.y * sx + z1 * cxr;
      const perspective = 3.5 / (3.5 - z2 * .68);
      return { x: cx + x1 * scale * perspective, y: cy + y2 * scale * perspective, z: z2, a: .18 + (z2 + 1) * .28, seed: p.seed };
    });

    for (let i = 0; i < projected.length; i++) {
      const a = projected[i];
      for (let j = i + 1; j < projected.length; j++) {
        const b = projected[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < (width < 600 ? 31 : 40)) {
          ctx.strokeStyle = `rgba(0,230,150,${(1 - d / 40) * Math.min(a.a, b.a) * .32})`;
          ctx.lineWidth = .65;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const r = 1 + (a.z + 1) * .85;
      ctx.fillStyle = a.seed > .83 ? `rgba(34,211,238,${a.a})` : `rgba(0,230,118,${a.a})`;
      ctx.beginPath(); ctx.arc(a.x, a.y, r, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduceMotion) frame = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', event => {
    pointer.x = event.clientX / Math.max(1, width) - .5;
    pointer.y = event.clientY / Math.max(1, height) - .5;
  }, { passive: true });
  resize();
  if (!reduceMotion) frame = requestAnimationFrame(draw);
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame), { once: true });
})();
