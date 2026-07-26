const PILLARS = [
  {
    n: '01',
    title: 'Création de contenu',
    body: 'Vidéos, visuels et créas publicitaires à ton image — produits par une équipe qui vient du film et de la pub. Du contenu qui arrête le scroll.',
    tags: ['Vidéo', 'Photo', 'Créas ads', 'IA'],
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="3" y="7" width="20" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M23 13l6-4v14l-6-4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="13" cy="16" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Publicité Meta & Google',
    body: "Création, lancement et optimisation quotidienne de tes campagnes. Ciblage affiné, budget traqué au franc près — tu n'as rien à gérer.",
    tags: ['Meta Ads', 'Google Ads', 'Ciblage', 'Optimisation'],
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16" cy="16" r="7" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16" cy="16" r="2.2" fill="currentColor" />
        <path d="M16 1.5V8M16 24v6.5M1.5 16H8M24 16h6.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Optimisation de ton site',
    body: "Ton site devient une machine à convertir : pages rapides, parcours clair, tracking propre. Le trafic payé ne se perd plus en route.",
    tags: ['Landing pages', 'Conversion', 'Tracking', 'Vitesse'],
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="26" height="19" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 11h26" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 19l4-4 3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 28h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Pillars() {
  return (
    <section className="pillars" id="piliers">
      <div className="container">
        <p className="eyebrow reveal">CE QU'ON FAIT</p>
        <h2 className="section-title reveal">
          Trois piliers. <span className="accent">Un moteur.</span>
        </h2>
        <p className="section-sub reveal">
          Pour que le système IRIS tourne, on exécute nous-mêmes les trois
          leviers qui font venir tes clients — et notre analyse se base
          exactement sur ce qu'on exécute.
        </p>
        <div className="pillars__grid">
          {PILLARS.map((p) => (
            <article className="pillar reveal" key={p.n}>
              <div className="pillar__icon">{p.icon}</div>
              <p className="pillar__index mono">{p.n}</p>
              <h3 className="pillar__title">{p.title}</h3>
              <p className="pillar__body">{p.body}</p>
              <div className="pillar__tags">
                {p.tags.map((t) => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <p className="pillars__note reveal">
          <span className="mono">TRANSPARENCE</span> — on mesure ce qu'on exécute :
          chaque franc investi dans ces trois piliers est suivi, analysé et
          reporté dans ton app IRIS.
        </p>
      </div>
    </section>
  );
}
