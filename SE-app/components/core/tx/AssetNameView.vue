<script setup>
import { useAssetStore } from '/stores/asset-store'
const assetStore = useAssetStore()
  
const props = defineProps({
    name: {}
})
const assetName = ref('')
onMounted(async ()=>{
    assetName.value = await assetStore.loadAsset(props.name)
})


const shortenHash = (txt) => { return txt.slice(0, 10) + " ... " + txt.slice(txt.length - 10) }
</script>
<template>

<p>{{ (assetName.assetName !== '')? assetName.assetName: shortenHash(assetName.data.asset) }}</p>
</template>