<script setup>
import { computed } from "vue";
import { useTxStore } from 'stores/tx-store';
import UtxoView from './UtxoView.vue';
import SankeyView from "./SankeyView.vue";

const txStore = useTxStore()

var currentTx = ''
const txHash = computed(() => {
    if (currentTx !== txStore.currentTx) txStore.loadUtxos(); currentTx = txStore.currentTx
    return txStore.currentTx
})

</script>

<template>
    <div class="q-pa-sm" v-if="txHash !== ''">
        <SankeyView :graphtype="'tx'" />
    </div>

    
    <div class="row" :key="txHash">
        <UtxoView class="col-12 col-sm-6" :put='"inputs"' :tx_hash="txStore.currentTx" />
        <UtxoView class="col-12 col-sm-6" :put='"outputs"' :tx_hash="txStore.currentTx" />
    </div>

</template>