import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap, prefersReduced, scrollToSection } from '../lib/motion';
import { SECTORS, simulate, chf, signedChf } from '../lib/simulator';

const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");

/** Animated number that eases toward its target whenever it changes. */
function useAnimatedNumber(target: number) {
  const [display, setDisplay] = useState(target);
  const ref = useRef({ v: target });
  useEffect(() => {
    if (prefersReduced) {
      setDisplay(target);
      return;
    }
    const obj = ref.current;
    const tween = gsap.to(obj, {
      v: target,
      duration: 0.7,
      ease: 'power3.out',
      onUpdate: () => setDisplay(obj.v),
    });
    return () => {
      tween.kill();
    };
  }, [target]);
  return display;
}

export default function Simulator() {
  const [budget, setBudget] = useState(2000);
  const [sectorId, setSectorId] = useState('immobilier');
  const sector = useMemo(() => SECTORS.find((s) => s.id === sectorId)!, [sectorId]);
  const [clientValue, setClientValue] = useState(sector.defaultClientValue);

  // adopt the sector's typical client value when switching sector
  const onSector = (id: string) => {
    setSectorId(id);
    const s = SECTORS.find((x) => x.id === id)!;
    setClientValue(s.defaultClientValue);
  };

  const r = useMemo(() => simulate(budget, sector, clientValue), [budget, sector, clientValue]);

  const roi = useAnimatedNumber(r.roi);
  const clics = useAnimatedNumber(r.clics);
  const leads = useAnimatedNumber(r.leads);
  const qualifies = useAnimatedNumber(r.qualifies);
  const profit = useAnimatedNumber(r.profit);

  // exposed for the verification script
  useEffect(() => {
    (window as any).__simRoi = r.roi;
  }, [r.roi]);

  return (
    <section className="sim" id="simulateur">
      <div className="container">
        <p className="eyebrow reveal">GROWTH ENGINE</p>
        <h2 className="section-title reveal">
          Simule ton <span className="accent">ROI</span> avec IRIS
        </h2>
        <p className="section-sub reveal">
          Ajuste les paramètres et vois en temps réel combien de clients tu peux
          acquérir grâce à notre système.
        </p>

        <div className="sim__grid reveal">
          {/* ————— control panel ————— */}
          <div className="sim__panel">
            <h3 className="sim__panel-title">Panneau de contrôle</h3>

            <label className="sim__label mono" htmlFor="sim-budget">
              BUDGET PUBLICITAIRE MENSUEL
              <span className="sim__label-value">{chf(budget)}</span>
            </label>
            <input
              id="sim-budget"
              className="sim__slider"
              type="range"
              min={200}
              max={20000}
              step={100}
              value={budget}
              onChange={(e) => setBudget(+e.target.value)}
            />
            <div className="sim__range mono">
              <span>CHF 200</span>
              <span>CHF 20'000</span>
            </div>

            <p className="sim__label mono">TON SECTEUR</p>
            <div className="sim__sectors">
              {SECTORS.map((s) => (
                <button
                  key={s.id}
                  className={`sim__sector ${s.id === sectorId ? 'is-active' : ''}`}
                  onClick={() => onSector(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <label className="sim__label mono" htmlFor="sim-value">
              VALEUR MOYENNE PAR CLIENT
              <span className="sim__label-value">{chf(clientValue)}</span>
            </label>
            <input
              id="sim-value"
              className="sim__slider"
              type="range"
              min={50}
              max={50000}
              step={50}
              value={clientValue}
              onChange={(e) => setClientValue(+e.target.value)}
            />
            <div className="sim__range mono">
              <span>CHF 50</span>
              <span>CHF 50'000</span>
            </div>
          </div>

          {/* ————— results ————— */}
          <div className="sim__results">
            <p className="sim__roi-label mono">ROI NET ESTIMÉ</p>
            <p className={`sim__roi ${r.roi < 0 ? 'is-negative' : ''}`} data-testid="sim-roi">
              {roi < 0 ? '−' : '+'}
              {fmt(Math.abs(roi))}%
            </p>

            <div className="sim__stats">
              <div className="sim__stat">
                <span className="sim__stat-value">{fmt(clics)}</span>
                <span className="sim__stat-label mono">CLICS</span>
              </div>
              <div className="sim__stat">
                <span className="sim__stat-value">{fmt(leads)}</span>
                <span className="sim__stat-label mono">LEADS</span>
              </div>
              <div className="sim__stat">
                <span className="sim__stat-value">{fmt(qualifies)}</span>
                <span className="sim__stat-label mono">QUALIFIÉS</span>
              </div>
            </div>

            <div className="sim__breakdown">
              <div className="sim__row">
                <span>Investissement publicitaire</span>
                <span>{chf(budget)}</span>
              </div>
              <div className="sim__row sim__row--muted">
                <span>Frais de service IRIS</span>
                <span>{chf(r.serviceFee)}</span>
              </div>
              <div className="sim__row sim__row--strong">
                <span>Coût total</span>
                <span>{chf(r.totalCost)}</span>
              </div>
              <div className="sim__row">
                <span>Revenu estimé</span>
                <span>{chf(r.revenue)}</span>
              </div>
              <div className="sim__row sim__row--profit">
                <span>PROFIT NET</span>
                <span>{signedChf(profit)}</span>
              </div>
            </div>

            <button className="btn btn--primary btn--block" onClick={() => scrollToSection('#contact')}>
              Déployer ta stratégie
            </button>
            <p className="sim__disclaimer mono">ESTIMATION INDICATIVE, NON CONTRACTUELLE</p>
          </div>
        </div>
      </div>
    </section>
  );
}
