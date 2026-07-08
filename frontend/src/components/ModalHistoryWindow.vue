<template>
  <div class="history-table-wrap">
    <table v-if="historyData?.length" class="data-table">
      <thead>
        <tr>
          <th>Пользователь</th>
          <th>Дата</th>
          <th>Действие</th>
          <th>Комментарий</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in historyData" :key="index">
          <td>{{ entry.actorId ?? '—' }}</td>
          <td>{{ formatDate(entry.at) }}</td>
          <td>{{ entry.action ?? '—' }}</td>
          <td>{{ entry.comment?.trim() ? entry.comment : '—' }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else class="empty-state" style="padding: var(--space-8)">
      <p class="empty-state__text">История изменений пока пуста.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/ticketLabels'

interface HistoryEntry {
  actorId?: string
  at: string
  comment?: string | null
  action?: string
}

defineProps<{
  historyData: HistoryEntry[]
}>()
</script>
