<script setup>
const props = defineProps({
    iconName: String,
    iconSize: String,
    headline: String,
    content: String
})
</script>
<template>
    <div class="popover__title popover__wrapper">
        <q-icon :name="props.iconName" :size="props.iconSize" />
        <div class="popover__content text-left">
            <p class="text-h6">{{props.headline}}</p>
            <p style="font-size:x-small">
                {{props.content}}
            </p>
        </div>
    </div>
</template>