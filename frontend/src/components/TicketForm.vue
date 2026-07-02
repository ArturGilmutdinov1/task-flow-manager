<template>
    <section>
        <component 
            v-if="ticketData && ticketComponent" 
            :is="ticketComponent" 
            :ticket="ticketData"
        />
        <p>Комментарий</p>
        <textarea v-model="comment" placeholder="введите несколько строчек" maxlength="250" ></textarea>

        <button v-if="showSendNext" type="button" @click="sendNext">{{ userData?.role === 'manager'?'Одобрить':'Отправить далее' }}</button>
        <button v-if="showSendBack"  type="button" @click="sendBack">Отправить на доработку</button>
        <button type="button" @click="openHistory = true ">История документа</button>
    </section>

    <Teleport to="body">
        <div v-if="openHistory" class="modal-overlay">
            <div class="modal-content">
                <ModalHistoryWindow :historyData="ticketHistory"/>
                <button @click="openHistory = false">Закрыть</button>
            </div>
        </div>

    </Teleport>
</template>


<script setup lang="ts">
    import { actionTicketApi, ticketApi } from '@/api';
    import { computed, onMounted, ref, Teleport } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import PurchaseTicketForm from './PurchaseTicketForm.vue';
    import VacationTicketForm from './VacationTicketForm.vue';
    import ModalHistoryWindow from './ModalHistoryWindow.vue';

    const route = useRoute();
    const router = useRouter();

    const userDataJSON = localStorage.getItem('tfm_current_user');
    const userData = userDataJSON ? JSON.parse(userDataJSON) : null;

    const ticketId = String(route.params.id);
    const typeTicket = ref<string | null>(null);
    const ticketData = ref(null);
    const ticketHistory = ref([]);
    const comment = ref('')

    const openHistory = ref(false);

    const showSendNext = computed(() => {
        return ['requester', 'operator', 'manager'].includes(userData?.role);
    });

    const showSendBack = computed(() => {
        return ['operator', 'manager'].includes(userData?.role);
    });


    const dataFromSend = computed(() => ({
        actorId: userData?.id,
        actorRole: userData?.role,
        comment: comment.value  
    }));



    const ticketComponent = computed(() => { 
               return typeTicket.value === 'purchase'? PurchaseTicketForm: VacationTicketForm;
            })

    onMounted(() =>{
        ticketApi.getTicket(ticketId).then((responce) => {
            typeTicket.value = responce.data.type;
            ticketData.value = responce.data.formData;
            ticketHistory.value = responce.data.history;            
        })
    })

    async function sendNext() {
        switch(userData.role) {
            case 'requester':
                await actionTicketApi.submit(ticketId, dataFromSend.value);
                break;
            case 'operator':
                await actionTicketApi.forward(ticketId, dataFromSend.value);
                break;
            case 'manager':
                await actionTicketApi.approve(ticketId, dataFromSend.value);
                break;             
        }
    
        router.push('/');
    }

    async function sendBack() {
        switch(userData.role) {
            case 'operator':
                await actionTicketApi.rework(ticketId, dataFromSend.value);
                break;
            case 'manager':
                await actionTicketApi.reject(ticketId, dataFromSend.value);
                break;
        }

        router.push('/');
    }
</script>

<style scoped>
/* Затемнение фона */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; 
}

/* Содержимое модалки */
.modal-content {
    background: white;
    padding: 30px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    position: relative;
}

</style>