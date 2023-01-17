<template>
    <div class="bg-white dark:bg-gray-900">

        <NavView />
        <slot />

        <FooterView />

    </div>
</template>

<script setup>
import FooterView from '~~/components/std/FooterView.vue';
import NavView from '~~/components/std/NavView.vue';
</script>