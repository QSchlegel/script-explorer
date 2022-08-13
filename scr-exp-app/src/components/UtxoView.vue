<template>

    
    <div :style='{ "background-color": "white", "border": (props.put == "inputs") ? "1px solid blue" : "1px solid red" }'>
        <q-list>
            <q-item class="text-h6 flex flex-center">{{ props.put }}</q-item>

            <!--Individual UtxOs-->
            <div v-for='i, index  in store.TxList.filter((f) => f.hash == store.CurTx).map((m) => (put == "inputs") ? m.inputs : m.outputs)[0]'
                :key="index">

                <div class="q-px-sm q-py-md"  >
                    <q-card>
                        <!--Take Colateral in to Account-->
                        <div class="q-pa-md flex flex-center">
                            <div v-if='props.put == "inputs"'>
                                {{ i.tx_hash.slice(0,5)+"..."+i.tx_hash.slice(i.tx_hash.length-5) + " - " + i.output_index
                                }}
                            </div>
                            <div v-if='props.put == "outputs"'>
                                {{ tx_hash.slice(0,5)+"..."+tx_hash.slice(tx_hash.length-5) + " - " + i.output_index
                                }}
                            </div>
                            <div class=" q-pa-sm popover__title popover__wrapper">
                                💸
                                <p class="popover__content">UnspentTransactionOutput: Address-Index</p>
                            </div>


                        </div>

                        <div class="q-pa-xs">
                            <q-list bordered separator v-for="j, jndex in i.amount" :key="jndex">
                                <div class="row q-pa-sm" v-if="j.unit == 'lovelace'">
                                    <div class="col-6 q-pl-md">
                                        ₳
                                    </div>

                                    <div class="col-6">
                                        {{ j.quantity / 1000000 }}
                                    </div>

                                </div>

                                <div class="row q-pa-xs" v-if="j.unit != 'lovelace'">

                                    <div class="col-6 ">
                                        <q-btn no-caps flat rounded color="primary" text-color="black"
                                            :label='"📦 " + j.unit.slice(0, 4) + " ... " + j.unit.slice(j.unit.length - 4)'
                                            @click="store.CurAsset = ((store.CurAsset != j.unit) ? j.unit : ''); store.loadAsset();" />
                                    </div>

                                    <div class="q-pa-sm col-6">
                                        {{ j.quantity }}
                                    </div>

                                </div>
                                <div class="q-pa-xs" v-if="store.CurAsset === j.unit">
                                    <q-card bordered>
                                        {{ store.AssetList.filter((f) => f.asset == store.CurAsset) }}
                                    </q-card>

                                </div>
                            </q-list>
                        </div>
                    </q-card>
                </div>
            </div>
        </q-list>
    </div>




</template>


<script setup>

import { useScriptStore } from 'stores/script-store';

const store = useScriptStore();
const props = defineProps({
    put: String,
    tx_hash: String
})

</script>