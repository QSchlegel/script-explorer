<template>

    <div class="p-4 m-4 text-sm text-yellow-700 bg-yellow-100 border border-yellow-600 rounded-lg dark:bg-gray-600 dark:text-yellow-300 dark:border-yellow-200"
        role="alert" v-if="netStore.LoggedIn !== true">
        <span class="font-medium">Project Id missing!</span>
        <br />
        Please Enter your Project ID.
    </div>

</template>

<script setup>
import { useNetStore } from '/stores/net-store'
const netStore = useNetStore()
</script>