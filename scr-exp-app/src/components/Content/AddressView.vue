<script setup>
import { useAddrStore } from 'src/stores/addr-store';
import { ref, onUpdated, onMounted } from "vue";
import { useGraphStore } from 'stores/graph-store';
import SankeyView from './SankeyView.vue';
import CopyToClipboard from '../Util/CopyToClipboard.vue';
import HoverIcon from '../Util/HoverIcon.vue';
import GridToggleView from "../Util/GridToggleView.vue";

const addrStore = useAddrStore();
const graphStore = useGraphStore();

const props = defineProps({
    input: String,
    isAddress: Boolean
})

onMounted(async () => mountloader())
onUpdated(async () => {
    if (props.input !== ((props.isAddress) ?
        addrObject.value.info.address : addrObject.value.info.scriptHash)) addrObject.value = makeAddrObject()
})

const addrObject = ref({})

const emptyPredicate = (f) => {
    return props.input === ((props.isAddress) ? f.address : f.scriptHash)
}

// ToDo This works, but is in need of Refactoring 
const mountloader = async () => {

    if (addrStore.addressInfoList.filter((f) => emptyPredicate(f)).length === 0) {
        const x = await addrStore.loadAddress(props.input, props.isAddress)
        if (x) addrObject.value = makeAddrObject()
    } else {
        addrObject.value = makeAddrObject()
    }

}
const makeAddrObject = () => {
    const addrList = addrStore.addressInfoList.filter((f) => emptyPredicate(f))
    const txList = addrStore.addressTxList.filter((f) => emptyPredicate(f))
    const utxoList = addrStore.addressUTxOList.filter((f) => emptyPredicate(f))
    if (addrList !== [] && addrList[0] !== undefined &&
        txList !== [] && txList[0] !== undefined &&
        utxoList !== [] && utxoList[0] !== undefined) {
        graphStore.createAddressGraph(addrList[0].address)
        return {
            info: addrList[0],
            tx: txList[0],
            utxo: utxoList[0]
        }
    }

    return 'empty'
}

const calcQuantity = (quantity, decimals) => {
    if (decimals !== null) {
        return quantity / Math.pow(10, decimals)
    } else return quantity
}
//Todo create event listeners window height and width to make sankey adaptable

</script>

<template>
    <q-card flat>
        <q-linear-progress query track-color="primary" color="accent" class="q-mt-sm"
            v-if='addrObject.info === undefined && addrObject === "empty"' />



        <div v-if="addrObject.info !== undefined && addrObject !== 'empty'">
            <div class="row">
                <div class="col-11"></div>
                <GridToggleView class="col-auto q-pt-md" :grid-id="addrObject.info.address" :grid-type="'address'" />
            </div>
            <q-card-section class="q-pt-none">
                <div class="row ">
                    <q-icon name="sym_o_chevron_left" size="sm" class="col-auto q-pt-lg"
                        v-if="addrObject.info.data.script" />
                    <HoverIcon class="col-auto q-pt-lg" :icon-name="'sym_o_wallet'" :icon-size="'sm'"
                        :headline="(addrObject.info.data.script) ? 'Scriptaddress' : 'Address'" :content="''" />
                    <q-icon name="sym_o_chevron_right" size="sm" class="col-auto q-pt-lg"
                        v-if="addrObject.info.data.script" />
                    <CopyToClipboard class="text-overline col-auto q-pt-xs" :content="addrObject.info.address"
                        :startOffset="15" :endOffset="8" :btnSize="'xs'" />
                    <div class="col" />

                </div>


                <div class="row">
                    <div class="col-12 col-md-8 q-pl-md q-pt-sm" v-if="addrObject.utxo.data.length > 0">
                        <SankeyView :graphtype="'address'" :graphId="addrObject.info.address" />
                    </div>
                    <div class="col-12 col-md-4 q-pl-md q-pt-sm">
                        <!--Address Balance-->
                        <q-markup-table flat bordered>
                            <thead>
                                <tr>
                                    <th class="text-left">Amount</th>
                                    <th class="text-left">Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="a, index in addrObject.info.data.amount" :key="index">
                                    <td class="text-left">{{ calcQuantity(a.quantity, a.decimals) }}</td>
                                    <td class="text-left" v-if="a.unit === 'lovelace'">₳</td>
                                    <td class="text-left" v-else>
                                        <router-link :to="'/assets/' + a.unit" class="col-auto text-indigo-9"
                                            style="text-decoration: none">
                                            {{ a.unit.slice(0, 5) + '...' + a.unit.slice(a.unit.length - 5) }}
                                        </router-link>
                                    </td>
                                    <!--Placeholder for clickable AssetView-->
                                </tr>
                            </tbody>
                        </q-markup-table>
                    </div>
                    <div class="col-12 col-lg-6 q-pl-md q-pt-sm" v-if="addrObject.utxo.data.length > 0">
                        <q-markup-table flat bordered>
                            <thead>
                                <tr>
                                    <th class="text-left">UTxO</th>
                                    <th class="text-left">Index</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="utxo, index in addrObject.utxo.data" :key="index">
                                    <td class="text-left">
                                        <router-link :to="'/utxos/' + utxo.tx_hash + '-' + utxo.tx_index"
                                            class="text-indigo-9" style="text-decoration: none">
                                            {{ utxo.tx_hash }}
                                        </router-link>
                                    </td>
                                    <td class="text-left">{{ utxo.tx_index }}</td>
                                </tr>
                            </tbody>
                        </q-markup-table>
                    </div>
                    <div class="col-12 col-lg-6 q-pl-md q-pt-sm">
                        <q-markup-table flat bordered>
                            <thead>
                                <tr>
                                    <th class="text-left">Tx</th>
                                    <th class="text-left">Index</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="tx, index in addrObject.tx.data" :key="index">
                                    <td class="text-left">
                                        <router-link :to="'/txs/' + tx.tx_hash" class="text-indigo-9"
                                            style="text-decoration: none">
                                            {{ tx.tx_hash }}
                                        </router-link>
                                    </td>
                                    <td class="text-left">{{ tx.tx_index }}</td>
                                </tr>
                            </tbody>
                        </q-markup-table>
                    </div>

                </div>
            </q-card-section>
        </div>
    </q-card>



</template>