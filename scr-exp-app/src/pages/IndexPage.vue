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

    <q-card class="col-12 col-sm-6 q-ma-md" v-if="!store.LoggedIn">
      <q-card-section>
        <q-card-section class="text-h5 q-pt-md q-pl-md q-pb-none row">
          <div class="col-auto">
            <q-btn flat round icon="chevron_right" @click="infoToggle = !infoToggle" v-if="!infoToggle" />
            <q-btn flat round icon="keyboard_arrow_down" @click="infoToggle = !infoToggle" v-if="infoToggle" />
          </div>
          <div class="col-10 q-ma-xs">How to use the Script Explorer ? </div>
        </q-card-section>

        <q-card-section v-if="infoToggle">
          <ol>
            <li>Create a <a href="https://blockfrost.io" target="_blank">Blockfrost</a> Account</li>
            <li>Setup a <a href="https://blockfrost.io" target="_blank">Blockfrost</a> Project</li>
            <li>Find the Project ID on the <a href="https://blockfrost.io" target="_blank">Blockfrost</a> Dashboard.
            </li>
            <li>Enter the Project ID in the Field above.</li>
            <li>Load Scripts from the Scriptlist or Find Scripts with the searchbar.</li>
          </ol>

          <q-card bordered class="q-ma-xl">
            <q-video :ratio="18 / 9" class="q-ma-md" src="https://www.youtube.com/embed/6L0f7zNanY8" />
          </q-card>
        </q-card-section>
      </q-card-section>

    </q-card>
    <q-card class="col-12 col-sm-6 q-ma-md" v-if="!store.LoggedIn">
      <q-card-section>
        <q-card-section class="text-h5 q-pt-md q-pl-md q-pb-none row">
          <div class="col-auto">
            <q-btn flat round icon="chevron_right" @click="infoToggle2 = !infoToggle2" v-if="!infoToggle2" />
            <q-btn flat round icon="keyboard_arrow_down" @click="infoToggle2 = !infoToggle2" v-if="infoToggle2" />
          </div>
          <div class="col-10 q-ma-xs">Nice to know! ℹ️</div>
        </q-card-section>

        <q-card-section v-if="infoToggle2" >
          The Script Explorer is a Frontend and requires a Backend, which provides data.<br />
          The Script Explorer does not have its own Backend. <br />
          Instead it uses the <a href="https://blockfrost.io" target="_blank">Blockfrost</a> Backend.
          <br />
          That is why you have to setup at least a free Blockfrost Account and a Project, which gives you a Project ID
          <br /> <br />
          Once you give the Project ID to the Script Explorer, it can fetch data from the Backend on your behalf.
          <br />
          The Script Explorer only saves your Project ID in local storage as a cookie. 🍪<br />
          Also the Script Explorer is still under development, so please excuse some rough Edges. <br />
          None the less have fun exploring.<br /> <br />
          If you have specific feature requests, questions or something seems wrong.<br />
          Feel free to contact me: <a href="mailto:quirin.schlegel@icloud.com">quirin.schlegel@icloud.com</a>
        </q-card-section>


      </q-card-section>
    </q-card>

    <!--Scriptitem-->

    <q-card bordered class="q-ma-md" v-if="store.CurScript != ''">
      <q-card-section class="row">
        <div class="text-h5 q-mt-sm q-mb-xs col text-center" style="word-wrap:break-word">
          📜 {{ store.CurScript }}
          <q-btn flat round icon="content_copy" @click='cTC' />

        </div>

      </q-card-section>

      <!--Timelock Script-->

      <q-card-section v-if='variant == "timelock"'>
        <JsonView :data='store.ScrJson'></JsonView>
      </q-card-section>

      <!--Plutus Script-->
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
import JsonView from 'src/components/JsonView.vue';

const store = useScriptStore();

const pID = ref('')
const searchScript = ref('')
const infoToggle = ref(false)
const infoToggle2 = ref(false)

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
