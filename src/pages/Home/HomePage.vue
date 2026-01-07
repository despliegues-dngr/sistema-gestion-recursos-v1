<template>
  <MainLayout>
    <PageLayout>
      <template #main>
        <!-- Tabla de Funcionarios -->
        <Card class="dashboard-card">
          <template #header>
            <div class="card-header-with-search">
              <span>Funcionarios ({{ funcionarios.length }})</span>
              <div class="card-header-actions">
                <Input
                  v-model="searchQuery"
                  placeholder="Buscar por nombre, CI o unidad..."
                  size="sm"
                  class="search-input"
                />
                <Button
                  variant="primary"
                  size="sm"
                  @click="handleCreate"
                >
                  + Agregar Funcionario
                </Button>
                <FileUpload
                  label="Importar CSV"
                  accept=".csv"
                  variant="primary"
                  size="sm"
                  :loading="isImporting"
                  @file-selected="handleCSVImport"
                />
              </div>
            </div>
          </template>

          <Table
            :columns="tableColumns"
            :data="paginatedData"
            :actions="tableActions"
            empty-message="No hay funcionarios registrados. Importa un CSV para comenzar."
            @action="handleTableAction"
          >
            <template #cell-grado="{ row }: { row: any }">
              {{ row.grado?.nombre || "-" }}
            </template>
            <template #cell-unidad="{ row }: { row: any }">
              {{ row.unidad?.nombre || "-" }}
            </template>
            <template #cell-subUnidad="{ row }: { row: any }">
              {{ row.subUnidad?.nombre || "-" }}
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
        <!-- Acordeones dinámicos según rol -->
        <Accordion
          v-for="accordion in dashboardConfig.accordions"
          :key="accordion.id"
          :title="accordion.title"
          :default-open="accordion.defaultOpen"
        >
          <!-- Temporarily commented for rendering diagnosis -->
          <!-- <template #icon>
            <component :is="getIcon(accordion.icon)" :size="16" />
          </template> -->
          <div class="filter-group">
            <template v-for="filter in accordion.filters" :key="filter.id">
              <Input
                v-if="filter.type === 'input'"
                :label="filter.label"
                :placeholder="filter.placeholder"
                size="sm"
              />
              <Select
                v-else-if="filter.type === 'select'"
                :label="filter.label"
                :placeholder="filter.placeholder"
                :options="filter.options || []"
                :model-value="null"
                size="sm"
              />
            </template>
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

    <!-- Modal Agregar Funcionario -->
    <Modal v-model="showCreateModal" size="xl">
      <template #header>
        <FichaModalHeader 
          :temp-data="createTempData"
          mode="create"
        />
      </template>
      <FichaFuncionario
        ref="fichaCreateRef"
        mode="create"
        @created="handleFuncionarioCreated"
        @temp-data-change="createTempData = $event"
      />
      <template #footer>
        <Button variant="secondary" @click="showCreateModal = false">
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          @click="fichaCreateRef?.saveChanges()" 
          :loading="fichaCreateSaving"
        >
          Crear Funcionario
        </Button>
      </template>
    </Modal>

    <!-- Modal Eliminar Funcionario -->
    <Modal v-model="showDeleteModal" title="Confirmar Eliminación" size="sm">
      <div class="delete-confirmation">
        <p>¿Estás seguro de eliminar al funcionario?</p>
        <p><strong>{{ selectedFuncionario?.nombre_completo }}</strong></p>
        <p class="warning-text">Esta acción no se puede deshacer.</p>
        
        <FormActions bordered>
          <Button variant="secondary" @click="showDeleteModal = false">
            Cancelar
          </Button>
          <Button variant="danger" @click="confirmDelete" :loading="isDeleting">
            Eliminar
          </Button>
        </FormActions>
      </div>
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
  Modal,
  Button,
  FileUpload,
  FichaModalHeader,
  FormActions,
} from "@components";
import FichaFuncionario from "./components/FichaFuncionario.vue";
import TransferirModal from "./components/TransferirModal.vue";
import type { TableColumn } from "@components/Table/Table.vue";
import type { FuncionarioConRelaciones } from "@services/personalService";
import { personalService } from "@services";
import { useToast, useTableActions } from "@hooks";
import { getDashboardConfig, urlRolMap } from "@config";
import {
  User,
  Users,
  Building,
  Clock,
  FileText,
  GraduationCap,
  Calendar,
  ClipboardCheck,
  Shield,
  UserCheck,
  CalendarCheck,
  BarChart3,
  TrendingUp,
  FileSearch,
} from "lucide-vue-next";

const route = useRoute();

const selectedUnit = computed(() => route.params.unidad as string || "direccion");

const selectedRole = computed(() => urlRolMap[selectedUnit.value] || "direccion_vi");

const dashboardConfig = computed(() => getDashboardConfig(selectedRole.value));

const iconMap: Record<string, unknown> = {
  User,
  Users,
  Building,
  Clock,
  FileText,
  GraduationCap,
  Calendar,
  ClipboardCheck,
  Shield,
  UserCheck,
  CalendarCheck,
  BarChart3,
  TrendingUp,
  FileSearch,
};

