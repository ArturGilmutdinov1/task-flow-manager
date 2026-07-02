<template>
    <section>
        <form>
            <label>
                Тип заявки
                <select v-model="ticketType">
                    <option v-for="ticket of ticketsType" :value="ticket.value">
                        {{ticket.text}}
                    </option>
                </select>
            </label>

            <CreateTicketPurchase v-if="ticketType==='purchase'" @response="(childFormData) => formData = childFormData"/>
            <CreateTicketVacation v-if="ticketType==='vacation'" @response="(childFormData) => formData = childFormData"/>

            <button type="button" @click="createTicket()">Отправить</button>
        </form>
    </section>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CreateTicketPurchase from './CreateTicketPurchase.vue';
import CreateTicketVacation from './CreateTicketVacation.vue';
import { ticketApi, type CreateTicket } from '@/api'
import { getUser } from '@/utils/storage';

const router = useRouter();

type TicketType = 'purchase' | 'vacation'

const ticketsType = [
    { text: 'Покупка', value: 'purchase' as const },
    { text: 'Отпуск', value: 'vacation' as const },
]

const formData = ref<CreateTicket['formData'] | null>(null)
const ticketType = ref<TicketType>('purchase')

async function createTicket() {
    const user = getUser()
    
    if (!user) {
        alert('Авторизуйтесь');
        return; 
    }
    if (!formData.value) {
        alert('Заполните форму')
        return
    }

    // Используем type assertion с проверкой
    const data = {
        type: ticketType.value,
        formData: formData.value,
        createdBy: user.id
    } as CreateTicket
    
    // Дополнительная runtime-проверка (опционально)
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

