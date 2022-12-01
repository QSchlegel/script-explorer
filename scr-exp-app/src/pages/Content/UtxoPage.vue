<script setup>
import UtxoView from 'src/components/Content/UtxoView.vue';
import SearchView from 'src/components/Util/SearchView.vue';
</script>
<template>
    <q-page>
        <SearchView/>
        <q-card class="q-ma-md" flat bordered>
        <UtxoView :tx-hash="$route.params.txHash"/>
        </q-card>
    </q-page>
</template>