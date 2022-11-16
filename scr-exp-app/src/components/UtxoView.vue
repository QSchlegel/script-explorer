<script setup>
import { useTxStore } from 'stores/tx-store';
import { useAssetStore } from 'stores/asset-store';

const txStore = useTxStore();
const assetStore = useAssetStore();

const props = defineProps({
    put: String,
    txHash: String
})

</script>

<template>


    <div :style='{ "background-color": "white", "border": (props.put == "inputs") ? "1px solid blue" : "1px solid red" }'
        v-if="txStore.utxosList.filter((f) => f.txHash == props.txHash).length >0">
        <q-list>
            <q-item class="text-h6 flex flex-center">{{ props.put }}</q-item>
            <!--ToDo: Group by Address-->
            <!--Individual UtxOs-->
            <div v-for='i, index  in txStore.utxosList.filter((f) => f.txHash == props.txHash).map((m) => (put == "inputs") ? m.data.inputs : m.data.outputs)[0]'
                :key="index">
                <div class="q-px-sm q-py-xs">
                    <q-card flat bordered :class='(i.collateral) ? "bg-warning" : ""'>
                        <div class="q-pa-sm flex flex-center">
                            <div class=" q-pa-sm popover__title popover__wrapper">
                                📍
                                <p class="popover__content">Address</p>
                            </div>
                            {{ i.address.slice(0, 17) + " ... " + i.address.slice(i.address.length - 7) }}
                        </div>

                        <div class="q-pa-xs flex flex-center">
                            <div class=" q-pa-sm popover__title popover__wrapper">
                                💸
                                <p class="popover__content">UnspentTransactionOutput: UtxO-Index</p>
                            </div>
                            <div v-if='props.put == "inputs"'>
                                {{ i.tx_hash.slice(0, 5) + " ... " + i.tx_hash.slice(i.tx_hash.length - 5) + " - " +
                                        i.output_index
                                }}
                            </div>
                            <div v-if='props.put == "outputs"'>
                                {{ props.txHash.slice(0, 5) + " ... " + props.txHash.slice(props.txHash.length - 5) + " - " + i.output_index
                                }}
                            </div>



                        </div>

                        <div class="q-pa-xs ">
                            <q-list bordered separator v-for="j, jndex in i.amount" :key="jndex">
                                <div class="row q-pa-sm bg-white" v-if="j.unit == 'lovelace'">
                                    <div class="col-6 q-pl-md ">
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
                                            @click="assetStore.currentAsset = ((assetStore.currentAsset != j.unit) ? j.unit : ''); assetStore.loadAsset();" />
                                    </div>

                                    <div class="q-pa-sm col-6">
                                        {{ j.quantity }}
                                    </div>

                                </div>
                                <div class="q-pa-xs" v-if="assetStore.currentAsset === j.unit">
                                    <q-card flat bordered>
                                        {{ assetStore.assetList.filter((f) => f.asset == assetStore.currentAsset) }}
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