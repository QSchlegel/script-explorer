<script setup>
import { onMounted } from 'vue'
import { initDropdowns, initPopovers } from 'flowbite'
import { useNetStore } from '/stores/net-store'
import { useTxStore } from '/stores/tx-store'
import { useScrStore } from '/stores/scr-store'
import { useAssetStore } from '/stores/asset-store'
import { useGridStore } from '/stores/grid-store'
import LoginNotice from '~~/components/core/Login/LoginNotice.vue';
import { storeToRefs } from 'pinia'

//init Stores
const netStore = useNetStore()
const txStore = useTxStore()
const scrStore = useScrStore()
const assetStore = useAssetStore()
const gridStore = useGridStore()

const { LoggedIn } = storeToRefs(netStore)

const route = useRoute()
const loaded = ref(false)
const dataTx = ref('')
const dataUtxo = ref('')

const loadTx = async () => {
    const txData = txStore.loadTx(route.params.id);
    const utxoData = txStore.loadUtxos(route.params.id);
    await Promise.all([txData, utxoData])
    loaded.value = (txData !== false) && (utxoData !== false)
    dataUtxo.value = await utxoData
    dataTx.value = await txData


}

// initialize components based on data attribute selectors
onMounted(() => {
    initDropdowns();
    initPopovers();
    if (netStore.LoggedIn === true) { loadTx(); }
})


watch(LoggedIn, () => {
    loadTx()
})

const shortenHash = (txt) => { return txt.slice(0, 15) + " ... " + txt.slice(txt.length - 10) }

</script>


