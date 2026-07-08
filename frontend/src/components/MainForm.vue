<template>
  <div class="page">
    <header class="page-header">
      <div class="page-header__content">
        <h1>Мои заявки</h1>
        <p class="page-header__subtitle">
          Список заявок, доступных для вашей роли. Откройте карточку, чтобы просмотреть детали и выполнить действие.
        </p>
      </div>
      <RouterLink to="/create-ticket" class="btn btn--primary">+ Создать заявку</RouterLink>
    </header>

    <section class="card">
      <div v-if="ticketsStore.tickets.length" class="ticket-list card__body">
        <article v-for="ticket of ticketsStore.tickets" :key="ticket.id" class="ticket-card">
          <RouterLink :to="`/ticket/${ticket.id}`" class="ticket-card__link">
            <div class="ticket-card__title">{{ getTicketTitle(ticket) }}</div>
            <div class="ticket-card__meta">
              <span>ID: {{ ticket.id.slice(0, 8) }}…</span>
              <span>·</span>
              <span>{{ formatDate(ticket.updatedAt) }}</span>
            </div>
          </RouterLink>
          <div class="ticket-card__badges">
            <span class="badge badge--type">{{ getTypeLabel(ticket.type) }}</span>
            <span class="badge" :class="getStatusBadgeClass(ticket.status)">
              {{ getStatusLabel(ticket.status) }}
            </span>
          </div>
        </article>
      </div>

      <div v-else class="empty-state">
        <div class="empty-state__icon">📋</div>
        <h2 class="empty-state__title">Заявок пока нет</h2>
        <p class="empty-state__text">
          Создайте первую заявку на закупку или отпуск — она появится здесь после сохранения.
        </p>
        <RouterLink to="/create-ticket" class="btn btn--primary">Создать заявку</RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTicketsStore } from '@/store/ticket'
import {
  formatDate,
  getStatusBadgeClass,
  getStatusLabel,
  getTicketTitle,
  getTypeLabel,
} from '@/utils/ticketLabels'

const ticketsStore = useTicketsStore()

onMounted(() => {
  ticketsStore.getTickets()
})
</script>
