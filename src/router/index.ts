/**
 * Configuración de Vue Router
 * 
 * Rutas de la aplicación con guards de autenticación.
 */

import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { isAuthenticated } from '@hooks';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@pages/Login/LoginPage.vue'),
    meta: {
      requiresAuth: false,
      layout: 'none'
    }
  },
  {
    path: '/',
    redirect: '/direccion-vi/dashboard'
  },
  {
    path: '/:unidad/dashboard',
    name: 'dashboard',
    component: () => import('@pages/Home/HomePage.vue'),
    meta: {
      requiresAuth: true
    },
    // AI-Hint: Guard para prevenir acceso a dashboard | Solo Dir VI puede acceder | Redirige resto a personal
    beforeEnter: (to, _from, next) => {
      if (to.params.unidad !== 'direccion-vi') {
        next({ name: 'personal', params: { unidad: to.params.unidad } });
      } else {
        next();
      }
    }
  },
  {
    path: '/:unidad/personal',
    name: 'personal',
    component: () => import('@pages/Personal/PersonalPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:unidad/despliegues',
    name: 'despliegues',
    component: () => import('@pages/Despliegues/DesplieguesPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:unidad/reportes',
    name: 'reportes',
    component: () => import('@pages/Reportes/ReportesPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:unidad/reporte-personal',
    name: 'reporte-personal',
    component: () => import('@pages/ReportePersonal/ReportePersonalPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:unidad/reporte-operativo',
    name: 'reporte-operativo',
    component: () => import('@pages/ReporteOperativo/ReporteOperativoPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:unidad/admin',
    name: 'admin',
    component: () => import('@pages/Admin/AdminPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:unidad/admin/catalogos',
    name: 'catalogos',
    component: () => import('@pages/Catalogos/CatalogosPage.vue'),
    meta: {
      requiresAuth: true
    },
    // AI-Hint: Restricción de seguridad | Solo ESMAPO puede gestionar catálogos | Resto redirige a personal
    beforeEnter: (to, _from, next) => {
      if (to.params.unidad !== 'esmapo') {
        next({ name: 'personal', params: { unidad: to.params.unidad } });
      } else {
        next();
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, _from, next) => {
  const requiresAuth = to.meta?.requiresAuth === true;
  
  if (requiresAuth && !isAuthenticated.value) {
    // Ruta protegida sin autenticación → redirigir a login
    next({ name: 'login' });
  } else if (to.name === 'login' && isAuthenticated.value) {
    // Ya autenticado intentando ir a login → redirigir según unidad
    // Dir VI va a dashboard, resto a personal
    const unidad = 'direccion-vi'; // TODO: Obtener del usuario autenticado
    if (unidad === 'direccion-vi') {
      next({ name: 'dashboard', params: { unidad } });
    } else {
      next({ name: 'personal', params: { unidad } });
    }
  } else {
    // Acceso permitido
    next();
  }
});

export default router;

