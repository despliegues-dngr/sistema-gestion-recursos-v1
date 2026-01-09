<template>
  <MainLayout>
    <PageLayout>
      <!-- CONTENIDO PRINCIPAL -->
      <template #main>
        <!-- VISTA PARA ESMAPO (Tabla completa de Órdenes Operativas) -->
        <Card v-if="isESMAPO" class="despliegues-card card--table">
          <template #header>
            <div class="card-header-with-search">
              <span
                >Órdenes Operativas - Todas las Unidades ({{
                  ordenesFormateadas.length
                }})</span
              >
              <div class="card-header-actions">
                <Input
                  v-model="searchQuery"
                  placeholder="Buscar por orden o unidad..."
                  size="sm"
                  class="search-input"
                />
                <Button variant="primary" size="sm" @click="handleCreate">
                  + Agregar Despliegue
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
            :data="datosPaginados"
            :actions="tableActions"
            empty-message="No hay órdenes operativas registradas. Importa un CSV para comenzar."
            @action="handleTableAction"
          />

          <template #footer>
            <Pagination
              v-if="ordenesFormateadas.length > 0"
              :current-page="currentPage"
              :total-pages="
                Math.ceil(ordenesFormateadas.length / pageSize) || 1
              "
              :total-items="ordenesFormateadas.length"
              :page-size="pageSize"
              :page-size-options="[10, 25, 50, 100]"
              @first="currentPage = 1"
              @previous="currentPage = Math.max(1, currentPage - 1)"
              @next="
                currentPage = Math.min(
                  Math.ceil(ordenesFormateadas.length / pageSize) || 1,
                  currentPage + 1
                )
              "
              @last="
                currentPage =
                  Math.ceil(ordenesFormateadas.length / pageSize) || 1
              "
              @update:pageSize="handlePageSizeChange"
            />
          </template>
        </Card>

        <Card v-else class="despliegues-card card--table direcciones-view">
          <template #header>
            <div class="header-with-tabs-and-search">
              <!-- Tabs de navegación (extraídos del componente Tabs) -->
              <div class="tabs-header-inline">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  :class="[
                    'tab-button-inline',
                    { 'tab-button-inline--active': activeTab === tab.id },
                  ]"
                  @click="activeTab = tab.id"
                >
                  <template
                    v-if="
                      tab.icon &&
                      (typeof tab.icon === 'object' ||
                        typeof tab.icon === 'function')
                    "
                  >
                    <component :is="tab.icon" :size="16" class="tab-icon" />
                  </template>
                  <span>{{ tab.label }}</span>

                  <!-- Badge de contador -->
                  <Badge
                    v-if="getTabCount(tab.id) > 0"
                    :variant="getTabBadgeVariant(tab.id)"
                    size="sm"
                    class="tab-badge"
                  >
                    {{ getTabCount(tab.id) }}
                  </Badge>
                </button>
              </div>

              <!-- Búsqueda -->
              <div class="header-search-inline">
                <Input
                  v-model="searchQuery"
                  placeholder="Buscar por orden..."
                  size="sm"
                  class="search-input"
                />
              </div>
            </div>
          </template>

          <!-- Sistema de Tabs -->
          <Tabs v-model="activeTab" :tabs="tabs">
            <!-- Tab: SIN CARGAR -->
            <template #sin-cargar>
              <div v-if="isLoadingSecciones" class="loading-container">
                <p class="text-muted">Cargando despliegues...</p>
              </div>
              <template v-else>
                <Table
                  :columns="tableColumns"
                  :data="datosPaginadosSeccion"
                  :actions="tableActions"
                  empty-message="No hay despliegues sin cargar."
                  @action="handleTableAction"
                />
              </template>
            </template>

            <!-- Tab: PARA HOY -->
            <template #para-hoy>
              <div v-if="isLoadingSecciones" class="loading-container">
                <p class="text-muted">Cargando despliegues...</p>
              </div>
              <template v-else>
                <Table
                  :columns="tableColumns"
                  :data="datosPaginadosSeccion"
                  :actions="tableActions"
                  empty-message="No hay despliegues programados para hoy."
                  @action="handleTableAction"
                />
              </template>
            </template>

            <!-- Tab: CARGADOS HOY -->
            <template #cargados-hoy>
              <div v-if="isLoadingSecciones" class="loading-container">
                <p class="text-muted">Cargando despliegues...</p>
              </div>
              <template v-else>
                <Table
                  :columns="tableColumns"
                  :data="datosPaginadosSeccion"
                  :actions="tableActions"
                  empty-message="No se han reportado despliegues hoy."
                  @action="handleTableAction"
                />
              </template>
            </template>

            <!-- Tab: HISTORIAL -->
            <template #historial>
              <div v-if="isLoadingSecciones" class="loading-container">
                <p class="text-muted">Cargando historial...</p>
              </div>
              <template v-else>
                <Table
                  :columns="tableColumns"
                  :data="datosPaginadosSeccion"
                  :actions="tableActions"
                  empty-message="No hay reportes históricos."
                  @action="handleTableAction"
                />
              </template>
            </template>
          </Tabs>

          <template #footer>
            <Pagination
              v-if="datosSeccionActual.length > 0"
              :current-page="currentPage"
              :total-pages="
                Math.ceil(datosSeccionActual.length / pageSize) || 1
              "
              :total-items="datosSeccionActual.length"
              :page-size="pageSize"
              :page-size-options="[10, 25, 50, 100]"
              @first="currentPage = 1"
              @previous="currentPage = Math.max(1, currentPage - 1)"
              @next="
                currentPage = Math.min(
                  Math.ceil(datosSeccionActual.length / pageSize) || 1,
                  currentPage + 1
                )
              "
              @last="
                currentPage =
                  Math.ceil(datosSeccionActual.length / pageSize) || 1
              "
              @update:pageSize="handlePageSizeChange"
            />
          </template>
        </Card>
      </template>

      <!-- SIDEBAR DE FILTROS -->
      <template #sidebar>
        <FilterPanel v-if="isESMAPO">
          <Accordion title="UNIDAD ACTUAL">
            <div class="filter-group">
              <UnitSelector />
            </div>
          </Accordion>
          <Accordion title="FILTROS">
            <div class="filter-group">
              <p class="text-muted">Sin filtros activos</p>
            </div>
          </Accordion>
        </FilterPanel>
        <FilterPanel v-else>
          <Accordion title="UNIDAD ACTUAL">
            <div class="filter-group">
              <UnitSelector />
            </div>
          </Accordion>
          <Accordion title="FILTROS">
            <div class="filter-group">
              <p class="text-muted">Sin filtros activos para esta unidad</p>
            </div>
          </Accordion>
        </FilterPanel>
      </template>
    </PageLayout>

    <!-- Modal Formulario Orden (ESMAPO) -->
    <ModalFormularioOrden
      v-model="showFormularioModal"
      :title="
        modalMode === 'edit'
          ? 'Editar Orden Operativa'
          : 'Nueva Orden Operativa'
      "
      subtitle="ESMAPO - Estado Mayor Policial"
      :tabs="formularioOrdenTabs"
      :submit-text="modalMode === 'edit' ? 'Actualizar Orden' : 'Crear Orden'"
      :loading="formRef?.isSaving"
      default-tab="general"
      @submit="formRef?.handleSubmit"
    >
      <template #general>
        <FormularioOrdenGeneral
          v-if="showFormularioModal"
          ref="formRef"
          :mode="modalMode"
          :orden-id="selectedOrdenId"
          @success="handleFormularioSuccess"
        />
      </template>

      <template #recursos>
        <FormularioOrdenRecursos
          v-if="showFormularioModal"
          :mode="modalMode"
          :orden-id="selectedOrdenId"
        />
      </template>
    </ModalFormularioOrden>

    <!-- Modal Reporte Despliegue Real -->
    <ModalReporteDespliegue
      v-model="showReporteModal"
      :dia-despliegue-id="selectedDiaDespliegueId"
      @success="handleReporteSuccess"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { MainLayout, PageLayout } from "@layouts";
