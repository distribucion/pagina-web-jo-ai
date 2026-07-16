# IRIS Growth Engine — Landing Page

Landing cinematográfica "30 scroll" para IRIS Growth Engine (JoProductions):
plataforma de adquisición que convierte ad spend en crecimiento predecible.

## Documentos clave
- `brief/brand-dna.md` — Brand DNA aprobado (paleta, tipografía, arquitectura, animación)
- `brief/asset-manifest.md` — manifiesto de assets generados con Higgsfield

## Stack
- Vite + React + TypeScript
- GSAP + ScrollTrigger (scroll-scrub del hero, pinning, reveals)
- Lenis (smooth scroll)
- Assets de video: Seedance 2.0 vía Higgsfield MCP (1080p, 16:9, 8s, sin audio)

## Paleta rápida
- Iris Neon `#8B5CF6` · Iris Glow `#A78BFA` · Iris Deep `#6D28D9`
- Void Black `#050508` (hero) · Deep Charcoal `#0D0D12` (body)
- Signal White `#F4F4F6` · Graphite Mist `#8A8A96`

## Tipografía
Space Grotesk (display) · Inter (body) · JetBrains Mono (métricas)

## Reglas
- Hero: video scroll-scrubbed (el dashboard se ensambla al hacer scroll)
- Animación: slow + elegant, fade+translateY, blur-to-focus, 60fps
- Mobile: fallback poster para el video scrub
- Verificar en localhost con Playwright antes de dar por terminado
