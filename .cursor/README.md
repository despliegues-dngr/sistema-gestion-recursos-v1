# ⚙️ Configuración de Cursor

## 📁 Estructura

```plaintext
.cursor/
├── commands/
│   └── develos.md          # Workflow /develos (Synapse-DevelOS v7.1)
├── rules/
│   ├── global-rules.mdc    # [ALWAYS] Reglas fundamentales
│   ├── code-style.mdc      # [AUTO] TypeScript + Frameworks frontend
│   └── patterns.mdc        # [AUTO] Base de datos + Seguridad
└── mcp.json                # [OPCIONAL] Servidores MCP
```

## 🎯 Tipos de Reglas

| Tipo | Archivo | Activación |
|------|---------|------------|
| **Always** | `global-rules.mdc` | Siempre activa |
| **Auto-Attached** | `code-style.mdc` | Archivos `.ts`, `.tsx`, `.vue`, `.jsx` |
| **Auto-Attached** | `patterns.mdc` | Archivos `*database*`, `*auth*`, `*service*` |

## 🕹️ Workflow Principal

**Comando:** `/develos`

**Características:**
- 🔄 Flujo adaptativo de 6 fases
- 🎯 Agente experto que se refina según contexto
- 📊 Clasifica automáticamente complejidad
- ✅ Verificación de calidad integrada

**Ejemplo:**
```bash
/develos Implementa un componente de tabla reutilizable
/develos Explica qué es dependency injection
/develos Compara MongoDB vs PostgreSQL para mi caso
```

## 📋 Reglas Contextuales

Las reglas en `rules/*.mdc` se activan automáticamente según el código que estés editando:

- **`global-rules.mdc`**: Siempre activas (R1: Código es verdad, R2: Contexto 100%)
- **`code-style.mdc`**: Se activa en archivos TypeScript y componentes frontend
- **`patterns.mdc`**: Se activa con bases de datos cliente, servicios, stores, autenticación y seguridad

## 🔧 Archivos de Soporte

### `.cursorrules` (Legacy Fallback)

Archivo en la raíz del proyecto que fuerza a Cursor a obtener reglas incluso cuando no lo haría automáticamente. Actúa como respaldo del sistema `.mdc`.

### `mcp.json` (Opcional)

Configuración de servidores MCP (Model Context Protocol) para extender capacidades:
- **Context7**: Documentación actualizada de librerías en tiempo real
- **Memory Bank**: Persistencia de contexto entre sesiones

## 📚 Referencias

- [Cursor Docs Oficiales](https://docs.cursor.com)
- [Workflow DevelOS v7.1](./commands/develos.md)
- [Reglas del Proyecto](./rules/)

## 🎓 Filosofía del Sistema

### "Contexto completo, agente adaptativo, calidad consistente"

1. **Contexto 100%**: Nunca asumir, siempre preguntar
2. **Agente Experto**: Rol especializado que evoluciona según contexto
3. **Calidad Primero**: SOLID, DRY, modularidad, testing
4. **Adaptabilidad**: El agente se refina de genérico a específico
