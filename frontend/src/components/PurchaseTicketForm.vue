<template>
  <div class="ticket-detail">
    <p class="ticket-type-label">🛒 Заявка на закупку</p>
    <h2>{{ ticket.itemName }}</h2>

    <div class="detail-grid">
      <div class="detail-item">
        <span class="detail-item__label">Количество</span>
        <span class="detail-item__value">{{ ticket.quantity ?? '—' }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-item__label">Цена</span>
        <span class="detail-item__value">
          {{ ticket.price != null ? `${ticket.price.toLocaleString('ru-RU')} ₽` : '—' }}
        </span>
      </div>
      <div class="detail-item field--full">
        <span class="detail-item__label">Обоснование</span>
        <span class="detail-item__value">{{ ticket.reason || '—' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PurchaseFormData } from './CreateTicketPurchase.vue'

defineProps<{
  ticket: PurchaseFormData
}>()
</script>

<style scoped>
.ticket-detail h2 {
  margin-bottom: var(--space-5);
}

.detail-item.field--full {
  grid-column: 1 / -1;
}
</style>
