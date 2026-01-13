# CLAUDE.md - Contexto del Proyecto Sakura Songs

## Descripción General

**Sakura Songs** es una aplicación web de reproductor de música relajante diseñada para proporcionar paz interior. Es una SPA (Single Page Application) construida con React que presenta diferentes escenas visuales acompañadas de música ambiente.

## Stack Tecnológico

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Lenguaje**: JavaScript (JSX)
- **Audio Library**: Howler.js 2.2.4
- **Gestures**: react-swipeable 7.0.1
- **Estilos**: CSS puro (sin frameworks)

## Estructura del Proyecto

```
sakura-songs/
├── public/              # Archivos estáticos (audio, favicon, etc.)
├── src/
│   ├── components/      # Componentes React
│   │   ├── Background/  # Componente de fondo con gradientes/imágenes
│   │   ├── Carousel/    # Carrusel de escenas con swipe
│   │   ├── Controls/    # Panel de controles de reproducción
│   │   └── SceneIndicator/ # Indicadores de escena (dots)
│   ├── data/
│   │   └── scenes.js    # Configuración de escenas (imágenes, audio)
│   ├── hooks/
│   │   ├── useAmbientPlayer.js  # Hook para reproducción de audio ambiente
│   │   └── useAudioPlayer.js    # Hook base de reproducción
│   ├── utils/
│   │   └── ambientGenerator.js  # Utilidades para audio generativo
│   ├── App.jsx          # Componente principal
│   ├── App.css          # Estilos principales
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── index.html           # HTML base
├── package.json         # Dependencias y scripts
└── vite.config.js       # Configuración de Vite

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

### useAmbientPlayer (src/hooks/useAmbientPlayer.js)
Hook principal para gestión de audio:
- Reproduce tracks según la escena activa
- Gestiona el estado de reproducción
- Maneja las interacciones del usuario (requerido por navegadores)

## Archivos Importantes

- **src/data/scenes.js**: Define todas las escenas y sus recursos
- **src/App.jsx**: Lógica principal de la aplicación
- **src/hooks/useAmbientPlayer.js**: Lógica de reproducción de audio
- **package.json**: Dependencias y scripts npm
- **index.html**: Configuración HTML, meta tags, fuentes

## Scripts Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo (Vite)
npm run build    # Build para producción
npm run preview  # Preview del build de producción
```

## Estado del Proyecto

- **Versión**: 1.0.0
- **Branch principal**: main
- **Branch de desarrollo**: claude/add-claude-md-uSiYx
- **Último commit**: Initial commit: Sakura Songs relaxing music player

## Consideraciones de Desarrollo

1. **Audio**: Los archivos de audio están referenciados en `/audio/` pero deben estar en la carpeta `public/audio/`
2. **Imágenes**: Se usan imágenes de Unsplash como placeholders
3. **Responsive**: Diseñado mobile-first con soporte táctil
4. **Browser Policy**: Requiere interacción del usuario para iniciar audio (política del navegador)
5. **Idioma**: La aplicación está en español

## Convenciones de Código

- Componentes en PascalCase
- Hooks personalizados con prefijo `use`
- CSS modules separados por componente
- Funciones de callback con useCallback para optimización
- Estado local con useState, sin gestión global (Redux/Zustand)

## Mejoras Futuras Potenciales

- Sistema de playlist personalizado
- Más escenas y variedad de audio
- Soporte para audio generativo/procedural
- Modo offline/PWA
- Preferencias de usuario (volumen, favoritos)
- Visualizador de audio
