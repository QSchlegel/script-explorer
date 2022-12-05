<script setup>
import { computed, onUpdated, onMounted} from "vue";
import { useScrStore } from 'stores/scr-store';
import AddressView from './AddressView.vue';
import TimelockView from "./TimelockView.vue";
import PlutusView from "./PlutusView.vue";
import CopyToClipboard from "../Util/CopyToClipboard.vue";
import HoverIcon from "../Util/HoverIcon.vue";

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

</script>
<template>
  <q-card v-if="props.scriptHash != undefined" flat >
    <q-card-section class="row q-px-md q-pb-none">
      <HoverIcon class="col-auto q-pt-lg"
      :icon-name="'sym_o_code'"
      :icon-size="'sm'"
      :headline="'Scripthash'"
      :content="'This is a Scripthash'"
      />
      <CopyToClipboard class="text-overline col-auto q-pt-xs" :content="props.scriptHash" 
          :start-offset="10" :end-offset="10" :btn-size="'xs'"/>
      
    </q-card-section>

    <AddressView v-if="scriptType.includes('plutus') && scriptPurpose.includes('spend')" :input="props.scriptHash" :is-address="false" />

    <PlutusView v-if="scriptType.includes('plutus')" :script-hash="props.scriptHash"/>

    <TimelockView v-if="scriptType === 'timelock'" :data="scrStore.timelock" />

  </q-card>

</template>