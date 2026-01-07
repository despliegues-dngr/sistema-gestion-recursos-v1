# 🏆 REGLAS DE ORO - Desarrollo DNGR

**Documento único de referencia. Consultar ANTES de cada implementación.**

---

## 📋 VISIÓN GENERAL DEL PROYECTO

**Sistema de Gestión de Recursos Policiales/Gubernamentales (DNGR v2.0)**

| Característica | Descripción |
|----------------|-------------|
| **Tipo** | Aplicación Desktop (NO web pública) |
| **Usuarios** | Funcionarios gubernamentales de la DNGR |
| **Arquitectura** | Local-First (funciona 100% offline) |
| **Persistencia** | IndexedDB con Dexie.js (sin backend) |
| **Filosofía** | KISS - Simplicidad sobre complejidad |
| **Estructura** | Component-Driven (colocación) |
| **Estilo Visual** | Estructurado - Bordes definidos, secciones claras |

---

## 🎯 ENFOQUE DE DISEÑO VISUAL: ESTRUCTURADO

**Filosofía:** Diseño estructurado y formal, apropiado para entornos policiales/gubernamentales donde la claridad, jerarquía y organización son fundamentales.

### Principios del Estilo Estructurado

| Principio | Descripción |
|-----------|-------------|
| **Bordes definidos** | Bordes de 2px para delimitar claramente las secciones |
| **Consistencia Card-like** | Todos los paneles siguen el patrón de Card (borde, header gris, contenido blanco) |
| **Contraste claro** | Fondos diferenciados entre header (`gray-50`) y body (`white`) |
| **Separación de secciones** | Cada área claramente delimitada con bordes de 2px |
| **Feedback visual sutil** | Estados hover con cambio de fondo (sin bordes de acento) |

### Especificaciones de Componentes

| Componente | Bordes | Header/Fondo | Hover |
|------------|--------|--------------|-------|
| **Card** | 2px solid `--border-color-strong` | Header `--color-gray-50` | - |
| **Table** | 2px exterior, 1px entre filas | Header `--color-gray-100` | Fila `--color-gray-50` |
| **FilterPanel** | 2px solid `--border-color-strong` | Header `--color-gray-50` | - |
| **Accordion** | 2px entre elementos | Header `--color-gray-50` | Fondo `--color-gray-100` |
| **Button** | 2px solid (color del variant) | - | Fondo más oscuro |
| **Input/Select** | 2px solid `--border-color-strong` | - | Borde `--color-primary` en focus |

### Colores de Borde

```css
--border-thin: 1px;           /* Separadores internos */
--border-medium: 2px;         /* Bordes de componentes */
--border-thick: 3px;          /* Bordes de acento/énfasis */
--border-color: #e5e7eb;      /* Borde sutil */
--border-color-strong: #d1d5db; /* Borde visible */
```

### ✅ CORRECTO: Estilo Estructurado

```css
.card {
  border: 2px solid var(--border-color-strong);
}

.card-header {
  background-color: var(--color-gray-50);
  border-bottom: 2px solid var(--border-color-strong);
}
```

### ❌ PROHIBIDO: Estilo sin estructura

```css
.card {
  border: none;              /* NO - sin delimitación */
  box-shadow: 0 1px 2px;     /* NO - solo sombra sin borde */
}
```

---

## 🛠️ STACK TECNOLÓGICO

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| **Framework** | Vue 3 (Composition API) | ^3.5.13 |
| **Build Tool** | Vite | ^6.0.5 |
| **Lenguaje** | TypeScript | ~5.7.2 |
| **State Management** | Pinia | ^2.2.6 |
| **Routing** | Vue Router | ^4.5.0 |
| **Base de Datos** | Dexie (IndexedDB) | ^4.0.1 |
| **Iconos** | Lucide Vue Next | ^0.562.0 |

---

## 📁 ESTRUCTURA DE CARPETAS (Component-Driven)

