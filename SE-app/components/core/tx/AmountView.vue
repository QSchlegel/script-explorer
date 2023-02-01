<script setup>
import ImageView from '../asset/ImageView.vue';
import AssetNameView from '~~/components/core/tx/AssetNameView.vue'
import { useAssetStore } from '/stores/asset-store'

const assetStore = useAssetStore()

const assetList = ref([])
const page = ref(0)
const pageSize = ref(8)

const props = defineProps({
    amount: ''
})

const loadAssets = async () => {
    page.value = page.value + 1
    assetList.value = await Promise.all(props.amount.filter(f => f.unit !== 'lovelace').slice(0, page.value * pageSize.value).map(async m => assetStore.loadAsset(m.unit)))
}
onMounted(() => {
    loadAssets()
})

</script>
<template>
    <div v-if="props.amount !== undefined && props.amount.length > 0"
        class="relative overflow-x-auto rounded-lg border boder-gray-200 dark:border-gray-700 mt-3">
        <div
            v-if="assetList !== [] && assetList !== undefined && assetList.filter(f => f.data.onchain_metadata !== null && f.data.onchain_metadata.image !== null).length > 0">
            <div class="grid grid-cols-4 gap-3 m-3">
                <NuxtLink
                    v-for="nft in assetList.filter(f => f.data.onchain_metadata !== null && f.data.onchain_metadata.image !== null)"
                    :to="'/assets/' + nft.data.asset">
                    <ImageView :data="nft.data" />
                </NuxtLink>
            </div>

            <button v-if="props.amount.length > pageSize * page"
                class="w-full py-1 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600 border-y boder-gray-100 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                @click="loadAssets()"> Load More
            </button>

        </div>

        <div class="relative overflow-x-auto h-min-fit max-h-60">
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
                    <tr v-for="asset, index in props.amount.slice(0, (pageSize * page < props.amount.length) ? pageSize * page : props.amount.length)"
                        :key="index" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <NuxtLink :to="'/assets/' + asset.unit">
                            <th scope="row"
                                class="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <svg v-if="asset.unit !== 'lovelace'" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                    class="w-4 h-4 m-0.5 mr-1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                                </svg>
                                <p v-if="asset.unit === 'lovelace'">₳</p>
                                <p v-if="asset.unit !== 'lovelace'">
                                    <AssetNameView :name="asset.unit" />
                                </p>

                            </th>
                        </NuxtLink>
                        <td class="px-6 py-4">
                            <p v-if="asset.unit === 'lovelace'">{{ asset.quantity / 1000000 }}</p>
                            <p v-if="asset.unit !== 'lovelace'">{{ asset.quantity }}</p>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>

        <button v-if="props.amount.length > pageSize * page" @click="loadAssets"
            class="w-full py-1 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600 border-t boder-gray-100 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Load More
        </button>
    </div>
</template>