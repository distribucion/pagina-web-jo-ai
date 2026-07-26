import { FormEvent, useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReduced } from '../lib/motion';
import { createStudioEngine } from '../lib/studioEngine';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [besoin, setBesoin] = useState('');

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
        '.contact__inner',
        { opacity: 0, y: 60, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 40%',
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

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Projet IRIS — ${entreprise || nom}`);
    const body = encodeURIComponent(
      `Nom : ${nom}\nEmail : ${email}\nEntreprise : ${entreprise}\n\nBesoin :\n${besoin}`
    );
    window.location.href = `mailto:info@jo-productions.ch?subject=${subject}&body=${body}`;
  };

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <canvas ref={canvasRef} className="contact__canvas" aria-hidden="true" />
      <div className="contact__inner container">
        <div className="contact__intro">
          <p className="eyebrow">PRÊT À PASSER À L'ACTION ?</p>
          <h2 className="contact__title">
            Parlons de <span className="accent">ton projet.</span>
          </h2>
          <p className="contact__sub">
            On ne fait pas de devis au hasard. On écoute, on analyse, et on
            propose une stratégie sur-mesure.
          </p>
          <p className="contact__free mono">PREMIER APPEL : GRATUIT, SANS ENGAGEMENT</p>

          <div className="contact__coords">
            <div className="contact__coord">
              <span className="mono">EMAIL</span>
              <a href="mailto:info@jo-productions.ch">info@jo-productions.ch</a>
            </div>
            <div className="contact__coord">
              <span className="mono">BUREAUX</span>
              <p>Fribourg — Lausanne · Suisse romande</p>
            </div>
            <div className="contact__coord">
              <span className="mono">INSTAGRAM</span>
              <a href="https://www.instagram.com/jo.productions.pro" target="_blank" rel="noreferrer">
                @jo.productions.pro
              </a>
            </div>
          </div>
        </div>

        <form className="contact__form" onSubmit={onSubmit}>
          <label className="contact__field">
            <span className="mono">TON NOM</span>
            <input
              type="text"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Jean Dupont"
            />
          </label>
          <label className="contact__field">
            <span className="mono">EMAIL</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jean@entreprise.ch"
            />
          </label>
          <label className="contact__field">
            <span className="mono">TON ENTREPRISE</span>
            <input
              type="text"
              value={entreprise}
              onChange={(e) => setEntreprise(e.target.value)}
              placeholder="Nom de ton entreprise"
            />
          </label>
          <label className="contact__field">
            <span className="mono">TON BESOIN</span>
            <textarea
              rows={4}
              value={besoin}
              onChange={(e) => setBesoin(e.target.value)}
              placeholder="Décris ton projet en quelques lignes…"
            />
          </label>
          <button type="submit" className="btn btn--primary btn--block">
            Envoyer
          </button>
        </form>
      </div>
    </section>
  );
}
