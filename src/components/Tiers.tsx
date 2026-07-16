import { scrollToSection } from '../lib/motion';

const TIERS = [
  {
    name: 'Launch',
    price: '$490',
    period: '/mo',
    desc: 'For single-channel teams getting serious about attribution.',
    items: [
      'Up to $10k/mo ad spend',
      'Precision tracking (pixel + server-side)',
      'Weekly ROI digest',
      'Email support',
    ],
    featured: false,
    cta: 'Request Access',
  },
  {
    name: 'Scale',
    price: '$990',
    period: '/mo',
    desc: 'The full engine — qualification, routing, and live ROI.',
    items: [
      'Up to $50k/mo ad spend',
      'Everything in Launch',
      'Automated lead qualification',
      'Real-time ROI dashboards',
      'Dedicated growth engineer',
    ],
    featured: true,
    cta: 'Request Access',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Multi-brand operations with custom scoring models.',
    items: [
      'Unlimited ad spend',
      'Multi-brand workspaces',
      'Custom qualification models',
      'SLA + onsite onboarding',
    ],
    featured: false,
    cta: 'Talk to us',
  },
];

export default function Tiers() {
  return (
    <section className="tiers" id="access">
      <div className="container">
        <p className="eyebrow reveal">ACCESS</p>
        <h2 className="section-title reveal">
          Access is <span className="accent">limited.</span>
        </h2>
        <p className="section-sub reveal">
          IRIS onboards a limited number of teams each month to keep every
          qualification model sharp. Request your slot.
        </p>
        <div className="tiers__grid">
          {TIERS.map((t) => (
            <div className={`tier reveal ${t.featured ? 'tier--featured' : ''}`} key={t.name}>
              {t.featured && <span className="tier__tag mono">MOST REQUESTED</span>}
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