import {
  Card,
  Input,
  Accordion,
  FilterPanel,
  Table,
  Button,
  FileUpload,
  Pagination,
  Modal,
  ModalFormularioOrden,
  Tabs,
  Badge,
  UnitSelector,
} from "@components";
import {
  AlertCircle as AlertCircleIcon,
  Calendar as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
  FileText as FileTextIcon,
} from "lucide-vue-next";
import type { TableColumn, TableAction } from "@components/Table/Table.vue";
import { esmapoService, desplieguesService } from "@services";
import type { DiaDespliegue, ReporteDespliegueConRelaciones } from "@services";
import { useToast } from "@hooks";
import type { OrdenOperativaConRelaciones } from "@services/esmapoService";
import { db } from "@lib/db";
import FormularioOrdenGeneral from "./components/FormularioOrdenGeneral.vue";
import FormularioOrdenRecursos from "./components/FormularioOrdenRecursos.vue";
import ModalReporteDespliegue from "./components/ModalReporteDespliegue.vue";
import "@components/FichaModalHeader/FichaModalHeader.css";
import "./DesplieguesPage.css";

const route = useRoute();
const toast = useToast();

// ✅ Identificar unidad actual
const currentUnit = computed(
  () => (route.params.unidad as string) || "direccion"
);
const isESMAPO = computed(() => currentUnit.value === "esmapo");
const unidadNombre = computed(() => {
  return currentUnit.value.charAt(0).toUpperCase() + currentUnit.value.slice(1);
});

