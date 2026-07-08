<template>
  <div class="ticket-detail">
    <p class="ticket-type-label">🏖 Заявка на отпуск</p>
    <h2>{{ ticket.itemName }}</h2>

    <div class="detail-grid">
      <div class="detail-item">
        <span class="detail-item__label">Дата начала</span>
        <span class="detail-item__value">{{ ticket.startDate || '—' }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-item__label">Дата окончания</span>
        <span class="detail-item__value">{{ ticket.endDate || '—' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  ticket: {
    itemName: string
    startDate: string
    endDate: string
  }
}>()
</script>

<style scoped>
.ticket-detail h2 {
  margin-bottom: var(--space-5);
}
</style>
