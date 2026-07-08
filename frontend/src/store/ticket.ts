import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ticketApi } from '@/api'

export interface TicketListItem {
  id: string
  type: string
  status: string
  updatedAt: string
  formData?: Record<string, unknown>
}

export const useTicketsStore = defineStore('ticketsStore', () => {
  const tickets = ref<TicketListItem[]>([])

  function getTickets() {
    try {
      ticketApi.getTickets().then((responce) => {
        tickets.value = responce.data.items
      })
    } catch (error) {
      console.error('Ошибка загрузки тикетов:', error)
    }
  }

  return { tickets, getTickets }
})
