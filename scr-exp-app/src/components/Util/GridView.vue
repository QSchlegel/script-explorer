<script setup>
import { useGridStore } from 'src/stores/grid-store'
import CopyToClipboard from './CopyToClipboard.vue';
import GridToggle from './GridToggleView.vue';

const gridStore = useGridStore();

</script>

<template>
    <q-card class="q-ma-md q-pa-sm" flat bordered>
        Please be aware, that the Grid is still in an early developement state! ⚠️
    </q-card>
    <div class="row q-pa-sm">
        <!-- Addresses -->
        <div class="col-12 col-md-6">
            <p class="text-overline q-pl-md">Addresses:</p>
            <div class="row" v-for="addr, index in gridStore.addrList" :key="index">
                <div class="col-12">
                    <q-card flat bordered class="q-ma-sm">
                        <div class="row">
                            <GridToggle class="col-auto q-mt-xs" :grid-id="addr.id" :grid-type="'address'" />
                            <CopyToClipboard class="col-auto" :content="addr.id" :start-offset="15" :end-offset="10"
                                :btn-size="'sm'" :link="'addresses'" />
                        </div>
                    </q-card>
                </div>

            </div>
        </div>

        <!-- Txs -->
        <div class="col-12 col-md-6">
            <p class="text-overline q-pl-md">Transactions:</p>
            <div class="row " v-for="tx, index in gridStore.txList" :key="index">
                <div class="col-12">
                    <q-card flat bordered class="q-ma-sm">
                        <div class="row">
                             <GridToggle class="col-auto q-mt-xs" :grid-id="tx.id" :grid-type="'tx'" />
                             <CopyToClipboard class="col-auto" :content="tx.id" :start-offset="10" :end-offset="10" :btn-size="'sm'"
                            :link="'txs'" />
                        </div>
                    </q-card>
                </div>
            </div>
        </div>

    </div>
</template>