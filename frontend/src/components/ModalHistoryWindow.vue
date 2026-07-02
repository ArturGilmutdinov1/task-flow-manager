<template>
        <table>
            <thead>
                <tr>
                    <th>Пользователь</th>
                    <th>Дата</th>
                    <th>Комментарий</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(history, index) in historyData" :key="index">
                    <td>{{ history.actorId ?? '—' }}</td>
                    <td>{{ history.at }}</td>
                    <td>{{ history.comment ?? '—' }}</td>
                </tr>
            </tbody>
            </table>
</template>


<script setup  lang="ts">
    defineProps({
        historyData: Array
    })
</script>