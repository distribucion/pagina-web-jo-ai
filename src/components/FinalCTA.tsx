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
        <p className="eyebrow">THE STUDIO STAYS CALM</p>
        <h2 className="cta__title">
          Growth, <span className="accent">automated.</span>
        </h2>
        <p className="cta__sub">
          Your acquisition engine runs while you create. Request access and watch
          your first qualified pipeline assemble itself this week.
        </p>
        <button className="btn btn--primary btn--lg" onClick={() => scrollToSection('#access')}>
          Request Access
        </button>
        <p className="cta__note mono">LIMITED ONBOARDING SLOTS · RESPONSE WITHIN 24H</p>
      </div>
    </section>
  );
}
