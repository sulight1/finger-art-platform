import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MarketplaceView from '../views/MarketplaceView.vue';
import SkillExchangeView from '../views/SkillExchangeView.vue';
import LoginView from '../views/LoginView.vue';
import AdminDashboardView from '../views/AdminDashboardView.vue';
import ArtisanDashboardView from '../views/ArtisanDashboardView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import CustomRequestPoolView from '../views/CustomRequestPoolView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: MarketplaceView,
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: ProductDetailView,
    },
    {
      path: '/custom-request-pool',
      name: 'custom-request-pool',
      component: CustomRequestPoolView,
    },
    {
      path: '/skill-exchange',
      name: 'skill-exchange',
      component: SkillExchangeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboardView,
      meta: { requiresAdmin: true }
    },
    {
      path: '/artisan-dashboard',
      name: 'artisan-dashboard',
      component: ArtisanDashboardView,
    },
  ],
});

// Simple navigation guard — 仅 ADMIN 页面需要登录验证
router.beforeEach((to, from, next) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (to.meta.requiresAdmin && (!user || user.role !== 'ADMIN')) {
    next('/login');
  } else {
    next();
  }
});

export default router;
