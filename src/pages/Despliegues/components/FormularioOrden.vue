<template>
  <div class="formulario-orden-deprecated" style="padding: 20px; text-align: center; border: 2px dashed var(--color-danger); border-radius: var(--radius-md); background-color: var(--color-gray-50);">
    <h3 style="color: var(--color-danger); margin-bottom: 10px;">⚠️ COMPONENTE DEPRECATED</h3>
    <p style="color: var(--color-text-secondary); margin-bottom: 15px;">
      Este componente (<code>FormularioOrden.vue</code>) ha sido reemplazado por una arquitectura limpia:
    </p>
    <ul style="text-align: left; display: inline-block; margin-bottom: 15px;">
      <li><code>useFormularioOrden.ts</code> (Estado compartido)</li>
      <li><code>FormularioOrdenGeneral.vue</code> (Tab Datos Generales)</li>
      <li><code>FormularioOrdenRecursos.vue</code> (Tab Recursos Planificados)</li>
    </ul>
    <p style="font-size: var(--font-size-sm); color: var(--color-gray-500);">
      Por favor, actualice sus referencias para usar los nuevos componentes especializados.
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * AI-Hint: Componente deprecado en Fase 3.
 * La lógica ha sido extraída a useFormularioOrden.ts y dividida en componentes especializados.
 */
console.warn('[DEPRECATED] FormularioOrden.vue está obsoleto. Use FormularioOrdenGeneral y FormularioOrdenRecursos.');
</script>
