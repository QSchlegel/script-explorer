<script setup>
import { ref, computed } from 'vue'
import LeftList from './LeftList.vue';
import { useNetStore } from 'src/stores/net-store';
import FooterView from 'src/components/Util/FooterView.vue';
import HeaderView from 'src/components/Util/HeaderView.vue';
const netStore = useNetStore();

const leftDrawerOpen = ref(false)

const pidDisplay = computed(() => {
  return netStore.ApiDetails.pid.slice(0, 7) + " - " + netStore.ApiDetails.pid.slice(7,14)+ "..."+ netStore.ApiDetails.pid.slice(netStore.ApiDetails.pid.length-7)
})

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<template>
  <q-layout view="hHh LpR fFr">

    <q-header elevated class="bg-primary text-black">
      <q-toolbar>
        <q-btn dense flat round icon="sym_o_menu" @click="toggleLeftDrawer" v-if="!leftDrawerOpen" />
        <q-btn dense flat round icon="sym_o_clear_all" @click="toggleLeftDrawer" v-if="leftDrawerOpen" />

        <q-toolbar-title style="font-size:small">
          <router-link class="text-black" style="text-decoration: none;" to="/" >Script-Explorer</router-link>
        </q-toolbar-title>

        <q-btn no-caps flat rounded class="q-mt-none q-mb-none" style="font-size:smaller" color="accent" :label="pidDisplay" v-if="netStore.LoggedIn" @click="netStore.clearApi"/>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <LeftList />
    </q-drawer>

    

    <q-page-container>
      <HeaderView />
      <router-view />
      <FooterView />
    </q-page-container>

    

  </q-layout>
</template>