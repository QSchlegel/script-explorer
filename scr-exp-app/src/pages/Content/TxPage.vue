<script setup>
import TxView from 'src/components/Content/TxView.vue';
</script>
<template>
    <q-page>
        <q-card class="q-ma-md" flat bordered>
        <TxView :tx-hash="$route.params.txHash" :script-hash="''"/>
        </q-card>
    </q-page>
</template>