```text
src/
├── assets/                     # Recursos estáticos
│   └── images/                 # Imágenes (logos, iconos)
│
├── styles/                     # Estilos globales (SOLO tokens y reset)
│   ├── tokens.css              # Design Tokens (variables CSS)
│   ├── reset.css               # Normalización (sin estilos visuales)
│   └── index.css               # Punto de entrada
│
├── components/                 # Componentes reutilizables (UI Kit)
│   ├── Button/
│   │   ├── Button.vue
│   │   ├── Button.css
│   │   └── index.ts
│   ├── Input/
│   │   ├── Input.vue
│   │   ├── PasswordInput.vue
│   │   ├── Input.css
│   │   └── index.ts
│   ├── Card/
│   │   ├── Card.vue
│   │   ├── Card.css
│   │   └── index.ts
│   └── index.ts                # Barrel export
│
├── layouts/                    # Layouts de aplicación
│   ├── MainLayout/
│   │   ├── MainLayout.vue
│   │   ├── MainLayout.css
│   │   └── index.ts
│   └── index.ts
│
├── pages/                      # Páginas de la aplicación
│   ├── Login/
│   │   ├── LoginPage.vue
│   │   ├── LoginPage.css
│   │   ├── components/
│   │   │   └── LoginForm.vue
│   │   └── index.ts
│   ├── Home/
│   │   ├── HomePage.vue
│   │   ├── HomePage.css
│   │   └── index.ts
│   └── index.ts
│
├── hooks/                      # Composables (lógica reutilizable)
│   ├── useAuth.ts
│   ├── useDatabase.ts
│   └── index.ts
│
├── stores/                     # Estado global (Pinia)
│   └── index.ts
│
├── router/                     # Configuración de rutas
│   └── index.ts
│
├── lib/                        # Utilidades y configuraciones
│   ├── db/
│   │   ├── index.ts            # Esquema Dexie
│   │   └── seed.ts             # Datos iniciales
│   ├── types/
│   │   └── index.ts            # Interfaces TypeScript
│   └── constants/
│       └── index.ts            # Constantes globales
│
├── App.vue                     # Componente raíz
└── main.ts                     # Entry point
```

### Principios de la Estructura

| Principio | Descripción |
|-----------|-------------|
| **Colocación** | Cada componente tiene sus estilos junto a él |
| **Autonomía** | Una carpeta = todo lo necesario para ese componente |
| **Sin conflictos** | Estilos aislados por componente, sin colisiones |
| **Fácil de encontrar** | Buscar `Button` → ir a `components/Button/` |

---

## 📍 ALIASES DE VITE

```typescript
// vite.config.ts
{
  '@': './src',
  '@components': './src/components',
  '@layouts': './src/layouts',
  '@pages': './src/pages',
  '@hooks': './src/hooks',
  '@stores': './src/stores',
  '@lib': './src/lib',
  '@styles': './src/styles'
}
```

---

## 🎨 ARQUITECTURA DE ESTILOS

### Estructura de Archivos CSS

```text
src/styles/                     # SOLO estilos globales
├── tokens.css                  # Variables CSS (fuente única de verdad)
├── reset.css                   # Normalización (sin estilos visuales)
└── index.css                   # Importa todo

src/components/Button/          # Estilos colocados con el componente
├── Button.vue
└── Button.css                  # Estilos SOLO de este componente
```

### Regla de Oro: COLOCACIÓN

| Tipo de Estilo | Ubicación |
|----------------|-----------|
| Variables CSS (tokens) | `styles/tokens.css` |
| Reset/Normalización | `styles/reset.css` |
| Estilos de Button | `components/Button/Button.css` |
| Estilos de Input | `components/Input/Input.css` |
| Estilos de LoginPage | `pages/Login/LoginPage.css` |

### ✅ CORRECTO: Estilos colocados

```
components/Button/
├── Button.vue      ← Componente
└── Button.css      ← Sus estilos (importados en el .vue)
```

### ❌ PROHIBIDO: Estilos dispersos

```
styles/components/buttons.css   ← NO, estilos lejos del componente
styles/components/inputs.css    ← NO, causa conflictos
```

---

## 🧩 COMPONENTES (UI Kit)

### Estructura de un Componente

```
components/Button/
├── Button.vue          # Template + Script
├── Button.css          # Estilos (importado en el .vue)
├── Button.test.ts      # Tests (opcional)
└── index.ts            # export { default as Button } from './Button.vue'
```

### Ejemplo de Componente

```vue
<!-- components/Button/Button.vue -->
<template>
  <button :class="classes" :disabled="disabled || loading">
    <span v-if="loading" class="btn-spinner"></span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import './Button.css'
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md'
})

const classes = computed(() => [
  'btn',
  `btn--${props.variant}`,
  `btn--${props.size}`,
  { 'btn--loading': props.loading }
])
</script>
```

```css
/* components/Button/Button.css */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

/* ... más estilos ... */
```

### Barrel Export

