<script setup>
import { computed } from '@vue/reactivity';
import { useAssetStore } from 'src/stores/asset-store';
import { onMounted } from 'vue';
import CopyToClipboard from "../Util/CopyToClipboard.vue";
import HoverIcon from "../Util/HoverIcon.vue";

const assetStore = useAssetStore()

const props = defineProps({
    policyId: String
})

onMounted(() => {
    assetStore.loadPolicy(props.policyId)
})
const policyObj = computed(() => {
    return assetStore.policyList.filter((f) => f.policyId === props.policyId)[0]
})

</script>
<template>

    <q-card flat>
        
        <q-linear-progress query track-color="primary" color="accent" class="q-mt-sm" v-if='policyObj === undefined' />
        <div v-if="policyObj !== undefined">
            <div class="row q-ml-md">
                <HoverIcon class="col-auto q-pt-lg" :icon-name="'sym_o_tenancy'" :icon-size="'sm'" :headline="'Policy'"
                    :content="'This is a Policy'" />
                <CopyToClipboard class="text-overline col-auto " :content="policyObj.policyId" :start-offset="10"
                    :end-offset="10" :btn-size="'xs'" :link="'assets/policy'" />
            </div>
            <div>
                <q-markup-table flat bordered class="q-mt-md">
                    <thead>
                        <tr>
                            <th class="text-left">Asset</th>
                            <th class="text-left">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="asset, index in policyObj.assets" :key="index">
                            <td class="row text-left">

                                <router-link :to="'/assets/' + asset.asset" class="col-auto text-indigo-9"
                                    style="text-decoration: none">
                                    {{ asset.asset }}
                                </router-link>
                            </td>
                            <td class="text-left">{{ asset.quantity }}</td>
                        </tr>
                    </tbody>
                </q-markup-table>

            </div>
        </div>

    </q-card>

</template>