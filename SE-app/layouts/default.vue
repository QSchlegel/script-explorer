<template>
    <div class="w-full bg-white dark:bg-gray-900">

        <NavView />

        <div class="grid">
            <div class="mt-20" />
            <div class="flex my-10">
                <slot class="w-1/2" />
            </div>

            <br /><br /><br />
            <br /><br /><br />
            <br /><br /><br />
            <br /><br /><br />
            <br /><br /><br />

        </div>

        <FooterView />

    </div>
</template>

<script setup>
import FooterView from '~~/components/std/FooterView.vue';
import NavView from '~~/components/std/NavView.vue';
import { useNetStore } from '/stores/net-store'
import { useScrStore } from '/stores/scr-store'

const netStore = useNetStore()
const scrStore = useScrStore()

const pID = ref('')
const loginLoading = ref(false)

const initList = () => {
    if (scrStore.scriptList.length === 0) { scrStore.loadMoreScripts(1); }
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
    pID.value = 'mainnetxyz'
    loginFkt();
})
</script>