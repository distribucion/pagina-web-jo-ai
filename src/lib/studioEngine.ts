// SEEDANCE-SWAP: when `public/video/studio-calm.mp4` exists, replace this
// canvas with an ambient looping <video>. Until then it renders the calm
// studio mood procedurally: drifting dust motes, a soft desk glow, and a faint
// ultra-wide monitor silhouette running the IRIS dashboard.

const TAU = Math.PI * 2;

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
}

export interface StudioEngine {
  setVisible(v: boolean): void;
  destroy(): void;
}

export function createStudioEngine(canvas: HTMLCanvasElement): StudioEngine {
  const ctx = canvas.getContext('2d')!;
  let W = 0;
  let H = 0;
  let dpr = 1;
  let raf = 0;
  let t = 0;
  let last = performance.now();
  let visible = true;
  let destroyed = false;
  let motes: Mote[] = [];

  function layout() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    W = Math.max(1, Math.floor(rect.width));
    H = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = W < 768 ? 40 : 80;
    motes = [];
    for (let i = 0; i < count; i++) {
      motes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: -2 - Math.random() * 5,
        vy: -1 - Math.random() * 3,
        r: 0.5 + Math.random() * 1.3,
        phase: Math.random() * TAU,
      });
    }
  }

  function frame(now: number) {
    if (destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible) {
      raf = requestAnimationFrame(frame);
      return;
    }
    t += dt;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#0A0A0F';
    ctx.fillRect(0, 0, W, H);

    // slow-breathing desk glow at the bottom
    const breathe = 0.5 + Math.sin(t * 0.5) * 0.12;
    let g = ctx.createRadialGradient(W * 0.5, H * 1.05, 0, W * 0.5, H * 1.05, H * 0.9);
    g.addColorStop(0, `rgba(109,40,217,${0.22 * breathe})`);
    g.addColorStop(1, 'rgba(109,40,217,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // faint ultra-wide monitor silhouette
    const mw = Math.min(W * 0.5, 760);
    const mh = mw * 0.3;
    const mx = W / 2 - mw / 2;
    const my = H * 0.56 - mh;
    ctx.strokeStyle = 'rgba(167,139,250,0.14)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(mx, my, mw, mh);
    const sg = ctx.createLinearGradient(mx, my, mx, my + mh);
    sg.addColorStop(0, 'rgba(139,92,246,0.05)');
    sg.addColorStop(1, 'rgba(139,92,246,0.10)');
    ctx.fillStyle = sg;
    ctx.fillRect(mx, my, mw, mh);
    // monitor stand
    ctx.strokeStyle = 'rgba(167,139,250,0.10)';
    ctx.beginPath();
    ctx.moveTo(W / 2, my + mh);
    ctx.lineTo(W / 2, my + mh + 26);
    ctx.moveTo(W / 2 - 40, my + mh + 26);
    ctx.lineTo(W / 2 + 40, my + mh + 26);
    ctx.stroke();
    // tiny live chart on screen
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(167,139,250,0.35)';
    ctx.shadowColor = '#8B5CF6';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const f = i / 40;
      const x = mx + mw * 0.08 + f * mw * 0.84;
      const y =
        my + mh * 0.72 - f * mh * 0.34 - Math.sin(f * 7 + t * 0.8) * mh * 0.05;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // dust motes
    ctx.globalCompositeOperation = 'lighter';
    for (const m of motes) {
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      if (m.x < -5) m.x = W + 5;
      if (m.y < -5) m.y = H + 5;
      const tw = 0.35 + Math.sin(t * 1.4 + m.phase) * 0.25;
      const mg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 3);
      mg.addColorStop(0, `rgba(196,181,253,${tw})`);
      mg.addColorStop(1, 'rgba(196,181,253,0)');
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * 3, 0, TAU);
      ctx.fill();
    }

    // vignette
    ctx.globalCompositeOperation = 'source-over';
    g = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.95);
    g.addColorStop(0, 'rgba(5,5,8,0)');
    g.addColorStop(1, 'rgba(5,5,8,0.8)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    raf = requestAnimationFrame(frame);
  }

  const onResize = () => layout();
  layout();
  window.addEventListener('resize', onResize);
  raf = requestAnimationFrame(frame);

  return {
    setVisible(v: boolean) {
      visible = v;
      last = performance.now();
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    },
  };
}
