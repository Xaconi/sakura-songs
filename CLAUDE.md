# CLAUDE.md - Contexto del Proyecto Sakura Songs

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

## Contextos Activos

Claude Code SIEMPRE debe leer estos archivos antes de cualquier tarea:

- `.claude/contexts/project-context.md` - Descripción del proyecto
- `.claude/contexts/coding-standards.md` - Estándares de código
- `.claude/contexts/architecture-guidelines.md` - Arquitectura del proyecto
- `.claude/contexts/testing-strategy.md` - Estrategia de testing
- `.claude/features/[FEATURE].md` - Requisitos de la feature actual (cuando aplique)

## 🤖 WORKFLOW AUTOMÁTICO INTELIGENTE

### Principio Fundamental

**Por defecto, TODO cambio de código sigue un workflow multi-fase con sub-agentes especializados**, a menos que:
1. El usuario explícitamente indique lo contrario
2. Claude detecte que el cambio es TRIVIAL (ver criterios abajo)

### Detección Automática de Cambios Triviales

Claude debe **evaluar primero** si el cambio solicitado es trivial. Si lo es, **SALTAR el workflow completo** y avisar en consola.

#### ✅ Cambios TRIVIALES (skip workflow):

**Correcciones menores de texto:**
- Typos en comentarios, strings, documentación
- Corrección de gramática o ortografía
- Cambios de puntuación o formato de texto

**Eliminaciones sin impacto:**
- Borrar archivos no utilizados (imports, assets, código muerto)
- Eliminar console.logs o debuggers
- Remover comentarios obsoletos o TODO completados

**Cambios de configuración triviales:**
- Actualizar README con info sin código
- Modificar .gitignore
- Cambiar título de HTML o meta tags
- Actualizar versión en package.json (sin cambios de código)

**Refactors cosméticos:**
- Renombrar variables para claridad (sin cambiar lógica)
- Reordenar imports alfabéticamente
- Formatear código (prettier, indentación)
- Añadir/quitar líneas en blanco

**Cambios de estilo puro:**
- Ajustar colores, espaciados, tamaños de fuente
- Cambiar CSS que no afecta funcionalidad
- Modificar transiciones o animaciones sutiles

#### ⚠️ Cambios NO TRIVIALES (ejecutar workflow):

- Cualquier cambio en lógica de negocio
- Nuevas funcionalidades o features
- Modificaciones en APIs o interfaces
- Cambios que afecten comportamiento
- Refactorings arquitectónicos
- Correcciones de bugs lógicos
- Cambios que requieran testing
- Modificaciones en hooks o state management

### Output para Cambios Triviales

Cuando Claude detecte un cambio trivial, debe:

```
⚡ CAMBIO TRIVIAL DETECTADO - WORKFLOW SALTADO

Tipo: [Typo fix / File deletion / Config update / etc]
Razón: [Breve explicación de por qué es trivial]

Cambios realizados:
- [Lista de cambios]

✅ Completado sin ejecutar workflow multi-fase
```

### Workflow Multi-Fase (Cambios NO Triviales)

Para cambios que **NO son triviales**, ejecutar TODAS estas fases en secuencia:

#### FASE 1: IMPLEMENTACIÓN
**Determinar el especialista necesario:**

- **Frontend changes** → Leer `/mnt/skills/user/frontend-specialist.md`
  - Cambios en componentes React
  - Modificaciones de UI/UX
  - Estilos o diseño
  
- **Backend changes** → Leer `/mnt/skills/user/backend-specialist.md`
  - APIs, servicios, lógica de negocio
  - Data layer, integración con Cloudinary
  - Hooks de estado o side effects
  
- **Mixed changes** → Leer ambos skills

**Ejecutar implementación siguiendo:**
1. El expertise del especialista
2. Coding standards de los contextos activos
3. Architecture guidelines del proyecto

**Output esperado:**
```
🔧 IMPLEMENTACIÓN [Frontend/Backend Specialist]

Análisis:
- [Qué se necesita implementar]
- [Decisiones de diseño tomadas]

Archivos modificados:
- [Lista de archivos]

Cambios realizados:
- [Descripción de cambios]
```

#### FASE 2: CODE REVIEW
**Obligatorio después de implementación:**

- Leer `/mnt/skills/user/code-reviewer.md`
- Aplicar checklist completo de revisión
- Si se encuentran issues → CORREGIRLOS antes de continuar
- Documentar decisiones tomadas

