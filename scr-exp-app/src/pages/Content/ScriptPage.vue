<script setup>
import ScriptView from 'src/components/Content/ScriptView.vue';
import SearchView from 'src/components/Util/SearchView.vue';
</script>
<template>
    <q-page>
        <SearchView/>
        <ScriptView :script-hash="$route.params.scriptHash"/>
    </q-page>
</template>