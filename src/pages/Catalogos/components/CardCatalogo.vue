<template>
  <div 
    class="card-catalogo" 
    @click="handleGestionar"
    :class="{ 'card-catalogo--loading': cargando }"
  >
    <div class="card-catalogo-header">
      <h4 class="card-catalogo-titulo">{{ titulo }}</h4>
      <Badge :variant="cargando ? 'gray' : 'primary'" size="sm">
        {{ cargando ? '...' : `${contador} activos` }}
      </Badge>
    </div>
    <div class="card-catalogo-body">
      <span class="card-catalogo-action">
        Click para gestionar valores →
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Badge } from '@components';
import { catalogosService } from '@services';
import type { TipoCatalogo } from '@lib/types';

interface Props {
  titulo: string;
  catalogo: TipoCatalogo;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  gestionar: [{ catalogo: TipoCatalogo; titulo: string }];
}>();

const contador = ref(0);
const cargando = ref(true);

async function cargarContador() {
  try {
    const valores = await catalogosService.getAll(props.catalogo, true);
    contador.value = valores.length;
  } catch (error) {
    // Error silencioso según plan de limpieza
  } finally {
    cargando.value = false;
  }
}

function handleGestionar() {
  if (!cargando.value) {
    emit('gestionar', { catalogo: props.catalogo, titulo: props.titulo });
  }
}

onMounted(() => {
  cargarContador();
});
</script>

<style scoped>
/* Card clickable - siguiendo patrón estructurado de REGLAS-DE-ORO */
.card-catalogo {
  border: 2px solid var(--border-color-strong);
  border-radius: var(--radius-md);
  background: var(--color-white);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  overflow: hidden;
}

.card-catalogo:hover:not(.card-catalogo--loading) {
  background-color: var(--color-gray-50);
}

.card-catalogo--loading {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Header con fondo gris - patrón Card estándar */
.card-catalogo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-gray-50);
  border-bottom: 2px solid var(--border-color-strong);
}

.card-catalogo-titulo {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
}

/* Body con texto de acción */
.card-catalogo-body {
  padding: var(--space-4);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
}

.card-catalogo-action {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.card-catalogo:hover:not(.card-catalogo--loading) .card-catalogo-action {
  color: var(--color-primary);
}
</style>
