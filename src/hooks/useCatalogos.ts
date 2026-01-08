/**
 * Composable para acceso a catálogos con fallback a hardcode
 * Modo dual durante migración
 */
import { ref, onMounted } from 'vue';
import { catalogosService } from '@services';
import type { TipoCatalogo } from '@lib/types';

// Valores hardcodeados como fallback (TEMPORAL - eliminar en Fase 4)
const FALLBACK_VALUES: Record<string, string[]> = {
  tipo_documento: ['Orden de Operaciones', 'Circular', 'Orden de Servicio', 'Comunicado', 'Otro'],
  tipo_servicio: ['Operativo', 'Patrullaje', 'Apoyo', 'Incursión', 'Allanamiento perimetral'],
  tiempo_servicio: ['Permanente', 'Transitorio', 'Estático'],
  departamento: ['Artigas', 'Canelones', 'Cerro Largo', 'Colonia', 'Durazno', 'Flores', 'Florida', 'Lavalleja', 'Maldonado', 'Montevideo', 'Paysandú', 'Río Negro', 'Rivera', 'Rocha', 'Salto', 'San José', 'Soriano', 'Tacuarembó', 'Treinta y Tres'],
  seccional: ['1ra', '2da', '3ra', '4ta', '5ta', '6ta', '7ma', '8va', '9na', '10ma', '11ra', '12da', '13ra', '14ta', '15ta', '16ta', '17ma', '18va', '19na', '20ma'],
  motivo_sin_efecto: ['Por falta de personal', 'Por orden de superior', 'Por cubrir otro Operativo'],
  tipo_tarea: ['Administrativa', 'Operativa', 'Supervisión', 'Coordinación', 'Técnica', 'Logística']
};

export function useCatalogo(tipo: TipoCatalogo) {
  const opciones = ref<Array<{ value: string; label: string }>>([]);
  const cargando = ref(false);
  const error = ref<string | null>(null);

  async function cargar() {
    cargando.value = true;
    error.value = null;
    try {
      const fromDB = await catalogosService.getOptions(tipo);
      
      if (fromDB.length > 0) {
        opciones.value = fromDB;
      } else if (FALLBACK_VALUES[tipo]) {
        // Fallback a hardcode si BD vacía
        opciones.value = FALLBACK_VALUES[tipo].map(v => ({ value: v, label: v }));
      } else {
        opciones.value = [];
      }
    } catch (err) {
      error.value = 'Error al cargar catálogo';
      
      // Fallback en caso de error
      if (FALLBACK_VALUES[tipo]) {
        opciones.value = FALLBACK_VALUES[tipo].map(v => ({ value: v, label: v }));
      }
    } finally {
      cargando.value = false;
    }
  }

  onMounted(() => {
    cargar();
  });

  return {
    opciones,
    cargando,
    error,
    recargar: cargar
  };
}

// Hooks específicos para cada catálogo (sintaxis más limpia)
export const useTiposDocumento = () => useCatalogo('tipo_documento');
export const useTiposServicio = () => useCatalogo('tipo_servicio');
export const useTiemposServicio = () => useCatalogo('tiempo_servicio');
export const useDepartamentos = () => useCatalogo('departamento');
export const useSeccionales = () => useCatalogo('seccional');
export const useMotivosSinEfecto = () => useCatalogo('motivo_sin_efecto');
export const useTiposTarea = () => useCatalogo('tipo_tarea');
