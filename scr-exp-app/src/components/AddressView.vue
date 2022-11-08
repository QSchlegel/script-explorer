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
            <div class="text-subtitle2 text-center">{{ addrObject.info.address }}</div>

            <!--Consolidated Sankey addr to utxos to assets  -->
            <SankeyView :graphtype="'address'" />

            <!--Address Balance-->
            <p>Balance:</p>
            <div v-for="a, index in addrObject.info.amount" :key="index">
                <div class="row" :key="index">
                    <div class="col-2">{{ calcQuantity(a.quantity, a.decimals) }}</div>
                    <div class="col-10" v-if="a.unit === 'lovelace'">₳</div>
                    <div class="col-10" v-else>{{ a.unit }}</div>
                    <!--Placeholder for clickable AssetView-->
                </div>
            </div>
            <p>utxo</p>
            <!--Address UTxOs-->
            <div v-for="utxo, index in addrStore.addressUTxOList.filter((f) => f.address === addrStore.currentAddress).map((m) => m.data)[0]"
                :key="index">
                <div>{{ utxo.tx_hash + ' - ' + utxo.tx_index }}</div>
            </div>



            <p>Tx</p>
            <!--Address Txs-->
            <div v-for="tx, index in addrStore.addressTxList.filter((f) => f.address === addrStore.currentAddress).map((m) => m.data)[0]"
                :key="index">
                <div>{{ tx.tx_hash + ' - ' + tx.tx_index }}</div>
            </div>
        </q-card-section>




    </div>



</template>