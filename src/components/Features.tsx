import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReduced } from '../lib/motion';
import { createFunnelEngine } from '../lib/funnelEngine';

const FEATURES = [
  {
    n: '01',
    title: 'Suivi de précision',
    body: 'Chaque clic, appel et conversion est capté à la source. IRIS relie vos plateformes publicitaires, vos pages d’atterrissage et votre CRM en une seule chronologie attribuée — vous savez exactement quel franc a produit quel client.',
    chips: ['Pixel + côté serveur', 'Attribution multi-touch', 'Zéro échantillonnage'],
  },
  {
    n: '02',
    title: 'Qualification automatisée',
    body: 'Tous les leads ne méritent pas le temps de votre équipe. IRIS évalue et filtre les leads entrants selon votre profil de client idéal, en temps réel — seuls les prospects vérifiés, à forte intention, atteignent votre pipeline.',
    chips: ['Scoring d’intention', 'Routage instantané', 'Prêt pour le CRM'],
  },
  {
    n: '03',
    title: 'ROI en temps réel',
    body: 'Regardez vos dépenses devenir du chiffre d’affaires en direct. Des tableaux de bord en temps réel traduisent la performance de vos campagnes dans la seule métrique qui compte : une croissance client prévisible et cumulative.',
    chips: ['Tableaux de bord live', 'LTV par cohorte', 'Prévisions'],
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
