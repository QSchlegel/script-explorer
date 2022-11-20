<script setup>
import { ref } from 'vue'
import { useNetStore } from 'src/stores/net-store'
import { useScrStore } from 'src/stores/scr-store'

const netStore = useNetStore()
const scrStore = useScrStore()

const searchText = ref('')
</script>

<template>
    <div v-if="netStore.LoggedIn" class="q-pa-md">
      <q-input v-model="searchText" text spellcheck="off" bottom-slots label="Find a Script">
        <template #append>
            <q-btn flat round icon="search" 
              @click="scrStore.currentScript = searchText;" 
              :to="'scripts/' + searchText"/>
        </template>
        <template #before>
          <q-icon v-if="searchText !== ''" name="close" class="cursor-pointer" @click="searchText = ''" />
        </template>
      </q-input>
    </div>
</template>