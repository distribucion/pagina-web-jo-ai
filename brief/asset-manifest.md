# ASSET MANIFEST — IRIS Growth Engine
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ⚠️ Estado: Higgsfield MCP no disponible en esta sesión
Los 3 clips Seedance 2.0 NO se pudieron generar (el servidor MCP de Higgsfield
no está conectado). En su lugar, el sitio usa **motores procedurales en canvas**
que cumplen la misma dirección de arte y son scrubbed por scroll con precisión
de frame. Cuando se conecte el MCP, ejecutar los prompts de abajo y colocar los
archivos en `public/video/` — el código tiene los puntos de integración marcados
con `// SEEDANCE-SWAP`.

Parámetros para los 3: **seedance_2_0, std mode, 1080p, 16:9, no audio, 8s.**

## 🎬 CLIP 1 — HERO (`public/video/hero-assembly.mp4`)
> A dark cinematic void. Chaotic streams of digital light in vibrant neon purple
> (#8B5CF6) and violet, representing raw ad traffic, flow through black space and
> slowly converge, seamlessly assembling themselves into a clean floating
> glassmorphism dashboard UI. A central ROI line graph pulses and climbs upward
> with a glowing neon iris accent. Slow cinematic motion, gradual reveal from
> chaos to order, progressive transformation with a clear beginning and end, no
> loop. Volumetric light, high contrast, dark background, no text, no faces. 8s.

**Integración:** Hero scroll-scrub (video.currentTime mapeado a progreso de scroll).
**Fallback actual:** motor de partículas `src/lib/heroEngine.ts` (ensamblaje real
de dashboard desde streams, controlado por scroll).

## 🎬 CLIP 2 — FUNNEL (`public/video/funnel-macro.mp4`)
> Extreme macro cinematic camera glide across holographic charts and glowing lead
> pipeline nodes floating in dark space, neon purple (#8B5CF6) hologram light,
> shallow depth of field. A single digital node lights up brightly as it passes
> through a translucent "qualification" filter gate, locking in place as a
> verified high-value lead with a bright iris glow. Slow elegant camera drift,
> dark charcoal background, high contrast, no text, no faces. 8s.

**Integración:** fondo de la sección features pinned (loop ambient).
**Fallback actual:** motor de pipeline `src/lib/funnelEngine.ts`.

## 🎬 CLIP 3 — STUDIO (`public/video/studio-calm.mp4`)
> A sleek ultra-wide monitor displaying a dark analytics dashboard with glowing
> neon purple charts, in a dimly lit high-end creative production studio at
> night. A professional camera lens and a coffee cup sit on the desk. Calm,
> controlled atmosphere, soft practical lighting, purple screen glow reflecting
> on the desk, cinematic depth of field, slow subtle camera push-in, no people,
> no readable text. 8s.

**Integración:** fondo del CTA final (loop ambient).
**Fallback actual:** escena ambient `src/lib/studioEngine.ts` + vignette.

## 📸 Otros assets
- Logos social proof: SVG wordmarks inline (placeholder de marcas)
- Product screenshot: dashboard IRIS construido en HTML/CSS dentro de
  browser-frame mockup (no requiere generación)
