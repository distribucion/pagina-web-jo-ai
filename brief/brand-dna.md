# BRAND DNA — IRIS Growth Engine
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎯 PROPÓSITO
IRIS Growth Engine es la plataforma de adquisición avanzada de **JoProductions**:
convierte inversión publicitaria en crecimiento predecible de clientes mediante
**precision tracking**, **automated lead qualification** y **real-time ROI
visualization**. La landing debe transmitir control absoluto, tecnología de
precisión y calma operativa: "el crecimiento está automatizado, todo bajo control".

**Cliente ideal:** dueños de negocio y directores de marketing que ya invierten
en Meta/Google Ads pero no ven claridad en el retorno — buscan un sistema, no
otra agencia. Sofisticados, escépticos, valoran datos sobre promesas.

**Posicionamiento:** producto de acceso exclusivo (tiers de "Request Access"),
no un servicio commodity.

## 🎨 IDENTIDAD VISUAL

### Paleta
| Rol | Hex | Nombre |
|---|---|---|
| Primary / Accent | `#8B5CF6` | Iris Neon (púrpura vibrante) |
| Accent Bright | `#A78BFA` | Iris Glow (highlights, glows) |
| Accent Deep | `#6D28D9` | Iris Deep (gradientes, sombras neon) |
| Background Hero | `#050508` | Void Black (near-black) |
| Background Body | `#0D0D12` | Deep Charcoal |
| Surface Glass | `rgba(139,92,246,0.06)` + blur | Glass Iris (cards glassmorphism) |
| Text Primary | `#F4F4F6` | Signal White |
| Text Muted | `#8A8A96` | Graphite Mist |

### Tipografía
- **Display:** Space Grotesk — headlines masivos, geométrica, técnica
- **Body:** Inter — texto corrido, UI, máxima legibilidad
- **Mono/Datos:** JetBrains Mono — métricas, labels, contadores

### Estilo fotográfico / video
Dark cinematic void, volumetric neon light streams, glassmorphism UI flotante,
macro holographic detail, low-key studio lighting, shallow depth of field,
purple/iris rim lighting. Sin personas. Sensación: sala de control silenciosa.

## 🏗 ARQUITECTURA DE PÁGINA
1. **Hero (scroll-scrub, clip 1):** streams caóticos de luz (tráfico de ads)
   se ensamblan en un dashboard glassmorphism al hacer scroll. Headline masivo
   "Predictable Client Growth." + CTA "Request Access".
2. **Logo strip:** social proof, logos en gris con hover iris.
3. **Features pinned (clip 2 de fondo):** 3 bloques que se revelan en secuencia —
   Precision Tracking → Automated Qualification → Real-Time ROI.
4. **Metrics counters:** 100% Ad Spend Tracked · 24/7 Lead Qualification ·
   3x Average ROI — contadores animados al entrar en viewport.
5. **Product screenshot:** mockup browser-frame con sombra neon suave.
6. **Access tiers:** tabla de 3 niveles, tier primario destacado en iris.
7. **FAQ:** acordeón glassmorphism.
8. **CTA final (clip 3 de fondo):** el estudio en calma — "Growth, automated."
   + Request Access.

## 🎬 DIRECCIÓN DE ANIMACIÓN
- **Estilo general:** Classic Motion cinematográfico — slow + elegant
- **Efecto hero:** scroll-scrubbed video (el dashboard se construye con el scroll)
- **Reveals:** fade + translateY sutil, blur-to-focus en headlines, clip-path en cards
- **Pinning:** sección features fijada sobre clip 2 con reveals secuenciales
- **Counters:** ease-out numérico al 40% de viewport
- **Scroll:** Lenis smooth scrolling, GSAP ScrollTrigger para todo

## 📐 ESPECIFICACIONES
- Responsive: mobile-first (video scrub con fallback poster en mobile)
- Performance: <3s load, 60fps, video H.264 optimizado + preload metadata
- Stack: Vite + React + TS + GSAP + ScrollTrigger + Lenis
- Assets: 3 clips Seedance 2.0 vía Higgsfield MCP (std, 1080p, 16:9, 8s, sin audio)
- Deploy: verificación en localhost (Vercel opcional después)
