<template>
  <Modal :modelValue="true" @update:modelValue="$emit('close')" size="md">
    <template #header>
      <h3>{{ titulo }}</h3>
    </template>
    
    <div class="catalogo-gestion">
      <!-- Agregar nuevo - arriba, inline -->
      <div class="catalogo-agregar">
        <Input
          v-model="nuevoValor"
          placeholder="Escribir nuevo valor..."
          size="sm"
          @keyup.enter="agregarNuevo"
        />
        <Button 
          variant="primary" 
          size="sm" 
          @click="agregarNuevo"
          :disabled="!nuevoValor.trim()"
        >
          <Plus :size="14" />
          Agregar
        </Button>
      </div>

      <!-- Tabla de valores -->
      <div class="catalogo-tabla">
        <div class="catalogo-tabla-header">
          <span class="catalogo-col-nombre">Valor</span>
          <span class="catalogo-col-acciones">Acciones</span>
        </div>
        
        <div class="catalogo-tabla-body">
          <div 
            v-for="valor in valores" 
            :key="valor.id" 
            class="catalogo-fila"
            :class="{ 'catalogo-fila--inactivo': !valor.activo }"
          >
            <!-- Modo edición -->
            <template v-if="editandoId === valor.id">
              <div class="catalogo-col-nombre">
                <Input
                  v-model="editandoNombre"
                  size="sm"
                  @keyup.enter="guardarEdicion(valor)"
                  @keyup.escape="cancelarEdicion"
                  autofocus
                />
              </div>
              <div class="catalogo-col-acciones">
                <button type="button" class="action-btn action-btn--success" @click="guardarEdicion(valor)" title="Guardar">
                  <Check :size="16" />
                </button>
                <button type="button" class="action-btn" @click="cancelarEdicion" title="Cancelar">
                  <X :size="16" />
                </button>
              </div>
            </template>
            
            <!-- Modo visualización -->
            <template v-else>
              <span class="catalogo-col-nombre catalogo-nombre">{{ valor.nombre }}</span>
              <div class="catalogo-col-acciones">
                <button type="button" class="action-btn" @click="iniciarEdicion(valor)" title="Editar">
                  <Pencil :size="16" />
                </button>
                <button 
                  type="button"
                  class="action-btn"
                  :class="valor.activo ? 'action-btn--danger' : 'action-btn--success'"
                  @click="toggleActivo(valor)" 
                  :title="valor.activo ? 'Desactivar' : 'Activar'"
                >
                  <ToggleRight v-if="valor.activo" :size="16" />
                  <ToggleLeft v-else :size="16" />
                </button>
                <button 
                  type="button"
                  class="action-btn action-btn--danger" 
                  @click="confirmarEliminar(valor)" 
                  title="Eliminar permanentemente"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
            </template>
          </div>
          
          <!-- Estado vacío -->
          <div v-if="valores.length === 0" class="catalogo-vacio">
            No hay valores en este catálogo
          </div>
        </div>
      </div>

      <!-- Info -->
      <p class="catalogo-info">
        <Info :size="14" />
        Los valores desactivados no aparecen en los formularios.
      </p>
    </div>

    <template #footer>
      <Button variant="secondary" @click="$emit('close')">
        Cerrar
      </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Modal, Button, Input } from '@components';
import { Pencil, Check, X, ToggleLeft, ToggleRight, Plus, Info, Trash2 } from 'lucide-vue-next';
import { catalogosService } from '@services';
import type { CatalogoValor, TipoCatalogo } from '@lib/types';

interface Props {
  catalogo: TipoCatalogo;
  titulo: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  actualizado: [];
}>();

const valores = ref<CatalogoValor[]>([]);
const nuevoValor = ref('');
const editandoId = ref<number | null>(null);
const editandoNombre = ref('');

async function cargar() {
  try {
    valores.value = await catalogosService.getAll(props.catalogo, false);
  } catch (error) {
    // Error silencioso en carga
  }
}

function iniciarEdicion(valor: CatalogoValor) {
  editandoId.value = valor.id!;
  editandoNombre.value = valor.nombre;
}

