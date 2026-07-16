import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReduced, scrollToSection } from '../lib/motion';
import { createHeroEngine } from '../lib/heroEngine';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current!;
    const canvas = canvasRef.current!;
    const engine = createHeroEngine(canvas);

    if (prefersReduced) {
      engine.setProgress(1);
      return () => engine.destroy();
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=260%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            engine.setProgress(self.progress);
            (window as any).__heroProgress = self.progress;
          },
          onRefresh: (self) => {
            (window as any).__heroST = { start: self.start, end: self.end };
          },
        },
      });

      tl.to('.hero__hint', { opacity: 0, duration: 0.08 }, 0.02)
        .to('.hero__sub', { opacity: 0, y: -30, duration: 0.16 }, 0.06)
        .to(
          '.hero__copy',
          { yPercent: -46, scale: 0.52, ease: 'power1.inOut', duration: 0.42 },
          0.12
        )
        .fromTo(
          '.hero__caption',
          { opacity: 0, y: 34 },
          { opacity: 1, y: 0, duration: 0.18 },
          0.74
        );
    }, section);

    return () => {
      ctx.revert();
      engine.destroy();
    };
  }, []);

  return (
    <section className="hero" id="top" ref={sectionRef}>
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
      <div className="hero__grain" aria-hidden="true" />
      <div className="hero__copy">
        <p className="eyebrow">IRIS GROWTH ENGINE — PAR JOPRODUCTIONS</p>
        <h1 className="hero__title">
          Une croissance
          <br />
          client prévisible.
        </h1>
        <p className="hero__sub">
          IRIS transforme vos dépenses publicitaires brutes en pipeline qualifié —
          suivi à la source, évalué automatiquement et visualisé en chiffre
          d'affaires, en temps réel.
        </p>
        <div className="hero__cta">
          <button className="btn btn--primary" onClick={() => scrollToSection('#access')}>
            Demander l'accès
          </button>
          <button className="btn btn--ghost" onClick={() => scrollToSection('#features')}>
            Découvrir le moteur
          </button>
        </div>
      </div>
      <p className="hero__caption mono">TRAFIC BRUT EN ENTRÉE · CLIENTS QUALIFIÉS EN SORTIE</p>
      <div className="hero__hint" aria-hidden="true">
        <span>Faites défiler pour assembler</span>
        <span className="hero__hint-line" />
      </div>
    </section>
  );
}
