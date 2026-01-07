<template>
  <div class="ficha-despliegue">
    <div class="ficha-layout-dos-columnas">
      
      <!-- CONTENEDOR DE CONTENIDO -->
      <div class="ficha-contenido-row">
        
        <!-- COLUMNA IZQUIERDA: Recursos -->
        <section v-if="mostrarRecursos" class="ficha-columna-recursos">
          <div class="recursos-lista">
            <!-- Lista vertical de recursos -->
            <div 
              v-for="recurso in recursosEditables" 
              :key="recurso.key" 
              class="recurso-fila"
            >
              <img :src="recurso.icon" :alt="recurso.label" class="recurso-icono" />
              <span class="recurso-nombre">{{ recurso.label }}</span>
              <Input
                v-model.number="editData[recurso.key]"
                type="number"
                size="sm"
                min="0"
                max="999"
                class="recurso-input-inline"
              />
            </div>
            
            <!-- Total Efectivos - Destacado -->
            <div class="recurso-fila recurso-fila-total">
              <img :src="ppssTotalIcon" alt="Total Efectivos" class="recurso-icono" />
              <span class="recurso-nombre">Total Efectivos</span>
              <div class="recurso-total-valor">{{ totalEfectivos }}</div>
            </div>
          </div>
        </section>
        
        <!-- Mensaje cuando no hay recursos (Franco/Sin efecto) -->
        <section v-else class="ficha-columna-recursos ficha-columna-vacia">
          <div class="mensaje-sin-recursos">
            <Info :size="32" />
            <p>No se requiere registro de recursos para este tipo de despliegue</p>
          </div>
        </section>

        <!-- COLUMNA DERECHA: Información -->
        <section class="ficha-columna-info">
          <div class="info-lista">
            <div class="info-fila">
              <span class="info-label">Nombre del Servicio</span>
              <span class="info-valor">{{ editData.nombreServicio || '-' }}</span>
            </div>
            <div class="info-fila">
              <span class="info-label">Fecha Inicio</span>
              <span class="info-valor">{{ formatDateTime(editData.realHoraInicio) }}</span>
            </div>
            <div class="info-fila">
              <span class="info-label">Fecha Fin</span>
              <span class="info-valor">{{ formatDateTime(editData.realHoraFin) }}</span>
            </div>
            <div class="info-fila">
              <span class="info-label">Departamento</span>
              <span class="info-valor">{{ editData.departamento || '-' }}</span>
            </div>
            <div class="info-fila">
              <span class="info-label">Seccional</span>
              <span class="info-valor">{{ editData.seccional || '-' }}</span>
            </div>
            
            <!-- Select de Tipo de Despliegue -->
            <div class="info-fila-editable">
              <span class="info-label">Tipo de Despliegue</span>
              <Select
                v-model="editData.tipoDespliegue"
                :options="tipoDespliegueOptions"
                size="sm"
                class="info-select"
              />
            </div>
            
            <!-- Select de Motivo (condicional) -->
            <div v-if="mostrarMotivo" class="info-fila-editable">
              <span class="info-label">Motivo</span>
              <Select
                v-model="editData.motivoSinEfecto"
                :options="motivoSinEfectoOptions"
                size="sm"
                class="info-select"
              />
            </div>
          </div>
        </section>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Info } from 'lucide-vue-next';
import { Input, Select } from '@components';
import { useToast } from '@hooks';
import { desplieguesService, type ReporteDespliegueConRelaciones } from '@services/desplieguesService';
import { esmapoService } from '@services/esmapoService';
import type { OrdenOperativa } from '@lib/types';
import './FichaDespliegue.css';

// Importación de iconos SVG
import movilIcon from '@/assets/images/movil.svg';
import ssooIcon from '@/assets/images/ssoo.svg';
import ppssEnMovilIcon from '@/assets/images/ppssEnMovil.svg';
import motosIcon from '@/assets/images/motos.svg';
import hiposIcon from '@/assets/images/hipos.svg';
import pieTierraIcon from '@/assets/images/pieTierra.svg';
import motosBitripuladasIcon from '@/assets/images/motosBitripuladas.svg';
import choqueApostadoIcon from '@/assets/images/choqueApostado.svg';
import choqueEnAlertaIcon from '@/assets/images/choqueEnAlerta.svg';
import hidroIcon from '@/assets/images/hidro.png';
import ppssTotalIcon from '@/assets/images/ppssTotal.svg';

