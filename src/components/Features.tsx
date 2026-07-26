import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReduced } from '../lib/motion';
import { createFunnelEngine } from '../lib/funnelEngine';

const STEPS = [
  {
    letter: 'I',
    n: '01',
    title: 'Identifier',
    body: 'On définit ton client idéal et on va le chercher exactement là où il se trouve.',
    chips: ['Ciblage', 'Données', 'Profil client'],
  },
  {
    letter: 'R',
    n: '02',
    title: 'Rayonner',
    body: 'On capte son attention avec du contenu et des publicités qui sortent du lot.',
    chips: ['Contenu', 'Publicité', 'Création'],
  },
  {
    letter: 'I',
    n: '03',
    title: 'Intéresser',
    body: "On l'engage et on le qualifie automatiquement, jour et nuit, sans rien laisser filer.",
    chips: ['Automatisations', 'Séquences', 'IA'],
  },
  {
    letter: 'S',
    n: '04',
    title: 'Signer',
    body: "On convertit, on mesure, on optimise — jusqu'au client signé.",
    chips: ['Conversion', 'Reporting', 'Suivi'],
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
          end: '+=300%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(3, Math.floor(self.progress * 4));
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
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.1, ease: 'power2.out' },
          i === 0 ? 0.001 : i / 4
        );
        if (i < 3) {
          tl.to(
            block,
            { autoAlpha: 0, y: -70, filter: 'blur(10px)', duration: 0.08, ease: 'power2.in' },
            (i + 1) / 4 - 0.08
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
    <section className="features" id="methode" ref={sectionRef}>
      <canvas ref={canvasRef} className="features__canvas" aria-hidden="true" />
      <div className="features__scrim" aria-hidden="true" />
      <div className="features__inner">
        <div className="features__head">
          <p className="eyebrow">LA MÉTHODE</p>
          <p className="features__head-title">
            I.R.I.S. <span>— ton marché, mis au point.</span>
          </p>
        </div>
        <div className="features__blocks">
          {STEPS.map((f) => (
            <article className="feature-block" key={f.n}>
              <span className="feature-block__letter" aria-hidden="true">
                {f.letter}
              </span>
              <p className="feature-block__index mono">
                {f.n} <span>/ 04</span>
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
          {STEPS.map((f, i) => (
            <span key={f.n} className={`features__dot ${i === active ? 'is-active' : ''}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
