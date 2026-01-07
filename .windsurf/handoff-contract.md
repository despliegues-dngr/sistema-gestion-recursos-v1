# 🤝 Contrato de Handoff v1.0
> **Sync ID:** `HANDOFF-2025-12-30` 
> **Última actualización:** 2025-12-30
> **Propósito:** Fuente única de verdad para la comunicación Architect ↔ DevelOS

---

## 📋 Documento de Referencia del Proyecto
> **⚠️ OBLIGATORIO:** Antes de cualquier implementación, consultar:
> [docs/REGLAS-DE-ORO.md](cci:7://file:///c:/Proyectos/sistema-gestion-recursos-v1/docs/REGLAS-DE-ORO.md:0:0-0:0) - Reglas de desarrollo DNGR

---

## Estados de Ejecución

| Estado | Emoji | Significado | Acción Architect | Acción DevelOS |
|--------|-------|-------------|------------------|----------------|
| `SUCCESS` | ✅ | Implementado 100% | **FIN** - Cerrar tarea | Emitir cierre exitoso |
| `PARTIAL_SUCCESS` | ⚠️ | Implementado con ajustes | **FIN** - Usuario decide | Emitir cierre + listar ajustes |
| `RETRY_NEEDED` | 🔄 | Plan necesita refinamiento | Generar plan refinado | Solicitar nuevo plan |
| `BLOCKED_CONTEXT_DRIFT` | ⏸️ | Código cambió vs hallazgos | Re-leer + nuevo plan | Reportar discrepancia |
| `BLOCKED_MISSING_INFO` | ❓ | Falta info del usuario | Preguntar → nuevo plan | Reportar qué falta |
| `BLOCKED_ENVIRONMENT` | 🔧 | Deps/CLI no disponibles | Plan con pasos setup | Reportar qué falta |
| `BLOCKED_POLICY` | 🚫 | Reglas lo prohíben | Ajustar propuesta | Reportar conflicto |
| `ESCALATE` | 🚨 | Requiere intervención humana | **FIN** - Usuario decide | Reportar + detener |

---

## Límites de Iteración

| Tipo | Máximo | Si excede |
|------|--------|-----------|
| Ajustes menores | 2 | → ESCALATE |
| Plan errado (major) | 1 | → ESCALATE |
| Mismo error repetido | 0 | → ESCALATE inmediato |
| **Total por tarea** | 3 | → ESCALATE |

---

## Regla de Oro
> El ciclo termina cuando: `SUCCESS`, `PARTIAL_SUCCESS` aceptado, o `ESCALATE`.

---

## 🔄 Flujo de Orquestación

┌─────────────────────────────────────────────────────────────────────────┐
│ 📁 CARPETA COMPARTIDA DEL PROYECTO                                      │
│ (Ambos IDEs leen/escriben los mismos archivos)                          │
└─────────────────────────────────────────────────────────────────────────┘
          │                                         │
    ┌──────────┘                             └──────────┐
    ▼                                               ▼
┌───────────────────┐                       ┌───────────────────┐
│     🌊 WINDSURF   │                       │     🖱️ CURSOR     │
│   Architect v1.5  │                       │    DevelOS v8.6   │
│   (Chat aislado)  │                       │   (Chat aislado)  │
└────────┬──────────┘                       └────────┬──────────┘
         │                                           │
         │          1. Genera PLAN                   │
         │  ─────────────────────▶  👤 USUARIO       │
         │                        (Orquestador)      │
         │                               │           │
         │          2. Copia PLAN        │           │
         │               ▼               │           │
         │  ────────────────────▶        │           │
         │                               │           │
         │                       3. Valida +         │
         │                          Ejecuta          │
         │                               │           │
         │  ◀──────────────────────────  │ 4. REPORTE│
         │          👤 USUARIO           │           │
         │       5. Copia REPORTE        │           │
         │               │               │           │
         │               ◀────────┘      │           │
         │                               │           │
         │  6. Evalúa → CIERRE o NUEVO PLAN          │
         └─────────────────────────────────────────────────┘

👤 USUARIO también: 7. Prueba la UI/funcionalidad

---

## 📋 Checklist para Orquestador

### Al pasar PLAN a DevelOS:
- [ ] Copiaste el PLAN completo (desde `# 📋 PLAN` hasta el final)
- [ ] Anotaste el Plan ID: `ARCH-XXXXXXXX` 

### Al recibir REPORTE de DevelOS:
- [ ] Identificaste la `🚦 SEÑAL DE CIERRE` 
- [ ] Probaste la funcionalidad/UI si aplica
- [ ] Copiaste el REPORTE completo a Architect

### Al recibir CIERRE de Architect:
- [ ] Estado final es `SUCCESS` o `PARTIAL_SUCCESS` aceptado
- [ ] O bien `ESCALATE` y tú decides cómo continuar

---

## 🔐 Seguridad Gubernamental (Contexto DNGR)

**Reglas Obligatorias:**
1. ❌ **NUNCA** incluir datos reales de ciudadanos en ejemplos de código
2. ❌ **NUNCA** proponer almacenar datos sensibles sin cifrado
3. ✅ **SIEMPRE** validar propuestas contra OWASP Top 10
4. ✅ **SIEMPRE** consultar [docs/REGLAS-DE-ORO.md](cci:7://file:///c:/Proyectos/sistema-gestion-recursos-v1/docs/REGLAS-DE-ORO.md:0:0-0:0) antes de implementar

**Datos sensibles:** DNI, CUIL/CUIT, biométricos, médicos, antecedentes, direcciones.

---

## Referencia de Versiones

| Agente | Versión | Ubicación |
|--------|---------|-----------|
| Architect | v1.5 | `.windsurf/workflows/Synapse-Architect Pro v1.0.md` |
| DevelOS | v8.6 | `.cursor/commands/develos.md` |
| Contrato | v1.0 | Este archivo |
| REGLAS-DE-ORO | v1.0 | `docs/REGLAS-DE-ORO.md` |

---

*Este archivo es la fuente única de verdad para el contrato de handoff.*

