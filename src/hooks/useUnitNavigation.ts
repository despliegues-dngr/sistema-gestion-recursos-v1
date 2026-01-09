import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getUnitDisplayName, unitOptions } from "@config";

/**
 * Hook to handle unit selection and navigation
 */
export function useUnitNavigation() {
  const route = useRoute();
  const router = useRouter();

  const currentUnitSlug = computed(() => {
    // AI-Hint: Priorizar parámetro unidad | Fallback a extracción de path para rutas legacy o sin params | Default a direccion
    const paramUnidad = route.params.unidad as string;
    if (paramUnidad) return paramUnidad;

    const pathSegments = route.path.split('/').filter(Boolean);
    return pathSegments[0] || "direccion";
  });

  const currentUnitName = computed(() => {
    return getUnitDisplayName(currentUnitSlug.value);
  });

  // AI-Hint: Cambiar unidad SIEMPRE redirige a página principal | Dir VI → dashboard | Resto → personal
  function handleUnitChange(value: string | number) {
    const unidad = String(value);
    
    // Dirección VI siempre va a dashboard
    if (unidad === 'direccion-vi') {
      router.push({ name: 'dashboard', params: { unidad } });
    } else {
      // Todas las demás unidades van a personal
      router.push({ name: 'personal', params: { unidad } });
    }
  }

  return {
    currentUnitSlug,
    currentUnitName,
    handleUnitChange,
    unitOptions
  };
}
