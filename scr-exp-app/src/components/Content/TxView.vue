<script setup>
import { onMounted, onUpdated } from "vue";
import { useTxStore } from 'stores/tx-store';
import UtxosView from './UtxosView.vue';
import SankeyView from "./SankeyView.vue";
import ChordView from "./ChordView.vue";
import CopyToClipboard from "../Util/CopyToClipboard.vue";
import HoverIcon from "../Util/HoverIcon.vue";
import GridToggleView from "../Util/GridToggleView.vue";
import { computed } from "@vue/reactivity";

const txStore = useTxStore()

const props = defineProps({
    txHash: String,
    //txIndex: Number,
    scriptHash: String
})
onMounted(() => {
    txStore.loadUtxos(props.txHash, props.scriptHash)
    txStore.loadTx(props.txHash)
})
onUpdated(() => {
    txStore.loadUtxos(props.txHash, props.scriptHash)
    txStore.loadTx(props.txHash)
})

const txObj = computed(() => {
    return {
        info: txStore.txList.filter((f) => f.hash === props.txHash)[0],
        utxos: txStore.utxosList.filter((f) => f.txHash === props.txHash)[0]
    }
})
</script>
<template>
    <q-card>
        <q-linear-progress query track-color="primary" color="accent" class="q-mt-sm"
            v-if="txObj.info === undefined && txObj.utxos === undefined" />

        <div class="row">
            <div class="col-11"></div>
            <GridToggleView class="col-auto q-pt-md" :grid-id="props.txHash" :grid-type="'tx'" />
        </div>

        <div v-if="txObj.info !== undefined && txObj.utxos !== undefined">
            <div class="row q-px-md">

                <HoverIcon class="col-auto q-pt-lg" :icon-name="'sym_o_input'" :icon-size="'sm'"
                    :headline="'Transaction'" :content="''" />
                <CopyToClipboard class="col q-pt-xs text-overline" :content="props.txHash" :start-offset="8"
                    :end-offset="8" :btn-size="'xs'" :link="'txs'" />
                <div class="col" />
            </div>
            <div class="row">
                <!--Chord Diagram-->
                <ChordView class="col-11 col-sm-4 q-ma-md q-pa-md" :graph-Id="props.txHash" :graphtype="'tx'" />

                <div class="col-1 col-sm-auto"></div>
                <!--Blockinfos-->
                <div class="col-12 col-sm-7">
                    <q-markup-table class="q-ma-md" flat bordered seperator="horizontal">
                        <tbody>
                            <tr>
                                <td>
                                    Fee
                                </td>
                                <td>₳ {{ parseInt(txObj.info.fees) / 1000000 }}</td>
                            </tr>
                            <tr>
                                <td>Size</td>
                                <td>{{ (txObj.info.size) }} Bytes</td>
                            </tr>
                            <tr>
                                <td>Mint / Burn</td>
                                <td>{{ txObj.info.asset_mint_or_burn_count }}</td>
                            </tr>
                            <tr>
                                <td>Deposit</td>
                                <td>{{ txObj.info.deposit }}</td>
                            </tr>
                            <tr>
                                <td>Valid Contract</td>
                                <td>{{ txObj.info.valid_contract }}</td>
                            </tr>
                        </tbody>
                    </q-markup-table>
                    <q-markup-table class="q-ma-md" flat bordered dense seperator="horizontal">
                        <tbody>
                            <tr>
                                <td>
                                    <HoverIcon :headline="'Block'" :content="''" :icon-name="'sym_o_crop_free'"
                                        :icon-size="'sm'" />
                                </td>
                                <td>
                                    <CopyToClipboard :content="txObj.info.block" :start-offset="10" :end-offset="10"
                                        :btn-size="'xs'" :link="'blocks'" />
                                </td>
                            </tr>
                            <tr>
                                <td>Time</td>
                                <td>{{ txObj.info.block_time }}</td>
                            </tr>
                            <tr>
                                <td>Height</td>
                                <td>{{ txObj.info.block_height }}</td>
                            </tr>
                            <tr>
                                <td>Slot</td>
                                <td>{{ txObj.info.slot }}</td>
                            </tr>
                            <tr>
                                <td>Index</td>
                                <td>{{ txObj.info.index }}</td>
                            </tr>
                        </tbody>
                    </q-markup-table>
                </div>
            </div>
            <q-card flat bordered class="q-ma-md q-pa-md">
                An improved Sankey Diagram is comming soon.
            </q-card>

            <div class="row">
                <div class="col-auto col-lg" />
                <SankeyView class="col-11 q-ma-md" :graphtype="'tx'" :graph-id="props.txHash" />
                <div class="col-auto col-lg" />
            </div>

            <div class="row" :key="props.txHash">
                <UtxosView class="col-12 col-md-6" :put='"inputs"' :tx-hash="props.txHash" />
                <UtxosView class="col-12 col-md-6" :put='"outputs"' :tx-hash="props.txHash" />
            </div>
        </div>

    </q-card>


</template>