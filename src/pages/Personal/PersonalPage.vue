<template>
  <MainLayout>
    <PageLayout>
      <template #main>
        <Card class="dashboard-card">
          <template #header>
            <div class="card-header-with-search">
              <span>Personal ({{ funcionarios.length }})</span>
              <div class="card-header-actions">
                <Input
                  v-model="searchQuery"
                  placeholder="Buscar por nombre, CI o unidad..."
                  size="sm"
                  class="search-input"
                />
              </div>
            </div>
          </template>

          <Table
            :columns="tableColumns"
            :data="paginatedData"
            :actions="tableActions"
            empty-message="No hay funcionarios registrados en esta unidad."
            @action="handleTableAction"
          >
            <template #cell-grado="{ row }">
              {{ row.grado?.nombre || "-" }}
            </template>
            <template #cell-unidad="{ row }">
              {{ row.unidad?.nombre || "-" }}
            </template>
          </Table>

          <template #footer>
            <Pagination
              v-if="filteredData.length > 0"
              :current-page="currentPage"
              :total-pages="totalPages"
              :total-items="filteredData.length"
              :page-size="pageSize"
              :page-size-options="[10, 25, 50, 100]"
              @first="currentPage = 1"
              @previous="currentPage = Math.max(1, currentPage - 1)"
              @next="currentPage = Math.min(totalPages, currentPage + 1)"
              @last="currentPage = totalPages"
              @update:page-size="handlePageSizeChange"
            />
          </template>
        </Card>
      </template>

      <template #sidebar>
        <FilterPanel>
          <Accordion title="UNIDAD ACTUAL">
            <div class="filter-group">
              <UnitSelector />
            </div>
          </Accordion>
          <Accordion title="FILTROS DE BÚSQUEDA">
            <div class="filter-group">
              <Input
                v-model="searchQuery"
                label="Nombre"
                placeholder="Buscar por nombre..."
                size="sm"
              />
              <Input label="CI" placeholder="Cédula de identidad" size="sm" />
              <Select label="Grado" placeholder="Seleccionar grado" size="sm" />
            </div>
          </Accordion>
        </FilterPanel>
      </template>
    </PageLayout>
    <!-- Modal Ficha Funcionario -->
    <Modal
      v-model="showFichaModal"
      size="xl"
    >
      <template #header>
        <FichaModalHeader 
          :funcionario="selectedFuncionario"
          @edit="fichaFuncionarioRef?.startEditing()"
        />
      </template>
      <FichaFuncionario
        v-if="selectedFuncionario"
        ref="fichaFuncionarioRef"
        :funcionario="selectedFuncionario"
        @updated="handleFichaUpdated"
      />
      <template #footer v-if="isFichaEditing">
        <Button variant="secondary" @click="fichaFuncionarioRef?.cancelEditing()">
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          @click="fichaFuncionarioRef?.saveChanges()" 
          :loading="fichaSaving"
        >
          Guardar Cambios
        </Button>
      </template>
    </Modal>

    <!-- Modal Transferir Funcionario -->
    <Modal v-model="showTransferModal" title="Transferir Funcionario" size="md">
      <TransferirModal
        v-if="selectedFuncionario"
        :funcionario="selectedFuncionario"
        @cancel="showTransferModal = false"
        @success="handleTransferSuccess"
      />
    </Modal>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { MainLayout, PageLayout } from "@layouts";
import {
  Card,
  Input,
  Accordion,
  FilterPanel,
  Select,
  Table,
  Pagination,
  Badge,
  Modal,
  Button,
  FichaModalHeader,
  UnitSelector,
} from "@components";
import FichaFuncionario from "../Home/components/FichaFuncionario.vue";
import TransferirModal from "../Home/components/TransferirModal.vue";
import type { TableColumn } from "@components/Table/Table.vue";
import type { FuncionarioConRelaciones } from "@services/personalService";
import { personalService } from "@services";
import { useToast, useTableActions } from "@hooks";
import { ROLES } from "@lib/constants";

const route = useRoute();
const toast = useToast();

// AI-Hint: Obtener unidad de la ruta | Filtra funcionarios por unidad específica | Solo Dir VI puede importar CSV | CRUD completo está en Dashboard
const unidad = computed(() => route.params.unidad as string || "direccion");
const isDireccionVI = computed(() => unidad.value === "direccion-vi");

