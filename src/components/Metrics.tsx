import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReduced } from '../lib/motion';

const METRICS = [
  { final: '100%', label: 'of ad spend tracked', sub: 'Every dollar attributed to its outcome — no dark spend.' },
  { final: '24/7', label: 'lead qualification', sub: 'The engine scores and routes leads while you sleep.' },
  { final: '3x', label: 'average ROI', sub: 'Median return across active IRIS accounts.' },
];

export default function Metrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current!;
    const els = valueRefs.current;

    if (prefersReduced) {
      els.forEach((el, i) => el && (el.textContent = METRICS[i].final));
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 72%',
        once: true,
        onEnter: () => {
          // 100%
          const a = { v: 0 };
          gsap.to(a, {
            v: 100,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate: () => els[0] && (els[0].textContent = `${Math.round(a.v)}%`),
          });
          // 24/7
          const b = { x: 0, y: 0 };
          gsap.to(b, {
            x: 24,
            y: 7,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate: () =>
              els[1] && (els[1].textContent = `${Math.round(b.x)}/${Math.round(b.y)}`),
          });
          // 3x
          const c = { v: 0 };
          gsap.to(c, {
            v: 3,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate: () => els[2] && (els[2].textContent = `${c.v.toFixed(1)}x`),
            onComplete: () => els[2] && (els[2].textContent = '3x'),
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="metrics" id="metrics">
      <div className="container">
        <p className="eyebrow reveal">THE ENGINE, MEASURED</p>
        <div className="metrics__grid">
          {METRICS.map((m, i) => (
            <div className="metric reveal" key={m.label}>
              <span
                className="metric__value"
                ref={(el) => {
                  valueRefs.current[i] = el;
                }}
              >
                0
              </span>
              <span className="metric__label">{m.label}</span>
              <span className="metric__sub">{m.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
