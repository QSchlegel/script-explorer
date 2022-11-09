<script setup>
import { useAddrStore } from 'stores/addr-store';
import { computed } from "vue";
import { useScrStore } from 'stores/scr-store';
import { useGraphStore } from 'stores/graph-store';
import SankeyView from './SankeyView.vue';

const addrStore = useAddrStore();
const scrStore = useScrStore();
const graphStore = useGraphStore();

const loadingAddr = computed(() => {
    if (scrStore.loadAddress === true) {
        addrStore.loadAddress()
        scrStore.toggleLoadAddrOff()
    }
    return scrStore.loadAddress
})

const addrObject = computed(() => {
    const addrList = addrStore.addressInfoList.filter((f) => f.address === addrStore.currentAddress)
    const txList = addrStore.addressTxList.filter((f) => f.address === addrStore.currentAddress)
    const uxtoList = addrStore.addressUTxOList.filter((f) => f.address === addrStore.currentAddress)
    if (addrList !== [] && txList !== [] && uxtoList !== []) return {
        info: addrList[0],
        tx: txList[0],
        utxo: uxtoList[0]
    }
    return 'empty'
})

const calcQuantity = (quantity, decimals) => {
    if (decimals !== null) {
        return quantity / Math.pow(10, decimals)
    } else return quantity
}
//Todo convert to event listeners window.height


</script>

<template>
    <div class="q-pa-md" v-if="loadingAddr === false && addrObject.info !== undefined && addrObject !== 'empty'">
        <q-card-section>
            {{ graphStore.createAddressGraph(addrStore.currentAddress) }}
            <div class="q-mb-xl text-subtitle2 text-center">{{ addrObject.info.address }}</div>
            <div class="row">
                <div class="col-8">
                    <SankeyView :graphtype="'address'" :graphId="addrObject.info.address" />
                </div>
                <div class="col-4 q-pl-md q-pt-sm">
                    <!--Address Balance-->
                    <q-markup-table flat bordered>
                        <thead>
                            <tr>
                                <th class="text-left">Amount</th>
                                <th class="text-left">Unit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="a, index in addrObject.info.amount" :key="index">
                                <td class="text-left">{{ calcQuantity(a.quantity, a.decimals) }}</td>
                                <td class="text-left" v-if="a.unit === 'lovelace'">₳</td>
                                <td class="text-left" v-else>{{ a.unit.slice(0, 5) + '...' + a.unit.slice(a.unit.length
                                        - 5)
                                }}</td>
                                <!--Placeholder for clickable AssetView-->
                            </tr>
                        </tbody>
                    </q-markup-table>
                </div>

            </div>

            <div class="row">
                <div class="col-12 col-lg-6">
                    <q-markup-table class="q-my-md q-mx-sm" flat bordered>
                        <thead>
                            <tr>
                                <th class="text-left">UTxO</th>
                                <th class="text-left">Index</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="utxo, index in addrStore.addressUTxOList.filter((f) => f.address === addrStore.currentAddress).map((m) => m.data)[0]"
                                :key="index">
                                <td class="text-left">{{ utxo.tx_hash }}</td>
                                <td class="text-left">{{ utxo.tx_index }}</td>
                            </tr>
                        </tbody>
                    </q-markup-table>
                </div>
                <div class="col-12 col-lg-6">
                    <q-markup-table class="q-my-md q-mx-sm" flat bordered>
                        <thead>
                            <tr>
                                <th class="text-left">Tx</th>
                                <th class="text-left">Index</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tx, index in addrStore.addressTxList.filter((f) => f.address === addrStore.currentAddress).map((m) => m.data)[0]"
                                :key="index">
                                <td class="text-left">{{ tx.tx_hash }}</td>
                                <td class="text-left">{{ tx.tx_index }}</td>
                            </tr>
                        </tbody>
                    </q-markup-table>
                </div>
            </div>





        </q-card-section>




    </div>



</template>