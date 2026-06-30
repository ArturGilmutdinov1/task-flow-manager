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
                    <td>пока никто</td>
                    <td>{{ history.at }}</td>
                    <td>{{ history.comment }}</td>
                </tr>
            </tbody>
            </table>
</template>


<script setup>
    const props = defineProps({
        historyData: Array
    })
    
    const historyData = props.historyData;
    console.log(historyData);
    
</script>