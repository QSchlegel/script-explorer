<script setup>
import GridView from 'src/components/Util/GridView.vue';
import MapView from 'src/components/Util/MapView.vue';
import { useGridStore } from 'src/stores/grid-store'

const gridStore = useGridStore();
</script>

<template>
    <q-page>
        <GridView v-if="gridStore.gridSwitch"/>
        <MapView  v-if="!gridStore.gridSwitch"/>
    </q-page>
    
</template>