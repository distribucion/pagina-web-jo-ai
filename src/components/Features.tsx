import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReduced } from '../lib/motion';
import { createFunnelEngine } from '../lib/funnelEngine';

const FEATURES = [
  {
    n: '01',
    title: 'Precision Tracking',
    body: 'Every click, call, and conversion is captured at the source. IRIS stitches your ad platforms, landing pages, and CRM into a single attributed timeline — so you know exactly which dollar produced which client.',
    chips: ['Pixel + server-side', 'Multi-touch attribution', 'Zero sampling'],
  },
  {
    n: '02',
    title: 'Automated Qualification',
    body: 'Not every lead deserves your team’s time. IRIS scores and filters incoming leads against your ideal-client profile in real time — only verified, high-intent prospects ever reach your pipeline.',
    chips: ['Intent scoring', 'Instant routing', 'CRM-ready'],
  },
  {
    n: '03',
    title: 'Real-Time ROI',
    body: 'Watch spend become revenue as it happens. Live dashboards translate campaign performance into the only metric that matters: predictable, compounding client growth.',
    chips: ['Live dashboards', 'Cohort LTV', 'Forecasting'],
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useLayoutEffect(() => {
    const section = sectionRef.current!;
    const engine = createFunnelEngine(canvasRef.current!);

    if (prefersReduced) {
      return () => engine.destroy();
    }

    const ctx = gsap.context(() => {
      const blocks = gsap.utils.toArray<HTMLElement>('.feature-block');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=250%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(2, Math.floor(self.progress * 3));
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              engine.setActive(idx);
              setActive(idx);
            }
            (window as any).__featureIdx = idx;
          },
          onToggle: (self) => engine.setVisible(self.isActive),
          onRefresh: (self) => {
            (window as any).__featuresST = { start: self.start, end: self.end };
          },
        },
      });

      blocks.forEach((block, i) => {
        tl.fromTo(
          block,
          { autoAlpha: 0, y: 70, filter: 'blur(10px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.13, ease: 'power2.out' },
          i === 0 ? 0.001 : i / 3
        );
        if (i < 2) {
          tl.to(
            block,
            { autoAlpha: 0, y: -70, filter: 'blur(10px)', duration: 0.1, ease: 'power2.in' },
            (i + 1) / 3 - 0.1
          );
        }
      });
    }, section);

    return () => {
      ctx.revert();
      engine.destroy();
    };
  }, []);

  return (
    <section className="features" id="features" ref={sectionRef}>
      <canvas ref={canvasRef} className="features__canvas" aria-hidden="true" />
      <div className="features__scrim" aria-hidden="true" />
      <div className="features__inner">
        <div className="features__blocks">
          {FEATURES.map((f, i) => (
            <article className="feature-block" key={f.n}>
              <p className="feature-block__index mono">
                {f.n} <span>/ 03</span>
              </p>
              <h3 className="feature-block__title">{f.title}</h3>
              <p className="feature-block__body">{f.body}</p>
              <div className="feature-block__chips">
                {f.chips.map((c) => (
                  <span className="chip" key={c}>
                    {c}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="features__dots" aria-hidden="true">
          {FEATURES.map((f, i) => (
            <span key={f.n} className={`features__dot ${i === active ? 'is-active' : ''}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
