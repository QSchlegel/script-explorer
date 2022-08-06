<template>
    <div v-for="tx, index in store.ScrRList.filter((f) => f.script_hash === store.CurScript).map((m) => m.data)[0]"
        :key="index">

        <q-card class="q-ma-md bg-primary">

            <div class="row">

                <div class="q-pa-sm q-pl-xl text-center col-12 col-sm-6 col-md-3 row">
                    <div class="">
                        <q-btn flat round icon="chevron_right" @click="store.CurTx = tx.tx_hash"
                            v-if="store.CurTx !== tx.tx_hash" />
                        <q-btn flat round icon="keyboard_arrow_down" @click="store.CurTx = ''"
                            v-if="store.CurTx === tx.tx_hash" />
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
                v-if='store.CurTx == tx.tx_hash && !utxLoaded' />
            <q-card-section v-if="store.CurTx == tx.tx_hash && utxLoaded">

                <div class="row justify-center">
                    <UtxoView class="col-12 col-sm-6" :put='"inputs"' />

                    <UtxoView class="col-12 col-sm-6" :put='"outputs"' />
                </div>

            </q-card-section>
        </q-card>
    </div>

</template>

<script setup>
import { computed } from 'vue';
import { useScriptStore } from 'stores/script-store';
import UtxoView from './UtxoView.vue';

const store = useScriptStore();


const utxLoaded = computed(() => {
    const txAvailable = store.TxList.filter((f) => f.hash === store.CurTx).length > 0
    if (!txAvailable) store.loadScriptTx()
    return txAvailable
}
)
</script>

<style>
.popover__wrapper {
    position: relative;
}

.popover__content {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    font-size: 12px;
    left: 0%;
    top: 90%;
    transform: translate(0px, 10px);
    border-radius: 5px;
    color: black;
    background-color: white;
    padding: 0.5em;
    border: 1px solid #dc500f;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);

}

.popover__content::after,
.popover__content::before {
    display: block;
    box-sizing: border-box;
    border-right: 1px solid transparent;
    background-color: white;

}

.popover__content::before {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border-left: 1px solid #dc500f;
    border-top: 1px solid #dc500f;
    border-bottom: 1px solid transparent;

    transform: rotate(45deg) skew(10deg, 10deg);
    top: -6px;
    left: 8px;
    bottom: -13px;
    transition-duration: 0.3s;
    transition-property: transform;
}

.popover__wrapper:hover .popover__content {
    z-index: 10;
    opacity: 1;
    visibility: visible;
    transform: translate(0px, 0px);
    transition: all 0.5s cubic-bezier(0.75, -0.02, 0.2, 0.97);
}
</style>