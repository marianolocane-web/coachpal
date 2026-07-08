# CoachPal Design System

**CoachPal** es una app mobile-web para trackear hábitos personales — un "coach" personal que ayuda a las personas a construir rachas (streaks) y consistencia diaria en los hábitos que les importan (ejercicio, lectura, meditación, agua, sueño, etc).

## Origen de este sistema

No se adjuntó codebase, Figma, ni assets de marca existentes (ni logo). Este design system se construyó **desde cero** a partir de una breve descripción del producto y respuestas del usuario a un cuestionario de dirección visual, con las siguientes decisiones tomadas por defecto (el usuario puede pedir ajustes en cualquier momento):

- **Vibe:** cálido y motivador — verde de "progreso/crecimiento" + ámbar de "energía/celebración", sobre fondos tipo papel cálido (no grises fríos).
- **Tono de copy:** cercano, tuteo, motivador pero no infantil.
- **Idioma:** español neutro.
- **Tipografía:** Manrope (display/títulos/números de racha) + Inter (cuerpo/UI) — ambas de Google Fonts, geométricas, amigables, muy legibles en pantallas pequeñas.
- **Iconos:** Lucide (línea, minimalista, esquinas redondeadas) vía CDN — no hay set de iconos propio que copiar.
- **Sin logo:** no se proporcionó ningún logo. El nombre "CoachPal" se muestra siempre como wordmark tipográfico (ver `assets/`). **No se ha inventado ningún logotipo.**

Como no hubo ninguna fuente de verdad (código, Figma) que definiera un inventario de componentes, este sistema sigue el set estándar (Button, Input, Card, Badge, Tabs, Dialog, Toast...) más un puñado de primitivas específicas de tracking de hábitos (anillo de progreso, contador de racha, fila de check diario).

## Producto

Un único producto por ahora: **CoachPal app** (mobile-web, pensada para usarse principalmente en el móvil pero servida como web). Pantallas core: onboarding, home/dashboard de hábitos, detalle de hábito + historial, añadir/editar hábito, perfil/estadísticas/rachas.

## Índice de este proyecto