function getIcon(iconName: string) {
  return iconMap[iconName] || User;
}

const toast = useToast();
const isImporting = ref(false);

const funcionarios = ref<FuncionarioConRelaciones[]>([]);
const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = ref(10);

const showFichaModal = ref(false);
const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const showTransferModal = ref(false);
const selectedFuncionario = ref<FuncionarioConRelaciones | null>(null);
const isDeleting = ref(false);

// AI-Hint: Refs para creación y visualización de FichaFuncionario
const fichaFuncionarioRef = ref<InstanceType<typeof FichaFuncionario> | null>(null);
const fichaCreateRef = ref<InstanceType<typeof FichaFuncionario> | null>(null);

// AI-Hint: Estados para creación
const createTempData = ref<any>(null);
const fichaCreateSaving = ref(false);

// AI-Hint: Estado local sincronizado con componente hijo para reactividad en template | Permite que footer del Modal reaccione a cambios de estado
const isFichaEditing = ref(false);
const fichaSaving = ref(false);

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

watch(
  () => fichaCreateRef.value?.saving,
  (newValue) => {
    fichaCreateSaving.value = newValue ?? false;
  },
  { immediate: true }
);

const tableColumns: TableColumn[] = [
  { field: "ci", label: "CI", width: "120px", sortable: true },
  { field: "grado", label: "Grado", width: "150px" },
  { field: "nombre_completo", label: "Nombre Completo", width: "250px", sortable: true },
  { field: "unidad", label: "Unidad", width: "180px" },
  { field: "subUnidad", label: "Sub Unidad", width: "180px" },
];

const tableActions = computed(() => useTableActions(selectedRole.value));

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
    funcionarios.value = await personalService.getAll();
  } catch (error) {
    toast.error("Error al cargar los funcionarios");
  }
}

function handlePageSizeChange(size: number) {
  pageSize.value = size;
  currentPage.value = 1;
}

function handleCreate() {
  createTempData.value = null;
  showCreateModal.value = true;
}

async function handleFuncionarioCreated() {
  await loadFuncionarios();
  showCreateModal.value = false;
  createTempData.value = null;
}

function handleDelete(funcionario: FuncionarioConRelaciones) {
  // AI-Hint: Dashboard es exclusivo de Dirección VI | Gestión central del padrón | No requiere validación adicional
  selectedFuncionario.value = funcionario;
  showDeleteModal.value = true;
}

function handleTransfer(funcionario: FuncionarioConRelaciones) {
  // AI-Hint: Dashboard es exclusivo de Dirección VI | Gestión central del padrón | No requiere validación adicional
  selectedFuncionario.value = funcionario;
  showTransferModal.value = true;
}

async function confirmDelete() {
  if (!selectedFuncionario.value?.id) return;
  
  isDeleting.value = true;
  try {
    await personalService.remove(selectedFuncionario.value.id);
    toast.success('Funcionario eliminado correctamente');
    await loadFuncionarios();
    showDeleteModal.value = false;
    selectedFuncionario.value = null;
  } catch (error) {
    toast.error('Error al eliminar funcionario');
  } finally {
    isDeleting.value = false;
  }
}

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
    case "delete":
      handleDelete(funcionario);
      break;
  }
}

watch(searchQuery, () => {
  currentPage.value = 1;
});

onMounted(() => {
  loadFuncionarios();
});

async function handleTransferSuccess() {
  toast.success('Funcionario transferido correctamente');
  await loadFuncionarios();
  showTransferModal.value = false;
  selectedFuncionario.value = null;
}

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

async function handleCSVImport(file: File) {
  isImporting.value = true;

  try {
    const csvText = await file.text();
    const result = await personalService.importFromCSV(csvText);

    if (result.importados > 0) {
      toast.success(
        `Importación exitosa: ${result.importados} de ${result.total} registros importados`
      );
    }

    if (result.errores.length > 0) {
      toast.warning(`${result.errores.length} errores durante la importación`);
    }

    if (result.importados === 0 && result.errores.length > 0) {
      toast.error(result.errores[0]?.error || "Error durante la importación");
    }

    await loadFuncionarios();
  } catch (error) {
    toast.error("Error inesperado al importar el archivo");
  } finally {
    isImporting.value = false;
  }
}
</script>

<style scoped>
/**
 * HomePage Styles
 */

/* Card header with search */
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

.card-header-with-search .search-input {
  width: 280px;
}

/* Filter groups */
.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* Dashboard Card - contenedor con altura fija y scroll */
.dashboard-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dashboard-card :deep(.card-body) {
  flex: 1;
  overflow-y: auto;
}

/* Modal delete confirmation styles */
.delete-confirmation {
  padding: var(--space-4);
}

.delete-confirmation p {
  margin-bottom: var(--space-3);
}

.delete-confirmation p:first-child {
  margin-top: 0;
}

.warning-text {
  color: var(--color-error, #dc2626);
  font-size: var(--font-size-sm, 0.875rem);
}
</style>
