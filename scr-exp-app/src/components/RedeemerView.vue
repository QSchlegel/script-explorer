<template>
    
    <div v-for="tx, index in store.ScrRList.filter((f) => f.script_hash === store.CurScript).map((m) => m.data)[0]"
        :key="index">

        <q-card class="q-ma-md bg-primary">

            <div class="row">

                <div class="q-pa-sm q-pl-xl text-center col-12 col-sm-6 col-md-3 row">
                    <div class="">
                        <q-btn flat round icon="chevron_right" @click="store.CurTx = tx.tx_hash; store.CurTxIndex = tx.tx_index"
                            v-if="(store.CurTx !== tx.tx_hash || store.CurTx === tx.tx_hash && store.CurTxIndex !== tx.tx_index)" :disabled="!store.LoggedIn"/>
                        <q-btn flat round icon="keyboard_arrow_down" @click="store.CurTx = ''; store.CurTxIndex = ''"
                            v-if="store.CurTx === tx.tx_hash && store.CurTxIndex === tx.tx_index" />
                    </div>
                    <div class="q-pt-sm">
                        {{ tx.tx_hash.slice(0, 7) + " ... " + tx.tx_hash.slice(tx.tx_hash.length - 7) + " - " + tx.tx_index
                        }}
                    </div>
                    <div class=" q-pa-sm popover__title popover__wrapper">
                        <q-icon name="library_books" />
                        <p class="popover__content">Transaction: Hash-Index</p>

                    </div>
                </div>
                

                <div class="q-pa-sm text-center col-12 col-sm-6 col-md-2 row">
                    <div class="q-pt-sm col text-right">
                        {{ tx.purpose }}
                    </div>
                    <div class="q-pa-sm popover__title popover__wrapper col text-left">
                        <q-icon name="build_circle" />
                        <p class="popover__content">
                            Transactiontype
                        </p>
                    </div>


                </div>

                <div class="q-pa-sm text-center col-12 col-sm-4 col-md-2 row">
                    <div class="q-pt-sm col text-right">
                        {{ tx.unit_mem }}
                    </div>
                    <div class="q-pa-sm popover__title popover__wrapper col text-left">
                        <q-icon name="storage" />
                        <p class="popover__content">
                            Memory
                        </p>
                    </div>

                </div>


                <div class="q-pa-sm text-center col-12 col-sm-4 col-md-2 row">
                    <div class="q-pt-sm col text-right">
                        {{ tx.unit_steps }}
                    </div>
                    <div class="q-pa-sm popover__title popover__wrapper col text-left">
                        <q-icon name="memory" />
                        <p class="popover__content">
                            Computingsteps
                        </p>
                    </div>

                </div>


                <div class="q-pa-sm text-center col-12 col-sm-4 col-md-2 row">
                    <div class="q-pt-sm col text-right">
                        ₳ {{ tx.fee / 1000000 }}
                    </div>
                    <div class="q-pa-sm  popover__title popover__wrapper col text-left">
                        <q-icon name="payments" />
                        <p class="popover__content">
                            Transactionfee
                        </p>
                    </div>

                </div>
            </div>

            <q-linear-progress query track-color="primary" color="accent" class="q-mt-sm"
                v-if='store.CurTx == tx.tx_hash && store.CurTxIndex === tx.tx_index && !utxLoaded' />

            <SankeyTry  v-if="store.CurTx === tx.tx_hash && store.CurTxIndex === tx.tx_index &&  store.TxList.filter((f) => f.hash === store.CurTx).length > 0"
                        class="q-ma-md"></SankeyTry>

            <q-card-section v-if="store.CurTx == tx.tx_hash && store.CurTxIndex === tx.tx_index &&  utxLoaded">

                <div class="row justify-center">
                    <UtxoView class="col-12 col-sm-6" :put='"inputs"'  />

                    <UtxoView class="col-12 col-sm-6" :put='"outputs"' :tx_hash='tx.tx_hash'/>
                </div>
            </q-card-section>
        </q-card>
    </div>

</template>

<script setup>
import { computed } from 'vue';
import { useScriptStore } from 'stores/script-store';
import UtxoView from './UtxoView.vue';
import SankeyTry from './SankeyTry.vue';


const store = useScriptStore();
const utxLoaded = computed(() => {
    const txAvailable = store.TxList.filter((f) => f.hash === store.CurTx).length > 0;
    if (!txAvailable){ store.loadScriptTx()}
    return txAvailable
}
)
</script>