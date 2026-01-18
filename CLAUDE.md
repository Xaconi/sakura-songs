# CLAUDE.md - Contexto del Proyecto Sakura Songs

---

## ⚠️ FLUJO OBLIGATORIO - LEER PRIMERO

**Este flujo es OBLIGATORIO en CADA sesión, sin excepciones.**

### PASO 1: Leer Contextos (SIEMPRE, antes de cualquier acción)

```
.claude/contexts/
├── project-context.md      ← Descripción del proyecto
├── coding-standards.md     ← Estándares de código
├── architecture-guidelines.md ← Arquitectura
└── testing-strategy.md     ← Estrategia de testing
```

### PASO 2: Identificar y Leer el Prompt según la tarea

| Tipo de tarea | Prompt a leer |
|---------------|---------------|
| Nueva feature | `.claude/prompts/prompt-create-feature.md` + `.claude/features/[NOMBRE].md` |
| Refactor | `.claude/prompts/prompt-refactor-code.md` |
| Bug fix | `.claude/prompts/prompt-fix-bug.md` |
| Tests | `.claude/prompts/prompt-generate-tests.md` |
| Code review | `.claude/prompts/prompt-code-review.md` |

### PASO 3: Durante Implementación, usar Skills en ESTE ORDEN

**Skills disponibles:**

| Skill | Ruta | Cuándo usar |
|-------|------|-------------|
| Frontend | `.claude/skills/frontend-specialist/SKILL.md` | Componentes React, hooks, estado, CSS, UI |
| Backend | `.claude/skills/backend-specialist/SKILL.md` | APIs, base de datos, servidor, backend puro |
| Code Reviewer | `.claude/skills/code-reviewer/SKILL.md` | Después de implementar código |
| Testing | `.claude/skills/testing-specialist/SKILL.md` | Generar/actualizar tests |
| QA | `.claude/skills/qa-specialist/SKILL.md` | Validación final |

