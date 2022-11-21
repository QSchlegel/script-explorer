<script setup>
import TxView from 'src/components/Content/TxView.vue';
import FooterView from 'src/components/Util/FooterView.vue';
import LoginView from 'src/components/Util/LoginView.vue';
import SearchView from 'src/components/Util/SearchView.vue';

</script>

<template>
    <q-page>
        <LoginView/>
        <SearchView/>
        <TxView :tx-hash="$route.params.txHash" :script-hash="''"/>
        <FooterView/>
    </q-page>
</template>