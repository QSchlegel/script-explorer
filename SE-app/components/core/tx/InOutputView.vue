<script setup>
import EutxoView from './EutxoView.vue';

const props = defineProps({
    put: '',
    data: {}
})
const shortenHash = (txt) => { return txt.slice(0, 15) + " ... " + txt.slice(txt.length - 10) }

</script>

<template>

    <div v-if="props.data !==''" v-for="addr, index in new Set((props.put === 'inputs') ? [...props.data.inputs].map(m => m.address) : [...props.data.outputs].map(m => m.address))"
        :key="index">
        <!--Output Addresses-->
        <NuxtLink :to="'/addresses/'+addr">
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
        </NuxtLink>
        

        <!--Output utxos-->
        <div v-for="utxo, jndex in ((props.put === 'inputs') ? [... props.data.inputs] : [... props.data.outputs]).filter(f => f.address === addr) "
            :key="jndex" class="mx-8 py-4">
            <EutxoView :txHash="(props.put === 'inputs') ? utxo.tx_hash: data.txHash" :utxo="utxo" />
        </div>

    </div>

</template>