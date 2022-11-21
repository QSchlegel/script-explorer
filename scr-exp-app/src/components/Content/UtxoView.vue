<script setup>
import { useTxStore } from 'stores/tx-store';
import CopyToClipboard from '../Util/CopyToClipboard.vue';
import HoverIcon from '../Util/HoverIcon.vue';
//import { useAssetStore } from 'stores/asset-store';

const txStore = useTxStore();
//const assetStore = useAssetStore();

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

            <!--Individual UtxOs-->
            <div v-for='addr, index  in new Set(txStore.utxosList
                .filter((f) => f.txHash == props.txHash)
                .map((m) => (put == "inputs") ? m.data.inputs : m.data.outputs)[0]
                .map((m) => m.amount
                .map((n) => n.addr))
                .flatMap((m) => m))' :key="index">

                <div class="row q-pl-md">
                    <HoverIcon class="col-auto q-pt-md" :icon-name="'sym_o_wallet'" :icon-size="'sm'"
                        :headline="'Address'" :content="''" />
                    <CopyToClipboard class="col-auto" :content="addr" :start-offset="15" :end-offset="10"
                        :btn-size="'xs'" />
                </div>

                <div class="q-px-sm q-pb-xl" v-for='utxo, jndex in txStore.utxosList
                    .filter((f) => f.txHash == props.txHash)
                    .map((m) => (put == "inputs") ? m.inputs : m.outputs)[0].filter((f)=> f.address === addr)
                    
                ' :key="jndex">
                    <div class="row q-pl-md">
                        <HoverIcon class="col-auto q-pt-md" :icon-name="'sym_o_receipt_long'" :icon-size="'sm'"
                            :headline="'UTxO'" :content="''" />

                        <HoverIcon class="col-auto q-pt-md" v-if="utxo.collateral"
                            :icon-name="'sym_o_balance'" :icon-size="'sm'" :headline="'Collateral'" :content="''" />

                        <HoverIcon class="col-auto q-pt-md"  :icon-name="'sym_o_cable'" v-if="utxo.reference"
                            :icon-size="'sm'" :headline="'Reference'" :content="''" />

                        <HoverIcon class="col-auto q-pt-md"  :icon-name="'sym_o_satellite_alt'" v-if="utxo.reference_script_hash"
                            :icon-size="'sm'" :headline="'Reference Script'" :content="utxo.reference_script_hash" />

                        <HoverIcon class="col-auto q-pt-md"  :icon-name="'sym_o_data_object'" v-if="utxo.data_hash"
                            :icon-size="'sm'" :headline="'Datum'" :content="utxo.data_hash" />

                        <HoverIcon class="col-auto q-pt-md"  :icon-name="'sym_o_topic'" v-if="utxo.inline_datum"
                            :icon-size="'sm'" :headline="'Inline Datum'" :content="utxo.inline_datum" />

                        <CopyToClipboard class="col-auto" :content="((props.put == 'inputs') ?utxo.tx_hash : props.txHash)+'-'+utxo.output_index " :start-offset="10" :end-offset="10"
                            :btn-size="'xs'" />
                    </div>

                    <q-markup-table class="q-mx-xl" separator="vertical" flat bordered dense>
                        <thead>
                            <tr>
                                <th class="text-left">Amount</th>
                                <th class="text-left">Unit</th>
                            </tr>
                        </thead>
                        <tbody v-for="unit, kndex in utxo.amount" :key="kndex">
                            <tr>
                                <td class="text-left">{{ unit.quantity }}</td>
                                <td class="text-left" v-if="'lovelace' === unit.unit">
                                    ₳
                                </td>
                                <td class="text-left" v-if="'lovelace' !== unit.unit">
                                    <div class="row">
                                        <HoverIcon class="col-auto q-pt-sm q-mt-xs" :icon-name="'sym_o_token'"
                                            :icon-size="'sm'" :headline="'Asset'" :content="''" />
                                        <CopyToClipboard class="col-auto" :content="unit.unit" :start-offset="4"
                                            :end-offset="4" :btn-size="'xs'" />
                                    </div>

                                </td>
                            </tr>
                        </tbody>
                    </q-markup-table>
                </div>
                <q-separator />
            </div>
        </q-list>
    </div>
</template>