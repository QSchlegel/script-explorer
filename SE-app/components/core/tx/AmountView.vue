<script setup>
import AssetNameView from './AssetNameView.vue';
import { useAssetStore } from '/stores/asset-store'
const assetStore = useAssetStore()

const props = defineProps({
    amount: {}
})


</script>
<template>
    <div v-if="amount !== ''" class="relative overflow-x-auto rounded-lg border boder-gray-200 dark:border-gray-700 mt-3">

        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg ">
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
                <tr v-for="asset, index in props.amount" :key="index"
                    class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
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
</template>