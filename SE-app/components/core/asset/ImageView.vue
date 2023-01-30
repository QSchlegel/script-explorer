<script setup>
const props = defineProps({
    data: ''
})
</script>
<template>
    <div v-if="data !==undefined && data.onchain_metadata.image !== undefined" class="grid justify-items-center">
        <div v-if="data.onchain_metadata.image[0] !== undefined && data.onchain_metadata.image[0].length > 1"
            v-for="img, index in data.onchain_metadata.image" :key="index">
            <img v-if="img.split('//')[0] === 'ipfs:'" class="max-w-1/2 rounded-lg"
                :src="'https://ipfsloader.script-explorer.workers.dev/ipfs/' + img.split('//')[1]" />
        </div>
        <img v-else class="max-w-1/2 rounded-lg"
            :src="'https://ipfsloader.script-explorer.workers.dev/ipfs/' + ((data.onchain_metadata.image.split('//')[1] === undefined) ? data.onchain_metadata.image : data.onchain_metadata.image.split('//')[1])">
    </div>
</template>