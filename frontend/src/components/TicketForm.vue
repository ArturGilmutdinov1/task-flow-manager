<template>
  <div class="page">
    <header class="page-header">
      <div class="page-header__content">
        <h1>Карточка заявки</h1>
        <p v-if="ticketMeta" class="page-header__subtitle">
          {{ getTypeLabel(ticketMeta.type) }} · {{ getStatusLabel(ticketMeta.status) }}
        </p>
      </div>
      <RouterLink to="/" class="btn btn--secondary">← К списку</RouterLink>
    </header>

    <section class="card">
      <div class="card__body">
        <PurchaseTicketForm
          v-if="purchaseTicket"
          :ticket="purchaseTicket"
        />
        <VacationTicketForm
          v-else-if="vacationTicket"
          :ticket="vacationTicket"
        />
        <p v-else class="page-header__subtitle">Загрузка заявки…</p>
      </div>

      <div class="card__footer">
        <div class="field field--full" style="flex: 1; min-width: 220px">
          <label class="field-label" for="comment">Комментарий</label>
          <textarea
            id="comment"
            v-model="comment"
            placeholder="Добавьте комментарий к действию (обязателен при отклонении или доработке)"
            maxlength="250"
          ></textarea>
        </div>

        <div class="btn-group">
          <button v-if="showSendNext" type="button" class="btn btn--primary" @click="sendNext">
            {{ userData?.role === 'manager' ? 'Одобрить' : 'Отправить далее' }}
          </button>
          <button v-if="showSendBack" type="button" class="btn btn--danger" @click="sendBack">
            {{ userData?.role === 'manager' ? 'Отклонить' : 'На доработку' }}
          </button>
          <button type="button" class="btn btn--secondary" @click="openHistory = true">
            История
          </button>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="openHistory" class="modal-overlay" @click.self="openHistory = false">
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="history-title">
          <div class="modal-content__header">
            <h2 id="history-title">История документа</h2>
            <button type="button" class="btn btn--ghost" @click="openHistory = false">✕</button>
          </div>
          <div class="modal-content__body">
            <ModalHistoryWindow :historyData="ticketHistory" />
          </div>
          <div class="modal-content__footer">
            <button type="button" class="btn btn--secondary" @click="openHistory = false">
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { actionTicketApi, ticketApi } from '@/api'
import { computed, onMounted, ref, Teleport } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PurchaseTicketForm from './PurchaseTicketForm.vue'
import VacationTicketForm from './VacationTicketForm.vue'
import ModalHistoryWindow from './ModalHistoryWindow.vue'
import { getStatusLabel, getTypeLabel } from '@/utils/ticketLabels'
import type { PurchaseFormData } from './CreateTicketPurchase.vue'
import type { VacationFormData } from './CreateTicketVacation.vue'

interface HistoryEntry {
  actorId?: string
  at: string
  comment?: string | null
  action?: string
  toStatus?: string
}

const route = useRoute()
const router = useRouter()

const userDataJSON = localStorage.getItem('tfm_current_user')
const userData = userDataJSON ? JSON.parse(userDataJSON) : null

const ticketId = String(route.params.id)
const ticketMeta = ref<{ type: string; status: string } | null>(null)
const purchaseTicket = ref<PurchaseFormData | null>(null)
const vacationTicket = ref<VacationFormData | null>(null)
const ticketHistory = ref<HistoryEntry[]>([])
const comment = ref('')
const openHistory = ref(false)

const showSendNext = computed(() => {
  return ['requester', 'operator', 'manager'].includes(userData?.role)
})

const showSendBack = computed(() => {
  return ['operator', 'manager'].includes(userData?.role)
})

const dataFromSend = computed(() => ({
  actorId: userData?.id,
  actorRole: userData?.role,
  comment: comment.value,
}))

onMounted(() => {
  ticketApi.getTicket(ticketId).then((responce) => {
    ticketMeta.value = { type: responce.data.type, status: responce.data.status }

    if (responce.data.type === 'purchase') {
      purchaseTicket.value = responce.data.formData
    } else {
      vacationTicket.value = responce.data.formData
    }

    ticketHistory.value = responce.data.history
  })
})

async function sendNext() {
  switch (userData.role) {
    case 'requester':
      await actionTicketApi.submit(ticketId, dataFromSend.value)
      break
    case 'operator':
      await actionTicketApi.forward(ticketId, dataFromSend.value)
      break
    case 'manager':
      await actionTicketApi.approve(ticketId, dataFromSend.value)
      break
  }

  router.push('/')
}

async function sendBack() {
  switch (userData.role) {
    case 'operator':
      await actionTicketApi.rework(ticketId, dataFromSend.value)
      break
    case 'manager':
      await actionTicketApi.reject(ticketId, dataFromSend.value)
      break
  }

  router.push('/')
}
</script>

<style scoped>
.card__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--space-5);
}
</style>
