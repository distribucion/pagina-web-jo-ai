import { useState } from 'react';

const ITEMS = [
  {
    q: 'Combien de temps avant de voir des résultats ?',
    a: "La plupart des clients voient les premiers leads qualifiés dans les 7 à 14 jours suivant le lancement des campagnes. Le système IRIS s'optimise ensuite en continu — les meilleurs résultats arrivent généralement entre la 4e et la 8e semaine.",
  },
  {
    q: "Est-ce que ça marche pour mon secteur d'activité ?",
    a: "IRIS s'adapte à ton industrie grâce à des benchmarks spécifiques (taux de conversion, valeur moyenne du client). Utilise le simulateur ROI pour voir une estimation basée sur ton secteur.",
  },
  {
    q: 'Quel budget publicitaire minimum est nécessaire ?',
    a: 'Nous recommandons un budget minimum de CHF 500-800/mois en publicité pour générer un volume de données suffisant. Le système est conçu pour scaler efficacement à mesure que le budget augmente.',
  },
  {
    q: 'Dois-je gérer les publicités moi-même ?',
    a: 'Non. Notre équipe prend en charge la création, le lancement et l’optimisation quotidienne de tes campagnes Meta Ads et Google Ads. Tu reçois des rapports clairs sans avoir à gérer la technique.',
  },
  {
    q: "Qu'est-ce qui différencie IRIS d'une agence marketing classique ?",
    a: "IRIS n'est pas une prestation de contenu — c'est un système complet d'acquisition avec suivi data, automatisations et publicité payante ciblée. On ne facture pas des posts, on construit une machine à clients mesurable.",
  },
  {
    q: 'Puis-je annuler à tout moment ?',
    a: "Oui, il n'y a aucun engagement à long terme forcé. On te demande simplement un cycle minimum de 30 jours pour que le système ait le temps de générer des données exploitables.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="faq" id="faq">
      <div className="container container--narrow">
        <p className="eyebrow reveal">QUESTIONS</p>
        <h2 className="section-title reveal">Des questions ? On répond.</h2>
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