```typescript
// components/Button/index.ts
export { default as Button } from './Button.vue'

// components/index.ts
export * from './Button'
export * from './Input'
export * from './Card'
// etc.
```

### Uso en Páginas

```vue
<!-- pages/Login/LoginPage.vue -->
<script setup lang="ts">
import { Button, Input } from '@components'
</script>
```

---

## 💾 SISTEMA DE PERSISTENCIA (Dexie.js)

### Ubicación

```
src/lib/db/
├── index.ts        # Esquema y tablas
└── seed.ts         # Datos iniciales
```

### Patrón de Definición

```typescript
// src/lib/db/index.ts
import Dexie, { Table } from 'dexie'
import type { Funcionario, Usuario } from '@lib/types'

class AppDatabase extends Dexie {
  funcionarios!: Table<Funcionario>
  usuarios!: Table<Usuario>

  constructor() {
    super('DNGRDatabase')
    this.version(1).stores({
      funcionarios: '++id, ci, gradoId, estado',
      usuarios: '++id, username, rolId, estado'
    })
  }
}

export const db = new AppDatabase()
```

---

## 🔄 FLUJO DE DATOS

```text
┌─────────────────────────────────────────────────────────────┐
│  PÁGINA (pages/Login/LoginPage.vue)                          │
│  └── Orquesta componentes + usa hooks                       │
└─────────────────────────────────────────────────────────────┘
                           │ eventos
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  HOOK (hooks/useAuth.ts)                                     │
│  └── Lógica reactiva + llamadas a DB                        │
└─────────────────────────────────────────────────────────────┘
                           │ queries
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  DEXIE (lib/db/index.ts)                                     │
│  └── Persistencia local en IndexedDB                        │
└─────────────────────────────────────────────────────────────┘
```

---

# 📏 REGLAS DE CÓDIGO

---

## 🚫 PROHIBIDO (Anti-patrones)

| ❌ NO hacer | ✅ Hacer en su lugar |
|-------------|---------------------|
| Código repetitivo (copy-paste) | Extraer a composable o componente |
| Valores hardcodeados | Usar Design Tokens (`--color-primary`) |
| Archivos > 400 líneas | Dividir por responsabilidad (ideal: ~300) |
| Usar `!important` en CSS | Corregir especificidad del selector |
| Lógica compleja innecesaria | Solución simple y directa (KISS) |
| Lógica en componentes Vue | Mover a composables (`useX.ts`) |
| Estilos inline o dispersos | Centralizar en `styles/tokens.css` |
| Inventar patrones nuevos | Seguir estructura existente del proyecto |
| Diseño inconsistente entre páginas | Usar componentes del Design System |
| **Parches rápidos ante errores** | **Analizar causa raíz + solución correcta** |

---

## 🔧 REGLA ANTI-PARCHES: Análisis de Causa Raíz

> **"No parchear síntomas, resolver problemas."**

### Filosofía

Cuando aparece un error, **NUNCA** aplicar un parche rápido que solo oculte el síntoma. En su lugar, seguir este proceso:

### Proceso ante Errores

```
1. PAUSAR    → No actuar impulsivamente
2. ANALIZAR  → ¿Cuál es la CAUSA RAÍZ del error?
3. EVALUAR   → ¿Hay múltiples soluciones posibles?
4. PROPONER  → Presentar opciones con pros/contras
5. DECIDIR   → Elegir la solución CORRECTA (no la rápida)
6. EJECUTAR  → Implementar la solución elegida
7. VERIFICAR → Confirmar que el problema está resuelto
```

### Formato de Análisis de Error

Cuando se detecta un error, documentar así:

```markdown
## 🐛 Análisis de Error

**Síntoma:** [Qué se observa]
**Causa Raíz:** [Por qué ocurre realmente]

### Opciones de Solución

| Opción | Descripción | Pros | Contras |
|--------|-------------|------|---------|
| A | [solución] | [ventajas] | [desventajas] |
| B | [solución] | [ventajas] | [desventajas] |

**Recomendación:** Opción [X] porque [razón]
```

### ❌ Ejemplos de Parches (PROHIBIDO)

```typescript
// ❌ PARCHE: Silenciar error sin entenderlo
try {
  await guardar()
} catch (e) {
  // ignorar
}

// ❌ PARCHE: Forzar tipo para evitar error de TS
const data = response as any

// ❌ PARCHE: Agregar !important para "arreglar" CSS
.boton { color: red !important; }

// ❌ PARCHE: Agregar setTimeout para "esperar" algo
setTimeout(() => hacerAlgo(), 500)
```

