import { useState } from 'react';

const ITEMS = [
  {
    q: "Qu'est-ce que IRIS Growth Engine, exactement ?",
    a: "IRIS est la plateforme d'acquisition de JoProductions : une couche de suivi, de qualification et de reporting qui se pose sur vos comptes publicitaires et transforme vos dépenses en un flux prévisible de clients qualifiés.",
  },
  {
    q: 'IRIS remplace-t-il mon agence ou mon media buyer ?',
    a: "Non — il les rend redevables. IRIS montre quelles campagnes, créas et audiences produisent réellement des clients, pour que celui qui gère vos publicités optimise le chiffre d'affaires, pas des métriques de vanité.",
  },
  {
    q: 'Quelles plateformes sont suivies ?',
    a: 'Meta, Google et TikTok Ads en natif, avec un suivi côté serveur résistant à iOS. La synchronisation CRM couvre HubSpot, Pipedrive et les webhooks sur mesure.',
  },
  {
    q: 'En combien de temps verrai-je des leads qualifiés ?',
    a: "Le suivi est actif dans les 48 heures suivant l'onboarding. La plupart des équipes voient des leads entièrement évalués et qualifiés arriver dans leur pipeline dès la première semaine.",
  },
  {
    q: "Pourquoi l'accès est-il limité ?",
    a: "Chaque compte reçoit un modèle de qualification calibré et un ingénieur croissance dédié. Limiter l'onboarding garde les deux affûtés — demandez l'accès et nous confirmons votre place sous 24 heures.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="faq" id="faq">
      <div className="container container--narrow">
        <p className="eyebrow reveal">QUESTIONS</p>
        <h2 className="section-title reveal">Vos questions, anticipées.</h2>
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
