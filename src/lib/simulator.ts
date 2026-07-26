// Benchmarks por secteur — calibrés pour reproduire l'exemple de la version
// originale du site : Immobilier + CHF 2'000 + CHF 500/client
// → 3'000 clics · 240 leads · 144 qualifiés · ROI net +140% · profit +CHF 3'500.
// Estimations marketing indicatives, non contractuelles.

export interface SectorBenchmark {
  id: string;
  label: string;
  cpc: number; // coût par clic (CHF)
  clickToLead: number; // taux clic → lead
  leadToQualified: number; // taux lead → qualifié
  qualifiedToClient: number; // taux qualifié → client signé
  defaultClientValue: number; // valeur moyenne par client (CHF)
}

export const SERVICE_FEE = 500; // frais de service IRIS (CHF / mois)

export const SECTORS: SectorBenchmark[] = [
  { id: 'immobilier', label: 'Immobilier', cpc: 0.6667, clickToLead: 0.08, leadToQualified: 0.6, qualifiedToClient: 0.0833, defaultClientValue: 500 },
  { id: 'coaching', label: 'Coaching / Consulting', cpc: 0.8, clickToLead: 0.1, leadToQualified: 0.55, qualifiedToClient: 0.1, defaultClientValue: 1500 },
  { id: 'ecommerce', label: 'E-commerce', cpc: 0.45, clickToLead: 0.06, leadToQualified: 0.5, qualifiedToClient: 0.18, defaultClientValue: 180 },
  { id: 'restauration', label: 'Restauration', cpc: 0.35, clickToLead: 0.09, leadToQualified: 0.55, qualifiedToClient: 0.22, defaultClientValue: 120 },
  { id: 'sante', label: 'Santé / Bien-être', cpc: 0.7, clickToLead: 0.09, leadToQualified: 0.6, qualifiedToClient: 0.12, defaultClientValue: 900 },
  { id: 'b2b', label: 'Services B2B', cpc: 1.1, clickToLead: 0.07, leadToQualified: 0.55, qualifiedToClient: 0.09, defaultClientValue: 4000 },
  { id: 'formation', label: 'Formation / Éducation', cpc: 0.6, clickToLead: 0.09, leadToQualified: 0.5, qualifiedToClient: 0.11, defaultClientValue: 800 },
  { id: 'construction', label: 'Construction', cpc: 0.9, clickToLead: 0.07, leadToQualified: 0.6, qualifiedToClient: 0.1, defaultClientValue: 6000 },
  { id: 'autre', label: 'Autre secteur', cpc: 0.7, clickToLead: 0.08, leadToQualified: 0.55, qualifiedToClient: 0.1, defaultClientValue: 800 },
];

export interface SimResult {
  clics: number;
  leads: number;
  qualifies: number;
  clients: number;
  revenue: number;
  serviceFee: number;
  totalCost: number;
  profit: number;
  roi: number; // en %
}

export function simulate(budget: number, sector: SectorBenchmark, clientValue: number): SimResult {
  const clics = budget / sector.cpc;
  const leads = clics * sector.clickToLead;
  const qualifies = leads * sector.leadToQualified;
  const clients = qualifies * sector.qualifiedToClient;
  const revenue = clients * clientValue;
  const totalCost = budget + SERVICE_FEE;
  const profit = revenue - totalCost;
  const roi = (profit / totalCost) * 100;
  return {
    clics: Math.round(clics),
    leads: Math.round(leads),
    qualifies: Math.round(qualifies),
    clients: Math.max(0, Math.round(clients)),
    revenue: Math.round(revenue),
    serviceFee: SERVICE_FEE,
    totalCost: Math.round(totalCost),
    profit: Math.round(profit),
    roi: Math.round(roi),
  };
}

export const chf = (n: number) =>
  `CHF ${Math.round(Math.abs(n))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`;

export const signedChf = (n: number) => `${n < 0 ? '−' : '+'}${chf(n)}`;
