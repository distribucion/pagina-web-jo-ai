# Cómo se hizo esta landing — el flujo completo, explicado

> Documento de contexto para Damián (JoProductions). Explica qué pasó desde
> que pegaste el prompt maestro de IRIS Growth Engine hasta la web verificada
> en localhost: qué decisiones se tomaron, qué herramientas se usaron en cada
> paso y por qué.

---

## 0. El punto de partida: tu prompt maestro

Pegaste un prompt del pack "The One-Prompt Website Pack" (adaptado por Gemini
a tu caso). Ese prompt traía 3 bloques:

1. **Qué es el producto** — IRIS Growth Engine, plataforma de adquisición.
2. **VISUALS** — 3 clips a generar con Seedance 2.0 en el Higgsfield MCP
   (hero de partículas, funnel macro, estudio en calma).
3. **WEBSITE** — la estructura exacta: hero scroll-scrub, logo strip,
   3 features pinned, counters, mockup, tiers, FAQ, CTA final + la orden de
   verificar en localhost antes de dar por terminado.

Un buen prompt maestro **no ejecuta nada por sí mismo** — es el brief. Lo que
lo convierte en web es el pipeline de skills que tienes instalado en
`~/.claude/skills/`. Eso es lo que se activó.

---

## 1. FASE BRIEF — skill `brand-strategist`

**Herramientas usadas:** Write (crear archivos). Nada más.

- La skill normalmente hace "discovery" (te pregunta tipo de negocio, mood,
  cliente ideal). **Se saltó las preguntas** porque tu prompt ya respondía
  todo — preguntarte de nuevo habría bloqueado el flujo.
- Se tradujo tu prompt a un documento formal de diseño:

| Archivo generado | Qué contiene |
|---|---|
| `brief/brand-dna.md` | Paleta con nombres y hex (Iris Neon `#8B5CF6`, Void Black `#050508`…), tipografías (Space Grotesk / Inter / JetBrains Mono), arquitectura de las 8 secciones, dirección de animación (slow + elegant, blur-to-focus) |
| `CLAUDE.md` | Resumen del proyecto que cualquier sesión futura de Claude lee automáticamente al abrir esta carpeta |

**Por qué importa:** todo lo que vino después (código, colores, prompts de
video) se derivó de este documento, no del prompt suelto. Es la "fuente de
verdad" del proyecto.

---

## 2. FASE ASSETS — skill `asset-director` (aquí hubo un giro importante)

**Herramientas usadas:** ToolSearch (buscar herramientas MCP), Write.

- La skill intentó usar el **Higgsfield MCP** (`generate_image`,
  `generate_video`) para crear los 3 clips Seedance… y **el MCP no estaba
  conectado en esa sesión**. Las herramientas simplemente no existían.
- **Decisión clave (y probablemente la razón de que a ti no te saliera
  durante semanas):** en vez de bloquearse o inventar, la skill degradó con
  elegancia:
  1. Escribió `brief/asset-manifest.md` con los **3 prompts Seedance exactos**
     (modelo, modo std, 1080p, 16:9, 8s, sin audio) listos para ejecutar
     cuando el MCP estuviera conectado.
  2. Cambió la estrategia a **visuales procedurales**: en vez de videos,
     los 3 "clips" se programarían como animaciones de canvas en código.
  3. Dejó marcadores `// SEEDANCE-SWAP` en el código señalando dónde entra
     cada clip real el día que se generen.

**Respuesta directa a tu pregunta original:** ❌ no se generó ninguna imagen
ni video. ✅ Todo lo que ves es código puro.

---

## 3. FASE BUILD — skill `frontend-architect`

**Herramientas usadas:** Write/Edit (código), PowerShell (npm, node),
Glob/Grep/Read (navegar el proyecto).

### 3.1 Scaffold

```
Vite + React + TypeScript   → el framework (compila a estáticos, carga <1s)
GSAP + ScrollTrigger        → el motor de animación por scroll (pinning, scrub)
Lenis                       → smooth scroll con inercia "cara"
Playwright                  → verificación automatizada en navegador real
```

Se escribieron a mano `package.json`, `vite.config.ts`, `tsconfig.json` e
`index.html` (con las 3 Google Fonts) y se corrió `npm install`.

### 3.2 Los 3 "videos" como motores de canvas

| Motor | Reemplaza al clip | Cómo funciona |
|---|---|---|
| `src/lib/heroEngine.ts` | HERO (ensamblaje) | ~1.500 partículas fluyen como streams caóticos de luz. Cada una tiene asignada una posición final muestreada de la geometría de un dashboard (bordes de cards, la polilínea ROI, barras). GSAP fija el hero durante 260% de scroll y pasa el progreso 0→1 al motor: las partículas interpolan de caos → orden, y al final se dibuja encima el UI glass con la línea ROI que se revela y pulsa. |
| `src/lib/funnelEngine.ts` | FUNNEL (macro) | Nodos fluyendo por 4 carriles cruzan el gate "AUTOMATED QUALIFICATION"; ~40% destellan, se califican y se fijan en la cuadrícula de "VERIFIED LEADS". Reacciona a cuál de los 3 features está activo. |
| `src/lib/studioEngine.ts` | STUDIO (calma) | Motas de polvo a la deriva, glow "respirando", silueta de monitor ultra-wide con mini-gráfico en vivo, vignette. |