**Workflow de Implementación (orden estricto):**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DESARROLLO (elegir según el tipo de cambio)              │
│    ├─ Frontend (React, hooks, estado, CSS, UI)              │
│    │  → .claude/skills/frontend-specialist/SKILL.md         │
│    └─ Backend (APIs, DB, servidor)                          │
│       → .claude/skills/backend-specialist/SKILL.md          │
├─────────────────────────────────────────────────────────────┤
│ 2. CODE REVIEW (siempre después de implementar)             │
│    → .claude/skills/code-reviewer/SKILL.md                  │
│    → Revisar código, corregir issues encontrados            │
├─────────────────────────────────────────────────────────────┤
│ 3. TESTING (después del code review)                        │
│    → .claude/skills/testing-specialist/SKILL.md             │
│    → Generar/actualizar tests para el código nuevo          │
├─────────────────────────────────────────────────────────────┤
│ 4. QA (validación final)                                    │
│    → .claude/skills/qa-specialist/SKILL.md                  │
│    → Validar edge cases, UX, accesibilidad                  │
└─────────────────────────────────────────────────────────────┘
```

### Resumen del Flujo Completo

```
1. CONTEXTOS (siempre primero)
   └─→ Leer todos los .claude/contexts/*.md

2. PROMPT (según tarea)
   └─→ Leer el prompt apropiado de .claude/prompts/
   └─→ Seguir el workflow definido en el prompt

3. SKILLS (durante fase de implementación del prompt)
   └─→ a) Desarrollo: frontend-specialist O backend-specialist
   └─→ b) Code Review: code-reviewer
   └─→ c) Testing: testing-specialist
   └─→ d) QA: qa-specialist
```

**IMPORTANTE:** Los prompts definen el workflow completo (git, fases, checkpoints). Los skills solo se usan durante la fase de implementación de código.

---

## Descripción General

**Sakura Songs** es una aplicación web de reproductor de música relajante diseñada para proporcionar paz interior. Es una SPA (Single Page Application) construida con React que presenta diferentes escenas visuales acompañadas de música ambiente.

## Stack Tecnológico

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Testing**: Vitest 1.0.4 + Testing Library
- **Lenguaje**: JavaScript (JSX) + TypeScript (config)
- **Audio Library**: Howler.js 2.2.4
- **Gestures**: Hook personalizado useDrag (sin librerías externas)
- **Estilos**: CSS puro (sin frameworks)
- **Audio Hosting**: Cloudinary

## Estructura del Proyecto

```
sakura-songs/
├── public/              # Archivos estáticos (audio, favicon, etc.)
├── src/
│   ├── components/      # Componentes React
│   │   ├── Carousel/    # Carrusel de escenas con swipe
│   │   │   ├── Carousel.css
│   │   │   ├── Carousel.jsx
│   │   │   └── Carousel.test.jsx
│   │   ├── Controls/    # Panel de controles de reproducción
│   │   │   ├── Controls.css
│   │   │   └── Controls.jsx
│   │   ├── SceneIndicator/ # Indicadores de escena (dots)
│   │   │   ├── SceneIndicator.css
│   │   │   └── SceneIndicator.jsx
│   │   └── SleepTimer/  # Sistema de temporizador de sueño
│   │       ├── SleepTimerBadge.css
│   │       ├── SleepTimerBadge.jsx
│   │       ├── SleepTimerBadge.test.jsx
│   │       ├── SleepTimerModal.css
│   │       ├── SleepTimerModal.jsx
│   │       └── SleepTimerModal.test.jsx
│   ├── config/
│   │   └── cloudinary.js # Configuración de Cloudinary para audio
│   ├── data/
│   │   └── scenes.js     # Configuración de escenas (imágenes, audio)
│   ├── hooks/
│   │   ├── useAudioPlayer.js     # Hook para reproducción de audio
│   │   ├── useAudioPlayer.test.js
│   │   ├── useDrag.js            # Hook personalizado para gestos de drag/swipe
│   │   ├── useDrag.test.js
│   │   ├── useSleepTimer.js      # Hook para gestión del temporizador
│   │   └── useSleepTimer.test.js
│   ├── test/
│   │   └── setup.ts      # Configuración de tests
│   ├── utils/
│   │   └── ambientGenerator.js # Utilidades para audio generativo
│   ├── App.jsx           # Componente principal
│   ├── App.css           # Estilos principales
│   ├── App.test.jsx      # Tests del componente principal
│   ├── main.jsx          # Punto de entrada
│   └── index.css         # Estilos globales
├── docs/
│   └── features/         # Documentación de características
├── index.html            # HTML base
├── package.json          # Dependencias y scripts
├── vite.config.js        # Configuración de Vite
├── vitest.config.ts      # Configuración de tests
└── CHANGELOG.md          # Registro de cambios

```

## Conceptos Clave

### Escenas
El proyecto organiza el contenido en **escenas** que representan diferentes momentos del día:
- **Amanecer (day)**: Paisaje de montaña al amanecer
- **Atardecer (sunset)**: Atardecer sobre el mar
- **Noche (night)**: Cielo estrellado

Cada escena tiene:
- `id`: Identificador único
- `name`: Nombre descriptivo
- `image`: URL de imagen de fondo (Unsplash)
- `gradient`: Gradiente CSS alternativo
- `tracks`: Array de pistas de audio asociadas

### Arquitectura de Audio
- Usa **Howler.js** para reproducción de audio
- Sistema de audio ambiente con transiciones suaves
- Soporte para múltiples tracks por escena
- Gestión de estado de reproducción (playing, loading, paused)
- **Audio hosting en Cloudinary** para distribución optimizada
- Playlist global con tracks de Calmly

### Sistema de Navegación
- **Carrusel con swipe**: Navegación táctil entre escenas
- **Controles**: Botones prev/next para cambiar escenas
- **Indicadores**: Dots interactivos para selección directa

## Componentes Principales

### App.jsx (src/App.jsx)
Componente raíz que orquesta toda la aplicación:
- Gestiona el estado de la escena actual
- Conecta el reproductor de audio con las escenas
- Coordina los componentes de UI

### Carousel (src/components/Carousel/Carousel.jsx)
- Renderiza las escenas en un layout de carrusel
- Soporta gestos de swipe (táctil/mouse)
- Muestra imágenes de fondo con overlays

### Controls (src/components/Controls/Controls.jsx)
Panel de control inferior con:
- Botón play/pause
- Navegación prev/next de escenas
- Display de track actual y nombre de escena
- Indicador de carga

### SleepTimer (src/components/SleepTimer/)
Sistema completo de temporizador de sueño:
- **SleepTimerModal**: Modal responsive para configuración del timer
- **SleepTimerBadge**: Badge flotante con countdown visible
- Presets: 15, 30, 45, 60, 90 minutos
- Input personalizado (1-480 minutos)
- Fade-out gradual de 5 segundos
- Mensaje "Dulces sueños" al finalizar

### useDrag (src/hooks/useDrag.js)
Hook personalizado para gestos de drag y swipe:
- Detecta movimientos táctiles y de mouse
- Soporta umbrales configurables para activar acciones
- Implementa lógica de carrusel sin dependencias externas

### useSleepTimer (src/hooks/useSleepTimer.js)
Hook para gestión del temporizador de sueño:
- Controla countdown y fade-out automático
- Gestiona presets de tiempo y entrada personalizada
- Coordina con el reproductor de audio

## Archivos Importantes

- **src/data/scenes.js**: Define todas las escenas y sus recursos
- **src/App.jsx**: Lógica principal de la aplicación
- **src/hooks/useAudioPlayer.js**: Lógica de reproducción de audio
- **src/config/cloudinary.js**: Configuración de Cloudinary para audio
- **vitest.config.ts**: Configuración del framework de testing
- **src/test/setup.ts**: Configuración de tests
- **CHANGELOG.md**: Registro de cambios del proyecto
- **package.json**: Dependencias y scripts npm
- **index.html**: Configuración HTML, meta tags, fuentes

## Scripts Disponibles

```bash
npm run dev         # Inicia servidor de desarrollo (Vite)
npm run build       # Build para producción
npm run preview     # Preview del build de producción
npm run test        # Ejecuta tests una vez
npm run test:watch  # Ejecuta tests en modo watch
npm run test:coverage # Ejecuta tests con reporte de cobertura
```

## Estado del Proyecto

- **Versión**: 1.0.0
- **Branch principal**: master
- **Branch de desarrollo**: claude/add-claude-md-uSiYx
- **Último commit**: Initial commit: Sakura Songs relaxing music player

## Nuevas Características Recientes

### Sleep Timer (Temporizador de Sueño)
- **Funcionalidad**: Permite programar la detención automática de la música
- **Presets**: 15, 30, 45, 60, 90 minutos
- **Personalización**: Input para tiempo personalizado (1-480 minutos)
- **UX**: Countdown visible en badge flotante, fade-out gradual de 5 segundos
- **Responsive**: Modal bottom-sheet en móvil, flotante en desktop
- **Testing**: 56 tests unitarios completos

### Sistema de Testing
- **Framework**: Vitest con Testing Library
- **Cobertura**: Tests para componentes, hooks y utilidades
- **Configuración**: Setup personalizado con jsdom para DOM testing
- **Scripts**: test, test:watch, test:coverage

### Integración Cloudinary
- **Audio Hosting**: Migración de archivos locales a Cloudinary
- **Beneficios**: Distribución optimizada, CDN global
- **Tracks**: Playlist global con 7 tracks de Calmly

### Hook useDrag Personalizado
- **Reemplazo**: Sustituye react-swipeable por implementación propia
- **Ventajas**: Sin dependencias externas, más ligero
- **Funcionalidad**: Gestos de drag/swipe para navegación de carrusel

## Consideraciones de Desarrollo

1. **Audio**: Archivos de audio alojados en Cloudinary para distribución optimizada
2. **Imágenes**: Se usan imágenes de Unsplash como placeholders
3. **Responsive**: Diseñado mobile-first con soporte táctil
4. **Browser Policy**: Requiere interacción del usuario para iniciar audio (política del navegador)
5. **Idioma**: La aplicación está en español

## Opciones de Usuario para Skills

El usuario puede modificar el comportamiento de los skills:
- **"Skip sub-agentes"** → Implementar sin consultarlos
- **"Modo detallado"** → Mostrar razonamiento completo de cada sub-agente
- **"Solo implementa"** → Sin code review ni testing automático

## Cambios Triviales (Skip Skills)

Para cambios triviales, NO usar skills:
- Typos en strings o comentarios
- Eliminar archivos no usados
- Cambios de configuración sin código
- Ajustar estilos CSS simples

## Límites de Tokens

- **Lectura inicial:** Máximo 15K tokens
- **Planificación:** Máximo 5K tokens
- **Implementación por fase:** Máximo 15K tokens
- **Implementación total:** Máximo 60K tokens
- **Documentación:** Máximo 10K tokens

## Scope Restrictions

**Excluir siempre:** `node_modules/`, `dist/`, `build/`, `coverage/`

## Git Workflow

1. `git checkout master`
2. `git pull origin master`
3. `git checkout -b feature/[NOMBRE]`
4. Commits con conventional commits
5. NO auto-push (requiere confirmación)

## Comportamiento

- ✅ Preguntar antes de cambios mayores
- ✅ Mostrar plan antes de implementar
- ✅ Checkpoint después de cada fase
- ✅ Aplicar coding standards automáticamente
- ❌ NO ser verboso (modo conciso)