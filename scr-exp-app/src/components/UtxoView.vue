<template>


    <div :style='{ "background-color": "white", "border": (props.put == "inputs") ? "1px solid blue" : "1px solid red" }'>
        <q-list>
            <q-item class="text-h6 flex flex-center">{{ props.put }}</q-item>

            <div v-for='i, index  in store.TxList.filter((f) => f.hash == store.CurTx).map((m) => (put == "inputs") ? m.inputs : m.outputs)[0]'
                :key="index">

                <div class="q-px-sm q-py-md">
                    <q-card>
                        <div class="q-pa-md flex flex-center">
                            <div>
                                {{ i.address.slice(10, 20) + " ... " +
                                        i.address.slice(i.address.length - 10) + " - " + i.output_index
                                }}
                            </div>
                            <div class=" q-pa-sm popover__title popover__wrapper">
                                💸
                                <p class="popover__content">UnspentTransactionOutput: Address-Index</p>
                            </div>


                        </div>

                        <div class="q-pa-xs">
                            <q-list bordered separator v-for="j, index in i.amount" :key="index">
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
    put: String
})

</script>