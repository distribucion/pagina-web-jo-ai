import { scrollToSection } from '../lib/motion';

const TIERS = [
  {
    name: 'Launch',
    price: 'CHF 490',
    period: '/mois',
    desc: 'Pour les équipes mono-canal qui prennent l’attribution au sérieux.',
    items: [
      "Jusqu'à CHF 10'000/mois de dépenses pub",
      'Suivi de précision (pixel + côté serveur)',
      'Digest ROI hebdomadaire',
      'Support par e-mail',
    ],
    featured: false,
    cta: "Demander l'accès",
  },
  {
    name: 'Scale',
    price: 'CHF 990',
    period: '/mois',
    desc: 'Le moteur complet — qualification, routage et ROI en direct.',
    items: [
      "Jusqu'à CHF 50'000/mois de dépenses pub",
      'Tout ce que comprend Launch',
      'Qualification automatisée des leads',
      'Tableaux de bord ROI en temps réel',
      'Ingénieur croissance dédié',
    ],
    featured: true,
    cta: "Demander l'accès",
  },
  {
    name: 'Enterprise',
    price: 'Sur mesure',
    period: '',
    desc: 'Opérations multi-marques avec modèles de scoring sur mesure.',
    items: [
      'Dépenses publicitaires illimitées',
      'Espaces de travail multi-marques',
      'Modèles de qualification sur mesure',
      'SLA + onboarding sur site',
    ],
    featured: false,
    cta: 'Parlons-en',
  },
];

export default function Tiers() {
  return (
    <section className="tiers" id="access">
      <div className="container">
        <p className="eyebrow reveal">ACCÈS</p>
        <h2 className="section-title reveal">
          L'accès est <span className="accent">limité.</span>
        </h2>
        <p className="section-sub reveal">
          IRIS intègre un nombre limité d'équipes chaque mois afin de garder
          chaque modèle de qualification affûté. Réservez votre place.
        </p>
        <div className="tiers__grid">
          {TIERS.map((t) => (
            <div className={`tier reveal ${t.featured ? 'tier--featured' : ''}`} key={t.name}>
              {t.featured && <span className="tier__tag mono">LE PLUS DEMANDÉ</span>}
              <h3 className="tier__name">{t.name}</h3>
              <p className="tier__price">
                {t.price}
                <span>{t.period}</span>
              </p>
              <p className="tier__desc">{t.desc}</p>
              <ul className="tier__list">
                {t.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <button
                className={`btn ${t.featured ? 'btn--primary' : 'btn--ghost'} btn--block`}
                onClick={() => scrollToSection('#cta')}
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