// ✅ Estado reactivo
const searchQuery = ref("");
const isImporting = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const ordenes = ref<OrdenOperativaConRelaciones[]>([]);
const showFormularioModal = ref(false);
const formRef = ref<any>(null);
const modalMode = ref<"create" | "edit">("create");
const selectedOrdenId = ref<number | undefined>(undefined);

// Tabs para modal de orden operativa (ESMAPO)
const formularioOrdenTabs = [
  { id: "general", label: "Datos Generales", icon: FileTextIcon },
  { id: "recursos", label: "Recursos Planificados", icon: FileTextIcon },
];

// ✅ Estado reactivo para Modal de Reporte
const showReporteModal = ref(false);
const selectedDiaDespliegueId = ref<string | number | undefined>(undefined);

// ✅ Sistema de Tabs para secciones
const activeTab = ref<string>("para-hoy");
const isLoadingSecciones = ref(false);
// ✅ Datos de cada sección
const sinCargar = ref<DiaDespliegue[]>([]);
const paraHoy = ref<DiaDespliegue[]>([]);
const cargadosHoy = ref<ReporteDespliegueConRelaciones[]>([]);
const historial = ref<ReporteDespliegueConRelaciones[]>([]);
// ✅ Configuración de tabs
const tabs = [
  { id: "sin-cargar", label: "Sin Cargar", icon: AlertCircleIcon },
  { id: "para-hoy", label: "Para Hoy", icon: CalendarIcon },
  { id: "cargados-hoy", label: "Cargados Hoy", icon: CheckCircleIcon },
  { id: "historial", label: "Historial", icon: HistoryIcon },
];

// Función para obtener el contador de cada tab
function getTabCount(tabId: string): number {
  switch (tabId) {
    case "sin-cargar":
      return sinCargar.value.length;
    case "para-hoy":
      return paraHoy.value.length;
    case "cargados-hoy":
      return cargadosHoy.value.length;
    case "historial":
      return historial.value.length;
    default:
      return 0;
  }
}

// Función para obtener la variante del badge según el tab
function getTabBadgeVariant(tabId: string): "warning" {
  return "warning"; // Diseño único amarillo para todos los tabs
}

// ✅ Cargar datos al montar
onMounted(async () => {
  await loadOrdenes();
});

async function loadOrdenes() {
  try {
    if (isESMAPO.value) {
      // ESMAPO: Vista administrativa completa
      ordenes.value = await esmapoService.getAll();
    } else {
      // Direcciones: Cargar datos de las 4 secciones
      await loadSeccionesDespliegue();
    }
  } catch (error) {
    console.error("Error al cargar órdenes:", error);
    toast.error("Error al cargar órdenes operativas");
  }
}

