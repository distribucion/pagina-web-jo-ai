// SEEDANCE-SWAP: when the Higgsfield clip `public/video/hero-assembly.mp4`
// exists, this engine can be replaced by a scroll-scrubbed <video>. Until then
// it procedurally renders the same shot: chaotic ad-traffic light streams that
// converge and assemble into a glassmorphism dashboard with a rising ROI graph.

interface Particle {
  hx: number; // home x (normalized 0..1 of dashboard space)
  hy: number;
  lane: number; // chaos stream lane y (normalized)
  dir: number; // 1 flows right, -1 flows left
  speed: number;
  phase: number;
  amp: number;
  freq: number;
  offset: number; // start offset along the stream
  stagger: number; // 0..0.4 — when this particle starts converging
  size: number;
  bright: number; // 0..1 color brightness
}

export interface HeroEngine {
  setProgress(p: number): void;
  destroy(): void;
}

const TAU = Math.PI * 2;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

interface Panel {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function createHeroEngine(canvas: HTMLCanvasElement): HeroEngine {
  const ctx = canvas.getContext('2d')!;
  let W = 0;
  let H = 0;
  let dpr = 1;
  let raf = 0;
  let target = 0; // progress requested by ScrollTrigger
  let p = 0; // smoothed progress
  let t = 0; // time in seconds
  let last = performance.now();
  let particles: Particle[] = [];
  let panels: Panel[] = [];
  let chart: Panel = { x: 0, y: 0, w: 0, h: 0 };
  let chartPts: { x: number; y: number }[] = [];
  let barsPanel: Panel = { x: 0, y: 0, w: 0, h: 0 };
  let destroyed = false;

  // ---- dashboard geometry -------------------------------------------------

  function layout() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    W = Math.max(1, Math.floor(rect.width));
    H = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const dashW = Math.min(W * 0.74, 1040);
    const dashH = Math.min(dashW * 0.52, H * 0.62);
    const cx = W / 2;
    const cy = H * 0.58;
    const left = cx - dashW / 2;
    const top = cy - dashH / 2;
    const gap = dashW * 0.02;

    panels = [];
    // top KPI row — 3 cards
    const kpiH = dashH * 0.2;
    const kpiW = (dashW - gap * 2) / 3;
    for (let i = 0; i < 3; i++) {
      panels.push({ x: left + i * (kpiW + gap), y: top, w: kpiW, h: kpiH });
    }
    // main chart card + side bars card
    const bodyY = top + kpiH + gap;
    const bodyH = dashH - kpiH - gap;
    chart = { x: left, y: bodyY, w: dashW * 0.66, h: bodyH };
    barsPanel = {
      x: left + dashW * 0.66 + gap,
      y: bodyY,
      w: dashW - dashW * 0.66 - gap,
      h: bodyH,
    };
    panels.push(chart, barsPanel);

    // rising ROI polyline inside the chart card
    const pad = Math.min(chart.w, chart.h) * 0.14;
    const n = 9;
    chartPts = [];
    const seedRise = [0.18, 0.26, 0.22, 0.38, 0.45, 0.42, 0.6, 0.74, 0.94];
    for (let i = 0; i < n; i++) {
      chartPts.push({
        x: chart.x + pad + ((chart.w - pad * 2) * i) / (n - 1),
        y: chart.y + chart.h - pad - (chart.h - pad * 2) * seedRise[i],
      });
    }

    buildParticles();
  }

  // ---- particles ----------------------------------------------------------

  function sampleRectPerimeter(r: Panel, count: number, out: { x: number; y: number }[]) {
    const per = 2 * (r.w + r.h);
    for (let i = 0; i < count; i++) {
      let d = (per * i) / count;
      let x: number, y: number;
      if (d < r.w) {
        x = r.x + d;
        y = r.y;
      } else if (d < r.w + r.h) {
        x = r.x + r.w;
        y = r.y + (d - r.w);
      } else if (d < 2 * r.w + r.h) {
        x = r.x + r.w - (d - r.w - r.h);
        y = r.y + r.h;
      } else {
        x = r.x;
        y = r.y + r.h - (d - 2 * r.w - r.h);
      }
      out.push({ x, y });
    }
  }

