import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReduced } from '../lib/motion';

const BRANDS = ['Apple', 'Nike', 'Amazon', 'Coca-Cola', 'Samsung', "L'Oréal", "McDonald's", 'Meta'];

export default function AdsCompare() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReduced) {
      // static final state
      gsap.set('.ads__bar-fill--organic', { width: '2.5%' });
      gsap.set('.ads__bar-fill--iris', { width: '85%' });
      return;
    }
    const section = sectionRef.current!;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ads__bar-fill--organic',
        { width: '0%' },
        {
          width: '2.5%',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.ads__bars', start: 'top 75%', once: true },
        }
      );
      gsap.fromTo(
        '.ads__bar-fill--iris',
        { width: '0%' },
        {
          width: '85%',
          duration: 1.8,
          ease: 'power3.out',
          delay: 0.25,
          scrollTrigger: { trigger: '.ads__bars', start: 'top 75%', once: true },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section className="ads" ref={sectionRef}>
      <div className="container">
        <p className="eyebrow reveal">PUBLICITÉ PAYANTE</p>
        <h2 className="section-title reveal">
          Les marques les plus rentables du monde ne{' '}
          <span className="accent">«&nbsp;espèrent&nbsp;»</span> pas être vues.
        </h2>
        <p className="section-sub reveal">
          Elles achètent la visibilité. Facebook Ads, Instagram Ads, Google Ads —
          ce sont les mêmes mécanismes qu'utilisent les plus grandes marques.
          Nous les optimisons pour ton échelle, avec la précision du système IRIS.
        </p>

        <div className="ads__brands reveal" aria-hidden="true">
          {BRANDS.map((b) => (
            <span className="ads__brand" key={b}>
              {b}
            </span>
          ))}
        </div>

        <div className="ads__bars">
          <div className="ads__bar-block reveal">
            <div className="ads__bar-head">
              <span className="mono">PORTÉE ORGANIQUE</span>
              <span className="ads__bar-pct mono">~2-5%</span>
            </div>
            <div className="ads__bar">
              <span className="ads__bar-fill ads__bar-fill--organic" />
            </div>
            <p className="ads__bar-note">
              ~2-5% de ton audience voit ton contenu. Tu publies dans le vide.
            </p>
          </div>

          <div className="ads__bar-block reveal">
            <div className="ads__bar-head">
              <span className="mono ads__bar-head--iris">IRIS POWERED ADS</span>
              <span className="ads__bar-pct ads__bar-pct--iris mono">85%</span>
            </div>
            <div className="ads__bar">
              <span className="ads__bar-fill ads__bar-fill--iris" />
            </div>
            <p className="ads__bar-note">
              Tu touches exactement les personnes qui ont besoin de toi. Chaque
              franc est traqué.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
