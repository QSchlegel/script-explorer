<template>
  <q-page>
    
    <!--Title-->
    <div class="row q-py-xl" v-if="store.CurScript == ''">
      <h2 class="col-7 col-sm-4 text-right q-mt-none q-mb-none">Script</h2>
      <div class="col-auto popover__title popover__wrapper" v-if="store.CurScript == ''">
        <h2 class="text-center q-mt-none q-mb-none">-</h2>

        <p class="q-mt-xl q-mb-none popover__content" style="font-size:10px;">by Quirin_Schlegel</p>
      </div>
      <p class="col-5 col-sm-auto"></p>
      <h2 class="col-4 text-left q-mt-none q-mb-none">Explorer</h2>
    </div>

    <!--Loggin-->
    <div class="q-pa-md" v-if="!store.LoggedIn">
      <q-input text spellcheck="off" bottom-slots v-model="pID" label="Enter Project ID">
        <template v-slot:append>
          <q-btn flat round icon="login" @click="store.setApi(pID); pID = ''" />
        </template>
      </q-input>
    </div>

    <!--Search Field-->
    <div class="q-pa-md" v-if="store.LoggedIn">
      <q-input text spellcheck="off" bottom-slots v-model="searchScript" label="Find a Script">
        <template v-slot:append>
          <q-btn flat round icon="search" @click="store.CurScript = searchScript; store.loadScriptData()" />
        </template>
        <template v-slot:before>
          <q-icon v-if="searchScript !== ''" name="close" @click="searchScript = ''" class="cursor-pointer" />
        </template>
      </q-input>
    </div>

    <!--Explainer-->
    <div class="row" v-if="store.CurScript == ''">
      <q-card bordered class="col q-ma-md" >
      <q-card-section >
        <q-card-section class="text-h5 q-pt-md q-pl-md q-pb-none">
          How to use the Script Explorer ?
        </q-card-section>
      
        <ol>
          <li>
            Setup a
            <a href="https://blockfrost.io/auth/signin" target="_blank">
              Blockfrost
            </a>
             Account.
          </li>
          <li>
            Setup <a href="https://blockfrost.io" target="_blank">Blockfrost</a> Project
          </li>
          <li>
            Enter the Project ID in the Field above.
          </li>
          <li>
            Load or Find Scripts to look at.
          </li>
        </ol>
        <q-card-section class="text-h5 q-pt-md q-pl-md">
          How does the Script Explorer work?
        </q-card-section>
        <q-card-section>
          The Script Explorer is a Frontend and requires a Backend, which provides data.<br/>
          The Script Explorer does not have its own Backend. <br/>
          Instead it uses the <a href="https://blockfrost.io" target="_blank">Blockfrost</a> Backend (REST API). <br/>
          That is why you have to setup a free Blockfrost Account and a Project. <br/> <br/>
          Once you give the project ID to the Script Explorer, it can fetch data from the Backend on your behalf. <br/>
          The Script Explorer currently saves no data persistently. <br/>
          Also the Script Explorer is still under development, so please excuse some rough Edges.
        </q-card-section>
        

      </q-card-section>
    </q-card>
    <q-card bordered class="col q-ma-md"></q-card>

    </div>
    


    <!--Scriptitem-->

    <q-card bordered class="q-ma-md" v-if="store.CurScript != ''">
      <q-card-section class="row">
        <div class="text-h5 q-mt-sm q-mb-xs col text-center" style="word-wrap:break-word">
          📜 {{ store.CurScript }}
          <q-btn flat round icon="content_copy" @click='cTC' />

        </div>

      </q-card-section>

      <!--ToDo build Timelock Script Component-->

      <q-card-section v-if='variant == "timelock"'>
        <q-separator />
        <q-list bordered padding class="rounded-borders">

          <q-item>
            <q-item-section avatar>
              <q-icon name="lock_outline" />
            </q-item-section>
            <q-item-section>
              {{ store.ScrJson.type }}
            </q-item-section>

            <q-item-section v-if='store.ScrJson.type == "atLeast"'>
              {{ store.ScrJson.required }}
            </q-item-section>
          </q-item>

          <div v-if='store.ScrJson.type == "sig"'>
            <q-separator spaced />
            <q-item v-if='store.ScrJson.type == "sig"'>
              {{ store.ScrJson.keyHash }}
              <q-icon name="key" />
            </q-item>
          </div>

          <div v-if='store.ScrJson.type != "sig"'>
            <div v-for="s, index in store.ScrJson.scripts" :key="index">

              <q-separator spaced />

              <q-item v-if='s.type == "sig"'>
                {{ s.keyHash }}
                <q-icon name="key" />
              </q-item>

              <q-item v-if='s.type == "before"'>
                <q-icon name="last_page" /> {{ s.slot }}
                <q-icon name="schedule" />
              </q-item>

              <q-item v-if='s.type == "after"'>
                {{ s.slot }}
                <q-icon name="schedule" />
                <q-icon name="first_page" />
              </q-item>
            </div>
          </div>
        </q-list>
      </q-card-section>

      <RedeemerView v-if='variant == "plutus" && rLoaded' />
      <q-linear-progress query track-color="primary" color="accent" class="q-mt-sm"
        v-if='variant == "plutus" && !rLoaded' />
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useScriptStore } from 'src/stores/script-store';
import RedeemerView from 'src/components/RedeemerView.vue';

const store = useScriptStore();

const pID = ref('')
const searchScript = ref('')

const cTC = function () {
  const textToCopy = store.CurScript
  return navigator.clipboard.writeText(textToCopy);
}

const rLoaded = computed(() => {
  const rAvailable = store.ScrRList.filter((f) => f.script_hash === store.CurScript).length > 0
  if (!rAvailable) store.loadScriptRedemer()
  return rAvailable
})

const variant = computed(() => {
  const x = store.ScrDataList.filter((f) => f.script_hash === store.CurScript);
  if (x[0] !== undefined) {
    switch (x[0].type) {
      case "timelock": store.loadScriptJson(); return "timelock";
      case "plutus": store.loadScriptRedemer(); return "plutus";
      case "plutusV1": store.loadScriptRedemer(); return "plutus";
      case "plutusV2": store.loadScriptRedemer(); return "plutus";
      default: return "err";
    }
  } return "err"
}
)

</script>
