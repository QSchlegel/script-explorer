<script setup>
//import { useAddrStore } from 'stores/addr-store';
import { computed } from "vue";
import { useScrStore } from 'stores/scr-store';
import AddressView from 'src/components/AddressView.vue';
//import PlutusView from "./PlutusView.vue";
import TimelockView from "./TimelockView.vue";
import PlutusView from "./PlutusView.vue";

const scrStore = useScrStore();


var currentScript = ''
const scrHash = computed(()=>{
    if (currentScript !== scrStore.currentScript) scrStore.loadScriptData(); currentScript = scrStore.currentScript
    return scrStore.currentScript
})

const scriptType = computed(()=>{
    const current = scrStore.scriptDataList.filter((f)=> f.script_hash === scrStore.currentScript)
    if (current.length > 0){
        if (current[0].type === 'timelock') return 'timelock'
        if (current[0].type === 'plutusV1') return 'plutus'
        if (current[0].type === 'plutusV2') return 'plutus'
        return 'unkown Type'
    } else return 'empty'
})

const cTC = function (txt) {
  return navigator.clipboard.writeText(txt)
}

</script>
<template>
    <q-card
      v-if="scrStore.currentScript != ''"
      bordered
      class="q-ma-md"
    >
      <q-card-section class="row">
        <div
          class="text-h6 q-mt-sm q-mb-xs col-11 text-center"
          style="word-wrap:break-word"
        >
        {{(scriptType == 'timelock')?'⏳':'📜'}}  {{ scrHash }}
          <q-btn
            class="col-1"
            flat
            round
            icon="content_copy"
            @click="cTC(scrStore.currentScript)"
          />
        </div>
        
      </q-card-section>
      
      <q-linear-progress query track-color="primary" color="accent" class="q-mt-sm" v-if='scrStore.dLoading' />
      

      <AddressView/>

      <PlutusView/>
      
      <TimelockView 
        v-if="scriptType === 'timelock'"
        :data="scrStore.timelock"/>

    </q-card>
    
    
</template>