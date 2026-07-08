<template>
  <div class="page">
    <header class="page-header">
      <div class="page-header__content">
        <h1>Новая заявка</h1>
        <p class="page-header__subtitle">Выберите тип заявки и заполните обязательные поля.</p>
      </div>
      <RouterLink to="/" class="btn btn--secondary">← К списку</RouterLink>
    </header>

    <form class="card card--padded form">
      <div class="field">
        <label class="field-label" for="ticket-type">Тип заявки</label>
        <select id="ticket-type" v-model="ticketType">
          <option v-for="ticket of ticketsType" :key="ticket.value" :value="ticket.value">
            {{ ticket.text }}
          </option>
        </select>
      </div>

      <div class="card card--padded" style="background: var(--color-gray-100); border-style: dashed">
        <CreateTicketPurchase
          v-if="ticketType === 'purchase'"
          @response="(childFormData) => (formData = childFormData)"
        />
        <CreateTicketVacation
          v-if="ticketType === 'vacation'"
          @response="(childFormData) => (formData = childFormData)"
        />
      </div>

      <div class="btn-group">
        <button type="button" class="btn btn--primary" @click="createTicket">Создать заявку</button>
        <RouterLink to="/" class="btn btn--secondary">Отмена</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CreateTicketPurchase from './CreateTicketPurchase.vue'
import CreateTicketVacation from './CreateTicketVacation.vue'
import { ticketApi, type CreateTicket } from '@/api'
import { getUser } from '@/utils/storage'

const router = useRouter()

type TicketType = 'purchase' | 'vacation'

const ticketsType = [
  { text: 'Закупка', value: 'purchase' as const },
  { text: 'Отпуск', value: 'vacation' as const },
]

const formData = ref<CreateTicket['formData'] | null>(null)
const ticketType = ref<TicketType>('purchase')

async function createTicket() {
  const user = getUser()

  if (!user) {
    alert('Авторизуйтесь')
    return
  }
  if (!formData.value) {
    alert('Заполните форму')
    return
  }

  const data = {
    type: ticketType.value,
    formData: formData.value,
    createdBy: user.id,
  } as CreateTicket

  if (data.type === 'purchase' && !('itemName' in data.formData)) {
    console.error('Несоответствие типа и данных')
    return
  }
  if (data.type === 'vacation' && !('startDate' in data.formData)) {
    console.error('Несоответствие типа и данных')
    return
  }

  await ticketApi.createTicket(data)
  router.push('/')
}
</script>
