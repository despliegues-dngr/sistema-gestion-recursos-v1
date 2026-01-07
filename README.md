# Sistema de Gestión de Recursos Policiales/Gubernamentales (DNGR v2.0)

Sistema de gestión de recursos diseñado para la **Dirección Nacional de Gendarmería y Reclusos (DNGR)**.

## 🚀 Stack Tecnológico

- **Vue 3** (Composition API + TypeScript)
- **Vite** (Build tool)
- **Pinia** (Estado global)
- **Vue Router** (Enrutamiento)
- **Dexie.js** (IndexedDB wrapper - Local-First)

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

```bash
npm install
```

## 🏃 Desarrollo

```bash
npm run dev
```

## 📦 Build

```bash
npm run build
```

## ✅ Type Check

```bash
npm run type-check
```

## 🧹 Lint

```bash
npm run lint
```

## 📚 Documentación

Toda la documentación del proyecto se encuentra en la carpeta `docs/`:

- `DEVELOPER-GUIDE.md` - Guía maestra de desarrollo
- `design-tokens.md` - Variables CSS (fuente de verdad única)
- `arquitectura-software.md` - Decisiones arquitectónicas
- `guia-diseno-dashboard.md` - Sistema de diseño para dashboards operativos

## 🏗️ Arquitectura

Arquitectura **Local-First** con IndexedDB como backend local. El sistema funciona completamente offline.

### Estructura de Carpetas

```
src/
├── composables/      # Lógica compartida (useAuth, useDatabase)
├── router/           # Configuración de rutas
├── stores/           # Stores de Pinia
├── types/            # Tipos TypeScript compartidos
├── views/            # Vistas de la aplicación
├── db.ts             # Configuración de Dexie.js (IndexedDB)
├── App.vue           # Componente raíz
└── main.ts           # Punto de entrada
```

## 🔴 Reglas de Oro

1. **DRY** - No duplicar código (crear composables/componentes)
2. **Máximo 300 líneas por archivo** - Extraer si supera
3. **TypeScript estricto** - Tipar todo
4. **Feature-based** - Organizar por dominio de negocio (cuando se implementen features)

Ver `docs/DEVELOPER-GUIDE.md` para más detalles.

## 📝 Licencia

Este proyecto es una demo para evaluación.