**Ventaja inesperada:** scrubear un `<video>` real con `video.currentTime`
da tirones (los keyframes H.264 no permiten saltar a cualquier frame). El
canvas es **frame-perfect**: cada píxel de scroll corresponde exactamente a
un estado de la animación. Lo que se pierde: el look fotográfico de video
real (el estudio con la lente y el café).

### 3.3 Las animaciones de scroll (GSAP)

- **Hero**: `ScrollTrigger` con `pin: true` + `scrub: 1` durante 260% de
  viewport. El mismo trigger mueve el headline (se encoge hacia arriba) y
  alimenta el motor de partículas.
- **Features**: sección pinned 250%; timeline que cruza los 3 bloques con
  fade + translateY + blur, sincronizada con el canvas del funnel.
- **Counters**: al entrar al viewport, GSAP anima objetos numéricos
  (0→100%, 0/0→24/7, 0.0x→3x) una sola vez.
- **Reveals genéricos**: toda `.reveal` hace fade + rise + blur-to-focus
  scrubbed en una ventana corta.
- **Accesibilidad**: si el sistema pide `prefers-reduced-motion`, no se
  crean los ScrollTriggers y todo queda visible en estado final.

### 3.4 Secciones sin video

Nav con blur al scrollear, logo strip en marquee infinito, mockup
browser-frame con el dashboard IRIS construido en HTML/CSS/SVG (entra con
rotación 3D), tiers con el plan Scale destacado, FAQ accordion, footer.

---

## 4. FASE VERIFICACIÓN — Playwright

**Herramientas usadas:** PowerShell (dev server + script), Read (mirar screenshots).

El prompt exigía "verificar antes de decir que está hecho". Se cumplió así:

1. El código expone estado para los tests: `window.__heroProgress`,
   `window.__featureIdx`, `window.__heroST` (rango del pin), `window.lenis`.
2. `scripts/verify.mjs` abre Chromium a 1440px y 390px, scrubea a
   posiciones exactas del pin con `lenis.scrollTo(y, { immediate: true })`
   y afirma con datos reales:
   - el scrub del hero llega a p>0.9 y el canvas pinta píxeles (getImageData)
   - los 3 bloques pinned ciclan 0→1→2
   - los counters terminan exactamente en `100%`, `24/7`, `3x`
   - el acordeón abre al click
   - 0 errores de consola y sin overflow horizontal en mobile
3. Genera 13 screenshots en `shots/` que se revisaron visualmente.
4. `npm run verify` termina con exit code ≠ 0 si algo falla.

---

## 5. Resumen de herramientas por fase

| Fase | Skill | Herramientas concretas |
|---|---|---|
| Brief | brand-strategist | Write |
| Assets | asset-director | ToolSearch (detectó MCP ausente), Write |
| Build | frontend-architect | Write/Edit, PowerShell (node, npm, tsc), Glob/Read |
| Verificación | frontend-architect | PowerShell (vite + playwright), Read (screenshots) |
| ❌ No se usaron | — | Higgsfield MCP (desconectado), 21st.dev MCP, Vercel (no se pidió deploy) |

---

## 6. Qué cambió después (para las próximas webs)

Con las lecciones de este proyecto se creó la skill orquestadora
**`/cinematic-web`** y se actualizaron las 3 skills. El flujo nuevo:

```
TU ENTRADA (una de tres)                 EL PIPELINE HACE
─────────────────────────                ────────────────────────────────
• URL de referencia            →  Fase 0  Chequea Higgsfield MCP + créditos
• Branding (logo/colores)      →  Fase 1  Brand DNA (extraído, no preguntado)
• Brief de una frase           →  Fase 2  Assets: imagen hero de referencia
                                          → clips Seedance consistentes
                                          → compresión ffmpeg (<4MB/clip)
                                          → fallback procedural si no hay MCP
                                  Fase 3  Build Vite+GSAP (copia los motores
                                          de ESTE proyecto como plantilla)
                                  Fase 4  Playwright hasta verde
                                  Fase 5  Entrega (deploy solo si lo pides)
```

Este proyecto (`paginaweb-jo-producction`) quedó como **plantilla canónica**:
las skills copian sus motores y su script de verificación en cada web nueva.

## 7. Pendiente opcional para IRIS

El Higgsfield MCP **ya está conectado** en las sesiones actuales. Cuando
quieras, se pueden generar los 3 clips reales con los prompts de
`brief/asset-manifest.md` (con el truco de la imagen hero de referencia) e
integrarlos como fondos ambient del funnel y del CTA, manteniendo el canvas
para el scrub del hero. Gasta créditos de Higgsfield — se hace solo si lo pides.
