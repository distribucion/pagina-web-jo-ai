# PLAN V2 — IRIS Growth Engine (integración del contenido real)

> Aprobaciones del 25.07.2026: **tono = tuteo** · **H1 = "Une croissance
> client prévisible." (se mantiene)** · **tiers = se eliminan** (la conversión
> pasa a ser simulador → contacto) · **paleta = 100% púrpura** (sin verde).
> Fuente de contenido: `ANALISIS-WEB-ORIGINAL.md`.

---

## Arquitectura final de la página (orden de secciones)

| # | Sección | Estado | Fondo/animación |
|---|---|---|---|
| 1 | **Hero** scroll-scrub (partículas → dashboard) | ✅ existe — retocar copy a tuteo, CTA primario pasa a "Simule ton ROI" (ancla al simulador) | heroEngine |
| 2 | **Cifras reales** — 14'202+ leads · 4.8x ROI · 38 clients · 100% 24/7 | 🔁 reemplaza counters inventados | counters GSAP |
| 3 | **Método I.R.I.S.** — Identifier · Rayonner · Intéresser · Signer | 🔁 reemplaza los 3 features pinned por los 4 pasos reales | funnelEngine (4 fases) + letra gigante por paso |
| 4 | **Ce qu'on fait** — 3 pilares: Création de contenu · Publicité Meta & Google · Optimisation du site | 🆕 (pedido del socio) | cards glass, reveal escalonado |
| 5 | **Comprendre le ROI** — fórmula + ejemplo CHF 2'000 → 8'000 (+300%) | 🆕 compacta | reveal + cifras animadas |
| 6 | **Simulador ROI** ⭐ — sliders + 9 sectores + resultado en vivo | 🆕 la joya | inputs interactivos, cifras que se animan al cambiar |
| 7 | **L'app** — "Une app pour voir où va ton argent" + 6 features reales | 🔁 evoluciona la sección Product (mockup se queda) | browser-frame + grid de features |
| 8 | **Pourquoi les ads** — organic 2-5% vs IRIS 85% + logos Apple/Nike/Amazon… | 🔁 reemplaza el logo strip ficticio | barras comparativas animadas por scroll |
| 9 | **FAQ real** — las 6 preguntas de la web original | 🔁 reemplaza las 5 inventadas | accordion existente |
| 10 | **Contact** — formulario + datos reales + "Premier appel : gratuit" | 🔁 evoluciona el CTA final | studioEngine de fondo |

**Se elimina:** tabla de tiers · logo strip ficticio · FAQ inventada.
**Nav nueva:** MÉTHODE · SIMULATEUR · L'APP · FAQ · CONTACT + botón "Parlons-en".

---

## Etapas de implementación

### Etapa 1 — Fundaciones de contenido (rápida, sin secciones nuevas)
- Pasar TODO el copy existente a tuteo ("vos dépenses" → "tes dépenses"…)
- Reemplazar counters por las 4 cifras reales
- Reemplazar la FAQ por las 6 preguntas reales
- Nav y footer nuevos (anclas + datos reales en footer)
- Actualizar `brief/brand-dna.md` con las decisiones aprobadas
- ✔️ Checkpoint: typecheck + verify + screenshots

### Etapa 2 — Método I.R.I.S. (la sección pinned)
- Reescribir los bloques pinned: 4 pasos (antes 3), cada uno con su letra
  gigante (I·R·I·S), descripción y tags (CIBLAGE · DONNÉES · …)
- Adaptar `funnelEngine` a 4 fases visuales (una por letra: identificación
  de nodos → destaque/rayonner → qualification gate → lock/signature)
- ✔️ Checkpoint: verificar que el pin cicla 0→1→2→3

### Etapa 3 — "Ce qu'on fait" (los 3 pilares del socio)
- Nueva sección tras el método: 3 cards glass (Contenu / Publicité /
  Optimisation web) con iconografía propia y el mensaje conector:
  "Notre analyse se base sur ces trois piliers — on mesure ce qu'on exécute."
- ✔️ Checkpoint: reveal + responsive

### Etapa 4 — Simulador ROI ⭐ (la etapa más grande)
- Componente `Simulator.tsx`: slider budget (CHF 200–20'000), selector de
  9 sectores, slider valor por cliente (CHF 50–50'000)
- Archivo de benchmarks por sector (CPC, tasa clic→lead, lead→qualifié,
  qualifié→client) calibrado para reproducir el ejemplo original
  (CHF 2'000 + Immobilier + CHF 500 → +140%, 3'000 clics, 240 leads,
  144 qualifiés, profit +CHF 3'500, frais de service CHF 500)
- Cifras animadas con GSAP al mover cualquier control; desglose de costes
- Todo en púrpura (glow para el ROI destacado)
- ✔️ Checkpoint: probar valores extremos, mobile, teclado

### Etapa 5 — ROI educativo + Pourquoi les ads
- Mini-sección "Comprendre le ROI" (definición, fórmula, ejemplo animado)
- Sección comparativa: barra 2-5% organique vs 85% IRIS animada por scroll
  + strip de logos de marcas reales (texto estilizado, sin assets externos)
- ✔️ Checkpoint: reveals y counters

### Etapa 6 — L'app + Contact (y adiós tiers)
- Retitular la sección del mockup a "Une app pour voir où va ton argent" y
  añadir el grid de 6 features reales
- Sección final Contact sobre studioEngine: formulario (nom, email,
  entreprise, besoin) con envío `mailto:info@jo-productions.ch` (sin backend
  por ahora), datos reales (Fribourg—Lausanne, @jo.productions.pro),
  "Premier appel : gratuit, sans engagement."
- Eliminar `Tiers.tsx` y sus referencias
- ✔️ Checkpoint: form navegable, anclas correctas

### Etapa 7 — Verificación final completa
- Actualizar `scripts/verify.mjs` a la nueva estructura (4 pasos del método,
  simulador: mover slider y verificar que el ROI cambia, form presente,
  cifras reales en counters)
- Pasada visual completa desktop + mobile con screenshots
- ✔️ Entrega: 100% checks verdes

### Etapa 8 — (Opcional, después) Clips Seedance
- Generar los 3 clips con el truco de imagen hero de referencia e
  integrarlos como fondos ambient (funnel y contact) según el manifest.

---

## Notas técnicas
- El formulario no tendrá backend en esta fase (mailto). Si luego quieres
  envío real: Formspree/servidor propio — decisión aparte.
- Los benchmarks del simulador son estimaciones de marketing, no promesas:
  añadiremos la nota "Estimation indicative, non contractuelle".
- Cada etapa termina con typecheck + `npm run verify` para no romper nada.
