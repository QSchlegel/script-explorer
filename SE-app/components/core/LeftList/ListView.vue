<template>

    <ul v-if="scrStore.scriptList.filter(f=>f.network === netStore.mode).length > 0"
        class="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white">
        <div v-for="script, index in scrStore.scriptList.filter(f=>f.network === netStore.mode)" :key="index">
            
                <li v-if="index === 0"
                    class="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500">
                    <ListItem :scr="script.scriptHash"  />
                </li>
                <li v-if="index !== 0 && index != scrStore.scriptList.filter(f=>f.network === netStore.mode).length - 1"
                    class="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500">
                    <ListItem :scr="script.scriptHash"  />
                </li>
                <li v-if="index === scrStore.scriptList.filter(f=>f.network === netStore.mode).length - 1"
                    class="w-full px-4 py-2 rounded-b-lg hover:bg-gray-100 dark:hover:bg-gray-500">
                    <ListItem :scr="script.scriptHash" />
                </li>
        </div>
    </ul>
    <br />

    <!--Pagination-->
    <div v-if="scrStore.scriptList.filter(f=>f.network === netStore.mode).length > 0" class="mb-56">
        <nav aria-label="Page navigation-list" class="text-center">
            <ul class="inline-flex items-center -space-x-px">
                <li>
                    <a @click="scrStore.loadMoreScripts(scrStore.page - 1)" v-if="scrStore.page !== 1"
                        class="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span class="sr-only">Previous</span>
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </a>
                </li>
                <li>
                    <a @click="scrStore.loadMoreScripts(scrStore.page - 2)" aria-current="page" v-if="scrStore.page > 2"
                        class="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        {{ scrStore.page - 2 }}
                    </a>
                </li>
                <li>
                    <a @click="scrStore.loadMoreScripts(scrStore.page - 1)" aria-current="page" v-if="scrStore.page > 1"
                        class="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        {{ scrStore.page - 1 }}
                    </a>
                </li>
                <li>
                    <a aria-current="page"
                        class="block z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                        {{ scrStore.page }}
                    </a>
                </li>
                <li>
                    <a @click="scrStore.loadMoreScripts(scrStore.page + 1)" aria-current="page"
                        class="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        {{ scrStore.page + 1 }}
                    </a>
                </li>
                <li>
                    <a @click="scrStore.loadMoreScripts(scrStore.page + 2)" aria-current="page"
                        class="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        {{ scrStore.page + 2 }}
                    </a>
                </li>
                <li>
                    <a @click="scrStore.loadMoreScripts(scrStore.page + 1)"
                        class="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <span class="sr-only">Next</span>
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </a>
                </li>
            </ul>
        </nav>

    </div>




</template>

<script setup>
import ListItem from './ListItem.vue';
import { useNetStore } from '/stores/net-store'
import { useScrStore } from '/stores/scr-store'
const netStore = useNetStore()
const scrStore = useScrStore()
</script>