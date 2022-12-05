<script setup>
import { ref } from 'vue'

const searchText = ref('')
</script>

<template>
  <q-input v-model="searchText" text spellcheck="off" bottom-slots label="Find a Script">
    <template #append>
      <q-btn flat round icon="search" :to="'scripts/' + searchText" />
    </template>
    <template #before>
      <q-icon v-if="searchText !== ''" name="close" class="cursor-pointer" @click="searchText = ''" />
    </template>
  </q-input>
</template>