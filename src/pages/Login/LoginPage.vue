<template>
  <div class="login-page">
    <!-- Branding Panel -->
    <aside class="login-branding">
      <div class="login-branding-content">
        <img 
          src="@/assets/images/logo-gr-dorado.svg" 
          alt="Logo Guardia Republicana"
          class="login-logo"
        />

        <h1 class="login-title">DNGR</h1>
        <p class="login-subtitle">Sistema de Gestión</p>
        
        <div class="login-divider"></div>
        
        <p class="login-ministry">Dirección Nacional de la Guardia Republicana</p>
        <p class="login-country">Ministerio del Interior · Uruguay</p>
      </div>
    </aside>

    <!-- Form Panel -->
    <main class="login-content">
      <div class="login-form-wrapper">
        <!-- Mobile Header -->
        <div class="login-mobile-header">
          <img 
            src="@/assets/images/logo-gr-dorado.svg" 
            alt="Logo"
            class="login-mobile-logo"
          />
          <span class="login-mobile-title">DNGR</span>
          <span class="login-mobile-subtitle">Sistema de Gestión</span>
        </div>

        <LoginForm 
          :is-loading="isLoading" 
          @submit="handleLogin" 
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import './LoginPage.css'
import { ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import { useAuth } from '@hooks'

const { login } = useAuth()
const isLoading = ref(false)

interface LoginCredentials {
  username: string
  password: string
}

async function handleLogin(credentials: LoginCredentials) {
  isLoading.value = true

  await new Promise(resolve => setTimeout(resolve, 800))

  login(credentials.username, credentials.password)
  
  isLoading.value = false
}
</script>
