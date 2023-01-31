<script setup>
const props = defineProps({
    blockTime: ''
})
const convertTimestamp = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
    let day = ("0" + date.getUTCDate()).slice(-2);
    let year = date.getUTCFullYear().toString().slice(-2);
    let hours = ("0" + date.getUTCHours()).slice(-2);
    let minutes = ("0" + date.getUTCMinutes()).slice(-2);
    return `${hours}:${minutes} ${month}/${day}/${year}`;
}
const time = ref('')
onMounted(async () => {
    time.value = convertTimestamp(props.blockTime)
})
</script>
<template>
    <p>{{ time }}</p>
</template>