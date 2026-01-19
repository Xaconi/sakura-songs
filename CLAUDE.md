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

### PASO 2: Identificar Tipo de Tarea y Tamaño

| Tamaño | Características | Flujo a seguir |
|--------|----------------|----------------|
| **Pequeña** | < 2 archivos, < 2h, clara | Paso 3: Prompt directo |
| **Mediana** | 2-5 archivos, 2-8h, necesita especificación | Paso 2A: Product Agent → Paso 3 |
| **Grande** | 5+ archivos, 8+ horas, compleja | Paso 2A: Product Agent → Paso 2B: Architect Agent → Paso 3 |

### PASO 2A: Para Features Medianas/Grandes - Product Agent (PRIMERO)

**OBLIGATORIO antes de implementar features medianas o grandes:**

```bash
# Invocar Product Agent para crear PRD
> Usa el product-agent para crear un PRD para [FEATURE]
```

El Product Agent:
- ✅ Hará preguntas exhaustivas (5-15 preguntas mínimo)
- ✅ Explorará edge cases, limitaciones, prioridades
- ✅ Generará PRD completo SOLO después de tener todas las respuestas
- ✅ Creará automáticamente el archivo en `.claude/features/[NOMBRE]-PRD.md`
- ✅ Reportará la ubicación del archivo al finalizar

**⚠️ IMPORTANTE:** El Product Agent NUNCA genera un PRD sin antes hacer preguntas. Si lo hace, es un error.

**Resultado:** Archivo PRD en `.claude/features/[NOMBRE]-PRD.md` creado automáticamente.

### PASO 2B: Para Features Grandes - Architect Agent (SEGUNDO)

**OBLIGATORIO para features grandes (después del PRD):**

```bash
# Invocar Architect Agent para dividir en tareas
> Usa el architect-agent con el PRD en .claude/features/[NOMBRE]-PRD.md
```

El Architect Agent:
- ✅ Lee el PRD
- ✅ Analiza la arquitectura existente
- ✅ Divide en subtareas ejecutables (2-4h cada una)
- ✅ Establece orden y dependencias
- ✅ Define criterios de aceptación por tarea
- ✅ Crea automáticamente el archivo en `.claude/features/[NOMBRE]-PLAN.md`
- ✅ Reporta la ubicación del archivo al finalizar

**Resultado:** Plan de implementación en `.claude/features/[NOMBRE]-PLAN.md` creado automáticamente.

### PASO 3: Identificar y Leer el Prompt según la tarea

| Tipo de tarea | Prompt a leer |
|---------------|---------------|
| Nueva feature | `.claude/prompts/prompt-create-feature.md` + PRD (si existe) |
| Refactor | `.claude/prompts/prompt-refactor-code.md` |
| Bug fix | `.claude/prompts/prompt-fix-bug.md` |
| Tests | `.claude/prompts/prompt-generate-tests.md` |
| Code review | `.claude/prompts/prompt-code-review.md` |

### PASO 4: Durante Implementación, usar Skills en ESTE ORDEN

**Skills disponibles (se activan automáticamente):**

| Skill | Ruta | Cuándo se activa |
|-------|------|------------------|
| Frontend | `.claude/skills/frontend-specialist/SKILL.md` | Componentes React, hooks, estado, CSS, UI |
| Backend | `.claude/skills/backend-specialist/SKILL.md` | APIs, base de datos, servidor, backend puro |
| Code Reviewer | `.claude/skills/code-reviewer/SKILL.md` | Después de implementar código |
| Testing | `.claude/skills/testing-specialist/SKILL.md` | Generar/actualizar tests |
| QA | `.claude/skills/qa-specialist/SKILL.md` | Validación final |
| Product | `.claude/skills/product-agent/SKILL.md` | Usado por Product Agent |
| Architect | `.claude/skills/architect-agent/SKILL.md` | Usado por Architect Agent |

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

---

## 🤖 SISTEMA DE AGENTES

Los agentes complementan el workflow normal, proporcionando **consultoría experta** cuando la necesitas.

### Agentes Disponibles

