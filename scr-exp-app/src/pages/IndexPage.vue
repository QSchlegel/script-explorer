<script setup>
import { ref } from 'vue'
import { useNetStore } from 'src/stores/net-store'
import { useScrStore } from 'src/stores/scr-store'

import ScriptView from 'src/components/ScriptView.vue';

const netStore = useNetStore()
const scrStore = useScrStore()

const pID = ref('')
const searchScript = ref('')
const infoToggle = ref(false)
const infoToggle2 = ref(false)

//TD use router to make components rest compatible

</script>

<template>
  <q-page>
    <!--Title-->
    <div
      v-if="scrStore.currentScript == ''"
      class="row q-py-xl"
    >
      <h2 class="col-7 col-sm-4 text-right q-mt-none q-mb-none">
        Script
      </h2>
      <div
        v-if="scrStore.currentScript == ''"
        class="col-auto popover__title popover__wrapper"
      >
        <h2 class="text-center q-mt-none q-mb-none">
          -
        </h2>

        <p
          class="q-mt-xl q-mb-none popover__content"
          style="font-size:10px;"
        >
          by Quirin_Schlegel
        </p>
      </div>
      <p class="col-5 col-sm-auto" />
      <h2 class="col-4 text-left q-mt-none q-mb-none">
        Explorer
      </h2>
    </div>

    <!--Loggin-->
    <div
      v-if="!netStore.LoggedIn"
      class="q-pa-md"
    >
      <q-input
        v-model="pID"
        text
        spellcheck="off"
        bottom-slots
        label="Enter Project ID"
      >
        <template #append>
          <q-btn
            flat
            round
            icon="login"
            @click="netStore.setApi(pID); pID = ''"
          />
        </template>
      </q-input>
    </div>

    <!--Search Field-->
    <div
      v-if="netStore.LoggedIn"
      class="q-pa-md"
    >
      <q-input
        v-model="searchScript"
        text
        spellcheck="off"
        bottom-slots
        label="Find a Script"
      >
        <template #append>
          <q-btn
            flat
            round
            icon="search"
            @click="scrStore.currentScript = searchScript;"
          />
        </template>
        <template #before>
          <q-icon
            v-if="searchScript !== ''"
            name="close"
            class="cursor-pointer"
            @click="searchScript = ''"
          />
        </template>
      </q-input>
    </div>

    <!--Scriptitem-->
    <ScriptView/>

    <!--Explainer-->
    <q-card
      v-if="!netStore.LoggedIn"
      class="col-12 col-sm-6 q-ma-md"
    >
      <q-card-section>
        <q-card-section class="text-h5 q-pt-md q-pl-md q-pb-none row">
          <div class="col-auto">
            <q-btn
              v-if="!infoToggle"
              flat
              round
              icon="chevron_right"
              @click="infoToggle = !infoToggle"
            />
            <q-btn
              v-if="infoToggle"
              flat
              round
              icon="keyboard_arrow_down"
              @click="infoToggle = !infoToggle"
            />
          </div>
          <div class="col-10 q-ma-xs">
            How to use the Script Explorer ?
          </div>
        </q-card-section>

        <q-card-section v-if="infoToggle">
          <ol>
            <li>
              Create a <a
                href="https://blockfrost.io"
                target="_blank"
              >Blockfrost</a> Account
            </li>
            <li>
              Setup a <a
                href="https://blockfrost.io"
                target="_blank"
              >Blockfrost</a> Project
            </li>
            <li>
              Find the Project ID on the <a
                href="https://blockfrost.io"
                target="_blank"
              >Blockfrost</a> Dashboard.
            </li>
            <li>Enter the Project ID in the Field above.</li>
            <li>Load Scripts from the Scriptlist or Find Scripts with the searchbar.</li>
          </ol>

          <q-card
            bordered
            class="q-ma-xl"
          >
            <q-video
              :ratio="18 / 9"
              class="q-ma-md"
              src="https://www.youtube.com/embed/Cv7FvPRRES0"
            />
          </q-card>
        </q-card-section>
      </q-card-section>
    </q-card>

    <q-card class="col-12 col-sm-6 q-ma-md">
      <q-card-section>
        <q-card-section class="text-h5 q-pt-md q-pl-md q-pb-none row">
          <div class="col-auto">
            <q-btn
              v-if="!infoToggle2"
              flat
              round
              icon="chevron_right"
              @click="infoToggle2 = !infoToggle2"
            />
            <q-btn
              v-if="infoToggle2"
              flat
              round
              icon="keyboard_arrow_down"
              @click="infoToggle2 = !infoToggle2"
            />
          </div>
          <div class="col-10 q-ma-xs">
            Nice to know! ℹ️
          </div>
        </q-card-section>

        <q-card-section v-if="infoToggle2">
          
          Feel free to contact me: <a href="mailto:quirin.schlegel@icloud.com">quirin.schlegel@icloud.com</a>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-page>
</template>