interface Props {
  reporte?: ReporteDespliegueConRelaciones;
  mode?: 'view' | 'create';
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'view'
});

const emit = defineEmits<{
  updated: [];
  created: [reporte: any];
  'temp-data-change': [data: any];
}>();

const toast = useToast();
const isEditing = ref(true); // Siempre en modo edición para recursos e info adicional
const saving = ref(false);

const editData = ref<any>({
  nroDocumento: '',
  tipoDocumento: 'Orden de Servicio',
  nombreServicio: '',
  realHoraInicio: '',
  realHoraFin: '',
  realMoviles: 0,
  realMotos: 0,
  realSsoo: 0,
  realPpssMovil: 0,
  realPieTierra: 0,
  realMotosBiTripuladas: 0,
  realHipos: 0,
  realChoqueApost: 0,
  realChoqueAlerta: 0,
  realHidro: 0,
  realTotalPersonal: 0,
  tipoDespliegue: 'Despliegue',
  motivoSinEfecto: '',
  departamento: '',
  seccional: ''
});

const recursosEditables = [
  { key: 'realMoviles', label: 'Móviles', icon: movilIcon },
  { key: 'realSsoo', label: 'SSOO', icon: ssooIcon },
  { key: 'realPpssMovil', label: 'P.P.S.S. en Movil', icon: ppssEnMovilIcon },
  { key: 'realMotos', label: 'Motos', icon: motosIcon },
  { key: 'realHipos', label: 'Hipos', icon: hiposIcon },
  { key: 'realPieTierra', label: 'Pie a Tierra', icon: pieTierraIcon },
  { key: 'realMotosBiTripuladas', label: 'Motos BiTripuladas', icon: motosBitripuladasIcon },
  { key: 'realChoqueApost', label: 'Choque Apostado', icon: choqueApostadoIcon },
  { key: 'realChoqueAlerta', label: 'Choque en Alerta', icon: choqueEnAlertaIcon },
  { key: 'realHidro', label: 'Hidro', icon: hidroIcon },
];

const tipoDespliegueOptions = [
  { value: 'Despliegue', label: 'Despliegue' },
  { value: 'Franco', label: 'Franco' },
  { value: 'Sin efecto', label: 'Sin efecto' }
];

const motivoSinEfectoOptions = [
  { value: 'Por falta de personal', label: 'Por falta de personal' },
  { value: 'Por orden de superior', label: 'Por orden de superior' },
  { value: 'Por cubrir otro Operativo', label: 'Por cubrir otro Operativo' },
  { value: 'Por cubrir Espectáculo público', label: 'Por cubrir Espectáculo público' },
  { value: 'Por inclemencias de tiempo', label: 'Por inclemencias de tiempo' },
  { value: 'Otro motivo', label: 'Otro motivo' }
];

// Cálculo automático de Total Efectivos
const totalEfectivos = computed(() => {
  return (
    Number(editData.value.realPpssMovil || 0) +
    Number(editData.value.realMotos || 0) +
    Number(editData.value.realMotosBiTripuladas || 0) +
    Number(editData.value.realHipos || 0) +
    Number(editData.value.realPieTierra || 0)
  );
});

watch(totalEfectivos, (newVal) => {
  editData.value.realTotalPersonal = newVal;
}, { immediate: true });

const mostrarRecursos = computed(() => editData.value.tipoDespliegue === 'Despliegue');
const mostrarMotivo = computed(() => editData.value.tipoDespliegue === 'Sin efecto');

