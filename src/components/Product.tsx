import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReduced } from '../lib/motion';

const CHART_POINTS = '0,86 40,78 80,82 120,64 160,55 200,60 240,38 280,26 320,8';

export default function Product() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReduced) return;
    const section = sectionRef.current!;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.browser-frame',
        { rotateX: 12, y: 90, opacity: 0.3 },
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 0.8,
          },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section className="product" ref={sectionRef}>
      <div className="container">
        <p className="eyebrow reveal">INSIDE THE COCKPIT</p>
        <h2 className="section-title reveal">
          One screen. <span className="accent">Total control.</span>
        </h2>
        <p className="section-sub reveal">
          The IRIS dashboard — every campaign, every lead, every dollar, live.
        </p>

        <div className="product__stage">
          <div className="browser-frame">
            <div className="browser-frame__bar">
              <span className="dot dot--r" />
              <span className="dot dot--y" />
              <span className="dot dot--g" />
              <span className="browser-frame__url mono">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
                  <rect x="1" y="5" width="8" height="6" rx="1.5" stroke="#8A8A96" />
                  <path d="M3 5V3.5A2 2 0 0 1 7 3.5V5" stroke="#8A8A96" />
                </svg>
                app.irisgrowth.io
              </span>
            </div>
            <div className="dash">
              <aside className="dash__side">
                <span className="dash__logo" />
                <span className="dash__nav is-active" />
                <span className="dash__nav" />
                <span className="dash__nav" />
                <span className="dash__nav" />
                <span className="dash__nav" />
              </aside>
              <div className="dash__main">
                <div className="dash__head">
                  <span className="dash__title">Acquisition Overview</span>
                  <span className="dash__range mono">LAST 30 DAYS</span>
                </div>
                <div className="dash__kpis">
                  {[
                    ['Ad Spend', '$48,210', '+12%'],
                    ['Qualified Leads', '312', '+38%'],
                    ['Cost / Client', '$154', '−21%'],
                    ['ROI', '3.2x', '+0.4x'],
                  ].map(([label, value, delta]) => (
                    <div className="dash__kpi" key={label}>
                      <span className="dash__kpi-label mono">{label}</span>
                      <span className="dash__kpi-value">{value}</span>
                      <span className={`dash__kpi-delta ${delta.startsWith('−') ? 'is-down' : ''}`}>
                        {delta}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="dash__chart">
                  <svg viewBox="0 0 320 100" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polygon points={`0,100 ${CHART_POINTS} 320,100`} fill="url(#areaFill)" />
                    <polyline
                      points={CHART_POINTS}
                      fill="none"
                      stroke="#A78BFA"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <circle cx="320" cy="8" r="3.5" fill="#F4F4F6" />
                  </svg>
                  <span className="dash__chart-label mono">REVENUE ATTRIBUTED TO ADS</span>
                </div>
                <div className="dash__bottom">
                  <div className="dash__channels">
                    {[
                      ['Meta', 64],
                      ['Google', 24],
                      ['TikTok', 12],
                    ].map(([name, pct]) => (
                      <div className="dash__channel" key={name as string}>
                        <span className="mono">{name}</span>
                        <span className="dash__bar">
                          <span style={{ width: `${pct}%` }} />
                        </span>
                        <span className="mono">{pct}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="dash__leads">
                    {[
                      ['M. Herrera', 'Meta · Form', 94],
                      ['K. Osei', 'Google · Call', 91],
                      ['L. Fontaine', 'Meta · WhatsApp', 88],
                    ].map(([name, src, score]) => (
                      <div className="dash__lead" key={name as string}>
                        <span>{name}</span>
                        <span className="mono dash__lead-src">{src}</span>
                        <span className="badge">{score} · Qualified</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
