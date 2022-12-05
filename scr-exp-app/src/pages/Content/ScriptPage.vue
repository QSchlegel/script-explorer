<script setup>
import ScriptView from 'src/components/Content/ScriptView.vue';
import { useScrStore } from 'stores/scr-store';
const scrStore = useScrStore();
</script>
<template>
    <q-page>
        <q-card class="q-ma-md" flat bordered>
            <q-linear-progress query track-color="primary" color="accent" class="q-mt-sm" v-if='scrStore.dLoading' />
            <ScriptView :script-hash="$route.params.scriptHash"/>
        </q-card>
    </q-page>
</template>