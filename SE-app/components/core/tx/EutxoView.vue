<script setup>
import AmountView from './AmountView.vue';
const props = defineProps({
    txHash: '',
    utxo: {}
})
const shortenHash = (txt) => { return txt.slice(0, 15) + " ... " + txt.slice(txt.length - 10) }
</script>
<template>
    <div v-if="props.utxo !== ''" class="flex text-gray-500 dark:text-gray-400 py-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
            class="text-gray-600 dark:text-gray-100 w-4 h-4 m-0.5 md:w-5 md:h-5 md:mt-2.5">
            <path fill-rule="evenodd"
                d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 01-.375.65 2.249 2.249 0 000 3.898.75.75 0 01.375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 17.625v-3.026a.75.75 0 01.374-.65 2.249 2.249 0 000-3.898.75.75 0 01-.374-.65V6.375zm15-1.125a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm.75 4.5a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zm-.75 3a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75zm.75 4.5a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-.75zM6 12a.75.75 0 01.75-.75H12a.75.75 0 010 1.5H6.75A.75.75 0 016 12zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
                clip-rule="evenodd" />
        </svg>
        <svg v-if="props.utxo.collateral" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke-width="1.5" stroke="currentColor" class="w-3 h-3 ml-1 mt-1 md:w-5 md:h-5 md:mt-2.5">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
        </svg>
        <svg v-if="props.utxo.reference" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke-width="1.5" stroke="currentColor" class="w-3 h-3 ml-1 mt-1 md:w-5 md:h-5 md:mt-2.5">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
        </svg>


        <NuxtLink :to="'/transactions/' + props.txHash">
            <p class="m-0.5 md:mt-2 text-xs md:text-base hover:text-gray-800 dark:hover:text-gray-50">
                {{ shortenHash(props.txHash) + " - " +
                props.utxo.output_index }}
            </p>
        </NuxtLink>

    </div>
    <div v-if="props.utxo !== ''">
        <!--Todo Pull datum and make a component-->
        <div v-if="utxo.data_hash !== null" class="flex text-gray-500 dark:text-gray-400 ml-3 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-3 h-3 ml-1  md:w-4 md:h-4">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p class="ml-1 text-xs md:mt-0.5">{{ shortenHash(props.txHash) }}</p>
        </div>
        <!--Todo translate inline Dataum-->
        <div v-if="props.utxo.inline_datum !== null" class="flex text-gray-500 dark:text-gray-400 ml-3 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-3 h-3 ml-1  md:w-4 md:h-4">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p class="ml-1 text-xs md:mt-0.5">{{ shortenHash(props.inline_datum) }}</p>
        </div>

        <NuxtLink v-if="props.utxo.reference_script_hash !== null" :to="'/scripts/' + props.utxo.reference_script_hash"
            class="flex text-gray-500 dark:text-gray-400 ml-3 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-3 h-3 ml-1  md:w-4 md:h-4">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <p class="ml-1 text-xs md:mt-0.5">{{ shortenHash(props.reference_script_hash) }}</p>
        </NuxtLink>

        <AmountView :amount="props.utxo.amount" />
    </div>

</template>