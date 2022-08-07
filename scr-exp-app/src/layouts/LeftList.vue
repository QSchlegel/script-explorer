<template> 
    <q-list>
        <q-item   v-for="s, index in store.ScriptList" :key="index">
            <q-item-section>
                <q-btn  :style='{"background-color": (store.CurScript == s)? "lightgrey": "white"}' 
                        @click="store.CurScript = s; store.loadScriptData()"
                        >
                    {{s.slice(0,10)+ " ... " + s.slice(s.length-10)}}
                </q-btn>
                
            </q-item-section>
        </q-item>
        <q-linear-progress query track-color="primary" color="accent" class="q-mt-sm" v-if='store.SLLoading' />
        <q-item>
            <q-item-section>
                <q-btn class="q-mb-xl" color="accent" text-color="white" @click="store.loadMoreScripts" :disabled="!store.LoggedIn">
                    Load Scripts
                </q-btn>
            </q-item-section>
        </q-item>
    </q-list>
</template>
<script setup> 
    import { useScriptStore } from 'src/stores/script-store';
    
    const store = useScriptStore();

</script>