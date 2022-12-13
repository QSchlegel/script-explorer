<script setup>
import { useScrStore } from 'stores/scr-store';
import { useTxStore } from 'stores/tx-store';
import HoverIcon from '../Util/HoverIcon.vue';
import SankeyView from './SankeyView.vue';

const scrStore = useScrStore();
const txStore = useTxStore();

const props = defineProps({
    scriptHash: String
})

</script>

<template>

    <div v-for="tx, index in scrStore.plutusList.filter((f) => f.scriptHash === props.scriptHash).map((m) => m.data)[0]"
        :key="index">

        <q-card flat bordered class="q-ma-md">

            <div class="row">
                <div class="col-2 col-sm-1 col-lg-auto ">
                    <q-btn class="q-pa-sm q-ma-sm" flat round icon="sym_o_chevron_right" size="md"
                        @click="txStore.currentTx = tx.tx_hash; txStore.currentTxIndex = tx.tx_index" v-if="(txStore.currentTx !== tx.tx_hash && txStore.currentTxIndex === tx.tx_index
                        || txStore.currentTx === tx.tx_hash && txStore.currentTxIndex !== tx.tx_index
                        || txStore.currentTx !== tx.tx_hash && txStore.currentTxIndex !== tx.tx_index)" />
                    <q-btn class="q-pa-sm q-ma-sm" flat round icon="sym_o_keyboard_arrow_down" size="md"
                        @click="txStore.currentTx = ''; txStore.currentTxIndex = ''"
                        v-if="txStore.currentTx === tx.tx_hash && txStore.currentTxIndex === tx.tx_index" />
                </div>
                <div class="q-my-sm col-10 col-sm-5 col-lg row">
                    <HoverIcon class="q-pt-xs q-mr-md col-auto" :icon-name="'sym_o_input'" :icon-size="'sm'"
                        :headline="'Redeemer'"
                        :content="'A Redeemer consists of a Tx hash and a Tx index, which are denoted in the following way: hash-index'" />
                    <div class="q-pt-sm col-auto">
                        <router-link :to="'/txs/' + tx.tx_hash" class="col-auto text-indigo-9"
                            style="text-decoration: none">
                            {{ tx.tx_hash.slice(0, 7) + " ... " + tx.tx_hash.slice(tx.tx_hash.length - 7)
                                    + " - " + tx.tx_index
                            }}
                        </router-link>

                    </div>
                </div>


                <div class="col-2 col-sm-auto" />
                <div class="q-my-sm col-10 col-sm-4 col-lg row">
                    <HoverIcon class="q-pt-xs q-mr-md col-auto" :icon-name="'sym_o_payments'" :icon-size="'sm'"
                        :headline="'Transactionfee'" :content="''" />
                    <div class="q-pt-sm col-auto">
                        {{ tx.fee / 1000000 }} ₳
                    </div>
                </div>

                <div class="col-2 col-sm-auto" />
                <div class="q-my-sm col-10 col-sm-2 col-lg row">
                    <HoverIcon class="q-pt-xs q-mr-md col-auto" :icon-name="'sym_o_build'" :icon-size="'sm'"
                        :headline="'Transactiontype'" :content="''" />
                    <div class="q-pt-sm col-auto">
                        {{ tx.purpose }}
                    </div>
                </div>

                <div class="col-2 col-sm-1 col-lg-auto" />
                <div class="q-my-sm col-10 col-sm-5 col-lg row">
                    <HoverIcon class="q-pt-xs q-mr-md col-auto" :icon-name="'sym_o_database'" :icon-size="'sm'"
                        :headline="'Memoryconsumption'"
                        :content="'The number of memory units that the script uses: this represents the number of bytes that the script allocates. Typical scripts should consume less than 1,000,000 memory units (1MB of memory allocation).'" />
                    <div class="q-pt-sm col-auto">
                        {{ tx.unit_mem / 1000000 + " MB" }}
                    </div>
                </div>

                <div class="col-2 col-sm-auto" />
                <div class="q-my-sm col-10 col-sm-5 col-lg row">
                    <HoverIcon class="q-py-xs q-mr-sm col-auto" :icon-name="'sym_o_memory'" :icon-size="'sm'"
                        :headline="'Computingsteps'"
                        :content="'The number of computational (CPU) steps that the script uses: each step represents 1 picosecond of execution time on a benchmark machine. Typical scripts should consume less than 1,000,000,000 (1 millisecond).'" />
                    <div class="q-pt-sm col-auto">
                        {{ tx.unit_steps / 1000000000 + " ms" }}
                    </div>
                </div>
            </div>

            <SankeyView v-if="txStore.currentTx === tx.tx_hash && txStore.currentTxIndex === tx.tx_index"
                :graph-id="tx.tx_hash" :graphtype="'tx'" />
        </q-card>
    </div>

</template>