const funcionarios = ref<FuncionarioConRelaciones[]>([]);
const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = ref(10);

const showFichaModal = ref(false);
const showTransferModal = ref(false);
const selectedFuncionario = ref<FuncionarioConRelaciones | null>(null);
// AI-Hint: Ref para acceder a métodos expuestos de FichaFuncionario | Permite iniciar edición desde header del Modal y controlar footer
const fichaFuncionarioRef = ref<InstanceType<typeof FichaFuncionario> | null>(null);

// AI-Hint: Estado local sincronizado con componente hijo para reactividad en template | Permite que footer del Modal reaccione a cambios de estado
const isFichaEditing = ref(false);
const fichaSaving = ref(false);

const tableColumns: TableColumn[] = [
  { field: "ci", label: "CI", width: "100px", sortable: true },
  { field: "nombre_completo", label: "Nombre Completo", sortable: true },
  { field: "grado", label: "Grado", width: "120px" },
  { field: "unidad", label: "Unidad" },
];

// AI-Hint: Personal es solo lectura | CRUD completo está en Dashboard (HomePage) | Usa composable centralizado para consistencia
const tableActions = computed(() => useTableActions(ROLES.JEFE_UNIDAD));

const filteredData = computed(() => {
  if (!searchQuery.value) return funcionarios.value;

  const query = searchQuery.value.toLowerCase();
  return funcionarios.value.filter(
    (f) =>
      f.ci?.toLowerCase().includes(query) ||
      f.nombre_completo?.toLowerCase().includes(query) ||
      f.unidad?.nombre?.toLowerCase().includes(query)
  );
});

const totalPages = computed(
  () => Math.ceil(filteredData.value.length / pageSize.value) || 1
);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredData.value.slice(start, end);
});

async function loadFuncionarios() {
  try {
    funcionarios.value = await personalService.getByUnidad(unidad.value);
  } catch (error) {
    toast.error("Error al cargar los funcionarios");
  }
}

function handlePageSizeChange(size: number) {
  pageSize.value = size;
  currentPage.value = 1;
}

// AI-Hint: Personal es solo lectura | CRUD completo está en Dashboard (HomePage) | Solo ver detalles
function handleTableAction(payload: {
  action: string;
  row: Record<string, unknown>;
}) {
  const { action, row } = payload;
  const funcionario = row as unknown as FuncionarioConRelaciones;

  switch (action) {
    case "view":
      selectedFuncionario.value = funcionario;
      showFichaModal.value = true;
      break;
    case "transfer":
      handleTransfer(funcionario);
      break;
  }
}

function handleTransfer(funcionario: FuncionarioConRelaciones) {
  selectedFuncionario.value = funcionario;
  showTransferModal.value = true;
}

async function handleTransferSuccess() {
  toast.success("Funcionario transferido correctamente");
  await loadFuncionarios();
  showTransferModal.value = false;
  selectedFuncionario.value = null;
}

// AI-Hint: Watch para sincronizar estado de edición desde componente hijo | Necesario porque acceso directo a propiedades expuestas no es reactivo en template
watch(
  () => fichaFuncionarioRef.value?.isEditing,
  (newValue) => {
    isFichaEditing.value = newValue ?? false;
  },
  { immediate: true }
);

watch(
  () => fichaFuncionarioRef.value?.saving,
  (newValue) => {
    fichaSaving.value = newValue ?? false;
  },
  { immediate: true }
);

watch(searchQuery, () => {
  currentPage.value = 1;
});

watch(unidad, () => {
  loadFuncionarios();
  currentPage.value = 1;
});

onMounted(() => {
  loadFuncionarios();
});

async function handleFichaUpdated() {
  await loadFuncionarios();
  // Actualizar selectedFuncionario con los datos frescos
  if (selectedFuncionario.value?.id) {
    const updated = await personalService.getById(selectedFuncionario.value.id);
    if (updated) {
      selectedFuncionario.value = updated;
    }
  }
}
</script>

<style scoped>
.dashboard-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dashboard-card :deep(.card-body) {
  flex: 1;
  overflow-y: auto;
}

.card-header-with-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  width: 100%;
}

.card-header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.search-input {
  width: 280px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

</style>
