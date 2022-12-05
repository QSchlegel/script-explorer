<script setup>
import UtxoView from 'src/components/Content/UtxoView.vue';
</script>
<template>
    <q-page>
        <q-card class="q-ma-md" flat bordered>
        <UtxoView :tx-hash="$route.params.txHash"/>
        </q-card>
    </q-page>
</template>