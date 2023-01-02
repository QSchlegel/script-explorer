<script setup>
import { useGridStore } from 'src/stores/grid-store'
import { onMounted } from 'vue';
import ChordView from '../Content/ChordView.vue';
import CopyToClipboard from './CopyToClipboard.vue';
import GridToggle from './GridToggleView.vue';
import HoverIcon from './HoverIcon.vue';

const gridStore = useGridStore();


onMounted(async () => {
    if (gridStore.graph.length === 0) {
        const addrs = gridStore.addrListMem.map(m => gridStore.loadItem(m.id, 'address'))
        const txs = gridStore.txListMem.map(m => gridStore.loadItem(m.id, 'tx'))
        await Promise.all([addrs, txs]).then(setTimeout(() => { gridStore.generateGraph() }, 3000))
    }
})

</script>

<template>

    <q-card class="q-ma-md q-pa-sm" flat bordered>
        Please be aware, that the Grid is still in an early developement state! ⚠️
    </q-card>
    <div class="row q-pa-sm">
        <!-- Addresses -->
        <div class="col-12 col-md-6">
            <p class="text-overline q-pl-md">Addresses:</p>
            <div class="row" >
                <div class="col-12 col-lg-6" v-for="addr, index in gridStore.addrListMem" :key="index">
                    <q-card flat bordered class="q-ma-sm">

                        <div class="row">
                            <div class="col-12 row">
                                <div class="col-10"></div>
                                <GridToggle class="col-auto q-mt-xs" :grid-id="addr.id" :grid-type="'address'" />
                            </div>

                            <div class="col-12 row">
                                <div class="col"/>
                                <HoverIcon class="q-ml-sm q-mt-lg col-auto" :headline="'Address'" :content="''" :icon-name="'sym_o_wallet'" :icon-size="'sm'"/>
                                <CopyToClipboard class="col-auto" :content="addr.id" :start-offset="15" :end-offset="10"
                                    :btn-size="'xs'" :link="'addresses'" />
                                <div class="col"/>
                            </div>
                        </div>
                    </q-card>
                </div>

            </div>
        </div>

        <!-- Txs -->
        <div class="col-12 col-md-6">
            <p class="text-overline q-pl-md">Transactions:</p>
            <div class="row">
                <div class="col-12 col-sm-6" v-for="tx, index in gridStore.txListMem" :key="index">
                    <q-card flat bordered class="q-ma-sm">

                        <div class="row">
                            <div class="col-12 row">
                                <div class="col-10"></div>
                                <GridToggle class="col-auto q-mt-xs" :grid-id="tx.id" :grid-type="'tx'" />
                            </div>
                            <div class="col-11 q-pa-md">
                                <ChordView :graph-id="tx.id" :graphtype="'tx'" />
                            </div>
                            <div class="col-12 row">
                                <div class="col"/>
                                <HoverIcon class="q-ml-sm q-mt-lg col-auto" :headline="'Transaction'" :content="''" :icon-name="'sym_o_input'" :icon-size="'sm'"/>
                                <CopyToClipboard class="col-auto" :content="tx.id" :start-offset="10" :end-offset="10"
                                    :btn-size="'xs'" :link="'txs'" />
                                <div class="col"/>
                            </div>
                        </div>
                    </q-card>
                </div>
            </div>
        </div>

    </div>
</template>