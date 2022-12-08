<script setup>
import PolicyView from 'src/components/Content/PolicyView.vue';

    
</script>

<template>
    <q-page>
        <q-card  class="q-ma-md q-pa-md" flat bordered>
            <PolicyView :policy-id="$route.params.policyId" />
        </q-card>
        
    </q-page>
</template>