  function buildParticles() {
    const targets: { x: number; y: number; bright: number }[] = [];

    // panel outlines
    for (const panel of panels) {
      const pts: { x: number; y: number }[] = [];
      const count = Math.floor((panel.w + panel.h) / 7);
      sampleRectPerimeter(panel, count, pts);
      for (const pt of pts) targets.push({ ...pt, bright: 0.45 });
    }
    // chart polyline — dense + bright
    for (let i = 0; i < chartPts.length - 1; i++) {
      const a = chartPts[i];
      const b = chartPts[i + 1];
      const seg = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 5);
      for (let j = 0; j < seg; j++) {
        const f = j / seg;
        targets.push({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, bright: 1 });
      }
    }
    // bars inside side panel
    const bp = barsPanel;
    const bpad = Math.min(bp.w, bp.h) * 0.16;
    const rows = 4;
    for (let r = 0; r < rows; r++) {
      const y = bp.y + bpad + ((bp.h - bpad * 2) * r) / (rows - 1);
      const len = (bp.w - bpad * 2) * (0.9 - r * 0.18);
      const cnt = Math.floor(len / 6);
      for (let j = 0; j < cnt; j++) {
        targets.push({ x: bp.x + bpad + (len * j) / cnt, y, bright: 0.7 });
      }
    }
    // KPI "text" dashes
    for (let i = 0; i < 3; i++) {
      const k = panels[i];
      const cnt = Math.floor(k.w / 14);
      for (let j = 0; j < cnt; j++) {
        targets.push({
          x: k.x + k.w * 0.12 + (k.w * 0.5 * j) / cnt,
          y: k.y + k.h * 0.62,
          bright: 0.55,
        });
      }
    }

    // area-scaled cap
    const cap = Math.floor(Math.min(1700, Math.max(500, (W * H) / 900)));
    while (targets.length > cap) targets.splice(Math.floor(Math.random() * targets.length), 1);

