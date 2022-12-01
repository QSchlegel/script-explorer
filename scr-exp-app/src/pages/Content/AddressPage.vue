<script setup>
import AddressView from 'src/components/Content/AddressView.vue';
import SearchView from 'src/components/Util/SearchView.vue';
</script>
<template>
    <q-page>
        <SearchView/>
        <q-card class="q-ma-md" flat bordered>
            <AddressView :input="$route.params.input" :is-address="true"/>
        </q-card>
        
    </q-page>
</template>