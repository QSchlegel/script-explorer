<script setup>
import { useNetStore } from 'src/stores/net-store'
import LoginView from 'src/components/Util/LoginView.vue';
import SearchView from 'src/components/Util/SearchView.vue';
import { useGridStore } from 'src/stores/grid-store'

const gridStore = useGridStore();

const netStore = useNetStore()

</script>

<template>
    <LoginView v-if="!netStore.LoggedIn"/>

    <div class="row q-pa-md" v-if="netStore.LoggedIn" >
        <div class="col-auto q-pt-sm">
                    <q-btn flat bordered round icon="sym_o_apps"
                        @click="gridStore.gridSwitch = true" to="/grid" />
                    <q-btn flat round icon="sym_o_map"
                         @click="gridStore.gridSwitch = false" to="/grid"/>
        </div>
        <SearchView class="col"/>
    </div>
    

</template>