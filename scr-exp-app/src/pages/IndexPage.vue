<template>
  <q-page>

    <div class="q-pa-md">
      <q-input text spellcheck="off" bottom-slots v-model="searchScript" label="Find a Script">
        <template v-slot:append>
          <q-icon name="search" @click="store.CurScript = searchScript; store.loadScriptData()" />
        </template>
        <template v-slot:before>
          <q-icon v-if="searchScript !== ''" name="close" @click="searchScript = ''" class="cursor-pointer" />
        </template>
      </q-input>
    </div>

<div class="row" v-if="store.CurScript == ''">
  <h2 class="col-7 col-sm-4 text-right q-mt-none q-mb-none">Script</h2>
  <div class="col-auto popover__title popover__wrapper" v-if="store.CurScript == ''">      
      <h2 class="text-center q-mt-none q-mb-none">-</h2>
           
      <p class="q-mt-xl q-mb-none popover__content" style="font-size:10px;">by Quirin_Schlegel</p>
    </div>
    <p class="col-5 col-sm-auto"></p> 
    <h2 class="col-4 text-left q-mt-none q-mb-none">Explorer</h2>
</div>

    


    <q-card bordered class="q-ma-md" v-if="store.CurScript != ''">
      <q-card-section class="row">
        <div class="text-h5 q-mt-sm q-mb-xs col text-center" style="word-wrap:break-word">
          📜 {{ store.CurScript }}
          <q-btn flat round icon="content_copy" @click='cTC' />

        </div>

      </q-card-section>



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

const searchScript = ref('')

const cTC = function () {
  const textToCopy = store.CurScript
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    return navigator.clipboard.writeText(textToCopy);
  } else {
    // text area method
    let textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    // make the textarea out of viewport
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    //return new Promise((res, rej) => {
      // here the magic happens
    //  document.execCommand('copy') ? res() : rej();
     // textArea.remove();
    //});
  }
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


<style>
.popover__wrapper {
    position: relative;
}

.popover__content {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    font-size: 12px;
    left: 0%;
    top: 90%;
    transform: translate(0px, 10px);
    border-radius: 5px;
    color: black;
    background-color: white;
    padding: 0.5em;
    border: 1px solid #dc500f;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);

}

.popover__content::after,
.popover__content::before {
    display: block;
    box-sizing: border-box;
    border-right: 1px solid transparent;
    background-color: white;

}

.popover__content::before {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border-left: 1px solid #dc500f;
    border-top: 1px solid #dc500f;
    border-bottom: 1px solid transparent;

    transform: rotate(45deg) skew(10deg, 10deg);
    top: -6px;
    left: 8px;
    bottom: -13px;
    transition-duration: 0.3s;
    transition-property: transform;
}

.popover__wrapper:hover .popover__content {
    z-index: 10;
    opacity: 1;
    visibility: visible;
    transform: translate(0px, 0px);
    transition: all 0.5s cubic-bezier(0.75, -0.02, 0.2, 0.97);
}
</style>