<template>
  <q-layout view="hHh LpR fFr">

    <q-header elevated class="bg-primary text-black">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title >
            <p class="q-mt-none q-mb-none" style="font-size:small">Script Explorer</p>
            
          
        </q-toolbar-title>

        <q-btn no-caps flat rounded class="q-mt-none q-mb-none" style="font-size:smaller" color="accent" :label="pidDisplay" v-if="loggedIn" @click="store.clearApi"/>

        <!--- <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />-->
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <LeftList />
    </q-drawer>
    <!--
      <q-drawer overlay show-if-above v-model="rightDrawerOpen" side="right" bordered>
        <RightList />
      </q-drawer>
    -->

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import LeftList from './LeftList.vue';
//import RightList from './RightList.vue';
import { useScriptStore } from '../stores/script-store'

const store = useScriptStore();

const loggedIn = computed(() => {
  return store.ApiDetails.pid !== ''
})

const leftDrawerOpen = ref(false)
//const rightDrawerOpen = ref(false)

const pidDisplay = computed(() => {
  return store.ApiDetails.pid.slice(0, 7) + " - " + store.ApiDetails.pid.slice(7,14)+ "..."+ store.ApiDetails.pid.slice(store.ApiDetails.pid.length-7)
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
/* const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value
} */

</script>