| Agente | Ubicación | Cuándo invocar manualmente |
|--------|-----------|----------------------------|
| **Product Agent** | `.claude/agents/product-agent.md` | Para crear PRDs de features medianas/grandes |
| **Architect Agent** | `.claude/agents/architect-agent.md` | Para dividir features grandes en subtareas |
| **Frontend Agent** | `.claude/agents/frontend-agent.md` | Consultas sobre React, hooks, componentes, CSS |
| **Backend Agent** | `.claude/agents/backend-agent.md` | Consultas sobre Node.js, APIs, arquitectura backend |
| **Code Review Agent** | `.claude/agents/code-review-agent.md` | Revisiones ad-hoc, segunda opinión |
| **Testing Agent** | `.claude/agents/testing-agent.md` | Estrategia de testing, debugging tests |
| **QA Agent** | `.claude/agents/qa-agent.md` | Validación exhaustiva pre-release |

### Diferencia: Skills vs Agentes

**Skills** (automáticas):
- Se activan automáticamente durante workflows
- Aportan expertise en background
- Parte del proceso de implementación

**Agentes** (consultivos):
- Se invocan manualmente cuando necesitas expertise
- Tienen contexto separado
- Para consultas, planificación, o validación profunda

### Cómo Invocar Agentes

**Invocación Explícita:**
```bash
> Usa el frontend-agent para revisar mi componente Carousel
> Usa el product-agent para crear un PRD de sistema de playlists
> Usa el architect-agent para dividir esta feature en tareas
```

**Invocación Automática:**
Los agentes pueden ser invocados automáticamente por Claude Code si detecta que son relevantes para tu pregunta.

**Via Comando:**
```bash
/agents  # Ver lista de agentes disponibles
```

### Ejemplos de Uso

**Consulta Frontend:**
```
> Tengo dudas sobre cómo optimizar el rendering de useAudioPlayer. 
  Usa el frontend-agent para asesorarme.
```

**Crear PRD:**
```
> Quiero añadir un sistema de favoritos. Usa el product-agent para 
  crear un PRD (y asegúrate de que me haga muchas preguntas).
```

**Dividir Feature:**
```
> Tengo el PRD del sistema de favoritos. Usa el architect-agent 
  para crear el plan de implementación por tareas.
```

**Validación Pre-Release:**
```
> Voy a hacer deploy. Usa el qa-agent para validación exhaustiva 
  del sistema de playlists.
```

---

## 📋 FLUJOS COMPLETOS POR TAMAÑO

### Feature PEQUEÑA (< 2 archivos, < 2h)

```
1. Leer contextos (.claude/contexts/*.md)
2. Leer prompt apropiado (.claude/prompts/*)
3. Implementar usando workflow del prompt
4. Skills se activan automáticamente:
   - Desarrollo (frontend/backend)
   - Code Review
   - Testing
   - QA
```

### Feature MEDIANA (2-5 archivos, 2-8h)

```
1. Leer contextos (.claude/contexts/*.md)
2. PRODUCT AGENT → Generar PRD
   > Usa el product-agent para crear PRD de [FEATURE]
   (Responder todas sus preguntas)
3. Leer prompt apropiado + PRD generado
4. Implementar usando workflow del prompt con PRD como referencia
5. Skills se activan automáticamente
```

### Feature GRANDE (5+ archivos, 8+ horas)

```
1. Leer contextos (.claude/contexts/*.md)
2. PRODUCT AGENT → Generar PRD
   > Usa el product-agent para crear PRD de [FEATURE]
   (Responder todas sus preguntas)
3. ARCHITECT AGENT → Dividir en tareas
   > Usa el architect-agent con el PRD para crear plan
4. Por cada subtarea del plan:
   a. Leer prompt apropiado
   b. Implementar subtarea
   c. Skills se activan automáticamente
   d. Checkpoint (validar antes de continuar)
5. Integración final
6. QA Agent (opcional) para validación exhaustiva
```

---

## Resumen del Flujo Completo

