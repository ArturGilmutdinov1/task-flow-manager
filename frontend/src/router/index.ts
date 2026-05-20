import { createWebHistory, createRouter } from 'vue-router'
import MainForm from '@/components/MainForm.vue'
import LoginPage from '@/components/LoginPage.vue'
import NotFound from '@/components/NotFound.vue'
import CreateTicket from '@/components/CreateTicket.vue'
import TicketForm from '@/components/TicketForm.vue'

const routes = [
  { path: '/', component: MainForm },
  { path:'/login', component: LoginPage },
  { path:'/not-found', component: NotFound },
  { path:'/create-ticket', component: CreateTicket },
  { path:'/ticket', component: TicketForm },

]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})