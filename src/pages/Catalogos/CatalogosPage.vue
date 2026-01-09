<template>
  <MainLayout>
    <PageLayout>
      <template #main>
        <Card class="catalogos-card">
          <template #header>
            <span>Gestión de Catálogos del Sistema</span>
          </template>
          <div class="catalogos-container">
            <!-- Catálogos de Despliegues -->
            <section class="catalogos-seccion">
              <h3 class="seccion-titulo">🔹 Catálogos de Despliegues</h3>
              <div class="catalogos-grid">
                <CardCatalogo
                  titulo="Tipo de Documento"
                  :catalogo="'tipo_documento'"
                  @gestionar="abrirModal"
                />
                <CardCatalogo
                  titulo="Tipo de Servicio"
                  :catalogo="'tipo_servicio'"
                  @gestionar="abrirModal"
                />
                <CardCatalogo
                  titulo="Tiempo de Servicio"
                  :catalogo="'tiempo_servicio'"
                  @gestionar="abrirModal"
                />
                <CardCatalogo
                  titulo="Departamento"
                  :catalogo="'departamento'"
                  @gestionar="abrirModal"
                />
                <CardCatalogo
                  titulo="Seccional"
                  :catalogo="'seccional'"
                  @gestionar="abrirModal"
                />
                <CardCatalogo
                  titulo="Motivo Sin Efecto"
                  :catalogo="'motivo_sin_efecto'"
                  @gestionar="abrirModal"
                />
              </div>
            </section>

            <!-- Catálogos de Personal -->
            <section class="catalogos-seccion">
              <h3 class="seccion-titulo">🔹 Catálogos de Personal</h3>
              <div class="catalogos-grid">
                <CardCatalogo
                  titulo="Tipos de Tarea"
                  :catalogo="'tipo_tarea'"
                  @gestionar="abrirModal"
                />
                <!-- Nota: Grados, Unidades, etc. se agregarán en iteración futura -->
              </div>
            </section>
          </div>
        </Card>
      </template>

      <template #sidebar>
        <FilterPanel>
          <Accordion title="UNIDAD ACTUAL">
            <div class="filter-group">
              <UnitSelector />
            </div>
          </Accordion>
          <Accordion title="INFORMACIÓN">
            <div class="info-content">
              <p class="info-text">
                Gestione los valores disponibles para los campos de selección del sistema.
              </p>
              <p class="info-text">
                Los cambios se reflejan inmediatamente en todos los formularios.
              </p>
            </div>
          </Accordion>
        </FilterPanel>
      </template>
    </PageLayout>

    <!-- Modal de Gestión -->
    <ModalGestionCatalogo
      v-if="modalAbierto"
      :catalogo="catalogoActual!"
      :titulo="tituloModal"
      @close="cerrarModal"
      @actualizado="handleActualizado"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MainLayout, PageLayout } from '@layouts';
import { Card, Accordion, FilterPanel, UnitSelector } from '@components';
import CardCatalogo from './components/CardCatalogo.vue';
import ModalGestionCatalogo from './components/ModalGestionCatalogo.vue';
import type { TipoCatalogo } from '@lib/types';

const modalAbierto = ref(false);
const catalogoActual = ref<TipoCatalogo | null>(null);
const tituloModal = ref('');

function abrirModal(data: { catalogo: TipoCatalogo; titulo: string }) {
  catalogoActual.value = data.catalogo;
  tituloModal.value = data.titulo;
  modalAbierto.value = true;
}

function cerrarModal() {
  modalAbierto.value = false;
  catalogoActual.value = null;
}

function handleActualizado() {
  // Recargar cards si es necesario
}
</script>

<style scoped>
/* Card principal - patrón idéntico a HomePage/AdminPage */
.catalogos-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.catalogos-card :deep(.card-body) {
  flex: 1;
  overflow-y: auto;
}

/* Contenedor principal */
.catalogos-container {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* Secciones */
.catalogos-seccion {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.seccion-titulo {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  padding-bottom: var(--space-2);
  border-bottom: 2px solid var(--border-color-strong);
}

/* Grid de cards */
.catalogos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-4);
}

/* Sidebar */
.info-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.info-text {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  line-height: 1.5;
}

/* Forzar altura completa del contenedor main del PageLayout */
:deep(.page-layout-main) {
  height: 100%;
}
</style>
