import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReduced } from '../lib/motion';

const chf = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");

const METRICS = [
  { final: "14'202+", label: 'leads gérés', sub: 'Captés, suivis et qualifiés par le système IRIS.' },
  { final: '4,8x', label: 'ROI moyen', sub: 'Retour moyen constaté sur les comptes actifs.' },
  { final: '38', label: 'clients actifs', sub: 'Des entreprises de Suisse romande qui grandissent avec IRIS.' },
  { final: '100%', label: 'systèmes actifs 24/7', sub: 'Tes automatisations ne dorment jamais.' },
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
          const a = { v: 0 };
          gsap.to(a, {
            v: 14202,
            duration: 2.2,
            ease: 'power3.out',
            onUpdate: () => els[0] && (els[0].textContent = `${chf(a.v)}+`),
            onComplete: () => els[0] && (els[0].textContent = "14'202+"),
          });
          const b = { v: 0 };
          gsap.to(b, {
            v: 4.8,
            duration: 2,
            ease: 'power3.out',
            onUpdate: () => els[1] && (els[1].textContent = `${b.v.toFixed(1).replace('.', ',')}x`),
            onComplete: () => els[1] && (els[1].textContent = '4,8x'),
          });
          const c = { v: 0 };
          gsap.to(c, {
            v: 38,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate: () => els[2] && (els[2].textContent = `${Math.round(c.v)}`),
          });
          const d = { v: 0 };
          gsap.to(d, {
            v: 100,
            duration: 2,
            ease: 'power3.out',
            onUpdate: () => els[3] && (els[3].textContent = `${Math.round(d.v)}%`),
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="metrics" id="metrics">
      <div className="container">
        <p className="eyebrow reveal">DES CHIFFRES, PAS DES PROMESSES</p>
        <div className="metrics__grid metrics__grid--4">
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
