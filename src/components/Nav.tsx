import { useEffect, useState } from 'react';
import { scrollToSection } from '../lib/motion';

const LINKS = [
  { label: 'Plateforme', target: '#features' },
  { label: 'Métriques', target: '#metrics' },
  { label: 'Accès', target: '#access' },
  { label: 'FAQ', target: '#faq' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <a
        className="nav__logo"
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection('#top');
        }}
      >
        <span className="nav__iris" aria-hidden="true" />
        IRIS
        <span className="nav__by">par JoProductions</span>
      </a>
      <nav className="nav__links">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.target}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(l.target);
            }}
          >
            {l.label}
          </a>
        ))}
      </nav>
      <button className="btn btn--primary btn--sm" onClick={() => scrollToSection('#access')}>
        Demander l'accès
      </button>
    </header>
  );
}
