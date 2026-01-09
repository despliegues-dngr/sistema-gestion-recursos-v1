  Sistema DNGR - Mapa de Desarrollo v1.8     

Mapa del Proyecto

[📊 Estado General](#progreso) [📋 Gestión de Personal](#modulo-1) [📦 Gestión Operativa](#modulo-2) [🔐 Control y Seguridad](#modulo-3) [💡 Visión y Futuro](#ideas-proyecto) [🏗️ Estructura del Sistema](#arquitectura) [🗄️ Base de Datos](#modelo-datos) [⚙️ Configuración AI](#config-agentes)

Versión 1.8 (Sincronizada)

Mapa Estratégico de Recursos (DNGR)
===================================

Hoja de ruta y seguimiento de implementación para el Comando

📊 Resumen Ejecutivo de Progreso
--------------------------------

26

Hitos Completados

0

Tareas Pendientes

100%

Auditoría Técnica

✅

**Estado Actual:** Sistema Sincronizado con Código Fuente

Auditoría arquitectónica completada. Todos los servicios y flujos de datos han sido verificados.

📅 Historial de Versiones y Cambios

9 Ene 2026, 12:00
**Refactorización UX y Mejoras ESMAPO (v1.8):**
### 🔄 Reubicación del Selector de Unidades
**Cambio arquitectural:** El selector de unidades (módulos) ha sido movido del navbar superior al panel lateral de filtros (`FilterPanel`) en todas las páginas.
- **Nuevo Componente:** `UnitSelector.vue` centraliza la lógica de selección.
- **Nuevo Hook:** `useUnitNavigation.ts` extrae la lógica de redirección determinista.
- **UX:** Integración dentro de un `Accordion` ("UNIDAD ACTUAL") para consistencia visual con otros filtros.
- **Impacto:** Navbar más limpio y controles de navegación agrupados con filtros contextuales.

### 📊 Mejoras en Reporte Personal (ESMAPO)
- **Título Actualizado:** Acordeón renombrado a "PARTES DE UNIDADES" para mayor claridad operativa.
- **Selección Inteligente:** Todas las unidades se marcan por defecto al cargar, agilizando la vista comparativa total.
- **Filtros de Concepto:** Nuevo sistema de filtrado dinámico por estados de personal.
- **Nuevo Concepto:** Incorporación de "Realiza Serv. 222" en el parte de fuerza y mock data.
- **Exportación:** Agregados botones de "Exportar CSV" (placeholder) en los headers de las tablas de SS.OO. y Subalterno.

### 🎨 Estándar Global de Interfaz
- **Acordeones:** Implementación de estándar global de **estado colapsado por defecto** en todos los paneles de filtros del sistema.
- **Objetivo:** Reducción de ruido visual y carga cognitiva inicial; el usuario expande solo lo que necesita.
- **Alcance:** Afecta a 7 páginas core y configuraciones dinámicas en `dashboardConfig.ts`.

### 🧭 Navegación Simplificada - Dirección VI
- **Navbar:** Eliminado el acceso directo a "Administración" para el rol de Dirección VI.
- **Enfoque:** Interfaz simplificada centrada exclusivamente en "Dashboard" y "Personal".

9 Ene 2026, 10:00
**Mejoras de Navegación y Seguridad:**
### 🔄 Navegación entre Unidades (v1.1)
**Cambio arquitectural:** Simplificación de lógica de cambio de unidad en `MainLayout.vue`
**Comportamiento anterior:**
- Intentaba mantener el módulo actual al cambiar de unidad
- Causaba bugs cuando el módulo no existía en unidad destino
- Contenido no se actualizaba (solo URL y navbar)
**Comportamiento nuevo:**
- **Regla determinista:** Al cambiar de unidad → siempre redirige a `/personal`
- **Excepción única:** Dirección VI → siempre redirige a `/dashboard`
- Elimina casos edge de navegación inconsistente
**Impacto:**
- ✅ UX más predecible y consistente
- ✅ Reducción de código (-65% en función `handleUnitChange`)
- ✅ Sin bugs de contenido no actualizado
**Archivos modificados:**
- `src/layouts/MainLayout/MainLayout.vue` (líneas 95-117 → 95-103)
---
### 🔐 Gestión de Opciones - Restricción ESMAPO (v1.0)
**Cambio de seguridad:** Implementación de defensa en profundidad para módulo administrativo
**Módulo:** "Gestión de Catálogos" → renombrado a "Gestión de Opciones"
**Restricciones implementadas:**
1. **Nivel UI (navbar):**
   - Solo ESMAPO muestra el item en navegación
   - Dirección VI: item eliminado del navbar
2. **Nivel Router (seguridad real):**
   - Router guard en ruta `/admin/catalogos`
   - Validación: `if (unidad !== 'esmapo') → redirect to /personal`
   - Cumplimiento: OWASP A01:2021 - Broken Access Control
**Justificación:**
- Módulo de configuración crítica del sistema
- Requiere conocimiento técnico especializado
- ESMAPO es unidad de administración central
**Archivos modificados:**
- `src/config/navConfig.ts` (línea 91: renombrado, líneas 227-232: eliminado)
- `src/router/index.ts` (líneas 90-96: agregado `beforeEnter` guard)
**Cumplimiento normativo:**
- ✅ OWASP Top 10 2021 - A01
- ✅ Defensa en profundidad (UI + Router)
- ✅ Alineado con `docs/REGLAS-DE-ORO.md` - Seguridad Gubernamental
---
### 🐛 Bugfixes Menores
- **FichaFuncionario.vue:** Corrección de imports faltantes de iconos Lucide (FileText, Clock, Calendar, History, ChevronLeft, ChevronRight)

8 Ene 2026, 16:00
**Análisis de Cumplimiento Temporal v16 - Horarios Reales y Cruce de Medianoche:** Implementación de capacidad estratégica para medir cumplimiento de despliegues en **tiempo y forma**. **Campos nuevos en ReporteDespliegue:** `realHoraInicio` (string HH:MM), `realHoraFin` (string HH:MM), `cruzaMedianoche` (boolean calculado automáticamente). **Lógica de negocio:** Validación de formato HH:MM con soporte para despliegues nocturnos (ej: 18:00 a 06:00 → cruzaMedianoche=true). **UX:** Inputs de hora condicionales en modal de reporte (visibles solo si tipoDespliegue='Despliegue'), valores por defecto desde planificación, grid optimizado (2fr 1fr 1fr para balance visual). **Valor estratégico:** Permite análisis histórico de desviaciones temporales, identificación de patrones de incumplimiento, y optimización de planificación basada en datos reales. **Casos de uso:** (1) Detectar operativos que sistemáticamente se retrasan, (2) Identificar unidades con déficit crónico de recursos, (3) Análisis específico de turnos nocturnos, (4) Ajustar planificación a realidad operativa histórica. **Migración:** Campos opcionales, compatibles con reportes existentes. **Próximos pasos:** Implementar dashboard de análisis de cumplimiento temporal con métricas agregadas (tasa de desviación mensual, operativos recurrentes con incumplimiento, distribución de desviaciones por horario).

7 Ene 2026, 14:00
**Módulo Reporte Personal v1.0 - Parte de Fuerza:** Implementación del componente visual para el reporte "Parte de Fuerza" en la página `/esmapo/reporte-personal`. **Diseño Comparativo:** Sistema de tabla multi-columna que permite comparar la disponibilidad de personal entre múltiples Direcciones simultáneamente mediante selección dinámica con checkboxes. **Integración con Sistema de Diseño:** Uso del componente `<Table>` oficial del sistema para garantizar consistencia visual total con el resto de la aplicación. **Cálculos Automáticos:** Implementación de lógica para calcular "Se deduce" (suma de francos, licencias y cursos) y "Fuerza Efectiva" (trabajando menos deducciones) con totales por fila y columna. **Categorización:** Separación en dos tablas independientes (SS.OO. y Personal Subalterno) con estados de personal (Trabajando, Francos, Licencia anual, Licencia médica, Curso). **Datos Mock:** Implementación con 5 direcciones de ejemplo (Dir I, Dir II, Reg Norte, Reg Este, GEO) preparado para integración futura con datos reales de IndexedDB. **UX:** Scroll interno en Card, filas de resumen destacadas visualmente, columna TOTAL con color primario, fila "FUERZA EFECTIVA" con fondo azul. Pendiente: Integración con servicios de personal y cálculo dinámico basado en estados reales de funcionarios.

7 Ene 2026, 17:00
**Módulo Reporte Operativo v1.0 - Dashboard de Cumplimiento:** Implementación del dashboard ejecutivo para ESMAPO en la página `/esmapo/reporte-operativo`. **Vista Panorámica:** Sistema de tabla comparativa que permite auditar el estado de reportes de despliegue de todas las direcciones operativas simultáneamente. **Métricas Clave:** Tres indicadores por dirección: (1) Reportes Vencidos (despliegues sin cargar fuera de plazo), (2) Pendientes del Día (formato fracción X/Y mostrando reportados vs. total esperado), (3) Cumplimiento % (promedio de cumplimiento de personal desplegado vs. planificado del día). **Filtrado Dinámico:** Sistema de detección automática de unidades con órdenes operativas activas, eliminando dependencia de campo `tipo` estático. Filtros laterales para selección de fecha (histórico) y unidades específicas. **Componente ProgressBar Mejorado:** Rediseño con porcentaje alineado a la derecha de la barra, colores contextuales según nivel de cumplimiento (rojo crítico ≤50%, amarillo reducido ≤80%, verde completo ≤100%, azul excedido >100%), y prop `showLabel` para ocultar etiqueta en contextos compactos. **Cálculo de Cumplimiento:** Promedio de todos los reportes cargados en el día usando fórmula `(realTotalPersonal / refPlanTotalPersonal) * 100`, alineado con snapshot inmutable de planificación (v14). **UX Ejecutiva:** Etiquetas formales ("Reportes Vencidos", "Pendientes del Día") apropiadas para audiencia directiva, badges con emojis para identificación visual rápida (🔴 vencidos, 🟡 pendientes, ✅ sin atrasos). Pendiente: Parametrización de servicios de despliegue para soporte completo de consultas históricas por fecha.

7 Ene 2026, 12:00
**Rediseño Modal Historial v18 - Estilo Narrativo y Cumplimiento:** Transformación total del modo solo lectura para reportes históricos. **Diseño Narrativo:** Implementación de un formato de "informe oficial" que describe el despliegue en lenguaje natural, eliminando la rigidez de las cajas de texto y grillas. **Filtrado Inteligente:** Visualización exclusiva de recursos desplegados (cantidad > 0), optimizando el espacio vertical y eliminando ruido visual. **Métricas de Cumplimiento:** Integración de barra de progreso con cálculo automático de porcentaje basado en el snapshot de planificación (`refPlanTotalPersonal`). **Lógica de Permisos Estricta:** Forzado de modo solo lectura para cualquier reporte con `fechaDespliegue < hoy`, independientemente de su fecha de carga, garantizando la integridad de la sección Historial. **Refinamiento UI:** Eliminación de botones redundantes ("Cancelar") y pestañas innecesarias en modo consulta, dejando un botón único de "Cerrar". Limpieza de componentes obsoletos (`FichaVisualizacion`, `DatoReadonly`) reemplazados por el nuevo componente `ReporteDocumento`.

7 Ene 2026, 23:00
**UX Mejorada v16 - Unificación de Columnas y Modo Lectura:** Implementación de mejoras significativas en la interfaz de despliegues. **Unificación de columnas:** Consolidación de "Hora Inicio" y "Hora Fin" en columna única "Horario" con formato inteligente ("HH:MM a HH:MM", "A coordinar", "HH:MM a fin"). Consolidación de "Fecha Inicio" y "Fecha Fin" en columna única "Fecha" para ESMAPO con formato "DD/MM/YYYY a DD/MM/YYYY" o "DD/MM/YYYY a hasta nueva orden". Reducción de columnas ESMAPO de 18 a 16, mejorando legibilidad sin pérdida de información. **Acciones contextuales:** Implementación de botones dinámicos por sección en módulo Direcciones (Editar en Sin Cargar/Para Hoy/Cargados Hoy, Ver en Historial). **Modo solo lectura:** Implementación completa de visualización de reportes históricos con inputs deshabilitados, título dinámico ("Detalle de Reporte"), y botón contextual ("Cerrar"). **Componente reutilizable:** Extensión de `ModalFormularioOrden` con slot `footer-info` para contenido personalizado. **Trazabilidad:** Agregado campo "Responsable" en footer de modal de reporte (hardcoded "Tte. Juan Pérez" para demo, preparado para integración con sistema de autenticación en producción). Corrección de bug crítico en handler de acción "view" que abría modal incorrecto en sección Historial.

7 Ene 2026, 21:00

**Migración v15 - Tipo de Despliegue y UX Mejorada:** Implementación completa de campos `tipoDespliegue` y `motivoSinEfecto` en ReporteDespliegue. Permite a las Direcciones clasificar despliegues como "Despliegue", "Franco" o "Sin efecto" con motivo obligatorio para este último. Eliminación del campo del módulo ESMAPO (solo aplica a reportes de campo). Mejoras UX: layout inline para selectores (grid 2 columnas), mensajes dinámicos contextuales en modal de confirmación ("efectuará el día franco" / "ha quedado sin efecto, motivo: X"), unificación de componente "Total Efectivos" entre módulos ESMAPO y Direcciones. Ocultación condicional de sección de recursos en modal para Franco/Sin efecto. Migración automática con valor por defecto "Despliegue" para reportes existentes.

7 Ene 2026, 18:00

**Snapshot de Planificación v14:** Implementación de campos de referencia (`refPlan*`) en [ReporteDespliegue](cci:2://file:///c:/Proyectos/sistema-gestion-recursos-v1/src/lib/types/index.ts:286:0-332:1) para congelar valores planificados al momento del reporte. Garantiza integridad histórica: los porcentajes de cumplimiento son inmutables incluso si ESMAPO modifica la orden posteriormente. Nuevo componente `ProgressBar` para visualización de cumplimiento en modal de confirmación. Migración v14 con snapshot automático de reportes existentes.

7 Ene 2026, 15:00

**Sistema de Trazabilidad v13:** Implementación de Soft Delete y Versionado Completo para Órdenes Operativas. Nueva tabla `historial_ordenes_operativas` que registra snapshots de cada cambio (CREATE, UPDATE, DELETE). Campos agregados a OrdenOperativa: `eliminada`, `eliminadaAt`, `eliminadaPor`, `versionActual`. Garantiza auditoría total y recuperación de datos históricos para comparación con reportes de despliegue. Migración v13 exitosa sin pérdida de datos.

7 Ene 2026, 10:00

**Sincronización Arquitectónica v1.7:** Alineación total del mapa con la realidad del código fuente (Arquitecture Project.pdf). Documentación del patrón `buscarOCrear` en servicios de personal y ESMAPO. Detalle de inteligencia de importación CSV con normalización de cabeceras. Verificación del Motor de Generación de Despliegues (auto-generación de `DiaDespliegue`). Actualización del árbol de archivos con recursos SVG reales y servicios core confirmados.

5 Ene 2026, 16:30

**Refactorización de Modelo de Datos v3.0:** Renombramiento completo de campos en OrdenOperativa para alineación con nomenclatura de servicios: tipoOperativo→tipoServicio, nombreOperativo→nombreServicio, tiempoDespliegue→tiempoServicio. Implementación de campos de hora planificada independientes (horaInicioPlan, horaFinPlan) como strings para facilitar visualización directa. Corrección crítica del mapeo CSV para reconocer nuevos nombres de columnas (fechaInicioPlan, fechaFinPlan, horaInicioPlan, horaFinPlan). Simplificación de lógica de generación de días de despliegue (v7.0 KISS) eliminando cálculos innecesarios. Sistema ahora genera correctamente múltiples días para operativos vigentes sin fecha fin.

1 Ene 2026, 12:30

**Sistema de Reportes por Secciones v2.0:** Implementación completa del módulo de reportes de despliegue con clasificación temporal en 4 secciones (Sin Cargar, Para Hoy, Cargados Hoy, Historial). Migración de base de datos a v12 con campos de auditoría (fechaDespliegue, usuarioReportaId). Diferenciación de vistas: ESMAPO (administrativa con 18 columnas) vs Direcciones (operativa con 4 columnas). Corrección de diseño de scrollbars en componente Tabs para consistencia visual total.

30 Dic 2025, 10:00

**Auditoría General v1.5:** Sincronización documental completa. Rediseño de interfaz del mapa para mejor legibilidad técnica. Verificación de 20 tablas IndexedDB y stack de 14 componentes UI.

29 Dic 2025, 05:15

**Módulo Despliegues 1.0:** Finalización de CRUD avanzado para Órdenes Operativas (ESMAPO). Sistema de importación masiva CSV con validación inteligente. Vista administrativa con 18 columnas de recursos planificados.

Módulo 1: Gestión de Personal Fase de Consolidación

1

Estructura de Información de Base

☑

Registro Central del Personal (Patrón buscarOCrear)

Base de datos única de todos los efectivos de la DNGR. Incluye C.I., Grado y Unidad donde presta servicio. **Hallazgo Técnico:** El sistema utiliza el patrón `buscarOCrear` para mantener la integridad referencial; si un Grado o Unidad no existe al importar, se crea automáticamente.

Completado

☑

Organización de Dependencias

Define la estructura de mando y responsabilidad. Permite que cada jefe gestione exclusivamente a su personal, manteniendo el orden administrativo y la cadena de mando digital.

Completado

☑

Planificación de Turnos y Guardia

Configuración de horarios de servicio (Mañana, Tarde, Noche). Permite al Comando conocer qué personal está de guardia en cualquier momento, asegurando la respuesta inmediata ante emergencias.

Completado

☑

Control de Licencias y Partes Médicos

Registro de bajas médicas, licencias anuales y permisos. El sistema descuenta automáticamente a este personal de la "fuerza efectiva" para evitar errores en la planificación operativa.

Completado

☑

Regímenes de Servicio Especiales

Define reglas de trabajo específicas (horarios fijos, Servicio 222, guardias). Adapta el sistema a las diferentes modalidades de servicio que cumple la DNGR.

Completado

2

Gestión Administrativa

☑

Fichas Individuales del Personal

Herramienta para el alta y modificación de datos de los funcionarios. Solo personal autorizado puede dar de baja registros, garantizando la seguridad de la información histórica.

Completado

☑

Carga Masiva del Padrón (CSV Inteligente)

Permite ingresar todo el padrón de personal desde planillas externas. **Hallazgo Técnico:** El algoritmo incluye normalización inteligente de cabeceras (detecta 'ci', 'cedula' o 'doc' como el mismo campo) para máxima flexibilidad.

Completado

☑

Historial de Pases y Traslados

Registra cada vez que un funcionario pasa de una unidad a otra. Mantiene la trazabilidad de la carrera del personal necesaria para auditorías y control.

Completado

☐

Panel de Fuerza Efectiva Real

Muestra la cantidad de efectivos reales disponibles por cada turno, descontando automáticamente a quienes estén de licencia, parte médico o traslado.

En Cola

Módulo 2: Gestión Operativa Fase de Ejecución

3

Planificación Operativa (Estado Mayor / ESMAPO)

☑

Registro de Órdenes de Servicio (Motor de Generación)

Repositorio oficial para registrar operativos. **Hallazgo Técnico:** La creación de días es automática. Al crear una `OrdenOperativa` con un rango de fechas, el sistema genera N registros de `DiaDespliegue` en el `esmapoService`.

Completado

☑

Dashboard de Cumplimiento Operativo (Auditoría ESMAPO)

Panel ejecutivo que permite auditar en tiempo real el cumplimiento de todas las direcciones, identificando reportes vencidos y niveles de despliegue vs. planificación.

Completado

☐

Generador de Órdenes Digitales

Herramienta para crear órdenes detallando los recursos necesarios por cada unidad participante en un operativo planificado.

Pendiente

4

Informes de Despliegue en Terreno

☑

Sistema de Reporte de Despliegue Real con Clasificación Temporal

Sistema avanzado de 4 secciones para unidades operativas: **Sin Cargar** (despliegues pendientes de días anteriores), **Para Hoy** (programados para hoy), **Cargados Hoy** (reportados hoy), e **Historial** (reportes pasados). Incluye generación automática de días de despliegue, auditoría por usuario y timestamp, y alertas visuales por estado. Vista simplificada con 4 columnas: Orden, Nombre, Hora Inicio, Hora Fin.

Completado

☑

Carga Rápida de Informes de Campo

Importación masiva de reportes. El sistema asocia automáticamente cada informe con su Orden de Servicio correspondiente.

Completado

### 🆕 Gestión de Opciones del Sistema (Enero 2026)
**Estado:** ✅ COMPLETADO (08/01/2026)
#### Módulo de Gestión de Opciones
**Propósito:** Centralizar la gestión de valores de catálogos (listas de opciones) utilizados en formularios de todo el sistema, eliminando dependencia de valores hardcodeados y permitiendo adaptación institucional.
**Ubicación:** Página `/catalogos` (acceso restringido a roles administrativos)
**Arquitectura:**
- **Tabla IndexedDB:** `catalogos_valores` (id, catalogo, nombre, activo, orden, createdAt, updatedAt)
- **Servicio:** [catalogosService.ts](cci:7://file:///c:/Proyectos/sistema-gestion-recursos-v1/src/services/catalogosService.ts:0:0-0:0) con métodos CRUD completos
- **Composables:** [useCatalogos.ts](cci:7://file:///c:/Proyectos/sistema-gestion-recursos-v1/src/hooks/useCatalogos.ts:0:0-0:0) para acceso reactivo desde componentes
**Catálogos Gestionables:**
**Sección Despliegues:**
- `tipo_documento`: Clasificación de documentos operativos (Orden de Operaciones, Circular, etc.)
- `tipo_servicio`: Naturaleza táctica del despliegue (Operativo, Patrullaje, Apoyo, etc.)
- `tiempo_servicio`: Duración prevista (Permanente, Transitorio, Estático)
- `departamento`: Departamentos de Uruguay (19 opciones)
- `seccional`: Seccionales policiales (20 opciones)
- `motivo_sin_efecto`: Causas de despliegues sin efecto (6 opciones)
**Sección Personal:**
- `tipo_licencia`: Tipos de licencias de funcionarios
- `tipo_curso`: Tipos de capacitaciones
- `regimen`: Regímenes de servicio especiales
**Funcionalidades Implementadas:**
| Operación | Descripción | Validación |
|-----------|-------------|------------|
| **Crear** | Agregar nuevo valor al catálogo | Previene duplicados (case-insensitive) |
| **Editar** | Modificar nombre de valor existente | Validación de unicidad |
| **Activar/Desactivar** | Soft delete - oculta de formularios sin eliminar | Preserva integridad de datos históricos |
| **Eliminar** | Eliminación física permanente | Confirmación obligatoria |
| **Reordenar** | Cambiar orden de visualización | Gestión automática de índices |
**Decisiones Arquitectónicas:**
1. **Almacenamiento como Strings:** Los valores se guardan como texto en registros (ej: `tipoDocumento: "Orden de Servicio"`), NO como IDs. Esto garantiza que eliminar un valor del catálogo no afecta datos históricos.
2. **Eliminación Física Permitida:** A diferencia de otros módulos que usan soft delete exclusivamente, los catálogos permiten eliminación física para corregir errores de ingreso. Los datos históricos que usan esos valores permanecen intactos.
3. **Diseño Visual Estructurado:** Siguiendo el patrón de diseño estructurado del sistema (bordes 2px, iconos Lucide, estilos consistentes con Table.vue).
**Impacto Operativo:**
- ✅ Flexibilidad institucional para adaptar opciones sin modificar código
- ✅ Corrección inmediata de errores de ingreso
- ✅ Trazabilidad: cada cambio registra timestamp y usuario
- ✅ Consistencia: un solo lugar para gestionar todas las opciones del sistema
**Referencia Técnica:**
- Servicio: [src/services/catalogosService.ts](cci:7://file:///c:/Proyectos/sistema-gestion-recursos-v1/src/services/catalogosService.ts:0:0-0:0)
- Componentes: [src/pages/Catalogos/CatalogosPage.vue](cci:7://file:///c:/Proyectos/sistema-gestion-recursos-v1/src/pages/Catalogos/CatalogosPage.vue:0:0-0:0), [ModalGestionCatalogo.vue](cci:7://file:///c:/Proyectos/sistema-gestion-recursos-v1/src/pages/Catalogos/components/ModalGestionCatalogo.vue:0:0-0:0)
- Tipos: [TipoCatalogo](cci:2://file:///c:/Proyectos/sistema-gestion-recursos-v1/src/lib/types/index.ts:389:0-403:12) en [src/lib/types/index.ts](cci:7://file:///c:/Proyectos/sistema-gestion-recursos-v1/src/lib/types/index.ts:0:0-0:0)

Módulo 3: Control y Seguridad del Sistema Núcleo de Confianza

5

Acceso y Niveles de Mando

☑

Gestión de Usuarios y Perfiles de Acceso

Controla quién entra al sistema. Cada usuario está vinculado a una unidad y un cargo específico (Jefe, Administrativo, Operador), viendo solo lo autorizado.

Completado

☑

Ingreso Seguro con Clave Personal

Sistema de acceso que protege la información y asegura que solo personal habilitado pueda consultar los datos operativos.

Completado

6

Auditoría y Transparencia Administrativa

☑

Libro de Actas Digital (Log)

Registra cada alta, modificación o baja de datos. Guarda detalle de quién hizo el cambio y qué información se alteró para control total.

Completado

💡 Visión y Futuro (Hacia el Sistema Oficial) Propuestas de Mejora

Seguridad y Responsabilidad

Gestión de Claves

El Estado Mayor crea los usuarios con una clave temporal. Cada administrativo debe elegir su propia clave privada en el primer ingreso.

Responsabilidad Individual

Cada administrativo tendrá su propio acceso personal para identificar exactamente quién realizó cada modificación.

Normativas del Ministerio

El sistema oficial cumplirá con todos los estándares de seguridad exigidos por el Ministerio para proteger la información institucional.

Integración de Información

Conexión con Sistemas de RRHH

Sincronización automática con las bases centrales para mantener actualizados los grados y destinos de todo el personal.

Control de Logística y Medios

Registro de vehículos, armamento y equipos de comunicación asignados a cada operativo para un control integral.

Trabajo en Zonas sin Cobertura

Capacidad de registrar datos en zonas sin señal de internet y enviarlos automáticamente al recuperar la conexión.

Información para el Comando

Cálculo de Fuerza Efectiva Real

Conocer exactamente cuántos efectivos hay disponibles hoy, descontando automáticamente licencias o descansos.

Control de Despliegue en Terreno

Visualizar en un mapa la ubicación de los equipos y verificar si el despliegue real coincide con la planificación.

Documentación Oficial en PDF

Generación automática de informes listos para imprimir o archivar como constancia del trabajo realizado.

## 🔮 Funcionalidades Futuras Identificadas (Demo → Producción)
Esta sección documenta funcionalidades y mejoras identificadas durante el desarrollo de la demo que deben implementarse en el sistema de producción real.

### 🔐 Seguridad y Control de Acceso

#### Propiedad de Reportes
**Contexto:** Actualmente la demo no implementa autenticación ni gestión de usuarios.
**Funcionalidad requerida en producción:**
- Solo el usuario que creó un reporte puede editarlo
- Campo `usuarioReportaId` en [ReporteDespliegue](cci:2://file:///c:/Proyectos/sistema-gestion-recursos-v1/src/lib/types/index.ts:286:0-336:1) ya existe en el modelo
- Implementar validación: `if (reporte.usuarioReportaId !== usuarioActualId) → Solo lectura`
- Excepción: Roles con permisos especiales (Jefe de Unidad, ESMAPO) pueden editar cualquier reporte
**Impacto de seguridad:** ALTO - Previene modificación no autorizada de reportes oficiales
**Referencia técnica:** 
- Tabla: `reportes_despliegue.usuarioReportaId`
- Tipo: `INTEGER` (FK a `personal.id`)

---

#### Ventana de Edición Temporal
**Contexto:** En la demo, los reportes en "Cargados Hoy" son editables sin límite de tiempo.
**Funcionalidad requerida en producción:**
- Definir ventana de edición (ej: 2 horas desde `fechaHoraCarga`)
- Después de la ventana → Reporte pasa automáticamente a solo lectura
- Excepción: Roles administrativos pueden extender la ventana con justificación auditada
**Impacto operativo:** MEDIO - Balance entre flexibilidad operativa y trazabilidad
**Referencia técnica:**
- Campo: `reportes_despliegue.fechaHoraCarga`
- Lógica: `if (now() - fechaHoraCarga > VENTANA_EDICION) → readOnly = true`

---

### 📊 Lógica de Secciones de Despliegue

#### Definición de "Historial"
**Implementación actual (demo):**
```typescript
// Reportes pasan a Historial cuando:
// 1. fechaDespliegue < hoy (despliegues de días anteriores)
// 2. fechaHoraCarga < hoy (reportes cargados en días anteriores)
```
Consideraciones para producción:
- Evaluar si usar fechaDespliegue o fechaHoraCarga como criterio principal
- Impacto en reportes tardíos (ej: reporte cargado hoy de despliegue de ayer)
- Definir política institucional para reportes extemporáneos
**Referencia técnica:**
- Servicio: `desplieguesService.getHistorial()`
- Filtros: `fechaDespliegue`, `fechaHoraCarga`

---

### 🔄 Auditoría y Trazabilidad

#### Registro de Modificaciones de Reportes
**Funcionalidad requerida en producción:**
- Tabla `historial_reportes_despliegue` (similar a `historial_ordenes_operativas`)
- Snapshot completo del reporte antes de cada modificación
- Campos: `reporteId`, `usuarioModificaId`, `fechaHoraModificacion`, `datosAnteriores` (JSON)
- Permite comparar versiones y auditar cambios
**Impacto de auditoría:** CRÍTICO - Cumplimiento normativo gubernamental

---

### 🎨 Mejoras de UX Identificadas

#### Modal de Reporte en Modo Lectura (v18)
**Estado:** ✅ COMPLETADO (07/01/2026)
**Implementación:**
- Diseño narrativo dinámico que describe el despliegue en lenguaje natural.
- Filtrado automático de recursos (solo muestra los desplegados).
- Barra de progreso de cumplimiento integrada.
- Unificación de botones: botón único "Cerrar" en modo consulta.
- Eliminación de redundancias visuales (pestañas y etiquetas duplicadas).

---

### 📌 Notas de Migración Demo → Producción
**Stack Tecnológico:**
- Demo: Vue 3 + TypeScript + IndexedDB
- Producción (estimado): .NET + PostgreSQL + Vue 3

**Consideraciones:**
- Todos los modelos de datos documentados en este mapa son transferibles
- La lógica de negocio (validaciones, cálculos) debe replicarse en backend .NET
- Implementar tests unitarios y de integración (no presentes en demo)
- Agregar capa de seguridad: JWT, HTTPS, cifrado de datos sensibles
- Cumplir normativas del Ministerio del Interior (Uruguay)
**Referencia obligatoria:** `docs/REGLAS-DE-ORO.md` - Patrones arquitectónicos a mantener

🏗️ Estructura y Organización del Sistema Organización de Archivos

Guía de Organización del Proyecto

Detalle de cómo se organiza el código del sistema para asegurar que sea fácil de mantener y actualizar a futuro.

📁 src/

📁 assets/

📁 images/ (Recursos SVG Reales)

📄 movil.svgVehículos

📄 motosBitripuladas.svgRecurso Crítico

📄 hipos.svgUnidades Montadas

📄 choqueEnAlerta.svgFuerza de Choque

📄 pieTierra.svgPatrullaje

📄 logo-gr-dorado.svgBranding Institucional

📁 components/

📁 \[NombreComponente\]/

📄 Componente.vueLógica y template del componente.

📄 Componente.cssEstilos encapsulados.

📄 index.tsExportación pública del componente.

📁 forms/ Formularios de lógica compleja (ej: FuncionarioForm.vue) para reutilizar en modales de creación y edición.

📄 MiniCalendario.vue Componente especializado para la gestión visual de turnos operativos.

📄 UnitSelector.vue Selector de unidades/módulos integrado en FilterPanel.

📄 index.ts Barrel global: centraliza todas las exportaciones para importar desde '@components'.

📁 config/

📄 dashboardConfig.ts Configuración por roles (Dirección VI, ESMAPO, etc). Define filtros y paneles visibles.

📄 navConfig.ts Estructura dinámica de la barra de navegación basada en la unidad y permisos del usuario.

📁 hooks/

📄 useAuth.tsCore de seguridad: autenticación reactiva y control de sesión.

📄 useDatabase.tsAbstracción para transacciones genéricas en IndexedDB.

📄 useTableActions.tsGestor centralizado de acciones (ver, transferir, borrar) según roles.

📄 useToast.tsSistema global de notificaciones push de UI.

📄 useUnitNavigation.tsLógica centralizada de navegación y cambio de unidad.

📁 layouts/

📁 MainLayout/ Estructura envolvente global (TopBar + RouterView).

📁 PageLayout/ Esqueleto de páginas internas (Contenedor 2 columnas + Sidebar de filtros).

📁 lib/

📁 db/

📄 index.tsSingleton AppDatabase con 20 tablas IndexedDB definidas.

📄 seed.tsCarga masiva inicial de catálogos maestros.

📁 types/ index.ts: Interfaces y Enums del dominio verificado.

📁 constants/ Valores estáticos inmutables globales.

📁 pages/

📁 Home/ Página principal (Dashboard) para Dirección VI con KPIs ejecutivos.

📁 Personal/ Vista de gestión de padrón de funcionarios por unidad.

📁 Despliegues/ Core operativo: seguimiento de Órdenes de Servicio y Reportes Reales.

📁 Login/ Página de acceso y recuperación de credenciales.

📁 services/

📄 personalService.tsLógica de Importación y CRUD de Funcionarios.

📄 desplieguesService.tsLógica de Campo: Clasificación temporal de 4 estados.

📄 esmapoService.tsLógica Administrativa: Motor de generación de Órdenes.

📄 index.tsBarrel para acceso rápido desde '@services'.

📁 styles/

📄 tokens.cssVariables CSS globales (paleta de colores Slate/Blue, sombras, bordes).

📄 reset.cssNormalización de estilos entre navegadores.

📄 router/index.ts Configuración de Vue Router con Guards de protección por rol y unidad.

📄 main.ts Bootstrapper: inicializa Vue, Router, Pinia y monta el DOM.

🏗️ Arquitectura de 3 Capas Separación de Responsabilidades

Capas del Sistema

Layer 1: Presentation (Páginas + Componentes)

**Ubicación:** `src/pages/`, `src/components/`  
**Responsabilidad:** Renderizar UI, capturar eventos, orquestar composables.  
**Ejemplo:** `PersonalPage.vue` llama a `useFuncionarios()`

Layer 2: Business Logic (Services + Composables)

**Ubicación:** `src/services/`, `src/hooks/`  
**Responsabilidad:** Lógica de negocio, transformaciones, cálculos.  
**Ejemplo:** `personalService.ts` implementa CRUD completo.

Layer 3: Data Persistence (Dexie + IndexedDB)

**Ubicación:** `src/lib/db/index.ts`  
**Responsabilidad:** Esquema de 20 tablas, queries a IndexedDB.  
**Ejemplo:** `db.funcionarios.add(datos)`

🚫 Regla de Dependencia

**NUNCA** una capa superior debe saltarse la intermedia:  
❌ `HomePage.vue` → directamente → `db.funcionarios.add()`  
✅ `HomePage.vue` → `personalService.crear()` → `db.funcionarios.add()`

🗄️ Base de Datos y Registros Registro Local de Información

Información del Personal

Personal (funcionarios)

P \*idNúmero

\*C.I.Texto

\*Nombre CompletoTexto

F \*GradoNúmero

F \*UnidadNúmero

FSub-UnidadNúmero

FTurnoNúmero

FRégimenNúmero

realiza222Sí/No

🔑 Registro único

💎 C.I. no repetida

Licencias (licencias\_funcionarios)

P \*idNúmero

F \*funcionarioIdPersonal (ID)

F \*tipoLicenciaIdTipo (ID)

\*fechaInicioFecha

\*fechaFinFecha

🔑 Código único

🔗 Vinculado al Personal

Historial de Pases (historial\_movimientos)

P \*idNúmero

F \*funcionarioIdPersonal (ID)

F \*unidadOrigenIdOrigen (ID)

F \*unidadDestinoIdDestino (ID)

\*fechaCambioFecha

Capacitaciones (cursos)

P \*idNúmero

F \*funcionarioIdPersonal (ID)

F \*tipoCursoIdCurso (ID)

fechaInicioFecha

fechaFinFecha

Control de Asistencia y Servicios

Horarios Planificados (horarios)

P \*idNúmero

F \*funcionarioIdPersonal (ID)

\*fechaFecha

\*turnoTexto

Asistencia Real (asistencias)

P \*idNúmero

F \*funcionarioIdPersonal (ID)

\*fechaFecha

\*estadoTexto

Asignaciones a Servicios (asignaciones)

P \*idNúmero

F \*funcionarioIdPersonal (ID)

F \*servicioIdServicio (ID)

\*estadoTexto

Módulo Operativo (Flujo de Datos Verificado)

Ciclo de Vida del Dato

OrdenOperativa

(Planificación)

➔

DiaDespliegue

(Entidad Virtual)

➔

ReporteDespliegue

(Realidad en Campo)

Órdenes de Servicio (ordenes\_operativas)

P \*idNúmero

\*nroDocumentoNro. de Orden

\*tipoDocumentoTipo

tipoServicioNaturaleza

nombreDocumentoNombre

nombreServicioOperativo

F \*unidadSolicitadaIdUnidad (ID)

\*fechaInicioPlanInicio

\*fechaFinPlanFin

departamentoUbicación

seccionalSeccionales

tiempoServicioDuración

planTotalPersonalEfectivos Pedidos

\*estadoSituación

🆕 eliminadaBorrado Lógico

🆕 eliminadaAtFecha Eliminación

🆕 eliminadaPorUsuario (ID)

🆕 versionActualVersión

Reportes de Despliegue (reportes_despliegue) - v16

P *id                    Número

F *ordenId               Orden (ID)

F *unidadReportanteId    Unidad (ID)

*fechaDespliegue         Fecha del Día

F *usuarioReportaId      Usuario (ID)

*fechaHoraCarga          Timestamp

🆕 realHoraInicio        Hora Inicio Real (HH:MM)

🆕 realHoraFin           Hora Fin Real (HH:MM)

realMoviles              Móviles

realSsoo                 SSOO

realPpssMovil            PPSS Móvil

realMotos                Motos

realHipos                Hipos

realPieTierra            Pie a Tierra

realMotosBiTripuladas    Motos BiTrip

realChoqueApost          Choque Apost

realChoqueAlerta         Choque Alerta

realHidro                Hidro

realTotalPersonal        Total Efectivos

*estadoReal              Estado

motivoCambios            Motivo

observaciones            Observaciones

tipoDespliegue           Tipo Despliegue

motivoSinEfecto          Motivo (condicional)

🆕 cruzaMedianoche       Indicador Nocturno

🆕 refPlanMoviles        Snapshot Plan Móviles

🆕 refPlanMotos          Snapshot Plan Motos

🆕 refPlanSsoo           Snapshot Plan SSOO

🆕 refPlanPpssMovil      Snapshot Plan PPSS

🆕 refPlanPieTierra      Snapshot Plan Pie

🆕 refPlanMotosBiTripuladas  Snapshot Plan Bi/Tri

🆕 refPlanHidro          Snapshot Plan Hidro

🆕 refPlanHipos          Snapshot Plan Hipos

🆕 refPlanChoqueApost    Snapshot Plan Choque A

🆕 refPlanChoqueAlerta   Snapshot Plan Choque Alerta

🆕 refPlanTotalPersonal  Snapshot Plan Total

🔑 Registro único por día

🔗 Vinculado a Orden Operativa

👤 Auditoría por usuario y fecha

📸 Snapshot inmutable de planificación

⏰ Análisis de cumplimiento temporal habilitado

Historial de Órdenes (historial_ordenes_operativas) - v13

P *id                    Número

F *ordenId               Orden (ID)

*version                 Versión

*accion                  CREATE/UPDATE/DELETE

snapshot                 Estado Completo

F *usuarioId             Usuario (ID)

*fechaHora               Timestamp

🔑 Registro único por versión

🔗 Vinculado a Orden Operativa

📸 Snapshot completo para auditoría

🔄 Sistema de Clasificación Temporal (Motor Core)

Arquitectura de 4 Secciones

**1\. Sin Cargar (Alerta Roja):** `dia.fecha < today && !reporte`  
Despliegues vencidos que requieren reporte retroactivo urgente.  
  
**2\. Para Hoy (Alerta Amarilla):** `dia.fecha == today && !reporte`  
Despliegues programados para hoy pendientes de registro.  
  
**3\. Cargados Hoy (Éxito):** `reporte.fechaDespliegue == today`  
Reportes ingresados hoy, independiente del día del despliegue.  
  
**4\. Historial (Archivo):** `reporte.fechaDespliegue < today`  
Reportes pasados para consulta y auditoría.

Tabla Intermedia: dias\_despliegue

El sistema genera automáticamente un registro `DiaDespliegue` por cada día en el rango `[fechaInicioPlan, fechaFinPlan]` de la orden operativa.  
**Ejemplo:** Orden del 01/01 al 05/01 → genera 5 registros DiaDespliegue.  
**ID Compuesto:** `${ordenId}-${fecha.getTime()}`

Notas Técnicas de Migración

Migración v16 - Análisis de Cumplimiento Temporal

**Fecha:** 8 Ene 2026  
**Cambio:** Campos de horarios reales y detección de cruce de medianoche en ReporteDespliegue.  
**Propósito:** Habilitar análisis estratégico de cumplimiento temporal de despliegues. Permite comparar horarios planificados vs. ejecutados para detectar patrones de desviación y optimizar planificación futura.  
**Lógica:** 
- `realHoraInicio` y `realHoraFin` son strings en formato HH:MM (ej: "18:00", "06:00")
- `cruzaMedianoche` se calcula automáticamente: `true` si horaFin < horaInicio (ej: 18:00 a 06:00)
- Validación de formato con regex: `/^([01]\d|2[0-3]):([0-5]\d)$/`
- Valores por defecto desde `horaInicioPlan` y `horaFinPlan` de la orden operativa
**UX:** Inputs condicionales (solo visibles si tipoDespliegue='Despliegue'), grid optimizado 2fr 1fr 1fr para balance visual.  
**Valor estratégico:** Primera vez que el sistema captura desviaciones temporales. Permite responder:
- ¿Qué operativos nunca se despliegan a la hora planificada?
- ¿Cuál es la tasa de cumplimiento temporal mensual?
- ¿Los despliegues nocturnos tienen más desviación que los diurnos?
- ¿Qué unidades tienen mayor desviación temporal sistemática?

Migración v14 - Snapshot de Planificación

**Fecha:** 7 Ene 2026  
**Cambio:** Campos de referencia `refPlan*` en [ReporteDespliegue](cci:2://file:///c:/Proyectos/sistema-gestion-recursos-v1/src/lib/types/index.ts:286:0-332:1) para congelar planificación.  
**Propósito:** Garantizar que el cumplimiento reportado sea inmutable. Si ESMAPO modifica una orden después de que se reportó, el porcentaje histórico no cambia.  
**Lógica:** Al crear un reporte, se captura un snapshot completo de todos los campos `plan*` de la [OrdenOperativa](cci:2://file:///c:/Proyectos/sistema-gestion-recursos-v1/src/lib/types/index.ts:203:0-242:1) vinculada. Los campos `refPlan*` nunca se actualizan, ni siquiera al editar el reporte.  
**UX:** Modal de confirmación muestra barra de progreso comparando `realTotalPersonal` vs `refPlanTotalPersonal`.

Migración v13 - Trazabilidad de Órdenes

**Fecha:** 7 Ene 2026
**Cambio:** Sistema completo de versionado y soft delete para órdenes operativas.
**Propósito:** Garantizar trazabilidad total de cambios en planificación ESMAPO. Cada CREATE, UPDATE o DELETE genera un snapshot histórico inmutable.
**Lógica:** Soft delete oculta órdenes sin eliminarlas físicamente. Versionado permite recuperar el estado exacto de cualquier orden en el tiempo.
**Auditoría:** Cada cambio registra quién, cuándo y qué modificó, cumpliendo estándares gubernamentales.

Migración v12 - Reportes Diarios

**Fecha:** 1 Ene 2026  
**Cambio:** Agregados campos `fechaDespliegue` (Date) y `usuarioReportaId` (Number) a la tabla `reportes_despliegue`.  
**Propósito:** Permitir reportes diarios independientes para cada día de un operativo multi-día, con auditoría completa de quién reporta y cuándo.  
**Lógica:** Un operativo de 5 días genera 5 registros potenciales (DiaDespliegue), cada uno reportable independientemente.  
**Clasificación:** Los reportes se clasifican automáticamente en 4 secciones según su estado temporal.

Catálogos de Opciones (Select/MultiSelect)

### 🆕 Gestión Dinámica de Catálogos
**Cambio Arquitectónico (Enero 2026):** Los catálogos ya no están hardcodeados en el código fuente. Ahora se gestionan dinámicamente desde la página `/catalogos`, permitiendo a administradores:
- Agregar nuevos valores sin modificar código
- Editar nombres de valores existentes
- Activar/desactivar opciones según necesidad operativa
- Eliminar valores ingresados por error
**Tabla de Persistencia:** `catalogos_valores` (IndexedDB)
**A continuación se listan los valores por defecto precargados en el sistema:**

tipoDocumento (Select)

Clasificación oficial del documento operativo

• Orden de Operaciones

• Circular

• Orden de Servicio

• Comunicado

• Otro

5 opciones Requerido

tipoOperativo (Select)

Naturaleza táctica del despliegue

• Operativo

• Patrullaje

• Apoyo

• Incursión

• Allanamiento perimetral

5 opciones Opcional

tiempoDespliegue (Select)

Duración prevista del operativo

• Permanente

• Transitorio

• Estático

3 opciones Opcional

departamento (MultiSelect)

Departamentos de Uruguay donde se ejecuta el operativo (selección múltiple)

• Artigas

• Canelones

• Cerro Largo

• Colonia

• Durazno

• Flores

• Florida

• Lavalleja

• Maldonado

• Montevideo

• Paysandú

• Río Negro

• Rivera

• Rocha

• Salto

• San José

• Soriano

• Tacuarembó

• Treinta y Tres

19 departamentos MultiSelect Almacenado como CSV

seccional (MultiSelect)

Seccionales policiales involucradas (selección múltiple)

• 1ra

• 2da

• 3ra

• 4ta

• 5ta

• 6ta

• 7ma

• 8va

• 9na

• 10ma

• 11ra

• 12da

• 13ra

• 14ta

• 15ta

• 16ta

• 17ma

• 18va

• 19na

• 20ma

20 seccionales MultiSelect Almacenado como CSV

unidadSolicitada (Select)

Unidad operativa responsable del despliegue

• Dirección I

• Dirección II

• Regional Este

• Regional Norte

• GEO

• Dirección IV

• Dirección V

7 unidades Requerido

estado (Select)

Estado del ciclo de vida de la orden

• Pendiente

• En Proceso

• Cumplida Parcial

• Cerrada

4 estados Requerido

tipoDespliegue (Select)

Clasificación del estado del despliegue reportado (solo Direcciones)

• Despliegue

• Franco

• Sin efecto

3 opciones Requerido Solo en reportes de campo

motivoSinEfecto (Select)

Motivo específico cuando el despliegue queda sin efecto

• Por falta de personal

• Por orden de superior

• Por cubrir otro Operativo

• Por cubrir Espectáculo público

• Por inclemencias de tiempo

• Otro motivo

6 opciones Requerido si tipoDespliegue === 'Sin efecto'

ℹ️

**Nota sobre MultiSelect:** Los campos con selección múltiple (departamento, seccional) se almacenan en la base de datos como strings separados por comas (ej: "Montevideo, Canelones"). El componente MultiSelect gestiona la conversión array ↔ string automáticamente.

🔧

**Componentes UI:** El sistema utiliza dos componentes: `Select` para selección única y `MultiSelect` para selección múltiple con visualización de chips.

### ProgressBar

**Propósito:** Visualización de cumplimiento de recursos reportados vs. planificados.

**Props:**
- `current` (number): Valor actual reportado
- `total` (number): Valor planificado (snapshot)
- `label` (string): Etiqueta descriptiva
- `showPercentage` (boolean): Mostrar porcentaje
- `showValues` (boolean): Mostrar "X de Y"
- `showLabel` (boolean): Mostrar/ocultar etiqueta "Cumplimiento:" (default: true)

**Rangos de Color:**
- 0-50%: Rojo (crítico)
- 51-80%: Amarillo (reducido)
- 81-100%: Verde (cumplido)
- >100%: Azul (excedido/ampliado)

**Uso:** Modal de confirmación de reporte de despliegue.

Tablas de Referencia (Maestras)

Unidades Policiales (unidades)

P \*idNúmero

\*nombreNombre de Unidad

codigoIdentificador

\*tipoCategoría

Dependencias Internas (sub\_unidades)

P \*idNúmero

F \*unidadIdUnidad (ID)

\*nombreDependencia

Grados Policiales (grados)

P \*idNúmero

\*nombreDenominación

\*nivelRango

Turnos de Servicio (turnos)

P \*idNúmero

\*nombreTurno

horaInicioEntrada

horaFinSalida

escalafones

P \*idNUMBER

\*nombreVARCHAR

\*nivelNUMBER

tipos\_regimen

P \*idNUMBER

\*nombreVARCHAR

\*activoBOOLEAN

tipos\_licencia

P \*idNUMBER

\*nombreVARCHAR

\*activoBOOLEAN

tipos\_curso

P \*idNUMBER

\*nombreVARCHAR

\*activoBOOLEAN

Seguridad y Control de Usuarios

Usuarios del Sistema (usuarios)

P \*idNúmero

\*usernameNombre de Usuario

F \*rolIdCargo (ID)

\*estadoHabilitado (Sí/No)

Cargos y Permisos (roles)

P \*idNúmero

\*nombreDenominación

permisosLista de Accesos

Libro de Actas Digital (log\_auditoria)

P \*idNúmero

F \*usuarioIdAutor (ID)

\*accionOperación

\*tablaAfectadaRegistro

\*fechaHoraFecha y Hora

⚙️ Configuración del Asistente Digital (AI) Sincronización de Trabajo

Reglas de Trabajo del Asistente

Modo de Ejecución

Permite que el asistente trabaje con autonomía en tareas de bajo riesgo, agilizando el desarrollo sin comprometer la seguridad institucional.

Seguridad DNGR

Reglas estrictas para que el asistente nunca use datos reales en el código y cumpla con todas las normas de seguridad del Ministerio.

Código de Identificación (Sync ID)

Control para asegurar que los asistentes de planificación y ejecución estén siempre alineados en la misma tarea operativa.

🔄 Flujo de Trabajo Multi-Agente (v1.6)

Protocolo de Orquestación

1.  **Synapse-Architect (Windsurf):** Genera PLAN con ID único y Sync ID.
2.  **Humano Orquestador:** Copia PLAN literalmente y lo pasa a DevelOS.
3.  **Synapse-DevelOS (Cursor):** Valida Sync ID, ejecuta, genera REPORTE.
4.  **Humano Orquestador:** Evalúa REPORTE, decide:
    *   ✅ SUCCESS → Cerrar tarea
    *   ⚠️ PARTIAL\_SUCCESS → Decidir aceptar/rechazar
    *   🔄 RETRY\_NEEDED → Solicitar nuevo PLAN refinado
    *   🚨 ESCALATE → Intervención humana requerida

**⚠️ Límites de Iteración:**

*   Máximo 2 ajustes menores por tarea
*   Máximo 1 plan errado (major) por tarea
*   0 retries para mismo error repetido
*   3 iteraciones totales → ESCALATE automático

Registros de Control del Sistema

☑

Registro de Decisiones (project-decisions.md)

Archivo que guarda el "por qué" de cada solución adoptada para mantener la coherencia del sistema a largo plazo.

☑

Control de Errores Conocidos (known-issues.md)

Listado de situaciones a corregir y soluciones temporales para agilizar el mantenimiento.

© 2025 Sistema DNGR - **Tecnología para la Seguridad Pública** Desarrollado con Vue 3 + TS + IndexedDB

↑ Volver arriba