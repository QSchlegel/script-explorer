<script setup>
import AssetView from 'src/components/Content/AssetView.vue';

    
</script>

<template>
    <q-page>
        <q-card  class="q-ma-md q-pa-md" flat bordered>
            <AssetView :asset-id="$route.params.assetId"/>
        </q-card>
        
    </q-page>
</template>