- `styles.css` — entrypoint global (solo `@import`s).
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`.
- `guidelines/` — specimen cards de fundamentos (Colors, Type, Spacing, Brand).
- `components/` — primitivas React:
  - `forms/` — Button, IconButton, Input, Select, Checkbox, Switch
  - `feedback/` — Badge, Toast, Tooltip
  - `surfaces/` — Card, Dialog, Tabs
  - `habit/` — ProgressRing, StreakBadge, HabitRow, HabitCheckButton, DayMoodRing, IdentityVoteBar, HabitCard
- `ui_kits/coachpal-app/` — recreación clickable de la app (onboarding → home → detalle → añadir hábito → perfil).
- `assets/` — wordmark SVG, ilustraciones genéricas de placeholder.
- `SKILL.md` — versión portable de este sistema como Claude Skill.

## Intentional additions

No había ninguna fuente (codebase/Figma) que definiera un inventario de componentes, así que se construyó el set estándar completo esperado para una app de este tipo: Button, IconButton, Input, Select, Checkbox, Switch (`forms/`), Badge, Toast, Tooltip (`feedback/`), Card, Dialog, Tabs (`surfaces/`). Se añadieron 4 primitivas específicas de CoachPal no incluidas en un set genérico, por ser el corazón funcional del producto: `ProgressRing` (progreso circular diario), `StreakBadge` (contador de racha), `HabitRow` (fila de lista) y `HabitCheckButton` (el control más usado de la app). Tras feedback de producto se sumaron 3 más: `DayMoodRing` (círculo de ánimo/completado por día en el historial), `IdentityVoteBar` (barra de "votos de identidad" estilo James Clear) y `HabitCard` (tarjeta completa de hábito que compone las anteriores).

---

## CONTENT FUNDAMENTALS

**Persona:** CoachPal habla como un amigo que también es tu entrenador — cercano, nunca condescendiente, nunca sargento. Celebra el progreso pequeño tanto como el grande.

- **Trato:** tuteo siempre ("tú", nunca "usted"). Segunda persona directa: "Tu racha", "Hoy te toca...", "Llevas 12 días".
- **Longitud:** frases cortas. Un mensaje, una idea. Nada de párrafos en la UI.
- **Positividad sin negar la realidad:** si se rompe una racha, no se castiga — se reencuadra. Ej: "Se te pasó ayer. Hoy es un buen día para retomarlo." nunca "Has fallado" o "Racha perdida ❌".
- **Verbos de acción, no de estado:** "Marca como hecho", "Empieza tu racha", "Suma un día" — en vez de "Hábito completado exitosamente".
- **Números como protagonistas:** las rachas y streaks se muestran en cifras grandes (`--text-display-lg`), no enterradas en texto. El número ES el mensaje.
- **Emoji:** uso moderado y intencional, solo como refuerzo de un logro (🔥 para racha activa, 🎉 en un hito redondo tipo 30/100 días). Nunca como decoración en botones, títulos o navegación. Nunca más de un emoji por mensaje.
- **Mayúsculas:** solo en microcopy de una palabra (labels de navegación, badges de estado) con `--tracking-wide`. Nunca titulares en mayúsculas.
- **Ejemplos reales de copy:**
  - Título de home: "Hola, Marta 👋" — "Hoy es martes. Vamos a por 3 hábitos."
  - Confirmación: "¡Hecho! Llevas 7 días seguidos."
  - Hábito roto: "Ayer se quedó pendiente. ¿Retomamos hoy?"
  - Botón primario: "Marcar como hecho" / "Añadir hábito" / "Empezar"
  - Botón secundario: "Ahora no" / "Saltar"
  - Vacío (sin hábitos): "Todavía no tienes hábitos. Empieza por uno pequeño."
  - Hito: "🎉 100 días seguidos meditando. Impresionante."

## VISUAL FOUNDATIONS

- **Color:** verde (`--color-brand`) como color de progreso/consistencia — se usa en anillos de progreso completos, checks, y estados "hecho". Ámbar (`--color-accent`) reservado para energía y celebración: rachas activas, fuego de streak, hitos. Coral suave para lo pendiente/roto — nunca rojo puro, para no sentirse punitivo. Fondos cálidos tipo papel (`--sand-100`) en vez de grises fríos — sensación acogedora, no clínica/corporativa.
- **Tipografía:** Manrope para todo lo que sea número o titular (geométrica, con carácter, buena para cifras grandes de racha). Inter para cuerpo de texto y controles de UI (muy legible en tamaños pequeños de móvil). Nunca más de 2 familias.
- **Spacing:** escala de 4px. Las pantallas respiran — mínimo `--space-4` (16px) de margen lateral, `--space-6`/`--space-7` entre secciones. Cards nunca se tocan entre sí (mínimo `--space-3` de gap).
- **Fondos:** planos, sin gradientes decorativos ni imágenes full-bleed genéricas. El único "textural" es el propio color cálido de fondo. Ilustraciones (cuando existan) son simples, de una sola tinta o dos tonos, nunca fotografía de stock.
- **Animación:** micro-interacciones cortas y con propósito. Transiciones de estado (`--duration-fast`/`--duration-base`) con `--ease-standard`. Momentos de logro (completar racha, hito) usan `--ease-out-back` — un rebote sutil, nunca exagerado. Nada de loops decorativos infinitos.
- **Hover (desktop/web):** oscurecer ligeramente el color de fondo (`--color-brand-hover`, `--color-accent-hover`) — nunca cambiar de familia de color. Los botones ghost/texto ganan un fondo `subtle` en hover.
- **Press/active:** ligero scale-down (`transform: scale(0.97)`) + color `-active` un tono más oscuro. Da sensación táctil, apropiado para mobile-web.
- **Bordes:** sutiles y cálidos (`--color-border-subtle/default`), 1px, nunca gruesos. Se usan para separar, no para enmarcar con fuerza — la jerarquía principal viene del fondo y la sombra, no del borde.
- **Sombras:** suaves, cálidas y de bajo contraste (tinte marrón oscuro a baja opacidad, no negro puro) — dan elevación sin sentirse "flotantes" o duras. Ver `--shadow-xs` → `--shadow-lg`.
- **Radios de esquina:** generosos y consistentes — `--radius-md` (14px) en cards y botones, `--radius-lg/xl` en modales y sheets, `--radius-pill` en badges, chips y el botón de check circular. Nada de esquinas vivas (0px) en ningún componente de UI.
- **Cards:** fondo `--color-bg-surface` (blanco cálido), `--radius-md`, `--shadow-sm`, sin borde visible por defecto (el borde solo aparece en estado seleccionado/foco). Padding interno generoso (`--space-5`).
- **Transparencia/blur:** uso puntual — solo en overlays de modal/sheet (fondo `rgba(36,31,25,0.4)` sin blur) y en la barra de navegación inferior si flota sobre contenido (blur sutil `backdrop-filter: blur(12px)` + fondo semitransparente). No se usa glassmorphism decorativo en cards o botones.
- **Layout:** mobile-first, contenedor máximo `--mobile-max-width` (420px) centrado en viewports anchos. Tab bar inferior fija (`--tabbar-height`), header superior fijo simple (`--header-height`), contenido con scroll entre ambos.
- **Imagery:** no hay fotografía de producto real. Cuando se necesite un placeholder de imagen (foto de perfil, ilustración de hábito), usar formas planas de color sólido con iniciales o un icono Lucide centrado — nunca stock genérico gris.

### Semántica de estados de hábito (missed vs overdue)

Para marcar áreas de mejora sin culpar al usuario, CoachPal distingue dos estados negativos con tratamientos distintos:

- **Overdue** (vencido, el día sigue en curso): solo el *nombre* del hábito se pone en `--color-danger`. Es una alerta suave y reversible — el usuario todavía puede completarlo hoy.
- **Missed** (día ya cerrado, nunca se completó): la *tarjeta entera* se tiñe con `--color-danger-subtle` de fondo y borde `--coral-100`, más una etiqueta pequeña "No completado" en mayúsculas. Es un registro histórico, no una alarma — mismo tono coral suave que el resto del sistema, nunca rojo puro ni iconos de "X" agresivos. Sirve para que el usuario identifique patrones (qué hábito falla más) al revisar el calendario o el detalle de un día pasado, no para generar culpa.

- **Sistema:** [Lucide](https://lucide.dev) vía CDN (`lucide` npm/UMD o CDN script) — set de línea, stroke 2px, esquinas redondeadas, sin relleno. Se eligió por ser open-source, consistente en peso visual con Manrope/Inter, y no requerir licencia.
- No existía ningún set de iconos propio del producto que copiar (no había codebase). **Esto es una sustitución documentada**, no una copia de un sistema existente — si el usuario aporta luego un set propio, reemplazar aquí.
- Tamaños estándar: 16px (inline con texto pequeño), 20px (controles de UI, nav), 24px (acciones primarias destacadas).
- Color de icono normalmente hereda `currentColor`; iconos decorativos usan `--color-text-tertiary`.
- **Emoji:** ver Content Fundamentals — uso mínimo y solo como refuerzo emocional en mensajes de logro (🔥🎉), nunca como icono funcional de UI.
- No se usan caracteres unicode como iconos.
- No hay ilustraciones de marca todavía — `assets/` contiene solo el wordmark y placeholders geométricos simples.
