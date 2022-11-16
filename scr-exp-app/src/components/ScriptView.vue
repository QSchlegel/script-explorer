<script setup>
import { computed, onUpdated, onMounted} from "vue";
import { useScrStore } from 'stores/scr-store';
import AddressView from './AddressView.vue';
import TimelockView from "./TimelockView.vue";
import PlutusView from "./PlutusView.vue";

const scrStore = useScrStore();

const props = defineProps({
  scriptHash: String
})

onMounted(() => {
  scrStore.loadScriptData(props.scriptHash)
})

onUpdated(() => {
  scrStore.loadScriptData(props.scriptHash)
})

const scriptType = computed(() => {
  const current = scrStore.scriptDataList.filter((f) => f.script_hash === props.scriptHash)
  if (current.length > 0) {
    if (current[0].type === 'timelock') return 'timelock'
    if (current[0].type === 'plutusV1') return 'plutus'
    if (current[0].type === 'plutusV2') return 'plutus'
    return 'unkown Type'
  } else return 'empty'
})
const scriptPurpose = computed(() => {
  const current = scrStore.plutusList.filter((f) => f.scriptHash === props.scriptHash)
  if (current.length > 0 && current[0].data.length >0) {
    return current[0].data[0].purpose
  } else return 'empty'
})

//Auslagern in eigenen datei zur wiederverwendung
const copyToClipboard = function (txt) {
  return navigator.clipboard.writeText(txt)
}

</script>
<template>
  <q-card v-if="props.scriptHash != undefined" flat bordered class="q-ma-md">

    <q-card-section class="row">
      <div class="text-h6 q-mt-sm q-mb-xs col-11 text-center" style="word-wrap:break-word">
        {{ (scriptType == 'timelock') ? '⏳' : '📜' }} {{ props.scriptHash }}
        <q-btn class="col-1" flat round icon="content_copy" @click="copyToClipboard(scrStore.currentScript)" />
      </div>
    </q-card-section>

    <q-linear-progress query track-color="primary" color="accent" class="q-mt-sm" v-if='scrStore.dLoading' />

    <AddressView v-if="scriptType.includes('plutus') && scriptPurpose.includes('spend')" :input="props.scriptHash" :is-address="false" />

    <PlutusView v-if="scriptType.includes('plutus')" :script-hash="props.scriptHash"/>

    <TimelockView v-if="scriptType === 'timelock'" :data="scrStore.timelock" />

  </q-card>


</template>