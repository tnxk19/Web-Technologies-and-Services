import { createWebHistory, createRouter } from 'vue-router';
// import Login from '@/views/Login.vue'
const routes = [
  {
    path: '/',
    name: 'expensemanagement',
    component: () => import('@/views/ExpenseManagement.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('@/views/NotFound.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/UserLogin.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/UserRegister.vue')
  },

  {
    path: '/add-expense',
    name: 'AddExpense',
    component: () => import('@/views/AddExpense.vue')
  },
  {
    path: '/edit-expense/:id',
    name: 'EditExpense',
    component: () => import('@/views/EditExpense.vue'),
    props: (route) => ({ expenseId: route.params.id })
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

const isLoggedIn = () => {
  return sessionStorage.getItem('authToken');
};

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && to.path !== '/register' && !isLoggedIn()) {
    next({ path: '/login' });
  } else next();
  if (to.path == '/login' && isLoggedIn()) {
    next({ path: '/' });
  }
});

export default router;
