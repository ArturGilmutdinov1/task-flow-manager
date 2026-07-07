import { defineStore } from 'pinia'
import { ref } from 'vue'  
import { ticketApi } from '@/api';



export const useTicketsStore = defineStore('ticketsStore', () => {  
    const tickets = ref([])


    function getTickets() {
        try {
            ticketApi.getTickets().then((responce) => {
                tickets.value = responce.data.items
            })
        } catch(error) {
            console.error('Ошибка загрузки тикетов:', error)
        }
    }
    return {tickets, getTickets}
})