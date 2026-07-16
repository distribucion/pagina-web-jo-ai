import { scrollToSection } from '../lib/motion';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="nav__iris" aria-hidden="true" />
          <span>
            IRIS Growth Engine <span className="footer__by">— un système JoProductions</span>
          </span>
        </div>
        <nav className="footer__links">
          {[
            ['Plateforme', '#features'],
            ['Métriques', '#metrics'],
            ['Accès', '#access'],
            ['FAQ', '#faq'],
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
        <p className="footer__copy mono">© 2026 JOPRODUCTIONS</p>
      </div>
    </footer>
  );
}
