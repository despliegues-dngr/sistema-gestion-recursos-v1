<template>
  <div class="main-layout">
    <header class="main-topbar">
      <div class="topbar-content">
        <div class="topbar-brand">
          <div class="topbar-logo">
            <img :src="logoUrl" alt="DNGR" class="topbar-logo-img" />
          </div>
          <div class="topbar-title">
            <span class="topbar-title-main">DNGR</span>
            <span class="topbar-title-sub">Sistema de Gestión</span>
          </div>
        </div>

        <nav class="topbar-nav" v-if="navItems.length > 0">
          <router-link
            v-for="item in navItems"
            :key="item.id"
            :to="item.route"
            class="topbar-nav-item"
            :class="{ 'topbar-nav-item--active': isActiveRoute(item) }"
          >
            <component :is="getIcon(item.icon)" :size="18" class="topbar-nav-icon" />
            <span class="topbar-nav-label">{{ item.label }}</span>
          </router-link>
        </nav>

        <div class="topbar-actions">
          <div class="topbar-user-info">
            <div class="topbar-user-details">
              <span class="topbar-user-name">{{ userDisplayName }}</span>
            </div>
          </div>
          <button class="topbar-logout-button" @click="handleLogout">
            <i class="pi pi-sign-out"></i>
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import "./MainLayout.css";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth, useUnitNavigation } from "@hooks";
import { getNavConfig } from "@config";
import logoUrl from "@/assets/images/logo-gr-dorado.svg";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  Shield,
  UserCheck,
  FileSearch,
  TrendingUp,
} from "lucide-vue-next";
import type { NavItem } from "@config";

const route = useRoute();
const router = useRouter();
const { logout, usuario } = useAuth();
const { currentUnitSlug, handleUnitChange } = useUnitNavigation();

const userDisplayName = computed(() => {
  // Demo: Usuario fijo para entorno policial
  // En producción, esto vendría del usuario autenticado con su rango real
  return "Tte. Juan Pérez";
});

// AI-Hint: Obtener items de navegación según unidad actual | unidad viene de currentUnitSlug | Rutas se generan dinámicamente con contexto de unidad
const navConfig = computed(() => {
  return getNavConfig(currentUnitSlug.value);
});

const navItems = computed(() => navConfig.value.items);

const iconMap: Record<string, unknown> = {
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  Shield,
  UserCheck,
  FileSearch,
  TrendingUp,
};

function getIcon(iconName: string) {
  return iconMap[iconName] || LayoutDashboard;
}

function isActiveRoute(item: NavItem): boolean {
  if (item.exact) {
    return route.path === item.route;
  }
  return route.path.startsWith(item.route);
}

function handleLogout() {
  logout();
}
</script>