async function loadSeccionesDespliegue() {
  isLoadingSecciones.value = true;
  try {
    // Obtener ID de la unidad actual desde el usuario logueado o ruta
    // AI-Hint: Usamos el slug de la ruta para obtener el ID de la unidad para facilitar pruebas
    const unidadId = (await obtenerUnidadId(currentUnit.value)) || 1;

    const [sinCargarData, paraHoyData, cargadosHoyData, historialData] =
      await Promise.all([
        desplieguesService.getSinCargar(unidadId),
        desplieguesService.getParaHoy(unidadId),
        desplieguesService.getCargadosHoy(unidadId),
        desplieguesService.getHistorial(unidadId),
      ]);

    sinCargar.value = sinCargarData;
    paraHoy.value = paraHoyData;
    cargadosHoy.value = cargadosHoyData;
    historial.value = historialData;
  } catch (error) {
    console.error("Error al cargar secciones de despliegue:", error);
    toast.error("Error al cargar reportes de despliegue");
  } finally {
    isLoadingSecciones.value = false;
  }
}

// ✅ Helper para obtener ID de unidad desde slug
async function obtenerUnidadId(slug: string): Promise<number | undefined> {
  const nombreUnidad = getUnidadNameFromSlug(slug);

  // AI-Hint: Como 'nombre' no está indexado en IndexedDB, filtramos en memoria para evitar SchemaError
  const unidades = await db.unidades.toArray();
  const unidad = unidades.find((u) => u.nombre === nombreUnidad);

  return unidad?.id;
}

// ✅ Mapeo de slug de unidad a nombre en BD
function getUnidadNameFromSlug(slug: string): string {
  const mapping: Record<string, string> = {
    "direccion-i": "Dirección I",
    "direccion-ii": "Dirección II",
    "regional-norte": "Regional Norte",
    "regional-este": "Regional Este",
    geo: "GEO",
    "direccion-iv": "Dirección IV",
  };
  return mapping[slug] || "";
}

// ✅ Datos formateados según la sección activa
const datosSeccionActual = computed(() => {
  switch (activeTab.value) {
    case "sin-cargar":
      return sinCargar.value.map((d) => formatearDiaDespliegue(d));
    case "para-hoy":
      return paraHoy.value.map((d) => formatearDiaDespliegue(d));
    case "cargados-hoy":
      return cargadosHoy.value.map((r) => formatearReporte(r));
    case "historial":
      return historial.value.map((r) => formatearReporte(r));
    default:
      return [];
  }
});

