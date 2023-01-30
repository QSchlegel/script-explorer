<script setup>
import ImageView from '../asset/ImageView.vue';
import AssetNameView from '~~/components/core/tx/AssetNameView.vue'
import { useAssetStore } from '/stores/asset-store'

const assetStore = useAssetStore()

const assetList = ref([])
const page = ref(0)

const props = defineProps({
    policy: ''
})

const loadAssets = async () => {
    page.value = page.value + 1
    await assetStore.loadPolicy(props.policy, page.value)
    const tmp = assetStore.policyList.filter(f => f.policyId === props.policy)
    assetList.value = await Promise.all(tmp[0].assets.slice(0, page.value * 20).map(async m => assetStore.loadAsset(m.asset)))
}
onMounted(() => {
    loadAssets()
})
</script>

<template>
    <div class="rounded-lg border boder-gray-200 dark:border-gray-700">
        <div
            v-if="assetList !== [] && assetList !== undefined && assetList.filter(f => f.data.onchain_metadata !== null && f.data.onchain_metadata.image !== null).length > 0">
            <div class="grid grid-cols-4 gap-5 m-3">
                <NuxtLink
                    v-for="nft in assetList.filter(f => f.data.onchain_metadata !== null && f.data.onchain_metadata.image !== null)"
                    :to="'/assets/'+nft.data.asset">
                    <ImageView :data="nft.data" />
                </NuxtLink>
            </div>

            <div v-if="assetList.length % 20 === 0"
                class="grid justify-items-center py-3 rounded-lg border-b boder-gray-200 dark:border-gray-700">
                <a class="text-gray-400 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    @click="loadAssets()"> Load More </a>
            </div>
            <br />
        </div>

        <!--Table, which holds the Assets-->
        <div v-if="assetList !== [] && assetList !== undefined"
            class="relative overflow-x-auto h-min-fit max-h-60 rounded-lg border boder-gray-200 dark:border-gray-700">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Asset
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Quantity
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="asset, index in assetList" :key="index"
                        class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <NuxtLink :to="'/assets/' + asset.data.asset">
                            <th scope="row"
                                class="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-4 h-4 m-0.5 mr-1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                                </svg>

                                <AssetNameView :name="asset.data.asset" />
                            </th>
                        </NuxtLink>
                        <td class="px-6 py-4">
                            {{ asset.data.quantity }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="assetList.length % 20 === 0"
                class="grid justify-items-center py-3 border-t boder-gray-200 dark:border-gray-700">
                <a class="text-gray-400 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    @click="loadAssets()"> Load More </a>
            </div>
        </div>
    </div>
</template>