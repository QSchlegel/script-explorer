<template>
    <nav
        class="h-14 bg-white px-2 sm:px-4 py-2 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <div class="container flex flex-wrap items-center justify-between">

            <!--List Drawer Toggle-->
            <div class="w-6">
                <a class="text-gray-500 hover:text-gray-900 dark:hover:text-white" data-drawer-target="drawer-list-left"
                    data-drawer-toggle="drawer-list-left">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" v-if="scrStore.slLoading !== true"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    <svg aria-hidden="true" v-if="scrStore.slLoading === true"
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
                </a>
            </div>

            <!--Title-->
            <NuxtLink to="/" class="flex items-center">
                <span
                    class="self-center text-sm md:text-xl font-semibold whitespace-nowrap dark:text-white">ScriptExplorer</span>
            </NuxtLink>

            <!--SearchBar-->
            <div class="flex w-40 md:w-96">
                <div class="relative w-full">
                    <input type="search" id="search-top" v-model="searchTerm"
                        class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-gray-50 border-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                        placeholder="Search ..." required>
                    <button type="submit" @click="search()" :disabled="netStore.LoggedIn !== true"
                        class="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <span class="sr-only">Search</span>
                    </button>
                </div>
            </div>

            <div class="flex w-10 justify-between">
                <!--Login Indicator-->
                <span class="flex self-center w-2 h-2 bg-red-500 rounded-full" v-if="netStore.LoggedIn !== true" />
                <span class="flex self-center w-2 h-2 bg-green-500 rounded-full" v-if="netStore.LoggedIn === true" />

                <!--App Drawer Toggle-->
                <a class="text-gray-500 hover:text-gray-900 dark:hover:text-white flex "
                    data-drawer-target="drawer-swipe" data-drawer-toggle="drawer-swipe" data-drawer-placement="bottom"
                    data-drawer-edge="true" data-drawer-edge-offset="bottom-[60px]" aria-controls="drawer-swipe">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                </a>
            </div>
        </div>
    </nav>



    <!-- drawer component left -->
    <div id="drawer-list-left"
        class="fixed z-40 h-screen p-4 overflow-y-auto border-2 border dark:border-gray-600 bg-gray-100 w-80 dark:bg-gray-900 transition-transform left-0 top-14 -translate-x-full"
        tabindex="-1" aria-labelledby="drawer-left-list-label">
        <h5 id="drawer-left-list-label"
            class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
            Script-List
        </h5>

        <LoginNotice />
        
        <div v-if="false"
            class="w-48 text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <button type="button"
                class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                <svg aria-hidden="true" class="w-4 h-4 mr-2 fill-current" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clip-rule="evenodd"></path>
                </svg>
                Top
            </button>

            <button type="button"
                class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                <svg aria-hidden="true" class="w-4 h-4 mr-2 fill-current" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z"
                        clip-rule="evenodd"></path>
                </svg>
                Middle
            </button>
            <button type="button"
                class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium rounded-b-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                <svg aria-hidden="true" class="w-4 h-4 mr-2 fill-current" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M2 9.5A3.5 3.5 0 005.5 13H9v2.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 15.586V13h2.5a4.5 4.5 0 10-.616-8.958 4.002 4.002 0 10-7.753 1.977A3.5 3.5 0 002 9.5zm9 3.5H9V8a1 1 0 012 0v5z"
                        clip-rule="evenodd"></path>
                </svg>
                Bottom
            </button>
        </div>
        <ListView />
    </div>


    <!-- drawer component bottom -->
    <div id="drawer-swipe"
        class="fixed z-40 w-full overflow-y-auto bg-white border-t border-gray-200 rounded-t-lg dark:border-gray-700 dark:bg-gray-800 transition-transform bottom-0 left-0 right-0 translate-y-full bottom-[60px]"
        tabindex="-1" aria-labelledby="drawer-swipe-label">
        <div class="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" data-drawer-toggle="drawer-swipe">
            <span
                class="absolute w-8 h-1 -translate-x-1/2 bg-gray-300 rounded-lg top-3 left-1/2 dark:bg-gray-600"></span>
        </div>
        <div class="grid grid-cols-3 gap-4 p-4">

            <div
                class="p-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700">
                <NuxtLink to="/">
                    <div
                        class="flex justify-center items-center p-2 mx-auto mb-2 max-w-[48px] bg-gray-200 dark:bg-gray-500 rounded-full w-18 h-18">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="inline w-8 h-8 text-gray-500 dark:text-gray-400">
                            <path
                                d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                            <path
                                d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                        </svg>
                    </div>
                </NuxtLink>

                <div class="font-medium text-center text-gray-500 dark:text-gray-400">Home</div>
            </div>

            <div
                class="p-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700">
                <NuxtLink to="/map">
                    <div
                        class="flex justify-center items-center p-2 mx-auto mb-2 max-w-[48px] bg-gray-200 dark:bg-gray-500 rounded-full w-18 h-18">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="inline w-8 h-8 text-gray-500 dark:text-gray-400">
                            <path fill-rule="evenodd"
                                d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </NuxtLink>

                <div class="font-medium text-center text-gray-500 dark:text-gray-400">Map</div>
            </div>

            <div
                class="p-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700">
                <NuxtLink to="/bookmarks">
                    <div
                        class="flex justify-center items-center p-2 mx-auto mb-2 max-w-[48px] bg-gray-200 dark:bg-gray-500 rounded-full w-18 h-18">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="inline w-8 h-8 text-gray-500 dark:text-gray-400">
                            <path fill-rule="evenodd"
                                d="M6 3a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3H6zm1.5 1.5a.75.75 0 00-.75.75V16.5a.75.75 0 001.085.67L12 15.089l4.165 2.083a.75.75 0 001.085-.671V5.25a.75.75 0 00-.75-.75h-9z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </NuxtLink>

                <div class="font-medium text-center text-gray-500 dark:text-gray-400">Bookmarks</div>
            </div>

            <div
                class="p-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700">
                <NuxtLink to="/about">
                    <div
                        class="flex justify-center items-center p-2 mx-auto mb-2 max-w-[48px] bg-gray-200 dark:bg-gray-500 rounded-full w-18 h-18">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="inline w-8 h-8 text-gray-500 dark:text-gray-400">
                            <path
                                d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                        </svg>
                    </div>
                </NuxtLink>

                <div class="font-medium text-center text-gray-500 dark:text-gray-400">About</div>
            </div>

            <div
                class="p-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700">
                <NuxtLink to="/donate">
                    <div
                        class="flex justify-center items-center p-2 mx-auto mb-2 max-w-[48px] bg-gray-200 dark:bg-gray-500 rounded-full w-18 h-18">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="inline w-8 h-8 text-gray-500 dark:text-gray-400">
                            <path
                                d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>


                    </div>
                </NuxtLink>

                <div class="font-medium text-center text-gray-500 dark:text-gray-400">Donate</div>
            </div>



            <div
                class="p-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700">
                <NuxtLink to="/settings">
                    <div
                        class="flex justify-center items-center p-2 mx-auto mb-2 max-w-[48px] bg-gray-200 dark:bg-gray-500 rounded-full w-18 h-18">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="inline w-8 h-8 text-gray-500 dark:text-gray-400">
                            <path
                                d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 01-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 016.126 3.537zM8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 010 .75l-1.732 3.001c-.229.396-.76.498-1.067.16A5.231 5.231 0 016.75 12c0-1.362.519-2.603 1.37-3.536zM10.878 17.13c-.447-.097-.623-.608-.394-1.003l1.733-3.003a.75.75 0 01.65-.375h3.465c.457 0 .81.408.672.843a5.252 5.252 0 01-6.126 3.538z" />
                            <path fill-rule="evenodd"
                                d="M21 12.75a.75.75 0 000-1.5h-.783a8.22 8.22 0 00-.237-1.357l.734-.267a.75.75 0 10-.513-1.41l-.735.268a8.24 8.24 0 00-.689-1.191l.6-.504a.75.75 0 10-.964-1.149l-.6.504a8.3 8.3 0 00-1.054-.885l.391-.678a.75.75 0 10-1.299-.75l-.39.677a8.188 8.188 0 00-1.295-.471l.136-.77a.75.75 0 00-1.477-.26l-.136.77a8.364 8.364 0 00-1.377 0l-.136-.77a.75.75 0 10-1.477.26l.136.77c-.448.121-.88.28-1.294.47l-.39-.676a.75.75 0 00-1.3.75l.392.678a8.29 8.29 0 00-1.054.885l-.6-.504a.75.75 0 00-.965 1.149l.6.503a8.243 8.243 0 00-.689 1.192L3.8 8.217a.75.75 0 10-.513 1.41l.735.267a8.222 8.222 0 00-.238 1.355h-.783a.75.75 0 000 1.5h.783c.042.464.122.917.238 1.356l-.735.268a.75.75 0 10.513 1.41l.735-.268c.197.417.428.816.69 1.192l-.6.504a.75.75 0 10.963 1.149l.601-.505c.326.323.679.62 1.054.885l-.392.68a.75.75 0 101.3.75l.39-.679c.414.192.847.35 1.294.471l-.136.771a.75.75 0 101.477.26l.137-.772a8.376 8.376 0 001.376 0l.136.773a.75.75 0 101.477-.26l-.136-.772a8.19 8.19 0 001.294-.47l.391.677a.75.75 0 101.3-.75l-.393-.679a8.282 8.282 0 001.054-.885l.601.504a.75.75 0 10.964-1.15l-.6-.503a8.24 8.24 0 00.69-1.191l.735.268a.75.75 0 10.512-1.41l-.734-.268c.115-.438.195-.892.237-1.356h.784zm-2.657-3.06a6.744 6.744 0 00-1.19-2.053 6.784 6.784 0 00-1.82-1.51A6.704 6.704 0 0012 5.25a6.801 6.801 0 00-1.225.111 6.7 6.7 0 00-2.15.792 6.784 6.784 0 00-2.952 3.489.758.758 0 01-.036.099A6.74 6.74 0 005.251 12a6.739 6.739 0 003.355 5.835l.01.006.01.005a6.706 6.706 0 002.203.802c.007 0 .014.002.021.004a6.792 6.792 0 002.301 0l.022-.004a6.707 6.707 0 002.228-.816 6.781 6.781 0 001.762-1.483l.009-.01.009-.012a6.744 6.744 0 001.18-2.064c.253-.708.39-1.47.39-2.264a6.74 6.74 0 00-.408-2.308z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </NuxtLink>

                <div class="font-medium text-center text-gray-500 dark:text-gray-400">Settings</div>
            </div>
        </div>
    </div>