// ✅ Helper: Normalizar hora a string "HH:MM"
function normalizarHora(hora?: string | Date | null): string | null {
  if (!hora) return null;

  if (typeof hora === "string") return hora;

  // Convertir Date a "HH:MM"
  return new Date(hora).toLocaleTimeString("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// ✅ Helper: Formatear horario según especificación DNGR
function formatearHorario(
  horaInicio?: string | Date | null,
  horaFin?: string | Date | null
): string {
  const inicio = normalizarHora(horaInicio);
  const fin = normalizarHora(horaFin);

  // Regla 1: Sin hora inicio
  if (!inicio) return "A coordinar";

  // Regla 2: Con inicio, sin fin
  if (!fin) return `${inicio} a fin`;

  // Regla 3: Ambas definidas
  return `${inicio} a ${fin}`;
}

// ✅ Helper: Formatear rango de fechas según especificación DNGR
function formatearFecha(fechaInicio?: Date | null, fechaFin?: Date | null): string {
  if (!fechaInicio) return "-";

  const inicio = new Date(fechaInicio).toLocaleDateString("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Regla 1: Sin fecha fin
  if (!fechaFin) return `${inicio} a hasta nueva orden`;

  const fin = new Date(fechaFin).toLocaleDateString("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Regla 2: Ambas definidas
  return `${inicio} a ${fin}`;
}

// ✅ Formatear DiaDespliegue para la tabla
function formatearDiaDespliegue(dia: DiaDespliegue) {
  return {
    id: `${dia.ordenId}-${dia.fecha.getTime()}`,
    ordenId: dia.ordenId,
    fechaDespliegue: dia.fecha,
    fecha: new Date(dia.fecha).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    orden: dia.orden
      ? `${dia.orden.tipoDocumento || ""} ${
          dia.orden.nroDocumento || ""
        }`.trim()
      : "-",
    nombre: dia.orden
      ? [
          `${dia.orden.tipoServicio || ""} ${
            dia.orden.nombreDocumento || ""
          }`.trim(),
          dia.orden.nombreServicio,
        ]
          .filter(Boolean)
          .join(" - ") || "-"
      : "-",
    horario: formatearHorario(
      dia.orden?.horaInicioPlan,
      dia.orden?.horaFinPlan
    ),
  };
}

// ✅ Formatear ReporteDespliegue para la tabla
function formatearReporte(reporte: ReporteDespliegueConRelaciones) {
  // Priorizar horas reales, fallback a planificadas
  const horaInicio = reporte.realHoraInicio || reporte.orden?.horaInicioPlan;
  const horaFin = reporte.realHoraFin || reporte.orden?.horaFinPlan;

  return {
    id: reporte.id,
    ordenId: reporte.ordenId,
    fechaDespliegue: reporte.fechaDespliegue,
    fecha: new Date(reporte.fechaDespliegue).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    orden: reporte.orden
      ? `${reporte.orden.tipoDocumento || ""} ${
          reporte.orden.nroDocumento || ""
        }`.trim()
      : "-",
    nombre: reporte.orden
      ? [
          `${reporte.orden.tipoServicio || ""} ${
            reporte.orden.nombreDocumento || ""
          }`.trim(),
          reporte.orden.nombreServicio,
        ]
          .filter(Boolean)
          .join(" - ") || "-"
      : "-",
    horario: formatearHorario(horaInicio, horaFin),
  };
}

// ✅ Paginación sobre datos de la sección actual
const datosPaginadosSeccion = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return datosSeccionActual.value.slice(start, end);
});

// ✅ Formatear datos para la tabla con soporte de búsqueda (ESMAPO)
const ordenesFormateadas = computed(() => {
  let filtered = ordenes.value;

  // ✅ Filtro de búsqueda
  if (searchQuery.value) {
    filtered = filtered.filter(
      (o) =>
        o.nroDocumento
          ?.toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        (o.unidad?.nombre || "")
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        (o.nombreServicio || "")
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
    );
  }

  return filtered.map((o) => ({
    id: o.id,
    unidad: o.unidad?.nombre || "Sin Unidad",
    orden: `${o.tipoDocumento || ""} ${o.nroDocumento || ""}`.trim() || "-",
    nombre:
      [
        `${o.tipoServicio || ""} ${o.nombreDocumento || ""}`.trim(),
        o.nombreServicio,
      ]
        .filter(Boolean)
        .join(" - ") || "-",
    fecha: formatearFecha(o.fechaInicioPlan, o.fechaFinPlan),
    horario: formatearHorario(o.horaInicioPlan, o.horaFinPlan),
    moviles: o.planMoviles,
    ssoo: o.planSsoo,
    ppss: o.planPpssMovil,
    motos: o.planMotos,
    hipos: o.planHipos,
    pieTierra: o.planPieTierra,
    motosBiTrip: o.planMotosBiTripuladas,
    choqueApost: o.planChoqueApost,
    choqueAlert: o.planChoqueAlerta,
    hidro: o.planHidro,
    efectivos: o.planTotalPersonal,
  }));
});

// ✅ Datos paginados para la tabla (ESMAPO)
const datosPaginados = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return ordenesFormateadas.value.slice(start, end);
});

// ✅ Columnas dinámicas según tipo de unidad
const tableColumns = computed<TableColumn[]>(() => {
  if (isESMAPO.value) {
    // Columnas ESMAPO - TODAS las 18 columnas
    return [
      { field: "unidad", label: "Unidad", sortable: true, width: "150px" },
      { field: "orden", label: "Orden", sortable: true, width: "220px" },
      { field: "nombre", label: "Nombre", sortable: true, width: "280px" },
      { field: "fecha", label: "Fecha", sortable: true, width: "220px" },
      { field: "horario", label: "Horario", width: "150px" },
      { field: "moviles", label: "Móviles", width: "60px", icon: "movil" },
      { field: "ssoo", label: "SSOO", width: "60px", icon: "ssoo" },
      {
        field: "ppss",
        label: "P.P.S.S. en Movil",
        width: "60px",
        icon: "ppssEnMovil",
      },
      { field: "motos", label: "Motos", width: "60px", icon: "motos" },
      { field: "hipos", label: "Hipos", width: "60px", icon: "hipos" },
      {
        field: "pieTierra",
        label: "Pie a Tierra",
        width: "60px",
        icon: "pieTierra",
      },
      {
        field: "motosBiTrip",
        label: "Motos BiTripuladas",
        width: "60px",
        icon: "motosBitripuladas",
      },
      {
        field: "choqueApost",
        label: "Choque Apostado",
        width: "60px",
        icon: "choqueApostado",
      },
      {
        field: "choqueAlert",
        label: "Choque en Alerta",
        width: "60px",
        icon: "choqueEnAlerta",
      },
      { field: "hidro", label: "Hidro", width: "60px", icon: "hidro" },
      {
        field: "efectivos",
        label: "Total Efectivos",
        width: "60px",
        icon: "ppssTotal",
      },
    ];
  }

  // Columnas para Direcciones - SIMPLIFICADAS
  return [
    { field: "fecha", label: "Fecha", sortable: true, width: "110px" },
    { field: "orden", label: "Orden", sortable: true, width: "200px" },
    {
      field: "nombre",
      label: "Nombre Operativo",
      sortable: true,
      width: "250px",
    },
    { field: "horario", label: "Horario", width: "150px" },
  ];
});

