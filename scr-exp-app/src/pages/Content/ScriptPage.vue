<script setup>
import ScriptView from 'src/components/Content/ScriptView.vue';
import FooterView from 'src/components/Util/FooterView.vue';
import LoginView from 'src/components/Util/LoginView.vue';
import SearchView from 'src/components/Util/SearchView.vue';

</script>

<template>
    <q-page>
        <LoginView/>
        <SearchView/>
        <ScriptView :script-hash="$route.params.scriptHash"/>
        <FooterView/>
    </q-page>
</template>