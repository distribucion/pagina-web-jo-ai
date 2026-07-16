import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReduced, scrollToSection } from '../lib/motion';
import { createStudioEngine } from '../lib/studioEngine';

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current!;
    const engine = createStudioEngine(canvasRef.current!);

    if (prefersReduced) return () => engine.destroy();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => engine.setVisible(self.isActive),
      });
      gsap.fromTo(
        '.cta__content',
        { opacity: 0, y: 60, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 35%',
            scrub: 0.8,
          },
        }
      );
    }, section);

    return () => {
      ctx.revert();
      engine.destroy();
    };
  }, []);

  return (
    <section className="cta" id="cta" ref={sectionRef}>
      <canvas ref={canvasRef} className="cta__canvas" aria-hidden="true" />
      <div className="cta__content">
        <p className="eyebrow">LE STUDIO RESTE SEREIN</p>
        <h2 className="cta__title">
          La croissance, <span className="accent">automatisée.</span>
        </h2>
        <p className="cta__sub">
          Votre moteur d'acquisition tourne pendant que vous créez. Demandez
          l'accès et regardez votre premier pipeline qualifié s'assembler cette
          semaine.
        </p>
        <button className="btn btn--primary btn--lg" onClick={() => scrollToSection('#access')}>
          Demander l'accès
        </button>
        <p className="cta__note mono">PLACES D'ONBOARDING LIMITÉES · RÉPONSE SOUS 24 H</p>
      </div>
    </section>
  );
}