// ✅ Acciones dinámicas
const tableActions = computed<TableAction[]>(() => {
  if (isESMAPO.value) {
    return [
      { name: "view", icon: "view", label: "Ver detalles" },
      { name: "delete", icon: "delete", label: "Eliminar" },
    ];
  }

  // Direcciones: Acciones dinámicas según sección
  switch (activeTab.value) {
    case "sin-cargar":
    case "para-hoy":
      return [{ name: "edit", icon: "edit", label: "Reportar Despliegue" }];

    case "cargados-hoy":
      return [{ name: "edit", icon: "edit", label: "Editar Reporte" }];

    case "historial":
      return [{ name: "view", icon: "view", label: "Ver Reporte" }];

    default:
      return [];
  }
});

async function handleCSVImport(file: File) {
  isImporting.value = true;
  try {
    const text = await file.text();
    const result = await esmapoService.importFromCSV(text);

    if (result.errores.length > 0) {
      toast.warning(
        `Importados: ${result.importados}/${result.total}. ${result.errores.length} errores`
      );
    } else {
      toast.success(`${result.importados} órdenes importadas exitosamente`);
    }

    await loadOrdenes();
  } catch (error) {
    console.error("Error al importar CSV:", error);
    toast.error("Error al importar CSV");
  } finally {
    isImporting.value = false;
  }
}

function handleCreate() {
  modalMode.value = "create";
  selectedOrdenId.value = undefined;
  showFormularioModal.value = true;
}

async function handleFormularioSuccess() {
  showFormularioModal.value = false;
  await loadOrdenes();
  // El toast ya lo muestra el componente FormularioOrden
}

// ✅ Handlers para Reporte de Despliegue
function handleReportarDespliegue(row: any) {
  selectedDiaDespliegueId.value = row.id;
  showReporteModal.value = true;
}

function handleReporteSuccess() {
  showReporteModal.value = false;
  // TODO Fase 2: Recargar secciones
  console.log("Reporte guardado - TODO: recargar datos");
  loadSeccionesDespliegue();
}

function handlePageSizeChange(size: number) {
  pageSize.value = size;
  currentPage.value = 1;
}

async function handleTableAction(payload: { action: string; row: any }) {
  switch (payload.action) {
    case "view":
      if (isESMAPO.value) {
        // Vista de Orden Operativa (ESMAPO)
        modalMode.value = "edit";
        selectedOrdenId.value = payload.row.id;
        showFormularioModal.value = true;
      } else {
        // Vista de Reporte (Direcciones - Historial)
        selectedDiaDespliegueId.value = payload.row.id;
        showReporteModal.value = true;
      }
      break;

    case "delete":
      if (confirm(`¿Está seguro de eliminar la orden ${payload.row.orden}?`)) {
        try {
          await esmapoService.softDelete(payload.row.id, 1); // AI-Hint: Usar ID de usuario logueado en prod
          toast.success("Orden eliminada exitosamente");
          await loadOrdenes();
        } catch (error) {
          toast.error("Error al eliminar la orden");
        }
      }
      break;

    case "edit":
      if (activeTab.value === "sin-cargar" || activeTab.value === "para-hoy") {
        handleReportarDespliegue(payload.row);
      } else {
        // Editar reporte existente
        selectedDiaDespliegueId.value = payload.row.id;
        showReporteModal.value = true;
      }
      break;

    default:
      toast.info(`Acción ${payload.action} no reconocida`);
  }
}