</template>

<script setup>
import { onMounted } from 'vue'
import { initDrawers } from 'flowbite'
import { useNetStore } from '/stores/net-store'
import { useScrStore } from '/stores/scr-store'
import { useTxStore } from '/stores/tx-store'
import { useAddrStore } from '/stores/addr-store'
import { useAssetStore } from '/stores/asset-store'
import ListView from '../core/LeftList/ListView.vue';
import LoginNotice from '../core/Login/LoginNotice.vue';
import { Buffer } from 'buffer'  // note: the trailing slash is important!
const router = useRouter();

const netStore = useNetStore()
const scrStore = useScrStore()
const txStore = useTxStore()
const addrStore = useAddrStore()
const assetStore = useAssetStore()


const adaHandle = 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a';

// initialize components based on data attribute selectors
onMounted(() => {
    initDrawers();
})
const searchTerm = ref('')

const search = async () =>{
    if( await scrStore.loadScriptData(searchTerm.value)) router.push({path:"/scripts/"+searchTerm.value})
    if( await txStore.loadTx(searchTerm.value)) router.push({path:"/transactions/"+searchTerm.value})
    if( await addrStore.loadAddressInfo(searchTerm.value)) router.push({path:"/addresses/"+searchTerm.value})
    if( await assetStore.loadAsset(searchTerm.value)) router.push({path:"/assets/"+searchTerm.value})

    const assetName = Buffer.from(searchTerm.value.toLocaleLowerCase()).toString('hex');
    const tmp = await assetStore.loadAssetAddr(adaHandle+assetName)
    if(tmp) router.push({path:"/addresses/"+tmp.addrs[0].address})

}
</script>