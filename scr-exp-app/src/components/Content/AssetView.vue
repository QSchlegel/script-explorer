<script setup>
import { useAssetStore } from 'src/stores/asset-store';
import { onMounted, computed } from 'vue';
import CopyToClipboard from "../Util/CopyToClipboard.vue";
import HoverIcon from "../Util/HoverIcon.vue";

const assetStore = useAssetStore()

const props = defineProps({
    assetId: String
})

onMounted(() => {
    assetStore.loadAsset(props.assetId)
    assetStore.loadAssetAddr(props.assetId)
    assetStore.loadAssetTx(props.assetId)

})

const infoObj = computed(() => {
    return assetStore.assetList.filter((f) => f.asset === props.assetId)[0]
})
const addrObj = computed(() => {
    return assetStore.assetAddrList.filter((f) => f.asset === props.assetId)[0]
})
const txObj = computed(() => {
    return assetStore.assetTxList.filter((f) => f.asset === props.assetId)[0]
})

</script>
<template>
    <q-card flat>

        <q-linear-progress query track-color="primary" color="accent" class="q-mt-sm" v-if="props.assetId === undefined && infoObj === undefined && addrObj === undefined && txObj === undefined" />
        <div
            v-if="props.assetId !== undefined && infoObj !== undefined && addrObj !== undefined && txObj !== undefined">

            <div class="row">
                <HoverIcon class="col-auto q-pt-lg" :icon-name="'sym_o_token'" :icon-size="'sm'" :headline="'Asset'"
                    :content="'This is an Asset'" />
                <CopyToClipboard class="text-overline col-auto " :content="props.assetId" :start-offset="10"
                    :end-offset="10" :btn-size="'xs'" />
            </div>

            <div class="row q-ml-md">
                <HoverIcon class="col-auto q-pt-lg" :icon-name="'sym_o_badge'" :icon-size="'sm'" :headline="'Assetname'"
                    :content="'Translation comming soon.'" />
                <CopyToClipboard class="text-overline col-auto " :content="infoObj.asset_name" :start-offset="10"
                    :end-offset="10" :btn-size="'xs'" />
            </div>

            <div class="row q-ml-md">
                <HoverIcon class="col-auto q-pt-lg" :icon-name="'sym_o_fingerprint'" :icon-size="'sm'"
                    :headline="'Fingerprint'" :content="'This is an Asset Fingerprint.'" />
                <CopyToClipboard class="text-overline col-auto " :content="infoObj.fingerprint" :start-offset="10"
                    :end-offset="10" :btn-size="'xs'" />
            </div>

            <div class="row q-ml-md">
                <HoverIcon class="col-auto q-pt-lg" :icon-name="'sym_o_tenancy'" :icon-size="'sm'" :headline="'Policy'"
                    :content="'This is a Policy'" />
                <CopyToClipboard class="text-overline col-auto " :content="infoObj.policy_id" :start-offset="10"
                    :end-offset="10" :btn-size="'xs'" :link="'assets/policy'" />
            </div>

            <div>
                <q-markup-table flat bordered class="q-mt-md">
                    <thead>
                        <tr>
                            <th class="text-left">Tx</th>
                            <th class="text-left">Index</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="tx, index in txObj.txs" :key="index">
                            <td class="row text-left">
                                <HoverIcon class="col-auto q-mr-sm" v-if="infoObj.initial_mint_tx_hash === tx.tx_hash"
                                    :icon-name="'sym_o_loupe'" :icon-size="'xs'" :headline="'Initial mint transaction'"
                                    :content="''" />
                                <router-link :to="'/txs/' + tx.tx_hash" class="col-auto text-indigo-9"
                                    style="text-decoration: none">
                                    {{ tx.tx_hash }}
                                </router-link>
                            </td>
                            <td class="text-left">{{ tx.tx_index }}</td>
                        </tr>
                    </tbody>
                </q-markup-table>

            </div>
            <div>
                <q-markup-table flat bordered class="q-mt-md">
                    <thead>
                        <tr>
                            <th class="text-left">Address</th>
                            <th class="text-left">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="addr, index in addrObj.addrs" :key="index">
                            <td class="row text-left">

                                <router-link :to="'/addresses/' + addr.address" class="col-auto text-indigo-9"
                                    style="text-decoration: none">
                                    {{ addr.address }}
                                </router-link>
                            </td>
                            <td class="text-left">{{ addr.quantity }}</td>
                        </tr>
                    </tbody>
                </q-markup-table>

            </div>
        </div>

    </q-card>

</template>