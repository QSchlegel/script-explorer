<script setup>
//CSS Framework imports
import { initDropdowns } from 'flowbite'
import { useNetStore } from '/stores/net-store'
import { useScrStore } from '/stores/scr-store'

const netStore = useNetStore()
const scrStore = useScrStore()

const pID = ref('')
const loginLoading = ref(false)

const initList = () => {
    if (scrStore.scriptList.filter(f=> f.network === netStore.mode).length === 0) { scrStore.loadMoreScripts(1); }
}

const loginFkt = async () => {
    loginLoading.value = !loginLoading.value
    if (await netStore.setApi(pID.value)) {
        pID.value = ''
        await initList();
    } else {
        //td notification
    }
    loginLoading.value = false
}
onMounted(() => {
    initDropdowns();
})
</script>
<template>




    <div class="grow" />
    <div class="w-96 md:w-1/2 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 md:p-3">
        
        <div>
            <button id="dropdownDividerButton" data-dropdown-toggle="dropdownDivider"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button">Select Network<svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg></button>

            <!-- Dropdown menu -->
            <div id="dropdownDivider"
                class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDividerButton">
                    <li>
                        <a @click="pID = 'mainnetxyz'; loginFkt()"
                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Mainnet</a>
                    </li>
                    <li>
                        <a @click="pID = 'preprodxyz'; loginFkt()"
                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Preprod network</a>
                    </li>
                    <li>
                        <a @click="pID = 'previewxyz'; loginFkt()"
                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Preview network</a>
                    </li>
                </ul>
                <div class="py-2">
                    <a @click="pID = ''; netStore.clearApi()"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                        Project Id
                    </a>
                </div>
            </div>
            <p>{{ netStore.mode }}</p>
        </div>

        <div v-if="netStore.LoggedIn !== true" class="relative w-full my-2">
            <input type="search" id="search-top" v-model="pID"
                class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-gray-50 border-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                placeholder="Enter Project ID" required>
            <button type="submit" @click="loginFkt()" :disabled="loginLoading"
                class="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">

                <div v-if="!loginLoading">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    <span class="sr-only">Login</span>
                </div>
                <div v-if="loginLoading">
                    <svg aria-hidden="true"
                        class="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor" />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill" />
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
            </button>
        </div>
    </div>
    <div class="grow" />

</template>