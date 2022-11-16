<script setup>
import ScriptView from 'src/components/ScriptView.vue';

</script>

<template>
    <q-page>
        <ScriptView :script-hash="$route.params.scriptHash"/>
    </q-page>
</template>