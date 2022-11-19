<script setup>
import ScriptView from 'src/components/Content/ScriptView.vue';

</script>

<template>
    <q-page>
        <ScriptView :script-hash="$route.params.scriptHash"/>
    </q-page>
</template>