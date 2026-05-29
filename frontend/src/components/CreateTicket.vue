<template>
    <section>
        <form>
            <CreateTicketPurchase @response="(childFormData) => formData = childFormData"/>
            <CreateTicketVacation @response="(childFormData) => formData = childFormData"/>
        </form>
    </section>
</template>


<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';    
    
    import CreateTicketPurchase from './CreateTicketPurchase.vue';
    import CreateTicketVacation from './CreateTicketVacation.vue';

     const formData = ref({})

    const router = useRouter();


</script>

