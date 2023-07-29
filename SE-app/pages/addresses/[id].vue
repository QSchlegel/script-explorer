<script setup>
import { Buffer } from 'buffer'  // note: the trailing slash is important!

//CSS Framework imports
import { initDropdowns, initPopovers } from 'flowbite'

//Store imports
import { useNetStore } from '/stores/net-store'
import { useAddrStore } from '/stores/addr-store'
import { useGridStore } from '/stores/grid-store'
import { storeToRefs } from 'pinia'

//Component imports
import LoginNotice from '~~/components/core/Login/LoginNotice.vue';
import AmountView from '~~/components/core/tx/AmountView.vue'
import EutxoView from '~~/components/core/tx/EutxoView.vue'
import TxTimeView from '~~/components/core/tx/TxTimeView.vue'

//init Stores
const netStore = useNetStore()
const addrStore = useAddrStore()
const gridStore = useGridStore()
const { LoggedIn } = storeToRefs(netStore)

//init Route Params
const route = useRoute()

//init Component variables
const loaded = ref(false)
const dataInfo = ref('')
const dataTx = ref('')
const dataUtxo = ref('')
const page = ref(1)
const pIDAdaHandle = 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a';

//Component Functions
const loadAddr = async () => {
    dataInfo.value = await addrStore.loadAddressInfo(route.params.id)
    dataTx.value = await addrStore.loadAddressTransactions(route.params.id)
    dataUtxo.value = await addrStore.loadAddressUTxOs(route.params.id)
    loaded.value = true
}
const loadMoreTx = async () => {
    page.value = page.value + 1
    const tmp = dataTx.value.data
    dataTx.value = await addrStore.loadAddressTransactions(route.params.id, page.value)
    dataTx.value.data = tmp.concat(dataTx.value.data)
}
const shortenHash = (txt) => { return txt.slice(0, 15) + " ... " + txt.slice(txt.length - 10) }

useHead({
  title: 'Address',
  meta: [
    { name: 'description', content: 'This is an address page.'}
  ],
})

//Hooks
onMounted(() => {
    initDropdowns();
    initPopovers();
    if (netStore.LoggedIn === true) { loadAddr(); }
})
watch(LoggedIn, () => {
    loadAddr()
})
</script>


<template>
    <div class="grow" />
    <div class="w-96 md:w-3/4 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 md:p-3">

        <div class="flex justify-between px-4 pt-4">
            <div class="flex p-1.5 text-gray-900 dark:text-white" data-popover-target="popover-addr"
                data-popover-placement="bottom">
                <svg v-if="loaded && dataInfo.script" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor" class="w-3 h-3 my-1.5 md:w-5 md:h-5 md:my-2.5 ">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <svg v-if="loaded" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                    class="w-3 h-3 my-1.5 md:w-5 md:h-5 md:my-2.5">
                    <path fill-rule="evenodd"
                        d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                        clip-rule="evenodd" />
                </svg>
                <svg v-if="loaded && dataInfo.script" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor" class="w-3 h-3 my-1.5 md:w-5 md:h-5 md:my-2.5 ">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <svg aria-hidden="true" v-if="!loaded && netStore.LoggedIn === true"
                    class="w-3 h-3 mx-3 my-1.5 md:w-5 md:h-5 md:mx-5 md:my-2.5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor" />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill" />
                </svg>
                <p class="m-1 md:m-2 text-xs md:text-base ">{{
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
                        <a v-if="gridStore.addrList.filter(f => f.id === route.params.id).length === 0"
                            @click="gridStore.addItem(route.params.id, 'address')"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                            <div class="flex text-left ">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                </svg>
                                <p> Add Bookmark</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a v-if="gridStore.addrList.filter(f => f.id === route.params.id).length > 0"
                            @click="gridStore.removeItem(route.params.id, 'address')"
                            class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600  dark:hover:text-white">
                            <div class="flex text-left ">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="w-5 h-5">
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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="w-5 h-5">
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
        <div data-popover id="popover-addr" role="tooltip"
            class="absolute z-10 invisible inline-block w-64 text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
            <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                <h3 class="uppercase font-semibold text-gray-900 dark:text-white">Address</h3>
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

        <div v-if="netStore.LoggedIn === true && loaded && dataInfo !== '' && dataInfo.amount
            .filter(({ unit }) => unit.includes(pIDAdaHandle)).length > 0"
            class="relative px-6 my-6 mx-5 py-2 w-52 overflow-x-auto h-min-fit max-h-60 border boder-gray-100 dark:border-gray-700 rounded-lg">
            <div class="flex text-lg text-gray-900 dark:text-white " v-for="handle in dataInfo.amount
                .filter(({ unit }) => unit.includes(pIDAdaHandle))
                .map(({ unit }) => {
                    const hexName = unit.replace(pIDAdaHandle, '');
                    const utf8Name = Buffer.from(hexName, 'hex').toString('utf8');
                    return utf8Name;
                })">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-4 h-4 mt-1.5 mx-1">
                    <path stroke-linecap="round"
                        d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
                </svg>
                <p class=""> {{ handle }}</p>
            </div>

        </div>

        <LoginNotice />
        <br />

        <!--Address Holdings-->
        <div v-if="netStore.LoggedIn === true && loaded
            && dataInfo !== ''" class="px-3">
            <div class="inline-flex items-center justify-center w-full">
                <hr class="w-72 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
                <span
                    class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800">
                    Address Holdings
                </span>
            </div>
            <AmountView :amount="dataInfo.amount" />
            <br />
        </div>
        
        <!--Address UTxOs-->
        <div v-if="netStore.LoggedIn === true && loaded
            && dataUtxo !== '' && dataUtxo.data && dataUtxo.data.length > 0" class="px-3">
            <div class="inline-flex items-center justify-center w-full">
                <hr class="w-72 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
                <span
                    class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800">
                    Address UTxOs
                </span>
            </div>
            <div class="relative overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <div v-for="utxo, index in dataUtxo.data " :key="index" class="mx-5 py-4">
                    <EutxoView :txHash="utxo.tx_hash" :utxo="utxo" />
                </div>
            </div>
            <br />
        </div>
        
        <!--Transactions-->
        <div v-if="netStore.LoggedIn === true && loaded
            && dataTx !== ''">
            <div class="inline-flex items-center justify-center w-full">
                <hr class="w-72 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
                <span
                    class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800">
                    Transactions
                </span>
            </div>

            <div class="relative overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 mx-5">
                <ol class="relative mx-5 mt-5 pb-1 border-l border-gray-200 dark:border-gray-700">
                    <li v-for="tx, index in dataTx.data " :key="index" class="ml-4 my-4">
                        <div
                            class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
                        </div>
                        <time class="mb-1 text-xs font-normal leading-none text-gray-400 dark:text-gray-500">
                            <TxTimeView :blockTime="tx.block_time" />
                        </time>
                        <NuxtLink :to="`/transactions/${tx.tx_hash}`"
                            class="flex my-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="w-3 h-3 m-1 md:w-4 md:h-4">
                                <path
                                    d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                            <h3 class="text-sm font-semibold my-0.5">{{
                                shortenHash(tx.tx_hash) + ' - ' + tx.tx_index
                            }}</h3>
                        </NuxtLink>
                    </li>
                </ol>
                <div v-if="dataTx.data.length % 20 === 0"
                    class="grid justify-items-center py-3 border-t boder-gray-200 dark:border-gray-700">
                    <a class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        @click="loadMoreTx()"> Load More </a>
                </div>
            </div>
        </div>

    </div>
    <div class="grow" />
</template>