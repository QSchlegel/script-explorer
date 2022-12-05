<script setup>
import { useTxStore } from 'stores/tx-store';
import { onMounted, ref, computed } from 'vue';
import CopyToClipboard from '../Util/CopyToClipboard.vue';
import HoverIcon from '../Util/HoverIcon.vue';
import SankeyView from './SankeyView.vue';

const txStore = useTxStore()

const props = defineProps({
    txHash: String
})

const loaded = ref(false)

onMounted(async () => {
    loaded.value = false
    loaded.value = await txStore.loadUtxos(props.txHash.split('-')[0])
})

const utxo = computed(() => {
    if (loaded.value) {
        return txStore.utxosList.filter((f) => f.txHash === props.txHash.split('-')[0])[0].outputs.filter((f) => f.output_index === parseInt(props.txHash.split('-')[1]))[0]
    } else return ''

})
</script>

<template>
    <div v-if="loaded">
        <div class="row q-pl-md">
            <HoverIcon class="col-auto q-pt-lg" :icon-name="'sym_o_wallet'" :icon-size="'sm'" :headline="'Address'"
                :content="''" />
            <CopyToClipboard class="col-auto" :content="utxo.address" :start-offset="15" :end-offset="10"
                :btn-size="'xs'" :link="'addresses'" />
            
        </div>
        <div class="row q-pl-xl">
            <HoverIcon class="col-auto q-pt-lg" :icon-name="'sym_o_receipt_long'" :icon-size="'sm'" :headline="'UTxO'"
                :content="''" />

            <HoverIcon class="col-auto q-pt-lg" v-if="utxo.collateral" :icon-name="'sym_o_balance'" :icon-size="'sm'"
                :headline="'Collateral'" :content="''" />

            <HoverIcon class="col-auto q-pt-lg" :icon-name="'sym_o_satellite_alt'" v-if="utxo.reference_script_hash"
                :icon-size="'sm'" :headline="'Reference Scripthash'" :content="utxo.reference_script_hash" />

            <HoverIcon class="col-auto q-pt-lg" :icon-name="'sym_o_data_object'" v-if="utxo.data_hash" :icon-size="'sm'"
                :headline="'Datum'" :content="utxo.data_hash" />

            <HoverIcon class="col-auto q-pt-lg" :icon-name="'sym_o_topic'" v-if="utxo.inline_datum" :icon-size="'sm'"
                :headline="'Inline Datum'" :content="utxo.inline_datum" />

            <CopyToClipboard class="col-auto" :content="((props.put == 'inputs') ? utxo.tx_hash : props.txHash)"
                :start-offset="10" :end-offset="10" :btn-size="'xs'" :link="'utxos'" />
        </div>

        <SankeyView class="row q-pl-xl q-pa-md" :graph-id="props.txHash" :graphtype="'utxo'"/>
        
    </div>
</template>