function cancelarEdicion() {
  editandoId.value = null;
  editandoNombre.value = '';
}

async function guardarEdicion(valor: CatalogoValor) {
  if (!editandoNombre.value.trim()) return;
  
  try {
    await catalogosService.actualizar(valor.id!, { nombre: editandoNombre.value.trim() });
    await cargar();
    cancelarEdicion();
    emit('actualizado');
  } catch (error: any) {
    alert(error.message || 'Error al guardar');
  }
}

async function agregarNuevo() {
  if (!nuevoValor.value.trim()) return;
  
  try {
    await catalogosService.crear({
      catalogo: props.catalogo,
      nombre: nuevoValor.value.trim(),
      activo: true
    });
    nuevoValor.value = '';
    await cargar();
    emit('actualizado');
  } catch (error: any) {
    alert(error.message || 'Error al crear');
  }
}

async function toggleActivo(valor: CatalogoValor) {
  try {
    if (valor.activo) {
      await catalogosService.desactivar(valor.id!);
    } else {
      await catalogosService.activar(valor.id!);
    }
    await cargar();
    emit('actualizado');
  } catch (error: any) {
    alert(error.message || 'Error al cambiar estado');
  }
}

async function confirmarEliminar(valor: CatalogoValor) {
  const confirmacion = confirm(
    `¿Eliminar "${valor.nombre}"?\n\n` +
    `Esta acción es permanente y no se puede deshacer.\n` +
    `Los registros existentes que usen este valor no se verán afectados.`
  );
  
  if (!confirmacion) return;
  
  try {
    await catalogosService.eliminar(valor.id!);
    await cargar();
    emit('actualizado');
  } catch (error: any) {
    alert(error.message || 'Error al eliminar');
  }
}

onMounted(() => {
  cargar();
});
</script>

<style scoped>
.catalogo-gestion {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Sección agregar - inline arriba */
.catalogo-agregar {
  display: flex;
  gap: var(--space-2);
  padding-bottom: var(--space-4);
  border-bottom: 2px solid var(--border-color-strong);
}

.catalogo-agregar :deep(.input-container) {
  flex: 1;
}

/* Tabla de valores */
.catalogo-tabla {
  display: flex;
  flex-direction: column;
}

.catalogo-tabla-header {
  display: flex;
  padding: var(--space-2) var(--space-3);
  background-color: var(--color-gray-100);
  border-bottom: 2px solid var(--border-color-strong);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-700);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.catalogo-tabla-body {
  max-height: 300px;
  overflow-y: auto;
}

.catalogo-fila {
  display: flex;
  align-items: center;
  padding: var(--space-3);
  border-bottom: 1px solid var(--border-color);
  transition: background-color var(--transition-fast);
}

.catalogo-fila:hover {
  background-color: var(--color-gray-50);
}

.catalogo-fila:last-child {
  border-bottom: none;
}

.catalogo-fila--inactivo {
  opacity: 0.5;
}

.catalogo-fila--inactivo .catalogo-nombre {
  text-decoration: line-through;
  color: var(--color-gray-500);
}

.catalogo-col-nombre {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--color-gray-900);
}

.catalogo-col-acciones {
  display: flex;
  gap: var(--space-2);
  width: 110px;
  justify-content: flex-end;
}

/* Botones de acción - mismo estilo que Table */
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background-color: var(--color-white);
  border: var(--border-thin) solid var(--border-color-strong);
  border-radius: var(--radius-md);
  color: var(--color-gray-600);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background-color: var(--color-gray-100);
  color: var(--color-primary);
  border-color: var(--color-primary-light);
}

.action-btn--success:hover {
  background-color: var(--color-success-light);
  color: var(--color-success);
  border-color: var(--color-success);
}

.action-btn--danger:hover {
  background-color: var(--color-error-light);
  color: var(--color-error);
  border-color: var(--color-error);
}

/* Estado vacío */
.catalogo-vacio {
  padding: var(--space-6);
  text-align: center;
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
}

/* Info */
.catalogo-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-color);
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
}
</style>