// ✅ Resetear paginación al cambiar de tab
watch(activeTab, () => {
  currentPage.value = 1;
});

// ✅ Garantizar que los datos se muestren cuando estén disponibles
// AI-Hint: watchEffect crea una dependencia reactiva con los arrays de datos para forzar la re-evaluación del computed
watchEffect(() => {
  if (!isESMAPO.value && !isLoadingSecciones.value) {
    // El simple acceso a la longitud de los arrays garantiza el rastreo de dependencias
    const _ = [
      sinCargar.value.length,
      paraHoy.value.length,
      cargadosHoy.value.length,
      historial.value.length,
    ];
  }
});

// ✅ Recargar datos cuando cambia la unidad en la ruta
// AI-Hint: Vue Router reutiliza el componente, por lo que onMounted no se ejecuta al cambiar de parámetro
watch(
  () => route.params.unidad,
  async (newUnidad, oldUnidad) => {
    // Solo recargar si realmente cambió la unidad (no en carga inicial)
    if (newUnidad && oldUnidad && newUnidad !== oldUnidad) {
      console.log(
        `[DesplieguesPage] Cambio de unidad: ${oldUnidad} → ${newUnidad}`
      );

      // Limpiar datos anteriores para evitar mostrar datos de otra unidad mientras carga
      if (!isESMAPO.value) {
        sinCargar.value = [];
        paraHoy.value = [];
        cargadosHoy.value = [];
        historial.value = [];
      } else {
        ordenes.value = [];
      }

      // Resetear estado de UI
      currentPage.value = 1;
      activeTab.value = "para-hoy";

      // Recargar datos
      await loadOrdenes();
    }
  }
);
</script>

<style scoped>
/**
 * Estilos para el módulo de Despliegues
 * 
 * ESTRUCTURA:
 * 1. Compactación Global (card-header, table rows)
 * 2. Sistema Unificado de Headers (ESMAPO + Direcciones)
 * 3. Estilos específicos de Direcciones (tabs inline)
 * 4. Utilidades (loading, text-muted, etc.)
 * 
 * PRINCIPIOS:
 * - Headers compactos: min-height 44px, padding reducido
 * - Aislamiento: Todos los estilos prefijados con .despliegues-card o .direcciones-view
 * - Responsive: Mobile-first con media queries
 */
.despliegues-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.despliegues-card :deep(.card-body) {
  flex: 1;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ========================================
   COMPACTACIÓN GLOBAL
   ======================================== */
/* Reducir padding del header en todas las tablas */
.despliegues-card :deep(.card-header) {
  padding: var(--space-2) var(--space-4); /* Reducido de space-3 a space-2 */
}

/* Compactar body de card */
/* (Ya definido arriba, pero mantenemos por consistencia de estructura) */

/* Compactar filas de tabla */
.despliegues-card :deep(.table tbody tr) {
  height: 44px; /* Reducido de 48px a 44px */
}

.despliegues-card :deep(.table td) {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm); /* Texto más compacto */
}

.despliegues-card :deep(.table th) {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
}

/* ========================================
   SISTEMA UNIFICADO DE HEADERS COMPACTOS
   ======================================== */
/* Header estándar con búsqueda y acciones (ESMAPO) */
.card-header-with-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  width: 100%;
  min-height: 44px;
}

.card-header-with-search > span {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  white-space: nowrap;
  flex-shrink: 0;
}

.card-header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: nowrap;
}

.card-header-with-search .search-input {
  width: 240px;
  flex-shrink: 1;
  min-width: 180px;
}

/* Responsive para header estándar */
@media (max-width: 768px) {
  .card-header-with-search {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
  }

  .card-header-with-search > span {
    order: 1;
  }

  .card-header-actions {
    order: 2;
    flex-wrap: wrap;
  }

  .card-header-with-search .search-input {
    width: 100%;
    order: 1;
  }
}

