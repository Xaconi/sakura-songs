# CLAUDE.md - Sistema Multi-Agente Sakura Songs

---

## 🚨 INSTRUCCIÓN CRÍTICA - LEER ESTO PRIMERO

**Cada vez que inicies una sesión o recibas una nueva tarea, DEBES seguir este proceso en orden:**

### PASO 0: Identificar el tipo de tarea

Antes de hacer CUALQUIER cosa, clasifica la tarea:

| Tipo | Características | Workflow a seguir |
|------|----------------|-------------------|
| **Bug Fix / Debugging** | Resolver problema existente | → Workflow Bug Fix (ver sección §1) |
| **Feature Pequeña** | < 2 archivos, < 2h, clara | → Workflow Feature Pequeña (ver sección §2) |
| **Feature Mediana** | 2-5 archivos, 2-8h, necesita PRD | → Workflow Feature Mediana (ver sección §3) |
| **Feature Grande** | 5+ archivos, 8+ horas, compleja | → Workflow Feature Grande (ver sección §4) |
| **Refactoring** | Mejora de código sin nueva funcionalidad | → Workflow Refactoring (ver sección §5) |
| **Testing** | Crear/actualizar tests | → Workflow Testing (ver sección §6) |
| **Code Review** | Revisar código existente | → Workflow Code Review (ver sección §7) |

**⚠️ IMPORTANTE**: Una vez identificado el tipo, ve DIRECTAMENTE a la sección correspondiente y sigue su workflow COMPLETO.

---

## §1. WORKFLOW: BUG FIX / DEBUGGING

**Este workflow es OBLIGATORIO para resolver bugs.**

### Paso 1.1: Leer Contextos (SIEMPRE primero)
```
DEBES leer estos archivos en orden:
1. .claude/contexts/project-context.md
2. .claude/contexts/architecture-guidelines.md
3. .claude/contexts/coding-standards.md
```

### Paso 1.2: Leer el Prompt de Bug Fix
```
LEE: .claude/prompts/prompt-fix-bug.md
Este archivo contiene el workflow específico para debugging
```

### Paso 1.3: Ejecutar Product Agent (OBLIGATORIO)

**NO saltes este paso. El Product Agent debe analizar el bug primero.**

```
PROCESO OBLIGATORIO:
1. LEE: .claude/agents/product-agent.md
2. LEE: .claude/skills/product-agent/SKILL.md
3. EJECUTA el análisis del bug:
   - Hacer preguntas clarificadoras (mínimo 3-5)
   - Identificar el impacto
   - Definir criterios de éxito
   - Generar PRD del bug en .claude/features/bug-[NOMBRE]-PRD.md
```

**Resultado esperado**: Archivo PRD creado en `.claude/features/bug-[NOMBRE]-PRD.md`

### Paso 1.4: Ejecutar Architect Agent (OBLIGATORIO)

**El Architect Agent investiga la causa raíz.**

```
PROCESO OBLIGATORIO:
1. LEE: .claude/agents/architect-agent.md
2. LEE: .claude/skills/architect-agent/SKILL.md
3. LEE el PRD generado: .claude/features/bug-[NOMBRE]-PRD.md
4. EJECUTA la investigación:
   - Analizar archivos relevantes del codebase
   - Formular hipótesis sobre causas raíz
   - Identificar archivos a modificar
   - Crear plan de fix en .claude/features/bug-[NOMBRE]-PLAN.md
```

**Resultado esperado**: Plan de implementación en `.claude/features/bug-[NOMBRE]-PLAN.md`

### Paso 1.5: Implementar Fix

```
SEGÚN EL TIPO DE CÓDIGO A MODIFICAR:

Frontend (React, componentes, hooks, UI):
1. LEE: .claude/agents/frontend-agent.md
2. LEE: .claude/skills/frontend-specialist/SKILL.md
3. Implementa el fix siguiendo el plan

Backend (APIs, lógica, servidor):
1. LEE: .claude/agents/backend-agent.md
2. LEE: .claude/skills/backend-specialist/SKILL.md
3. Implementa el fix siguiendo el plan
```

### Paso 1.6: Code Review (OBLIGATORIO)

```
DESPUÉS de implementar:
1. LEE: .claude/agents/code-review-agent.md
2. LEE: .claude/skills/code-reviewer/SKILL.md
3. Revisa el código implementado
4. Corrige cualquier issue encontrado
```

### Paso 1.7: Testing (OBLIGATORIO)

```
DESPUÉS del code review:
1. LEE: .claude/agents/testing-agent.md
2. LEE: .claude/skills/testing-specialist/SKILL.md
3. Crea/actualiza tests para el bug fix
4. Verifica que no hay regresiones
```

### Paso 1.8: QA Final (OBLIGATORIO)

