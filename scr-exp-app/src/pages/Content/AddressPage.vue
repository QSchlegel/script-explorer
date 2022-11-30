<script setup>
import AddressView from 'src/components/Content/AddressView.vue';
import SearchView from 'src/components/Util/SearchView.vue';
</script>
<template>
    <q-page>
        <SearchView/>
        <AddressView :input="$route.params.input" :is-address="true"/>
    </q-page>
</template>