**Output esperado:**
```
✅ CODE REVIEW [Code Reviewer]

Revisión completada:
✓ [Aspecto revisado - OK]
✓ [Aspecto revisado - OK]
⚠️ [Issue encontrado - CORREGIDO]
✓ [Verificación final - OK]

Decisiones documentadas:
- [Decisión 1]
- [Decisión 2]
```

#### FASE 3: TESTING
**Obligatorio después de code review:**

- Leer `/mnt/skills/user/testing-specialist.md`
- Generar/actualizar tests según testing strategy
- Asegurar coverage del código nuevo/modificado
- Simular ejecución de tests

**Output esperado:**
```
🧪 TESTING [Testing Specialist]

Tests generados/actualizados:
- [Archivo de test 1]
- [Archivo de test 2]

Coverage:
- [Componente/función]: X%
- [Total estimado]: Y%

Tests incluidos:
- [Test case 1]
- [Test case 2]
```

#### FASE 4: QA VALIDATION
**Obligatorio después de testing:**

- Leer `/mnt/skills/user/qa-specialist.md`
- Validar requisitos funcionales
- Verificar edge cases
- Revisar UX/accesibilidad

**Output esperado:**
```
🎯 QA VALIDATION [QA Specialist]

Validaciones:
✓ [Requisito funcional 1]
✓ [Edge case verificado]
✓ [Accesibilidad verificada]
✓ [UX validada]

Edge cases considerados:
- [Caso 1]
- [Caso 2]
```

#### FASE 5: DOCUMENTATION
**Paso final:**

- Leer `/mnt/skills/user/documentation-specialist.md`
- Actualizar documentación relevante
- Actualizar JSDoc/comentarios si necesario
- Registrar en CHANGELOG si es cambio significativo

**Output esperado:**
```
📚 DOCUMENTATION [Documentation Specialist]

Documentación actualizada:
- [Archivo 1]: [Qué se actualizó]
- [Archivo 2]: [Qué se actualizó]

CHANGELOG:
- [Entrada añadida / No requiere entrada]
```

### Resumen Final del Workflow

Al completar TODAS las fases, Claude debe mostrar:

```
─────────────────────────────────
✨ WORKFLOW MULTI-FASE COMPLETADO

Fases ejecutadas:
✅ Implementación [Frontend Specialist]
✅ Code Review [Code Reviewer]
✅ Testing [Testing Specialist]
✅ QA Validation [QA Specialist]
✅ Documentation [Documentation Specialist]

Estado: LISTO PARA COMMIT
Archivos modificados: [número]
Tests añadidos/actualizados: [número]
Coverage estimado: [porcentaje]
─────────────────────────────────
```

### Comandos de Override del Usuario

El usuario puede saltarse el workflow con:

- `"Skip workflow"` → Solo implementación, sin fases
- `"Skip testing"` → Saltar fase 3
- `"Skip review"` → Saltar fase 2 (NO RECOMENDADO)
- `"Quick fix"` → Solo fases 1-2
- `"Just implement"` → Solo fase 1

Cualquier otro comando personalizado será respetado.

### Notas de Ejecución

- ⚠️ Si alguna fase FALLA, DETENER y reportar
- ✅ Cada fase debe completarse antes de pasar a la siguiente
- 📊 Mantener transparencia total en cada paso
- 🎯 La detección de trivialidad es responsabilidad de Claude
- 💬 En caso de duda sobre trivialidad, preguntar al usuario

## Límites de Tokens

- **Lectura inicial:** Máximo 15K tokens
- **Planificación:** Máximo 5K tokens
- **Implementación por fase:** Máximo 15K tokens
- **Implementación total:** Máximo 60K tokens
- **Documentación:** Máximo 10K tokens

## Scope Restrictions

### Lectura Inicial
**SOLO leer:**
- Archivos `.md` en `.claude/`
- NO leer código del proyecto todavía

**Excluir siempre:**
- `node_modules/`
- `dist/`
- `build/`
- `coverage/`

### Análisis de Código
- SOLO durante fase de integración
- SOLO archivos específicos necesarios

## Workflows

### Feature Implementation
1. Leer `.claude/prompts/prompt-create-feature.md`
2. Leer `.claude/features/[NOMBRE].md`
3. Seguir el workflow paso a paso
4. Checkpoints en cada fase

### Refactor
1. Leer `.claude/prompts/prompt-refactor-code.md`
2. Seguir el workflow paso a paso
3. Checkpoints en cada fase

### Testing
- Framework: Vitest
- Coverage mínimo: 70%
- Seguir `.claude/prompts/prompt-generate-tests.md`
- Generar tests automáticamente después de implementar

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