/* Ocultar el tabs-header del componente Tabs (solo en Direcciones) */
.direcciones-view :deep(.tabs-header) {
  display: none;
}

/* Ajustar tabs-content para ocupar todo el espacio (solo en Direcciones) */
.direcciones-view :deep(.tabs-content) {
  border-top: none;
  padding-top: 0;
}

/* Header con tabs y búsqueda en una línea (solo en Direcciones) */
.direcciones-view .header-with-tabs-and-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  width: 100%;
  min-height: 44px; /* Consistente con ESMAPO */
}

/* Tabs inline en el header (solo en Direcciones) */
.direcciones-view .tabs-header-inline {
  display: flex;
  gap: var(--space-1);
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  min-width: 0; /* Permite shrink */
}

.direcciones-view .tabs-header-inline::-webkit-scrollbar {
  display: none;
}

.direcciones-view .tab-button-inline {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-family-base);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: color var(--transition-fast),
    background-color var(--transition-fast), border-color var(--transition-fast),
    box-shadow var(--transition-fast), transform 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
  position: relative;
}

.direcciones-view .tab-button-inline:hover:not(.tab-button-inline--active) {
  color: var(--color-gray-900);
  background-color: var(--color-gray-200); /* Más contraste */
  border-color: var(--color-gray-300);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px); /* Efecto de elevación */
}

.direcciones-view .tab-button-inline--active {
  color: var(--color-primary);
  background-color: var(--color-primary-100); /* Más saturado */
  border-color: var(--color-primary-200);
  border-bottom: 3px solid var(--color-primary); /* Indicador fuerte */
  font-weight: var(--font-weight-semibold);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15); /* Sombra azul */
  padding-bottom: calc(var(--space-2) - 2px); /* Compensar border-bottom */
}

/* Evitar hover en tab activo */
.direcciones-view .tab-button-inline--active:hover {
  transform: none;
  cursor: default;
}

/* Estado focus para accesibilidad (navegación por teclado) */
.direcciones-view .tab-button-inline:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  z-index: 1;
}

/* Remover outline por defecto */
.direcciones-view .tab-button-inline:focus {
  outline: none;
}

/* Estado pressed (al hacer click) */
.direcciones-view .tab-button-inline:active:not(.tab-button-inline--active) {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.direcciones-view .tab-icon {
  flex-shrink: 0;
  transition: transform var(--transition-fast);
}

/* Ícono se agranda levemente en hover */
.direcciones-view
  .tab-button-inline:hover:not(.tab-button-inline--active)
  .tab-icon {
  transform: scale(1.1);
}

/* Badge de contador en tabs */
.direcciones-view .tab-badge {
  margin-left: var(--space-1);
  font-size: 11px;
  min-width: 20px;
  height: 18px;
  padding: 0 var(--space-1);
  line-height: 18px;
  transition: transform var(--transition-fast);
}

/* Badge en tab activo tiene color más intenso */
.direcciones-view .tab-button-inline--active .tab-badge {
  font-weight: var(--font-weight-bold);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Badge en hover tiene efecto sutil */
.direcciones-view
  .tab-button-inline:hover:not(.tab-button-inline--active)
  .tab-badge {
  transform: scale(1.05);
}

/* Ajustar espaciado del tab cuando tiene badge */
.direcciones-view .tab-button-inline:has(.tab-badge) {
  padding-right: var(--space-2);
}

/* Búsqueda inline (solo en Direcciones) */
.direcciones-view .header-search-inline {
  flex-shrink: 0;
}

.direcciones-view .header-search-inline .search-input {
  width: 220px;
  min-width: 180px;
}

/* Responsive (solo en Direcciones) */
@media (max-width: 768px) {
  .direcciones-view .header-with-tabs-and-search {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
  }

  .direcciones-view .tabs-header-inline {
    order: 1;
  }

  .direcciones-view .header-search-inline {
    order: 2;
  }

  .direcciones-view .header-search-inline .search-input {
    width: 100%;
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.text-muted {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}

/* Estilos para contenido de tabs */
/* AI-Hint: Se eliminó .tab-content para permitir que la tabla ocupe todo el espacio y card--table funcione correctamente */

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  min-height: 200px;
}

.loading-container .text-muted {
  font-size: var(--font-size-base);
}
</style>
