<script setup>
const props = defineProps({
    content: String,
    startOffset: Number,
    endOffset: Number,
    btnSize: String,
    link: String
})
const copyToClipboard = () => {
    return navigator.clipboard.writeText(props.content)
}
</script>

<template>
    <div class="row q-pa-sm q-mt-sm" v-if="props.content !== undefined" >
        <router-link :to="(props.link)? '/'+ props.link +'/'+ props.content: '/'" 
            class="text-indigo-9 col-auto q-pa-sm" 
            style="text-decoration: none;">{{props.content.slice(0, props.startOffset) + ' ... ' + props.content.slice(props.content.length - props.endOffset) }}
        </router-link>
        <q-gutter class="col q-pt-sm">
            <q-btn class="col-auto" flat round icon="content_copy" :size="props.btnSize" @click="copyToClipboard()" />
        </q-gutter>
        
    </div>
</template>