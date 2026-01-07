/**
 * Hook de Autenticación
 * 
 * Demo: Sin validación real de servidor.
 */

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Usuario } from '@lib/types'

const usuario = ref<Usuario | null>(null)

export const isAuthenticated = computed(() => usuario.value !== null)

export function useAuth() {
  const router = useRouter()

  async function login(username: string, _password: string) {
    let rolId = 1
    
    if (username === '12345678') {
      rolId = 1
    } else if (username === '87654321') {
      rolId = 3
    }

    usuario.value = {
      id: 1,
      username: username,
      password: '',
      rolId: rolId,
      estado: 'activo'
    } as Usuario
    
    router.push('/')
  }

  function logout() {
    usuario.value = null
    router.push('/login')
  }

  return {
    usuario,
    isAuthenticated: computed(() => usuario.value !== null),
    login,
    logout
  }
}
