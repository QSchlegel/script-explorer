<script setup>
import AddressView from 'src/components/Content/AddressView.vue';
import FooterView from 'src/components/Util/FooterView.vue';
import LoginView from 'src/components/Util/LoginView.vue';
import SearchView from 'src/components/Util/SearchView.vue';

</script>

<template>
    <q-page>
        <LoginView/>
        <SearchView/>
        <AddressView :input="$route.params.input" :is-address="true"/>
        <FooterView/>
    </q-page>
</template>