```
VALIDACIÓN final:
1. LEE: .claude/agents/qa-agent.md
2. LEE: .claude/skills/qa-specialist/SKILL.md
3. Valida:
   - El bug está resuelto
   - No hay regresiones
   - Edge cases cubiertos
   - Código cumple estándares
```

**✅ COMPLETADO**: Bug fix terminado y validado.

---

## §2. WORKFLOW: FEATURE PEQUEÑA (< 2 archivos, < 2h)

### Paso 2.1: Leer Contextos
```
1. .claude/contexts/project-context.md
2. .claude/contexts/architecture-guidelines.md
3. .claude/contexts/coding-standards.md
```

### Paso 2.2: Leer Prompt
```
LEE: .claude/prompts/prompt-create-feature.md
```

### Paso 2.3: Implementar

```
Frontend:
1. LEE: .claude/skills/frontend-specialist/SKILL.md
2. Implementa

Backend:
1. LEE: .claude/skills/backend-specialist/SKILL.md
2. Implementa
```

### Paso 2.4: Code Review → Testing → QA
```
Igual que en §1.6, §1.7, §1.8
```

---

## §3. WORKFLOW: FEATURE MEDIANA (2-5 archivos, 2-8h)

### Paso 3.1: Leer Contextos
```
(Igual que §2.1)
```

### Paso 3.2: Product Agent (OBLIGATORIO)

```
1. LEE: .claude/agents/product-agent.md
2. LEE: .claude/skills/product-agent/SKILL.md
3. Genera PRD completo (con preguntas exhaustivas)
4. Crea: .claude/features/[NOMBRE]-PRD.md
```

### Paso 3.3: Implementar con PRD
```
1. LEE: .claude/prompts/prompt-create-feature.md
2. LEE el PRD generado
3. Implementa según §2.3
```

### Paso 3.4: Code Review → Testing → QA
```
Igual que §1.6, §1.7, §1.8
```

---

## §4. WORKFLOW: FEATURE GRANDE (5+ archivos, 8+ horas)

### Paso 4.1: Leer Contextos
```
(Igual que §2.1)
```

### Paso 4.2: Product Agent (OBLIGATORIO)
```
(Igual que §3.2)
```

### Paso 4.3: Architect Agent (OBLIGATORIO)

```
1. LEE: .claude/agents/architect-agent.md
2. LEE: .claude/skills/architect-agent/SKILL.md
3. LEE el PRD: .claude/features/[NOMBRE]-PRD.md
4. Divide en subtareas (2-4h cada una)
5. Crea: .claude/features/[NOMBRE]-PLAN.md
```

### Paso 4.4: Por Cada Subtarea
```
1. Implementa la subtarea (§2.3)
2. Code Review (§1.6)
3. Testing (§1.7)
4. Continúa con siguiente subtarea
```

### Paso 4.5: QA Final del Feature Completo
```
(Igual que §1.8)
```

---

## §5. WORKFLOW: REFACTORING

### Paso 5.1: Leer Contextos
```
(Igual que §2.1)
```

### Paso 5.2: Leer Prompt
```
LEE: .claude/prompts/prompt-refactor-code.md
```

### Paso 5.3: Architect Agent Analiza
```
1. LEE: .claude/agents/architect-agent.md
2. LEE: .claude/skills/architect-agent/SKILL.md
3. Analiza código actual
4. Propone mejoras arquitectónicas
```

### Paso 5.4: Implementar → Review → Testing → QA
```
Igual que workflows anteriores
```

---

## §6. WORKFLOW: TESTING

### Paso 6.1: Leer Prompt
```
LEE: .claude/prompts/prompt-generate-tests.md
```

### Paso 6.2: Testing Agent
```
1. LEE: .claude/agents/testing-agent.md
2. LEE: .claude/skills/testing-specialist/SKILL.md
3. Genera tests
```

---

## §7. WORKFLOW: CODE REVIEW

### Paso 7.1: Code Review Agent
```
1. LEE: .claude/agents/code-review-agent.md
2. LEE: .claude/skills/code-reviewer/SKILL.md
3. Revisa código
4. Reporta findings
```

---

## 📂 ESTRUCTURA DE ARCHIVOS

```
.claude/
├── CLAUDE.md (este archivo)
├── agents/
│   ├── product-agent.md
│   ├── architect-agent.md
│   ├── frontend-agent.md
│   ├── backend-agent.md
│   ├── code-review-agent.md
│   ├── testing-agent.md
│   └── qa-agent.md
├── skills/
│   ├── product-agent/SKILL.md
│   ├── architect-agent/SKILL.md
│   ├── frontend-specialist/SKILL.md
│   ├── backend-specialist/SKILL.md
│   ├── code-reviewer/SKILL.md
│   ├── testing-specialist/SKILL.md
│   └── qa-specialist/SKILL.md
├── contexts/
│   ├── project-context.md
│   ├── architecture-guidelines.md
│   ├── coding-standards.md
│   └── testing-strategy.md
├── prompts/
│   ├── prompt-fix-bug.md
│   ├── prompt-create-feature.md
│   ├── prompt-refactor-code.md
│   ├── prompt-generate-tests.md
│   └── prompt-code-review.md
└── features/
    ├── [NOMBRE]-PRD.md
    └── [NOMBRE]-PLAN.md
```

