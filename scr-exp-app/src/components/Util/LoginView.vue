<script setup>
import { ref } from 'vue'
import { useNetStore } from 'src/stores/net-store'

const netStore = useNetStore()
const pID = ref('')
const infoToggle = ref(false)
</script>

<template>
    <div class="q-pa-md">
        <q-input v-model="pID" text spellcheck="off" bottom-slots label="Enter Project ID">
            <template #append>
                <q-btn flat round icon="login" @click="netStore.setApi(pID); pID = ''" />
            </template>
        </q-input>
    </div>

    <q-card  flat class="col-12 col-sm-6 q-ma-md">
        <q-card-section>
            <q-card-section class="text-h5 q-pt-md q-pl-md q-pb-none row">
                <div class="col-auto">
                    <q-btn v-if="!infoToggle" flat bordered round icon="sym_o_chevron_right"
                        @click="infoToggle = !infoToggle" />
                    <q-btn v-if="infoToggle" flat round icon="sym_o_keyboard_arrow_down" @click="infoToggle = !infoToggle" />
                </div>
                <div class="col-10 q-ma-xs">
                    How to use the Script Explorer ?
                </div>
            </q-card-section>

            <q-card-section v-if="infoToggle">
                <ol>
                    <li>
                        Create a <a href="https://blockfrost.io" target="_blank">Blockfrost</a> Account
                    </li>
                    <li>
                        Setup a <a href="https://blockfrost.io" target="_blank">Blockfrost</a> Project
                    </li>
                    <li>
                        Find the Project ID on the <a href="https://blockfrost.io" target="_blank">Blockfrost</a>
                        Dashboard.
                    </li>
                    <li>Enter the Project ID in the Field above.</li>
                    <li>Load Scripts from the Scriptlist or Find Scripts with the searchbar.</li>
                </ol>
                <q-video :ratio="16 / 9" class="q-ma-xl" src="https://www.youtube.com/embed/Cv7FvPRRES0" />
            </q-card-section>
        </q-card-section>
    </q-card>
</template>