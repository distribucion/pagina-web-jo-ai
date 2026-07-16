import { useState } from 'react';

const ITEMS = [
  {
    q: 'What exactly is IRIS Growth Engine?',
    a: 'IRIS is JoProductions’ acquisition platform: a tracking, qualification, and reporting layer that sits on top of your ad accounts and turns advertising spend into a predictable stream of qualified clients.',
  },
  {
    q: 'Does IRIS replace my ad agency or media buyer?',
    a: 'No — it makes them accountable. IRIS shows which campaigns, creatives, and audiences actually produce clients, so whoever runs your ads optimizes against revenue instead of vanity metrics.',
  },
  {
    q: 'Which platforms does it track?',
    a: 'Meta, Google, and TikTok Ads out of the box, with server-side tracking for iOS-resistant attribution. CRM sync covers HubSpot, Pipedrive, and custom webhooks.',
  },
  {
    q: 'How fast until I see qualified leads?',
    a: 'Tracking is live within 48 hours of onboarding. Most teams see fully scored, qualified leads flowing into their pipeline within the first week.',
  },
  {
    q: 'Why is access limited?',
    a: 'Every account gets a calibrated qualification model and a dedicated growth engineer. Limiting onboarding keeps both sharp — request access and we confirm your slot within 24 hours.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="faq" id="faq">
      <div className="container container--narrow">
        <p className="eyebrow reveal">QUESTIONS</p>
        <h2 className="section-title reveal">Before you ask.</h2>
        <div className="faq__list">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div className={`faq__item reveal ${isOpen ? 'is-open' : ''}`} key={i}>
                <button
                  className="faq__q"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <svg
                    className="faq__chevron"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
                <div className="faq__a-wrap">
                  <div className="faq__a">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
