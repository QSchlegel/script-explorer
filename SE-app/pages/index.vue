<template>

    <div class="flex py-10 my-10">
        <div class="grow" />
        <div class="flex-none w-96">
            <h2 class=" bg-white dark:bg-gray-900 tracking-tighter text-gray-800 md:text-lg dark:text-gray-300">
                Welcome to the Script-Explorer!</h2>
            
            <div class="flex w-96 mt-8" v-if="netStore.LoggedIn !== true">
                
                <div class="relative w-full">

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
            <br />

            <p class="text-justify text-gray-500 dark:text-gray-400">Our platform is designed to provide you with a
                seamless and intuitive experience for exploring the vast world of blockchain technology.</p>
            <br />

            <p class="text-justify text-gray-500 dark:text-gray-400">Our state-of-the-art visualization tools allow you
                to easily navigate the complex web of transactions, addresses, assets and scripts that make up the
                Cardano
                blockchain. You can easily track the flow of funds, monitor the performance of scripts, and stay
                up-to-date on the latest developments in the space.</p>
            <br />

            <p class="text-justify text-gray-500 dark:text-gray-400">This gives you unparalleled insight into how these
                powerful tools are being used, and allows you to make informed decisions about your own use of smart
                contracts.</p>
            <br />

            <p class="text-justify text-gray-500 dark:text-gray-400">Whether you're a seasoned blockchain veteran or a
                curious newcomer, our platform has something to offer. So why not take a look around and see what the
                blockchain has in store for you?</p>
            <br />

            <iframe class="w-96 h-60" src="https://www.youtube-nocookie.com/embed/Cv7FvPRRES0"
                title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen></iframe>
        </div>
        <div class="grow" />
    </div>


</template>

<script setup>
import { useNetStore } from '/stores/net-store'
const netStore = useNetStore()

const pID = ref('')
const loginLoading = ref(false)

const loginFkt = async()  => {
    loginLoading.value = !loginLoading.value
    if( await netStore.setApi(pID.value)){
        pID.value = ''
    } else{
        //td notification
    }
    loginLoading.value = false
}
</script>