    particles = targets.map((tg) => ({
      hx: tg.x,
      hy: tg.y,
      lane: 0.18 + Math.random() * 0.64,
      dir: Math.random() > 0.5 ? 1 : -1,
      speed: 0.05 + Math.random() * 0.12,
      phase: Math.random() * TAU,
      amp: 12 + Math.random() * 46,
      freq: 0.4 + Math.random() * 1.1,
      offset: Math.random(),
      stagger: Math.random() * 0.38,
      size: 0.8 + Math.random() * 1.7,
      bright: tg.bright * (0.75 + Math.random() * 0.25),
    }));
  }

  // ---- drawing ------------------------------------------------------------

  function roundRect(x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawDashboardUI(uiAlpha: number) {
    if (uiAlpha <= 0.01) return;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

    for (const panel of panels) {
      ctx.globalAlpha = uiAlpha;
      const g = ctx.createLinearGradient(panel.x, panel.y, panel.x + panel.w, panel.y + panel.h);
      g.addColorStop(0, 'rgba(139,92,246,0.10)');
      g.addColorStop(1, 'rgba(255,255,255,0.025)');
      ctx.fillStyle = g;
      roundRect(panel.x, panel.y, panel.w, panel.h, 14);
      ctx.fill();
      ctx.strokeStyle = `rgba(167,139,250,${0.30 * uiAlpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // KPI labels
    ctx.globalAlpha = uiAlpha;
    const kpis = [
      ['DÉPENSES PUB', 'CHF 48,2k'],
      ['LEADS QUALIFIÉS', '312'],
      ['ROI', '3,2x'],
    ];
    for (let i = 0; i < 3; i++) {
      const k = panels[i];
      ctx.fillStyle = `rgba(138,138,150,${0.9 * uiAlpha})`;
      ctx.font = `500 ${Math.max(8, k.h * 0.16)}px "JetBrains Mono", monospace`;
      ctx.fillText(kpis[i][0], k.x + k.w * 0.1, k.y + k.h * 0.34);
      ctx.fillStyle = `rgba(244,244,246,${uiAlpha})`;
      ctx.font = `600 ${Math.max(12, k.h * 0.3)}px "Space Grotesk", sans-serif`;
      ctx.fillText(kpis[i][1], k.x + k.w * 0.1, k.y + k.h * 0.74);
    }

    // ROI polyline with glow, revealed progressively
    const reveal = smoothstep(0.55, 0.97, p);
    if (reveal > 0.02) {
      const totalSegs = chartPts.length - 1;
      const shown = reveal * totalSegs;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(1, uiAlpha * 1.2);
      ctx.shadowColor = '#8B5CF6';
      ctx.shadowBlur = 16;
      ctx.strokeStyle = '#A78BFA';
      ctx.lineWidth = 2.2;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(chartPts[0].x, chartPts[0].y);
      let end = chartPts[0];
      for (let i = 1; i < chartPts.length; i++) {
        const f = Math.min(1, shown - (i - 1));
        if (f <= 0) break;
        const a = chartPts[i - 1];
        const b = chartPts[i];
        end = { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
        ctx.lineTo(end.x, end.y);
      }
      ctx.stroke();

      // pulsing endpoint
      const pulse = 3.2 + Math.sin(t * 3.2) * 1.4;
      ctx.fillStyle = '#F4F4F6';
      ctx.beginPath();
      ctx.arc(end.x, end.y, pulse, 0, TAU);
      ctx.fill();
      ctx.restore();

      // area fill under revealed line
      ctx.save();
      ctx.globalAlpha = 0.14 * uiAlpha * reveal;
      const ag = ctx.createLinearGradient(0, chart.y, 0, chart.y + chart.h);
      ag.addColorStop(0, '#8B5CF6');
      ag.addColorStop(1, 'rgba(139,92,246,0)');
      ctx.fillStyle = ag;
      ctx.beginPath();
      ctx.moveTo(chartPts[0].x, chart.y + chart.h * 0.86);
      for (let i = 0; i < chartPts.length; i++) {
        const f = shown - (i - 1);
        if (i > 0 && f <= 0) break;
        ctx.lineTo(chartPts[i].x, chartPts[i].y);
      }
      ctx.lineTo(end.x, chart.y + chart.h * 0.86);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function frame(now: number) {
    if (destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;
    p += (target - p) * Math.min(1, dt * 7);

    // trail fade — leaves motion blur on the streams
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(5,5,8,0.30)';
    ctx.fillRect(0, 0, W, H);

    const uiAlpha = smoothstep(0.55, 0.92, p);

    ctx.globalCompositeOperation = 'lighter';
    for (const pt of particles) {
      const local = easeInOut(smoothstep(pt.stagger, Math.min(1, pt.stagger + 0.55), p));

      // chaotic stream position
      const travel = (pt.offset + t * pt.speed * pt.dir) % 1.3;
      const sx = (travel < 0 ? travel + 1.3 : travel) * (W * 1.3) - W * 0.15;
      const sy =
        pt.lane * H +
        Math.sin(t * pt.freq + pt.phase) * pt.amp +
        Math.sin(sx * 0.004 + pt.phase) * 30;

      // converge toward home
      const jitter = (1 - local) * 2;
      const x = sx + (pt.hx - sx) * local + Math.sin(t * 2 + pt.phase) * jitter;
      const y = sy + (pt.hy - sy) * local + Math.cos(t * 2.3 + pt.phase) * jitter;

      const settle = 1 - uiAlpha * 0.55; // particles dim as UI takes over
      const alpha = (0.25 + pt.bright * 0.55) * settle;
      const size = pt.size * (1 + (1 - local) * 0.7);

      const g = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      const hue = pt.bright > 0.85 ? '196,181,253' : '139,92,246';
      g.addColorStop(0, `rgba(${hue},${alpha})`);
      g.addColorStop(1, `rgba(${hue},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, TAU);
      ctx.fill();
    }

    drawDashboardUI(uiAlpha);

    raf = requestAnimationFrame(frame);
  }

  // ---- lifecycle ----------------------------------------------------------

  const onResize = () => layout();
  layout();
  window.addEventListener('resize', onResize);
  // opaque base
  ctx.fillStyle = '#050508';
  ctx.fillRect(0, 0, W, H);
  raf = requestAnimationFrame(frame);

  return {
    setProgress(v: number) {
      target = Math.min(1, Math.max(0, v));
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    },
  };
}
