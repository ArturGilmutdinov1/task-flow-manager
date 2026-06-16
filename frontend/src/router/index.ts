import { createWebHistory, createRouter } from 'vue-router'
import MainForm from '@/components/MainForm.vue'
import LoginPage from '@/components/LoginPage.vue'
import NotFound from '@/components/NotFound.vue'
import CreateTicket from '@/components/CreateTicket.vue'
import TicketForm from '@/components/TicketForm.vue'

const routes = [
  { path: '/', component: MainForm, meta: { requiresAuth: true }},
  { path:'/login', component: LoginPage, requiresAuth: false },
  { path:'/not-found', component: NotFound },
  { path:'/create-ticket', component: CreateTicket, meta: { requiresAuth: true } },
  { path:`/ticket/:id`, component: TicketForm, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach( async (to, from)=> {
  const userJSON = localStorage.getItem('tfm_current_user')
  const isAuthenticated = !!userJSON;

  if (!isAuthenticated && to.meta.requiresAuth) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }
})

export {router}