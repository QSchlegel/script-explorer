<script setup>
import { onMounted, onUpdated } from "vue";
import { useTxStore } from 'stores/tx-store';
import UtxoView from './UtxoView.vue';
import SankeyView from "./SankeyView.vue";
import CopyToClipboard from "../Util/CopyToClipboard.vue";
import HoverIcon from "../Util/HoverIcon.vue";

const txStore = useTxStore()

const props = defineProps({
    txHash: String,
    //txIndex: Number,
    scriptHash: String
})

onMounted(() => {
    if (txStore.utxosList.filter((f) => f.txHash === props.txHash).length === 0)
        txStore.loadUtxos(props.txHash, props.scriptHash)
})
onUpdated(() => {
    if (txStore.utxosList.filter((f) => f.txHash === props.txHash).length === 0)
        txStore.loadUtxos(props.txHash, props.scriptHash)
})

</script>

<template>
    <div class="row q-px-md">
        <HoverIcon class="col-auto q-pt-lg" :icon-name="'sym_o_input'" :icon-size="'sm'" :headline="'Transaction'" :content="''" />
        <CopyToClipboard class="col q-pt-xs text-overline" :content="props.txHash" 
            :start-offset="8" :end-offset="8" 
            :btn-size="'xs'" :link="'txs'"/>

    </div>

    <div class="q-pa-sm"
        v-if="props.txHash !== undefined && txStore.utxosList.filter((f) => f.txHash === props.txHash).length > 0">
        <div class="row" >
            <div class="col-auto col-lg"/>
            <SankeyView class="col-11" :graphtype="'tx'" :graph-id="props.txHash" />
            <div class="col-auto col-lg"/>
        </div>
        
    </div>


    <div class="row" :key="props.txHash">
        <UtxoView class="col-12 col-md-6" :put='"inputs"' :tx-hash="props.txHash" />
        <UtxoView class="col-12 col-md-6" :put='"outputs"' :tx-hash="props.txHash" />
    </div>

</template>