---

## 🎯 DIFERENCIA CLAVE: Agents vs Skills

### Agents (archivos .md en .claude/agents/)
- Definen el **ROL y RESPONSABILIDADES** del agente
- Contienen el **WORKFLOW específico** que debe seguir
- Son **documentos de proceso**

### Skills (archivos SKILL.md en .claude/skills/)
- Contienen **EXPERTISE y CONOCIMIENTO** especializado
- Son la **BASE DE CONOCIMIENTOS** del agente
- Son **documentos de referencia técnica**

**Debes leer AMBOS** cuando ejecutes un agente:
1. Primero el Agent (para saber QUÉ hacer)
2. Luego el Skill (para saber CÓMO hacerlo)

---

## ⚠️ RECORDATORIOS CRÍTICOS

1. **NUNCA saltes el workflow obligatorio**
2. **SIEMPRE lee los agentes Y skills completos**
3. **NO asumas - sigue el proceso paso a paso**
4. **Documenta decisiones en PRDs y PLANs**
5. **Code Review y Testing NO son opcionales**

---

## 🚫 EXCEPCIONES (Cuándo NO usar el sistema completo)

**Cambios triviales** (sin agents ni skills):
- Typos en strings o comentarios
- Eliminar archivos no usados
- Cambios de configuración sin código
- Ajustar estilos CSS simples (< 10 líneas)

Para estos, puedes trabajar directamente.

---

## 📊 LÍMITES DE TOKENS

- **Lectura inicial:** Máximo 15K tokens
- **Planificación:** Máximo 5K tokens
- **Implementación por fase:** Máximo 15K tokens
- **Implementación total:** Máximo 60K tokens
- **Documentación:** Máximo 10K tokens

---

## 🔧 GIT WORKFLOW (Automático)

1. `git checkout master`
2. `git pull origin master`
3. `git checkout -b feature/[NOMBRE]` o `bugfix/[NOMBRE]`
4. Commits con conventional commits
5. NO auto-push (requiere confirmación)

---

## 📋 DESCRIPCIÓN DEL PROYECTO

**Sakura Songs** es una aplicación web de reproductor de música relajante diseñada para proporcionar paz interior. Es una SPA (Single Page Application) construida con React que presenta diferentes escenas visuales acompañadas de música ambiente.

### Stack Tecnológico
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Testing**: Vitest 1.0.4 + Testing Library
- **Lenguaje**: JavaScript (JSX) + TypeScript (config)
- **Audio Library**: Howler.js 2.2.4
- **Audio Hosting**: Cloudinary

### Estructura del Proyecto

```
sakura-songs/
├── src/
│   ├── components/      # Componentes React
│   │   ├── Carousel/
│   │   ├── Controls/
│   │   ├── SceneIndicator/
│   │   └── SleepTimer/
│   ├── hooks/
│   │   ├── useAudioPlayer/
│   │   │   ├── index.ts
│   │   │   ├── usePlaybackControls.ts
│   │   │   ├── useTrackLoader.ts
│   │   │   └── useHowlInstance.ts
│   │   ├── useDrag.js
│   │   └── useSleepTimer.js
│   ├── data/
│   │   └── scenes.ts
│   └── App.tsx
└── [resto de archivos...]
```

### Componentes Clave

**useAudioPlayer**: Hook principal de audio que coordina:
- **usePlaybackControls**: Controles play/pause/next/prev
- **useTrackLoader**: Carga de tracks con Howler.js
- **useHowlInstance**: Gestión de la instancia de Howler

**Carousel**: Sistema de navegación entre escenas con swipe

**Controls**: Panel de control inferior

**SleepTimer**: Sistema de temporizador con fade-out

### Consideraciones Mobile
- Diseñado mobile-first
- Soporte para background playback
- Políticas de autoplay del navegador
- AudioContext puede suspenderse en background (iOS Safari, Chrome Android)

---

## 🎯 COMPORTAMIENTO GENERAL

- ✅ Preguntar antes de cambios mayores
- ✅ Mostrar plan antes de implementar
- ✅ Checkpoint después de cada fase
- ✅ Aplicar coding standards automáticamente
- ❌ NO ser verboso (modo conciso)
- ❌ NO auto-push a git

---

FIN DEL DOCUMENTO