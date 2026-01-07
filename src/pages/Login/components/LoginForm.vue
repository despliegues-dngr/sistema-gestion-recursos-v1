<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <div class="login-form-header">
      <h2 class="login-form-title">Iniciar Sesión</h2>
      <p class="login-form-description">
        Ingrese sus credenciales para acceder al sistema
      </p>
    </div>

    <div class="login-form-fields">
      <Input
        v-model="username"
        label="Usuario"
        placeholder="Ingrese su usuario"
        size="lg"
        :error="errors.username"
        :disabled="isLoading"
        required
      />

      <PasswordInput
        v-model="password"
        label="Contraseña"
        placeholder="Ingrese su contraseña"
        size="lg"
        :error="errors.password"
        :disabled="isLoading"
        required
      />
    </div>

    <Button
      type="submit"
      variant="primary"
      size="lg"
      :loading="isLoading"
      :disabled="isLoading"
      full-width
    >
      Ingresar al Sistema
    </Button>

    <div class="login-form-footer">
      <ShieldCheck :size="14" />
      <span>Conexión segura</span>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ShieldCheck } from 'lucide-vue-next'
import { Button, Input, PasswordInput } from '@components'

interface Props {
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<{
  submit: [credentials: { username: string; password: string }]
}>()

const username = ref('')
const password = ref('')

const errors = reactive({
  username: '',
  password: ''
})

function validate(): boolean {
  errors.username = ''
  errors.password = ''
  
  let isValid = true

  if (!username.value.trim()) {
    errors.username = 'El usuario es requerido'
    isValid = false
  }

  if (!password.value) {
    errors.password = 'La contraseña es requerida'
    isValid = false
  }

  return isValid
}

function handleSubmit() {
  if (!validate()) return
  
  emit('submit', {
    username: username.value.trim(),
    password: password.value
  })
}
</script>