<template>
    <div class="grow" />
    <div class="w-96 md:w-fit bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 md:p-3">
        <div class="flex justify-between px-4 pt-4">
            <div class="flex p-1.5" data-popover-target="popover-scripthash" data-popover-placement="bottom">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                    class="w-3 h-3 m-1.5 md:w-5 md:h-5 md:m-2.5 text-gray-900 dark:text-white">
                    <path
                        d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
                <p class="m-1 md:m-2 text-xs md:text-base text-gray-900 dark:text-white">{{
                    shortenHash(route.params.id)
                }}</p>
                <StdClipboardBtnView :txt="route.params.id" />
            </div>


            <button id="dropdownButton" data-dropdown-toggle="dropdown"
                class="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
                type="button">
                <span class="sr-only">Open dropdown</span>
                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z">
                    </path>
                </svg>
            </button>
            <!-- Dropdown menu TD function-->
            <div id="dropdown"
                class="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded shadow w-50 dark:bg-gray-700">
                <ul class="py-1" aria-labelledby="dropdownButton">
                    <li>
                        <a v-if="gridStore.txList.filter(f => f.id === route.params.id).length === 0"
                            @click="gridStore.addItem(route.params.id, 'tx')"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                            <div class="flex text-left ">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                </svg>
                                <p> Add Bookmark</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a v-if="gridStore.txList.filter(f => f.id === route.params.id).length > 0"
                            @click="gridStore.removeItem(route.params.id, 'tx')"
                            class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600  dark:hover:text-white">
                            <div class="flex text-left ">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5" />
                                </svg>
                                <p> Remove Bookmark</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                            <div class="flex text-left ">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                                </svg>
                                <p> Share </p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <!--Popover-->
        <div data-popover id="popover-scripthash" role="tooltip"
            class="absolute z-10 invisible inline-block w-64 text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
            <div
                class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                <h3 class="uppercase font-semibold text-gray-900 dark:text-white">Transaction</h3>
            </div>
            <div class="px-3 py-2">
                <div>
                    <p>Plutus is a functional programming language for writing smart contracts on the Cardano
                        blockchain.</p>
                    <br />
                    <p>It offers a strong type system, formal verification and the ability to use light
                        clients, making it secure, predictable and efficient.</p>
                </div>

            </div>
            <div data-popper-arrow> </div>
        </div>
        <br />

        <LoginNotice />
        <div v-if="netStore.LoggedIn === true
        && loaded" class="px-3">
            <div class="inline-flex items-center justify-center w-full">
                <hr class="w-72 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
                <span
                    class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800">Transaction
                    details</span>
            </div>
            <!--ToDo Table, which holds the Block information-->
            <div class="relative overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Type
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Parameter
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row"
                                class="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Fees
                            </th>
                            <td class="px-6 py-4">
                                {{ dataTx.fees }}
                            </td>
                        </tr>
                        <tr class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row"
                                class="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Size
                            </th>
                            <td class="px-6 py-4">
                                {{ dataTx.size }}
                            </td>
                        </tr>
                        <tr class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row"
                                class="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Valid contract
                            </th>
                            <td class="px-6 py-4">
                                {{ dataTx.valid_contract }}
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
        <br />

        <div v-if="netStore.LoggedIn === true
        && loaded" class="px-3">
            <div class="inline-flex items-center justify-center w-full">
                <hr class="w-72 h-px my-8 bg-blue-600 border-0 dark:bg-blue-600">
                <span
                    class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800">Inputs</span>
            </div>

            <!--Input Section-->
            <div class="relative overflow-x-auto rounded-lg border border-blue-600 dark:border-blue-600">
                <div v-for="addr, index in new Set(dataUtxo.inputs.map(m => m.address))" :key="index">
                    <!--Input Addresses-->
                    <div class="flex p-3  text-gray-600 bg-gray-50 hover:text-gray-800 dark:hover:text-gray-50  dark:bg-gray-700 border-b dark:border-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="w-4 h-4 mt-1.5 md:w-5 md:h-5 md:mt-2.5 dark:text-gray-100">
                            <path fill-rule="evenodd"
                                d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                                clip-rule="evenodd" />
                        </svg>

                        <p class="m-1 md:m-2 text-sm md:text-base dark:text-gray-200">{{
                            shortenHash(addr)
                        }}</p>
                    </div>

                    <!--Input utxos-->
                    <div v-for="utxo, index in dataUtxo.inputs.filter(f => f.address === addr) " :key="index"
                        class="mx-8 py-4">
                        <div class="flex text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-50 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="text-gray-600 dark:text-gray-100 w-3 h-3 m-1 md:w-5 md:h-5 md:mt-2.5">
                                <path fill-rule="evenodd"
                                    d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 01-.375.65 2.249 2.249 0 000 3.898.75.75 0 01.375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 17.625v-3.026a.75.75 0 01.374-.65 2.249 2.249 0 000-3.898.75.75 0 01-.374-.65V6.375zm15-1.125a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm.75 4.5a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zm-.75 3a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75zm.75 4.5a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-.75zM6 12a.75.75 0 01.75-.75H12a.75.75 0 010 1.5H6.75A.75.75 0 016 12zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
                                    clip-rule="evenodd" />
                            </svg>

                            <svg v-if="utxo.collateral" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                class="w-3 h-3 ml-1 mt-1 md:w-5 md:h-5 md:mt-2.5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                            </svg>
                            <svg v-if="utxo.data_hash !== null" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                class="w-3 h-3 ml-1 mt-1 md:w-5 md:h-5 md:mt-2.5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            <svg v-if="utxo.inline_datum !== null" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                class="w-3 h-3 ml-1 mt-1 md:w-5 md:h-5 md:mt-2.5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            <svg v-if="utxo.reference" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                class="w-3 h-3 ml-1 mt-1 md:w-5 md:h-5 md:mt-2.5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
                            </svg>
                            <svg v-if="utxo.reference_script_hash !== null" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                class="w-3 h-3 ml-1 mt-1 md:w-5 md:h-5 md:mt-2.5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                            <NuxtLink :to="'/transactions/' + utxo.tx_hash">
                                <p class="m-0.5 md:mt-2 text-xs md:text-base">{{
                                    shortenHash(utxo.tx_hash) + " - " + utxo.output_index
                                }}</p>
                            </NuxtLink>
                        </div>

                        <div
                            class="relative overflow-x-auto rounded-lg border boder-gray-200 dark:border-gray-700 mt-3">
                            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg ">
                                <thead
                                    class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                                    <tr v-for="asset, index in utxo.amount" :key="index"
                                        class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <NuxtLink :to="'/assets/' + asset.unit">
                                            <th scope="row"
                                                class="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                <svg v-if="asset.unit !== 'lovelace'" xmlns="http://www.w3.org/2000/svg"
                                                    fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                    stroke="currentColor" class="w-4 h-4 m-0.5 mr-1.5">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                                                </svg>
                                                <p v-if="asset.unit === 'lovelace'">₳</p>
                                                <p v-if="asset.unit !== 'lovelace'">{{ shortenHash(asset.unit) }}</p>

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
                    </div>
                    <br />
                </div>
            </div>
        </div>
        <br />

        <div v-if="netStore.LoggedIn === true
        && loaded" class="px-3">
            <div class="inline-flex items-center justify-center w-full">
                <hr class="w-72 h-px my-8 bg-red-600 border-0 dark:bg-red-600">
                <span
                    class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800">Outputs</span>
            </div>

            <!--Output Section-->
            <div class="relative overflow-x-auto rounded-lg border border-red-600 dark:border-red-600">
                <div v-for="addr, index in new Set(dataUtxo.outputs.map(m => m.address))" :key="index">
                    <!--Output Addresses-->
                    <div class="flex p-3  text-gray-600 bg-gray-50 hover:text-gray-800 dark:hover:text-gray-50 dark:bg-gray-700 border-b dark:border-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="w-4 h-4 mt-1.5 md:w-5 md:h-5 md:mt-2.5 dark:text-gray-100">
                            <path fill-rule="evenodd"
                                d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                                clip-rule="evenodd" />
                        </svg>

                        <p class="m-1 md:m-2 text-sm md:text-base dark:text-gray-200">{{
                            shortenHash(addr)
                        }}</p>
                    </div>

                    <!--Output utxos-->
                    <div v-for="utxo, jndex in dataUtxo.outputs.filter(f => f.address === addr) " :key="jndex"
                        class="mx-8 py-4">
                        <div class="flex text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-50 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="text-gray-600 dark:text-gray-100 w-3 h-3 m-1 md:w-5 md:h-5 md:mt-2.5">
                                <path fill-rule="evenodd"
                                    d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 01-.375.65 2.249 2.249 0 000 3.898.75.75 0 01.375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 17.625v-3.026a.75.75 0 01.374-.65 2.249 2.249 0 000-3.898.75.75 0 01-.374-.65V6.375zm15-1.125a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm.75 4.5a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zm-.75 3a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75zm.75 4.5a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-.75zM6 12a.75.75 0 01.75-.75H12a.75.75 0 010 1.5H6.75A.75.75 0 016 12zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
                                    clip-rule="evenodd" />
                            </svg>

                            <div :data-popover-target="'popover-out-collateral-'+index+'-'+jndex" data-popover-placement="bottom">
                                <svg v-if="utxo.collateral" 
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor"
                                    class="w-3 h-3 ml-1 mt-1 md:w-5 md:h-5 md:mt-2.5">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                                </svg>
                            </div>
                            <!--Popover-->
                            <div data-popover :id="'popover-out-collateral-'+index+'-'+jndex" role="tooltip"
                                class="absolute z-10 invisible inline-block w-64 text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                <div
                                    class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                                    <h3 class="uppercase font-semibold text-gray-900 dark:text-white">Collateral
                                    </h3>
                                </div>
                                <div class="px-3 py-2">
                                    <div>
                                        <p>Plutus is a functional programming language for writing smart contracts
                                            on
                                            the Cardano
                                            blockchain.</p>
                                        <br />
                                        <p>It offers a strong type system, formal verification and the ability to
                                            use
                                            light
                                            clients, making it secure, predictable and efficient.</p>
                                    </div>
                                </div>
                                <div data-popper-arrow> </div>
                            </div>

                            <svg v-if="utxo.data_hash !== null" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                class="w-3 h-3 ml-1 mt-1 md:w-5 md:h-5 md:mt-2.5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            <svg v-if="utxo.inline_datum !== null" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                class="w-3 h-3 ml-1 mt-1 md:w-5 md:h-5 md:mt-2.5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            <svg v-if="utxo.reference" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                class="w-3 h-3 ml-1 mt-1 md:w-5 md:h-5 md:mt-2.5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
                            </svg>
                            <svg v-if="utxo.reference_script_hash !== null" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                class="w-3 h-3 ml-1 mt-1 md:w-5 md:h-5 md:mt-2.5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                            <p class="m-0.5 md:mt-2 text-xs md:text-base">{{
                                shortenHash(route.params.id) + " - " + utxo.output_index
                            }}</p>
                        </div>
                        <div
                            class="relative overflow-x-auto rounded-lg border boder-gray-200 dark:border-gray-700 mt-3">

                            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg ">
                                <thead
                                    class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                                    <tr v-for="asset, index in utxo.amount" :key="index"
                                        class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <NuxtLink :to="'/assets/' + asset.unit">
                                            <th scope="row"
                                                class="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                <svg v-if="asset.unit !== 'lovelace'" xmlns="http://www.w3.org/2000/svg"
                                                    fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                    stroke="currentColor" class="w-4 h-4 m-0.5 mr-1.5">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                                                </svg>
                                                <p v-if="asset.unit === 'lovelace'">₳</p>
                                                <p v-if="asset.unit !== 'lovelace'">{{ shortenHash(asset.unit) }}</p>

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
                    </div>
                    <br />
                </div>

            </div>
        </div>
        <br />

        <div v-if="netStore.LoggedIn === true
        && loaded" class="px-3">
            <div class="inline-flex items-center justify-center w-full">
                <hr class="w-72 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
                <span
                    class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800">Block
                    details</span>
            </div>
            <!--ToDo Table, which holds the Block information-->
            <div class="relative overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Type
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Parameter
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row"
                                class="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Hash
                            </th>
                            <td class="px-6 py-4">
                                {{ dataTx.block }}
                            </td>
                        </tr>
                        <tr class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row"
                                class="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Height
                            </th>
                            <td class="px-6 py-4">
                                {{ dataTx.block_height }}
                            </td>
                        </tr>
                        <tr class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row"
                                class="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Time
                            </th>
                            <td class="px-6 py-4">
                                {{ dataTx.block_time }}
                            </td>
                        </tr>
                        <tr class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row"
                                class="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Slot
                            </th>
                            <td class="px-6 py-4">
                                {{ dataTx.slot }}
                            </td>
                        </tr>
                        <tr class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row"
                                class="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                index
                            </th>
                            <td class="px-6 py-4">
                                {{ dataTx.index }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <br />
    </div>

    <div class="grow" />

</template>