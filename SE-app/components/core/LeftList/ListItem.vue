<template>
    <div v-if="scrStore.scriptDataList.filter(f => f.script_hash === props.scr).length > 0">

        <div v-if="selected" class="flex justify-evenly text-blue-600 dark:text-blue-500">
            <NuxtLink class="flex justify-between" :to="'/scripts/' + props.scr">
                <svg v-if="type === 'timelock'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mt-0.5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <svg v-if="type === 'plutusV2' || type === 'plutusV1'" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mt-0.5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>

                <p class="mx-2">{{ shortenHash(props.scr) }}</p>
            </NuxtLink>


            <a v-if="gridStore.scrList.filter(f => f.id === props.scr).length > 0"
                @click="gridStore.removeItem(props.scr, 'scr')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 mt-0.5">
                    <path fill-rule="evenodd"
                        d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                        clip-rule="evenodd" />
                </svg>
            </a>

        </div>

        <div v-if="!selected" class="flex justify-between">
            <NuxtLink class="flex justify-between" :to="'/scripts/' + props.scr">
                <svg v-if="type === 'timelock'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mt-0.5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <svg v-if="type === 'plutusV2' || type === 'plutusV1'" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mt-0.5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>

                <p class="mx-2">{{ shortenHash(props.scr) }}</p>
            </NuxtLink>


            <a v-if="gridStore.scrList.filter(f => f.id === props.scr).length > 0"
                @click="gridStore.removeItem(props.scr, 'scr')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 mt-0.5">
                    <path fill-rule="evenodd"
                        d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                        clip-rule="evenodd" />
                </svg>
            </a>

        </div>

    </div>




</template>

<script setup>
import { useScrStore } from '/stores/scr-store'
import { useGridStore } from '/stores/grid-store'

const scrStore = useScrStore()
const gridStore = useGridStore()

const type = computed(() => {
    const tmp = scrStore.scriptDataList.filter(f => f.script_hash === props.scr)
    return (tmp.length > 0) ? tmp[0].type : ''
})
//ToDo find a better solution this feels wrong
const selected = computed(() => {
    return (props.scr === scrStore.currentScript)
})

const props = defineProps({
    scr: String
})
const shortenHash = (txt) => { return txt.slice(0, 10) + "..." + txt.slice(txt.length - 10) }

</script>