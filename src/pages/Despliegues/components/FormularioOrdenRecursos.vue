<template>
  <div class="formulario-secciones">
    <!-- Sección Única: Recursos del Operativo -->
    <InlineForm>
      <FichaFormulario :columns="3">
        <!-- Recursos Móviles -->
        <div class="ficha-dato">
          <span class="ficha-dato-label">Móviles</span>
          <Input
            v-model="formData.planMoviles"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/movil.svg" alt="Móviles" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Motos</span>
          <Input
            v-model="formData.planMotos"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/motos.svg" alt="Motos" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Motos Bi/Tripuladas</span>
          <Input
            v-model="formData.planMotosBiTripuladas"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/motosBitripuladas.svg" alt="Motos Bi/Tripuladas" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Hidrantes</span>
          <Input
            v-model="formData.planHidro"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/hidro.png" alt="Hidrantes" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Hipos</span>
          <Input
            v-model="formData.planHipos"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/hipos.svg" alt="Hipos" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <!-- Personal -->
        <div class="ficha-dato">
          <span class="ficha-dato-label">SSOO</span>
          <Input
            v-model="formData.planSsoo"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/ssoo.svg" alt="SSOO" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">P.P.S.S. en Móvil</span>
          <Input
            v-model="formData.planPpssMovil"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/ppssEnMovil.svg" alt="P.P.S.S. en Móvil" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Pie a Tierra</span>
          <Input
            v-model="formData.planPieTierra"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/pieTierra.svg" alt="Pie a Tierra" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Choque Apostado</span>
          <Input
            v-model="formData.planChoqueApost"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/choqueApostado.svg" alt="Choque Apostado" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Choque en Alerta</span>
          <Input
            v-model="formData.planChoqueAlerta"
            type="number"
            :min="0"
            size="sm"
            class="input-cantidad"
          >
            <template #icon>
              <img src="@/assets/images/choqueEnAlerta.svg" alt="Choque en Alerta" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
        
        <div class="ficha-dato">
          <span class="ficha-dato-label">Total Efectivos</span>
          <Input 
            :model-value="totalEfectivosCalculado" 
            type="text"
            size="sm"
            disabled
            class="input-cantidad input-total-efectivos"
          >
            <template #icon>
              <img src="@/assets/images/ppssTotal.svg" alt="Total Efectivos" style="width: 16px; height: 16px;" />
            </template>
          </Input>
        </div>
      </FichaFormulario>
    </InlineForm>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Input, Select, FichaFormulario, InlineForm } from '@components'
import { useFormularioOrden } from './useFormularioOrden'

interface Props {
  mode?: 'create' | 'edit'
  ordenId?: number
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create'
})

const {
  formData,
  errors,
  tipoDespliegueOptions,
  motivoSinEfectoOptions
} = useFormularioOrden(props)

// Computed property para calcular total de efectivos automáticamente
const totalEfectivosCalculado = computed(() => {
  const ppssMovil = Number(formData.value.planPpssMovil) || 0
  const motos = Number(formData.value.planMotos) || 0
  const hipos = Number(formData.value.planHipos) || 0
  const pieTierra = Number(formData.value.planPieTierra) || 0
  const motosBiTri = Number(formData.value.planMotosBiTripuladas) || 0
  
  return ppssMovil + motos + hipos + pieTierra + (motosBiTri * 2)
})

// Sincronizar el valor calculado con el formData para la persistencia
watch(totalEfectivosCalculado, (newValue) => {
  formData.value.planTotalPersonal = newValue
}, { immediate: true })
</script>

<style scoped>
/* Inputs de Cantidad - Ancho Limitado */
.input-cantidad {
  max-width: 5rem; /* ~80px - Suficiente para 2 dígitos + padding */
}

/* Eliminar padding izquierdo del contenedor de ícono */
.input-cantidad :deep(.input-icon) {
  padding-left: 0;
}

/* ✅ ÉNFASIS SUTIL PARA CAMPO CALCULADO (Consistencia con Direcciones) */
.input-total-efectivos :deep(.input-container) {
  border-color: var(--color-primary);
  background-color: var(--color-gray-100);
}

.input-total-efectivos :deep(.input-field) {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}
</style>
