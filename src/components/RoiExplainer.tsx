export default function RoiExplainer() {
  return (
    <section className="roi">
      <div className="container">
        <p className="eyebrow reveal">COMPRENDRE LE ROI</p>
        <h2 className="section-title reveal">
          Qu'est-ce que le <span className="accent">ROI&nbsp;?</span>
        </h2>
        <p className="section-sub reveal">
          Le ROI (Retour sur Investissement) mesure la rentabilité de chaque
          franc dépensé en publicité. C'est la différence entre ce que tu
          investis et ce que tu récupères — exprimée en pourcentage.
        </p>

        <div className="roi__grid">
          <div className="roi__example reveal">
            <p className="roi__example-label mono">EXEMPLE CONCRET</p>
            <div className="roi__example-rows">
              <div className="roi__example-row">
                <span>Investissement publicitaire</span>
                <span className="mono">− CHF 2'000</span>
              </div>
              <div className="roi__example-row">
                <span>Revenus générés</span>
                <span className="mono">+ CHF 8'000</span>
              </div>
              <div className="roi__example-row roi__example-row--total">
                <span>ROI</span>
                <span className="roi__example-roi">+300%</span>
              </div>
            </div>
          </div>

          <div className="roi__cards">
            {[
              {
                t: 'La formule simple',
                b: 'ROI = (Revenus générés − Investissement) ÷ Investissement × 100. Si tu investis CHF 1\'000 et génères CHF 4\'000, ton ROI est de +300%.',
              },
              {
                t: "Pourquoi c'est essentiel",
                b: 'Le ROI supprime les suppositions. Tu sais exactement combien rapporte chaque franc investi, et tu peux comparer chaque canal de façon objective.',
              },
              {
                t: 'Le pouvoir du data',
                b: 'Sans ROI, on navigue à l\'aveugle. Avec ROI, chaque décision — budget, canal, audience — repose sur un résultat financier mesurable.',
              },
            ].map((c) => (
              <div className="roi__card reveal" key={c.t}>
                <h3>{c.t}</h3>
                <p>{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
