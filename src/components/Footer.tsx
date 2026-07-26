import { scrollToSection } from '../lib/motion';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="nav__iris" aria-hidden="true" />
          <span>
            IRIS Growth Engine <span className="footer__by">— un système jo.productions</span>
          </span>
        </div>
        <nav className="footer__links">
          {[
            ['Méthode', '#methode'],
            ['Simulateur', '#simulateur'],
            ["L'app", '#app'],
            ['FAQ', '#faq'],
            ['Contact', '#contact'],
          ].map(([label, target]) => (
            <a
              key={label}
              href={target}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(target);
              }}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="footer__contact">
          <a href="mailto:info@jo-productions.ch">info@jo-productions.ch</a>
          <a href="https://www.instagram.com/jo.productions.pro" target="_blank" rel="noreferrer">
            @jo.productions.pro
          </a>
        </div>
        <p className="footer__copy mono">
          © 2026 JO.PRODUCTIONS · FRIBOURG — LAUSANNE · SUISSE ROMANDE
        </p>
      </div>
    </footer>
  );
}
