// SEEDANCE-SWAP: when `public/video/funnel-macro.mp4` exists, this canvas can
// be replaced by an ambient looping <video>. Until then it renders the same
// shot procedurally: a macro glide over holographic lead pipelines where nodes
// light up as they pass the Automated Qualification gate and lock in.

const TAU = Math.PI * 2;

interface Node {
  lane: number;
  x: number; // 0..1 normalized
  speed: number;
  r: number;
  depth: number; // 0.4 (far, dim) .. 1 (near, bright)
  phase: number;
  state: 'flowing' | 'rejected' | 'qualified' | 'locked';
  flash: number; // 1 → 0 after qualification flash
  lockSlot: number;
  lockT: number; // 0..1 travel toward lock slot
  fx: number; // frozen position when leaving the flow
  fy: number;
  alpha: number;
}

export interface FunnelEngine {
  setActive(i: number): void;
  setVisible(v: boolean): void;
  destroy(): void;
}

export function createFunnelEngine(canvas: HTMLCanvasElement): FunnelEngine {
  const ctx = canvas.getContext('2d')!;
  let W = 0;
  let H = 0;
  let dpr = 1;
  let raf = 0;
  let t = 0;
  let last = performance.now();
  let visible = true;
  // Active I.R.I.S. step: 0 Identifier (trails), 1 Rayonner (glow boost),
  // 2 Intéresser (gate intense), 3 Signer (locked leads + values)
  let active = 0;
  let destroyed = false;
  const GATE_X = 0.60;
  const SLOTS = 9;
  const slots: (Node | null)[] = new Array(SLOTS).fill(null);
  let nodes: Node[] = [];

  function laneY(lane: number) {
    return H * (0.3 + lane * 0.14);
  }

  function makeNode(startX = -0.05): Node {
    return {
      lane: Math.floor(Math.random() * 4),
      x: startX - Math.random() * 0.3,
      speed: 0.035 + Math.random() * 0.05,
      r: 3 + Math.random() * 4,
      depth: 0.4 + Math.random() * 0.6,
      phase: Math.random() * TAU,
      state: 'flowing',
      flash: 0,
      lockSlot: -1,
      lockT: 0,
      fx: 0,
      fy: 0,
      alpha: 1,
    };
  }

  function layout() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    W = Math.max(1, Math.floor(rect.width));
    H = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = W < 768 ? 18 : 34;
    nodes = [];
    for (let i = 0; i < count; i++) {
      const n = makeNode(Math.random());
      nodes.push(n);
    }
    ctx.fillStyle = '#0D0D12';
    ctx.fillRect(0, 0, W, H);
  }

  function slotPos(i: number) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const baseX = W * 0.80;
    const baseY = H * 0.36;
    return { x: baseX + col * (W * 0.05), y: baseY + row * (H * 0.09) };
  }

  function glow(x: number, y: number, r: number, rgb: string, a: number) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${rgb},${a})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  function drawGate() {
    const gx = W * GATE_X;
    const gh = H * 0.62;
    const gy = H * 0.5 - gh / 2;
    const intensity = active === 2 ? 1 : 0.55;

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    const g = ctx.createLinearGradient(gx - 34, 0, gx + 34, 0);
    g.addColorStop(0, 'rgba(139,92,246,0)');
    g.addColorStop(0.5, `rgba(139,92,246,${0.10 * intensity})`);
    g.addColorStop(1, 'rgba(139,92,246,0)');
    ctx.fillStyle = g;
    ctx.fillRect(gx - 34, gy, 68, gh);

    ctx.strokeStyle = `rgba(167,139,250,${0.35 * intensity})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(gx - 34, gy, 68, gh);

    // scanning line
    const scanY = gy + ((t * 0.35) % 1) * gh;
    ctx.globalCompositeOperation = 'lighter';
    const sg = ctx.createLinearGradient(gx - 34, scanY - 14, gx - 34, scanY + 14);
    sg.addColorStop(0, 'rgba(167,139,250,0)');
    sg.addColorStop(0.5, `rgba(167,139,250,${0.5 * intensity})`);
    sg.addColorStop(1, 'rgba(167,139,250,0)');
    ctx.fillStyle = sg;
    ctx.fillRect(gx - 34, scanY - 14, 68, 28);

    // vertical label
    ctx.globalCompositeOperation = 'source-over';
    ctx.save();
    ctx.translate(gx + 48, H * 0.5);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = `rgba(138,138,150,${0.6 * intensity})`;
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('QUALIFICATION AUTOMATISÉE', 0, 0);
    ctx.restore();
    ctx.restore();
  }

  function drawLockGrid() {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = 'rgba(167,139,250,0.16)';
    ctx.lineWidth = 1;
    for (let i = 0; i < SLOTS; i++) {
      const s = slotPos(i);
      ctx.beginPath();
      ctx.arc(s.x, s.y, 9, 0, TAU);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(138,138,150,0.6)';
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LEADS VÉRIFIÉS', W * 0.85, H * 0.29);

    // sparkline above the lock grid during the "Signer" step
    if (active === 3) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgba(167,139,250,0.8)';
      ctx.shadowColor = '#8B5CF6';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      const sx = W * 0.78;
      const sw = W * 0.14;
      for (let i = 0; i <= 24; i++) {
        const f = i / 24;
        const y =
          H * 0.72 -
          f * H * 0.05 -
          Math.sin(f * 9 + t * 1.2) * H * 0.008;
        if (i === 0) ctx.moveTo(sx + f * sw, y);
        else ctx.lineTo(sx + f * sw, y);
      }
      ctx.stroke();
    }
    ctx.restore();
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
    ctx.fillStyle = 'rgba(13,13,18,0.32)';
    ctx.fillRect(0, 0, W, H);

    // lane guides
    ctx.strokeStyle = 'rgba(139,92,246,0.05)';
    ctx.lineWidth = 1;
    for (let l = 0; l < 4; l++) {
      const y = laneY(l);
      ctx.beginPath();
      for (let x = 0; x <= W; x += 24) {
        const yy = y + Math.sin(x * 0.006 + l * 2 + t * 0.4) * 8;
        if (x === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }

    drawGate();
    drawLockGrid();

    ctx.globalCompositeOperation = 'lighter';
    const gx = W * GATE_X;

    for (const n of nodes) {
      if (n.state === 'flowing') {
        n.x += n.speed * dt;
        const px = n.x * W;
        const py = laneY(n.lane) + Math.sin(px * 0.006 + n.lane * 2 + t * 0.4) * 8;

        // tracer trails when Precision Tracking is active
        if (active === 0) {
          ctx.strokeStyle = `rgba(139,92,246,${0.20 * n.depth})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px - 34 * n.depth, py);
          ctx.lineTo(px - 6, py);
          ctx.stroke();
        }

        // "Rayonner" boosts every node's radiance
        const boost = active === 1 ? 1.5 : 1;
        glow(px, py, n.r * 3.4 * n.depth * boost, '139,92,246', Math.min(0.85, 0.5 * n.depth * boost));
        ctx.fillStyle = `rgba(196,181,253,${0.85 * n.depth})`;
        ctx.beginPath();
        ctx.arc(px, py, n.r * 0.55 * n.depth * boost, 0, TAU);
        ctx.fill();

        // gate crossing → qualify or reject
        if (px >= gx && px - n.speed * dt * W < gx + 40) {
          const free = slots.findIndex((s) => s === null);
          const qualify = free !== -1 && Math.random() < 0.4;
          if (qualify) {
            n.state = 'qualified';
            n.flash = 1;
            n.lockSlot = free;
            n.lockT = 0;
            n.fx = px;
            n.fy = py;
            slots[free] = n;
          } else {
            n.state = 'rejected';
            n.fx = px;
            n.fy = py;
          }
        }
        if (n.x > 1.15) Object.assign(n, makeNode());
      } else if (n.state === 'rejected') {
        n.alpha -= dt * 1.4;
        n.fy += dt * 30;
        n.fx += dt * 20;
        if (n.alpha <= 0) Object.assign(n, makeNode());
        else glow(n.fx, n.fy, n.r * 2.5, '138,138,150', 0.25 * n.alpha);
      } else if (n.state === 'qualified') {
        n.flash = Math.max(0, n.flash - dt * 2.2);
        n.lockT = Math.min(1, n.lockT + dt * 1.1);
        const s = slotPos(n.lockSlot);
        const e = 1 - Math.pow(1 - n.lockT, 3);
        const px = n.fx + (s.x - n.fx) * e;
        const py = n.fy + (s.y - n.fy) * e;

        // qualification flash ring
        if (n.flash > 0) {
          ctx.strokeStyle = `rgba(244,244,246,${n.flash * 0.9})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(n.fx, n.fy, (1 - n.flash) * 42 + 6, 0, TAU);
          ctx.stroke();
        }
        glow(px, py, 22, '167,139,250', 0.8);
        ctx.fillStyle = 'rgba(244,244,246,0.95)';
        ctx.beginPath();
        ctx.arc(px, py, 3.4, 0, TAU);
        ctx.fill();
        if (n.lockT >= 1) {
          n.state = 'locked';
          n.lockT = 0;
        }
      } else {
        // locked — pulse in place, then release the slot and respawn
        n.lockT += dt;
        const s = slotPos(n.lockSlot);
        const pulse = 0.65 + Math.sin(t * 2.4 + n.phase) * 0.2;
        glow(s.x, s.y, 18, '167,139,250', pulse * 0.7);
        ctx.fillStyle = 'rgba(244,244,246,0.9)';
        ctx.beginPath();
        ctx.arc(s.x, s.y, 3, 0, TAU);
        ctx.fill();
        if (active === 3) {
          ctx.fillStyle = 'rgba(196,181,253,0.75)';
          ctx.font = '500 9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText('+CHF 2,4k', s.x, s.y - 16);
        }
        if (n.lockT > 7) {
          slots[n.lockSlot] = null;
          Object.assign(n, makeNode());
        }
      }
    }

    raf = requestAnimationFrame(frame);
  }

  const onResize = () => layout();
  layout();
  window.addEventListener('resize', onResize);
  raf = requestAnimationFrame(frame);

  return {
    setActive(i: number) {
      active = Math.min(3, Math.max(0, i));
    },
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
