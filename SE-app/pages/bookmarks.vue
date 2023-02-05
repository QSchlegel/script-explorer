<script setup>
import { useGridStore } from '/stores/grid-store'
import { useNetStore } from '/stores/net-store';

const gridStore = useGridStore()
const netStore = useNetStore();

</script>
<template>
    <div class="grow" />
    <div class="w-96 md:w-3/4 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 md:p-3">
        <div class="grid">

            <div v-if="gridStore.addrListMem.filter(f=>f.network === netStore.mode).length > 0">
                <div class="inline-flex items-center justify-center w-full">
                    <hr class="w-72 h-px my-8 bg-gray-600 border-0 dark:bg-gray-600">
                    <span
                        class="absolute px-3 font-medium text-gray-900 bg-white dark:text-white dark:bg-gray-800">Addresses</span>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 md:p-3">

                    <div v-for="addr in gridStore.addrListMem.filter(f=>f.network === netStore.mode)" class="p-1.5 text-gray-900 dark:text-white">
                        <NuxtLink :to="'/addresses/' + addr.id">{{ addr.id }}</NuxtLink>
                    </div>
                </div>
            </div>

            <div v-if="gridStore.txListMem.filter(f=>f.network === netStore.mode).length > 0">
                <div class="inline-flex items-center justify-center w-full">
                    <hr class="w-72 h-px my-8 bg-gray-600 border-0 dark:bg-gray-600">
                    <span
                        class="absolute px-3 font-medium text-gray-900 bg-white dark:text-white dark:bg-gray-800">Transactions</span>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 md:p-3">

                    <div v-for="tx in gridStore.txListMem.filter(f=>f.network === netStore.mode)" class="p-1.5 text-gray-900 dark:text-white">
                        <NuxtLink :to="'/transactions/' + tx.id">{{ tx.id }}</NuxtLink>
                    </div>
                </div>
            </div>

            <div v-if="gridStore.assetList.filter(f=>f.network === netStore.mode).length > 0">
                <div class="inline-flex items-center justify-center w-full">
                    <hr class="w-72 h-px my-8 bg-gray-600 border-0 dark:bg-gray-600">
                    <span
                        class="absolute px-3 font-medium text-gray-900 bg-white dark:text-white dark:bg-gray-800">Assets</span>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 md:p-3">

                    <div v-for="asset in gridStore.assetList.filter(f=>f.address === netStore.mode)" class="p-1.5 text-gray-900 dark:text-white">
                        <NuxtLink :to="'/assets/' + asset.id">{{ asset.id }}</NuxtLink>
                    </div>
                </div>
            </div>

            <div v-if="gridStore.scrList.filter(f=>f.network === netStore.mode).length > 0">
                <div class="inline-flex items-center justify-center w-full">
                    <hr class="w-72 h-px my-8 bg-gray-600 border-0 dark:bg-gray-600">
                    <span
                        class="absolute px-3 font-medium text-gray-900 bg-white dark:text-white dark:bg-gray-800">Scripts</span>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 md:p-3">

                    <div v-for="scr in gridStore.scrList.filter(f=>f.network === netStore.mode)" class="p-1.5 text-gray-900 dark:text-white">
                        <NuxtLink :to="'/scripts/' + scr.id">{{ scr.id }}</NuxtLink>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <div class="grow" />

</template>