// AI-Hint: Formato 24h forzado según requerimiento del usuario
function formatDateTime(date: Date | string | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleString('es-UY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function startEditing() {
  if (props.mode === 'create') {
    editData.value = {
      nroDocumento: '',
      tipoDocumento: 'Orden de Servicio',
      nombreServicio: '',
      realHoraInicio: new Date().toISOString().slice(0, 16),
      realHoraFin: new Date().toISOString().slice(0, 16),
      realMoviles: 0,
      realMotos: 0,
      realSsoo: 0,
      realPpssMovil: 0,
      realPieTierra: 0,
      realMotosBiTripuladas: 0,
      realHipos: 0,
      realChoqueApost: 0,
      realChoqueAlerta: 0,
      realHidro: 0,
      realTotalPersonal: 0,
      tipoDespliegue: 'Despliegue',
      motivoSinEfecto: '',
      departamento: '',
      seccional: ''
    };
  } else if (props.reporte) {
    // AI-Hint: Asegurar que las fechas se carguen en formato ISO local para el input datetime-local
    const toISOLocal = (date: Date | string | undefined) => {
      if (!date) return '';
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      const offset = d.getTimezoneOffset() * 60000;
      return new Date(d.getTime() - offset).toISOString().slice(0, 16);
    };

    editData.value = {
      nroDocumento: props.reporte.orden?.nroDocumento || '',
      tipoDocumento: props.reporte.orden?.tipoDocumento || 'Orden de Servicio',
      nombreServicio: props.reporte.orden?.nombreServicio || '',
      realHoraInicio: toISOLocal(props.reporte.realHoraInicio),
      realHoraFin: toISOLocal(props.reporte.realHoraFin),
      // AI-Hint: Recursos inician vacíos (0) por requerimiento, no cargan de ESMAPO
      realMoviles: 0,
      realMotos: 0,
      realSsoo: 0,
      realPpssMovil: 0,
      realPieTierra: 0,
      realMotosBiTripuladas: 0,
      realHipos: 0,
      realChoqueApost: 0,
      realChoqueAlerta: 0,
      realHidro: 0,
      realTotalPersonal: 0,
      tipoDespliegue: 'Despliegue',
      motivoSinEfecto: '',
      departamento: props.reporte.departamento || '',
      seccional: props.reporte.seccional || ''
    };
  }
}

// AI-Hint: Métodos mantenidos por compatibilidad con el padre aunque isEditing sea siempre true
function cancelEditing() {}

async function saveChanges() {
  saving.value = true;
  try {
    const reporteData: any = {
      realHoraInicio: editData.value.realHoraInicio ? new Date(editData.value.realHoraInicio) : undefined,
      realHoraFin: editData.value.realHoraFin ? new Date(editData.value.realHoraFin) : undefined,
      realMoviles: Number(editData.value.realMoviles),
      realMotos: Number(editData.value.realMotos),
      realSsoo: Number(editData.value.realSsoo),
      realPpssMovil: Number(editData.value.realPpssMovil),
      realPieTierra: Number(editData.value.realPieTierra),
      realMotosBiTripuladas: Number(editData.value.realMotosBiTripuladas),
      realHipos: Number(editData.value.realHipos),
      realChoqueApost: Number(editData.value.realChoqueApost),
      realChoqueAlerta: Number(editData.value.realChoqueAlerta),
      realHidro: Number(editData.value.realHidro),
      realTotalPersonal: Number(editData.value.realTotalPersonal),
      tipoDespliegue: editData.value.tipoDespliegue,
      motivoSinEfecto: editData.value.motivoSinEfecto,
      departamento: editData.value.departamento,
      seccional: editData.value.seccional
    };

    const ordenData: Partial<OrdenOperativa> = {
      nroDocumento: editData.value.nroDocumento,
      tipoDocumento: editData.value.tipoDocumento,
      nombreServicio: editData.value.nombreServicio
    };

    if (props.mode === 'create') {
      const unidadId = 1; 
      const ordenId = await esmapoService.crearOrden(
        ordenData.nroDocumento!,
        unidadId,
        ordenData.tipoDocumento,
        undefined,
        undefined,
        ordenData.nombreServicio,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );

      const newId = await desplieguesService.create({
        ...reporteData,
        ordenId,
        unidadReportanteId: unidadId,
        fechaHoraCarga: new Date()
      } as any);

      toast.success('Reporte creado correctamente');
      emit('created', { id: newId });
    } else if (props.reporte?.id) {
      await desplieguesService.update(props.reporte.id, reporteData);
      if (props.reporte.ordenId) {
        await esmapoService.update(props.reporte.ordenId, ordenData);
      }
      toast.success('Reporte actualizado correctamente');
      emit('updated');
    }
  } catch (error) {
    toast.error('Error al guardar el reporte');
  } finally {
    saving.value = false;
  }
}

watch(() => ({
  nroDocumento: editData.value.nroDocumento,
  tipoDocumento: editData.value.tipoDocumento,
  nombreServicio: editData.value.nombreServicio
}), (newValue) => {
  if (props.mode === 'create') {
    emit('temp-data-change', {
      orden: {
        nroDocumento: newValue.nroDocumento,
        tipoDocumento: newValue.tipoDocumento,
        nombreServicio: newValue.nombreServicio
      }
    });
  }
}, { deep: true });

defineExpose({
  startEditing,
  cancelEditing,
  saveChanges,
  isEditing,
  saving
});

onMounted(() => {
  startEditing();
});
</script>

<style scoped>
</style>
