<script setup>
import { onMounted, onUpdated } from "vue";
import { useTxStore } from 'stores/tx-store';
import UtxoView from './UtxoView.vue';
import SankeyView from "./SankeyView.vue";

const txStore = useTxStore()

const props = defineProps({
    txHash: String,
    txIndex: Number,
    scriptHash: String
})

onMounted(()=>{
    txStore.loadUtxos(props.txHash, props.scriptHash)
})
onUpdated(()=>{
    txStore.loadUtxos(props.txHash, props.scriptHash)
})

</script>

<template>
    <div class="q-pa-sm" v-if="props.txHash !== undefined">
        <SankeyView :graphtype="'tx'" :graph-id="props.txHash" />
    </div>

    
    <div class="row" :key="props.txHash">
        <UtxoView class="col-12 col-sm-6" :put='"inputs"' :tx-hash="props.txHash" />
        <UtxoView class="col-12 col-sm-6" :put='"outputs"' :tx-hash="props.txHash" />
    </div>

</template>