### ✅ Ejemplos de Soluciones Correctas

```typescript
// ✅ CORRECTO: Manejar error apropiadamente
try {
  await guardar()
} catch (error) {
  console.error('Error al guardar:', error)
  mostrarNotificacion('Error al guardar. Intente nuevamente.')
}

// ✅ CORRECTO: Tipar correctamente la respuesta
interface ApiResponse { data: Usuario[] }
const response = await fetch<ApiResponse>(url)

// ✅ CORRECTO: Corregir especificidad CSS
.formulario .boton { color: var(--color-danger); }

// ✅ CORRECTO: Usar eventos/watchers apropiados
watch(datosListos, () => hacerAlgo())
```

### Cuándo SÍ es Aceptable un "Parche Temporal"

Solo en casos **excepcionales** y con documentación:

1. **Hotfix de producción crítico** (con ticket de seguimiento)
2. **Dependencia externa con bug conocido** (documentar workaround)
3. **Bloqueo de equipo** (con fecha límite para solución real)

En estos casos, **SIEMPRE** agregar comentario:

```typescript
// TODO: PARCHE TEMPORAL - Ticket #123
// Causa: [explicación]
// Solución real pendiente: [descripción]
// Fecha límite: [fecha]
```

---

## ✅ CHECKLIST PRE-IMPLEMENTACIÓN

Antes de escribir código, verificar:

- [ ] ¿Ya existe algo similar? → `code_search` primero
- [ ] ¿Sigo la estructura de carpetas del proyecto?
- [ ] ¿Uso los Design Tokens existentes?
- [ ] ¿El archivo tendrá < 400 líneas? (ideal: ~300)
- [ ] ¿La lógica va en composable, no en el componente?

---

## 🧩 HOOKS (Composables)

### Ubicación y Nomenclatura

```
src/hooks/
├── useAuth.ts          # Autenticación
├── useDatabase.ts      # Operaciones de BD
├── useExpedientes.ts   # Lógica de expedientes
└── index.ts            # Barrel export
```

### Patrón de Hook

```typescript
// hooks/useAuth.ts
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Usuario } from '@lib/types'

const usuario = ref<Usuario | null>(null)
export const isAuthenticated = computed(() => usuario.value !== null)

export function useAuth() {
  const router = useRouter()

  function login(username: string, password: string) {
    // lógica de login
  }

  function logout() {
    usuario.value = null
    router.push('/login')
  }

  return { usuario, isAuthenticated, login, logout }
}
```

### Cuándo Crear un Hook

| Señal | Acción |
|-------|--------|
| Lógica repetida 2+ veces | → Crear hook |
| Lógica compleja en componente | → Extraer a hook |
| Estado compartido entre componentes | → Hook con estado global |

---

## 📝 CÓDIGO LIMPIO

### TypeScript Estricto

```typescript
// ✅ SIEMPRE tipar
interface Expediente {
  id: number
  titulo: string
  estado: 'pendiente' | 'completado'
}

const expediente: Expediente = { /* ... */ }

// ❌ NUNCA usar any
const data: any = fetch() // PROHIBIDO
```

### Nombres Descriptivos

```typescript
// ❌ Nombres crípticos
const d = new Date()
const arr = []

// ✅ Nombres claros
const fechaCreacion = new Date()
const expedientesPendientes = []
```

---

## 🔄 CONSISTENCIA VISUAL

### Regla de Jakob

> "Si un botón 'Guardar' es azul en un módulo, debe ser azul en TODOS."

### Checklist de Consistencia

- [ ] ¿Los botones primarios usan `--color-primary`?
- [ ] ¿Los mensajes de error usan `--color-danger`?
- [ ] ¿El espaciado usa tokens (`--spacing-*`)?
- [ ] ¿La tipografía usa `--font-size-*`?
- [ ] ¿Los iconos son de la misma librería?

---

## ⚡ RESUMEN EJECUTIVO

| Regla | Límite |
|-------|--------|
| **Líneas por archivo** | ~300 ideal, 400 máximo tolerable |
| **Responsabilidades por archivo** | 1 |
| **Código repetido permitido** | 0 (extraer siempre) |
| **Valores hardcodeados** | 0 (usar tokens) |
| **Profundidad de anidación** | Máximo 3 niveles |
| **Uso de `!important`** | 0 (corregir especificidad) |

---

## 🚨 ANTES DE COMMIT

