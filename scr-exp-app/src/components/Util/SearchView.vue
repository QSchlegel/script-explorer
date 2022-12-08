<script setup>
import { ref } from 'vue';
import {useRouter} from 'vue-router';
import { useScrStore } from 'stores/scr-store';
import { useTxStore } from 'stores/tx-store';
import { useAddrStore } from 'stores/addr-store';
import { useAssetStore } from 'stores/asset-store';

const scrStore = useScrStore();
const addrStore = useAddrStore();
const txStore = useTxStore();
const assetStore = useAssetStore();
const router = useRouter();

const searchText = ref('')
const search = async () =>{
  const scrHash = scrStore.loadScriptData(searchText.value)
  

  const addr    = addrStore.loadAddress(searchText.value, true)
  const tx      = txStore.loadUtxos(searchText.value)
  const asset   = assetStore.loadAsset(searchText.value)
  const policy  = assetStore.loadPolicy(searchText.value)
   
  if (await scrHash) {router.push('/scripts/'+ searchText.value); return} 
  if (await policy) {router.push('assets/policy/'+ searchText.value); return}
  if (await addr) {router.push('/addresses/'+ searchText.value); return}
  if (await tx) {router.push('txs/'+ searchText.value); return} 
  if (await asset) {router.push('assets/'+ searchText.value); return} 
  searchText.value = 'This was not Found'

}
</script>

<template>
  <q-input v-model="searchText" text spellcheck="off" bottom-slots label="Find a Resource.">
    <template #append>
      <q-btn flat round icon="search" @click="search()" />
    </template>
    <template #before>
      <q-icon v-if="searchText !== ''" name="close" class="cursor-pointer" @click="searchText = ''" />
    </template>
  </q-input>
</template>