```
1. CONTEXTOS (siempre primero)
   └─→ Leer todos los .claude/contexts/*.md

2. PLANIFICACIÃ"N (según tamaño)
   ├─→ Pequeña: Skip a paso 3
   ├─→ Mediana: Product Agent (PRD)
   └─→ Grande: Product Agent (PRD) → Architect Agent (plan)

3. PROMPT (según tarea)
   └─→ Leer el prompt apropiado de .claude/prompts/
   └─→ Si hay PRD/plan, usarlo como referencia
   └─→ Seguir el workflow definido en el prompt

4. SKILLS (durante fase de implementación del prompt)
   └─→ a) Desarrollo: frontend-specialist O backend-specialist
   └─→ b) Code Review: code-reviewer
   └─→ c) Testing: testing-specialist
   └─→ d) QA: qa-specialist

5. AGENTES CONSULTIVOS (cuando necesites)
   └─→ Invocar manualmente para consultas, revisiones profundas, etc.
```

**IMPORTANTE:** 
- Los **prompts** definen el workflow completo (git, fases, checkpoints)
- Los **skills** se activan automáticamente durante implementación
- Los **agentes** se invocan manualmente para consultoría experta
- El **Product Agent** SIEMPRE hace preguntas antes de generar PRD
- El **Architect Agent** divide features grandes en subtareas ejecutables

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
├── .claude/                 # Configuración de Claude Code
│   ├── agents/              # Agentes consultivos
│   │   ├── product-agent.md
│   │   ├── architect-agent.md
│   │   ├── frontend-agent.md
│   │   ├── backend-agent.md
│   │   ├── code-review-agent.md
│   │   ├── testing-agent.md
│   │   └── qa-agent.md
│   ├── contexts/            # Contextos del proyecto
│   │   ├── project-context.md
│   │   ├── coding-standards.md
│   │   ├── architecture-guidelines.md
│   │   └── testing-strategy.md
│   ├── features/            # PRDs de features
│   │   └── [NOMBRE]-PRD.md
│   ├── prompts/             # Workflow prompts
│   │   ├── prompt-create-feature.md
│   │   ├── prompt-refactor-code.md
│   │   ├── prompt-fix-bug.md
│   │   ├── prompt-generate-tests.md
│   │   └── prompt-code-review.md
│   └── skills/              # Skills especializadas
│       ├── frontend-specialist/
│       │   └── SKILL.md
│       ├── backend-specialist/
│       │   └── SKILL.md
│       ├── code-reviewer/
│       │   └── SKILL.md
│       ├── testing-specialist/
│       │   └── SKILL.md
│       ├── qa-specialist/
│       │   └── SKILL.md
│       ├── product-agent/
│       │   └── SKILL.md
│       └── architect-agent/
│           └── SKILL.md
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes React
│   │   ├── Carousel/
│   │   ├── Controls/
│   │   ├── SceneIndicator/
│   │   └── SleepTimer/
│   ├── config/
│   │   └── cloudinary.js
│   ├── data/
│   │   └── scenes.js
│   ├── hooks/
│   │   ├── useAudioPlayer.js
│   │   ├── useDrag.js
│   │   └── useSleepTimer.js
│   ├── test/
│   │   └── setup.ts
│   ├── utils/
│   │   └── ambientGenerator.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── docs/
│   └── features/
├── CLAUDE.md            # Este archivo
├── CHANGELOG.md
├── package.json
├── vite.config.js
└── vitest.config.ts
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
- **Último commit**: Initial commit: Sakura Songs relaxing music player

## Consideraciones de Desarrollo

1. **Audio**: Archivos de audio alojados en Cloudinary para distribución optimizada
2. **Imágenes**: Se usan imágenes de Unsplash como placeholders
3. **Responsive**: Diseñado mobile-first con soporte táctil
4. **Browser Policy**: Requiere interacción del usuario para iniciar audio (política del navegador)
5. **Idioma**: La aplicación está en español

## Opciones de Usuario para Skills/Agentes

El usuario puede modificar el comportamiento:
- **"Skip sub-agentes"** → Implementar sin consultarlos
- **"Modo detallado"** → Mostrar razonamiento completo
- **"Solo implementa"** → Sin code review ni testing automático

## Cambios Triviales (Skip Skills y Agentes)

Para cambios triviales, NO usar skills ni agentes:
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