```
[ ] ¿Código sin repeticiones (DRY)?
[ ] ¿Archivos < 400 líneas? (ideal ~300)
[ ] ¿Usa Design Tokens (no hardcoded)?
[ ] ¿Sigue estructura del proyecto?
[ ] ¿TypeScript sin `any`?
[ ] ¿Diseño consistente con otras páginas?
[ ] ¿Lógica en composables (no en componentes)?
```

---

## 🏛️ REGLAS ESPECÍFICAS DNGR (Desktop Gubernamental)

### Filosofía: KISS (Keep It Simple, Stupid)

> "La solución más simple que funcione es la mejor solución."

Este es un sistema **Desktop gubernamental**, no una startup de Silicon Valley.

| ❌ Evitar | ✅ Preferir |
|-----------|------------|
| Animaciones complejas | Transiciones sutiles (0.2s) |
| Librerías pesadas innecesarias | Soluciones nativas/ligeras |
| Patrones over-engineered | Código directo y legible |
| Optimizaciones prematuras | Código claro primero |
| Features "por si acaso" | Solo lo que se necesita ahora |

### Prioridades de Código

```
Legibilidad > Mantenibilidad > Performance
```

*Un funcionario debe poder entender el código en 6 meses.*

---

## 🎯 REGLAS ADICIONALES RECOMENDADAS

### CSS Limpio

```css
/* ❌ PROHIBIDO */
.boton {
  color: red !important; /* NUNCA usar !important */
}

/* ✅ CORRECTO - Aumentar especificidad si es necesario */
.formulario .boton {
  color: var(--color-danger);
}
```

### Principio de Menor Sorpresa

> "El código debe hacer exactamente lo que su nombre sugiere."

```typescript
// ❌ Función que hace más de lo que dice
function obtenerUsuario() {
  const usuario = db.get()
  enviarEmail(usuario) // ¿Por qué envía email?
  return usuario
}

// ✅ Función que hace solo lo que dice
function obtenerUsuario() {
  return db.get()
}
```

### Early Return (Salida Temprana)

```typescript
// ❌ Anidación profunda
function procesar(data) {
  if (data) {
    if (data.valido) {
      if (data.activo) {
        // lógica principal
      }
    }
  }
}

// ✅ Early return
function procesar(data) {
  if (!data) return
  if (!data.valido) return
  if (!data.activo) return
  
  // lógica principal (sin anidación)
}
```

### Fail Fast (Fallar Rápido)

```typescript
// ✅ Validar al inicio, no al final
function crearExpediente(datos: DatosExpediente) {
  // Validaciones primero
  if (!datos.titulo) throw new Error('Título requerido')
  if (!datos.responsable) throw new Error('Responsable requerido')
  
  // Lógica principal (ya sabemos que datos es válido)
  return db.expedientes.add(datos)
}
```

### Comentarios Útiles

```typescript
// ❌ Comentario obvio
const contador = 0 // Inicializa contador en 0

// ✅ Comentario que explica el "por qué"
const TIMEOUT_MS = 30000 // 30s porque el servidor legacy es lento
```

### Manejo de Errores

```typescript
// ❌ Silenciar errores
try {
  await guardar()
} catch (e) {
  // ignorar
}

// ✅ Manejar o propagar
try {
  await guardar()
} catch (error) {
  console.error('Error al guardar:', error)
  mostrarNotificacion('Error al guardar. Intente nuevamente.')
}
```

---

## 📋 CHECKLIST COMPLETO PRE-COMMIT

```markdown
### Código
- [ ] Sin repeticiones (DRY)
- [ ] Archivos < 400 líneas (ideal ~300)
- [ ] Sin `any` en TypeScript
- [ ] Sin `!important` en CSS
- [ ] Nombres descriptivos
- [ ] Early returns (sin anidación profunda)

### Diseño
- [ ] Usa Design Tokens (no hardcoded)
- [ ] Consistente con otras páginas
- [ ] Sin animaciones innecesarias

### Arquitectura
- [ ] Sigue estructura del proyecto
- [ ] Lógica en composables
- [ ] Una responsabilidad por archivo

### DNGR Específico
- [ ] Solución simple (KISS)
- [ ] Funciona offline
- [ ] Accesible con teclado
```

---

**Documento de referencia técnica:** `docs/ESPECIFICACION-TECNICA-DNGR.md`  
**Mapa de desarrollo:** `docs/diagrams/flujo-sistema.html`
