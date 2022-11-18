<script setup>
const props = defineProps({
    content: String,
    startOffset: Number,
    endOffset: Number,
    btnSize: String
})
const copyToClipboard = () => {
    return navigator.clipboard.writeText(props.content)
}
</script>

<template>
    <div class="row" v-if="props.content !== undefined" >
        <p class="col-auto q-pt-md q-ml-sm">{{props.content.slice(0, props.startOffset) + ' ... ' + props.content.slice(props.content.length - props.endOffset) }}</p>
        <q-btn class="col-auto q-pa-sm q-ma-sm" flat round icon="content_copy" :size="props.btnSize" @click="copyToClipboard()" />
    </div>
</template>