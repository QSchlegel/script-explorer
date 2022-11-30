<script setup>
import TxView from 'src/components/Content/TxView.vue';
import SearchView from 'src/components/Util/SearchView.vue';
</script>
<template>
    <q-page>
        <SearchView/>
        <TxView :tx-hash="$route.params.txHash" :script-hash="''"/>
    </q-page>
</template>