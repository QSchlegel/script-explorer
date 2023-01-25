<script setup>
import { onMounted } from 'vue'
import { initDropdowns, initPopovers } from 'flowbite'
import { useNetStore } from '/stores/net-store'
import { useScrStore } from '/stores/scr-store'
import { useAssetStore } from '/stores/asset-store'
import { useGridStore } from '/stores/grid-store'
import LoginNotice from '~~/components/core/Login/LoginNotice.vue';
import { storeToRefs } from 'pinia'

//init Stores
const netStore = useNetStore()
const scrStore = useScrStore()
const assetStore = useAssetStore()
const gridStore = useGridStore()

const { LoggedIn } = storeToRefs(netStore)

const route = useRoute()

const scrType = ref('')
const plutusType = ref('')
const loaded = ref('false')

const loadScript = async () => {
    loaded.value = false
    const tmp = await scrStore.loadScriptData(route.params.id)
    if (tmp !== []) {
        if (tmp.type === 'timelock') {
            const json = scrStore.loadScriptJson(route.params.id);
            const policy = assetStore.loadPolicy(route.params.id);
            await Promise.all([json, policy])
            if (await policy === true) { plutusType.value = 'mint' }
        }
        else {
            const tmpRedeemer = await scrStore.loadScriptRedeemer(route.params.id)
            const pType = (tmpRedeemer.data.length > 0) ? tmpRedeemer.data[0].purpose : ''
            if (pType === 'mint') {
                await assetStore.loadPolicy(route.params.id)
            }
            plutusType.value = pType
        }
        scrType.value = tmp.type
    }
    scrStore.currentScript = route.params.id
    loaded.value = true
}

// initialize components based on data attribute selectors
onMounted(() => {
    initDropdowns();
    initPopovers();
    if (netStore.LoggedIn === true) { loadScript(); }
})


watch(LoggedIn, () => {
    loadScript()
})

const shortenHash = (txt) => { return txt.slice(0, 15) + " ... " + txt.slice(txt.length - 15) }

</script>

<template>

    <div class="grow" />
    <div class="w-96 md:w-fit bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 md:p-3">

        <div class="flex justify-between px-4 pt-4">

            <div class="flex p-1.5" data-popover-target="popover-scripthash" data-popover-placement="bottom">
                <svg v-if="loaded === true && netStore.LoggedIn === true && scrType === 'timelock'"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-3 h-3 m-1.5 md:w-5 md:h-5 md:m-2.5 text-gray-900 dark:text-white">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <svg v-if="loaded === true && netStore.LoggedIn === true && scrType !== 'timelock'"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-3 h-3 m-1.5 md:w-5 md:h-5 md:m-2.5 text-gray-900 dark:text-white">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
                <svg aria-hidden="true" v-if="loaded !== true"
                    class="w-3 h-3 m-1.5 md:w-5 md:h-5 md:m-2.5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor" />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill" />
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
                        <a v-if="gridStore.scrList.filter(f=>f.id === route.params.id).length === 0" @click="gridStore.addItem(route.params.id, 'scr')"
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
                        <a v-if="gridStore.scrList.filter(f=>f.id === route.params.id).length >0" @click="gridStore.removeItem(route.params.id, 'scr')"
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
                <h3 class="uppercase font-semibold text-gray-900 dark:text-white">{{ scrType }}</h3>
            </div>
            <div class="px-3 py-2">
                <div v-if="scrType === 'timelock'">
                    <p>Time-lock scripts are a smart contract feature in Cardano, that prevents
                        funds from being spent for a specific period of time or only allows predefined keys to spent
                        funds.</p>
                    <br/>
                    <p>These can be used to
                        create savings accounts or contracts where funds are released only after a certain period of
                        time.</p>
                </div>
                <div v-if="scrType !== 'timelock'">
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

        <!--ToDo Make recursive-->
        <div v-if="netStore.LoggedIn === true && scrType === 'timelock'" class=" px-3">
            <div class="inline-flex items-center justify-center w-full">
                <hr class="w-72 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
                <span
                    class="absolute px-1 text-sm font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800">Required
                    Conditions: {{
                        scrStore.timelock.type +
                            ((scrStore.timelock.type === "atLeast") ? ' ' + scrStore.timelock.required : '')
                    }}</span>
            </div>

            <p v-if="scrStore.timelock.type === 'sig'"
                class="text-sm text-center font-medium text-gray-900 bg-white dark:text-white dark:bg-gray-800">{{
                    scrStore.timelock.keyHash
                }}</p>

            <!--ToDo Table, which holds the Timelock Conditions-->
            <div v-if="scrStore.timelock.type !== 'sig'"
                class="relative overflow-x-auto rounded-lg border boder-gray-200 dark:border-gray-700">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Condition Type
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Condition Parameter
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="condition, index in scrStore.timelock.scripts" :key="index"
                            class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row"
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {{ condition.type }}
                            </th>
                            <td class="px-6 py-4">
                                {{ (condition.keyHash === undefined) ? condition.slot : condition.keyHash}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <br />


        <div v-if="netStore.LoggedIn === true
        && plutusType === 'mint'" class="px-3">
            <div class="inline-flex items-center justify-center w-full">
                <hr class="w-72 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
                <span
                    class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800">Policy</span>
            </div>
            <!--Table, which holds the Assets-->
            <div class="relative overflow-x-auto rounded-lg border boder-gray-200 dark:border-gray-700">
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
                        <tr v-for="asset, index in assetStore.policyList.filter(f => f.policyId === route.params.id)[0].assets"
                            :key="index" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <NuxtLink :to="'/assets/' + asset.asset">
                                <th scope="row"
                                    class="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-4 h-4 m-0.5 mr-1.5">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                                    </svg>

                                    {{ asset.asset }}
                                </th>
                            </NuxtLink>
                            <td class="px-6 py-4">
                                {{ asset.quantity }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <br />

        <div v-if="netStore.LoggedIn === true
        && scrType !== 'timelock'
        && plutusType !== ''" class="px-3">
            <div class="inline-flex items-center justify-center w-full">
                <hr class="w-72 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
                <span
                    class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800">Redeemer</span>
            </div>

            <div class="relative overflow-x-auto rounded-lg border boder-gray-200 dark:border-gray-700">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Transaction
                            </th>
                            <th scope="col" class="px-6 py-3">
                                CPU time

                            </th>
                            <th scope="col" class="px-6 py-3">
                                Memory
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Fee
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr v-for="tx, index in scrStore.plutusList.filter(f => f.scriptHash === route.params.id)[0].data"
                            :key="index" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <NuxtLink :to="'/transactions/' + tx.tx_hash">
                                <th scope="row"
                                    class="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-4 h-4 m-0.5 mr-1.5">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>

                                    {{ tx.tx_hash + "-" + tx.tx_index }}
                                </th>
                            </NuxtLink>
                            <td class="px-6 py-4">
                                {{(tx.unit_steps / 1000000000) + " ms" }}
                            </td>
                            <td class="px-6 py-4">
                                {{ (tx.unit_mem / 1000000) + " MB" }}
                            </td>
                            <td class="px-6 py-4">
                                {{ (tx.fee / 1000000) + " ₳" }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="grow" />

</template>