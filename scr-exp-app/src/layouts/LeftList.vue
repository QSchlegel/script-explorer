<script setup>
import { useScrStore } from 'src/stores/scr-store';
import { useNetStore } from 'src/stores/net-store';
import { useAddrStore } from 'src/stores/addr-store';

const netStore = useNetStore();
const scrStore = useScrStore();
const addrStore = useAddrStore();

</script>
<template>
    <q-list>
        <q-item v-for="s, index in scrStore.scriptList" :key="index">
            <q-item-section>
                <q-btn :style='{ "background-color": ($route.params.scriptHash !== undefined && $route.params.scriptHash == s) ? "lightgrey" : "white" }'
                    :to="'/scripts/' + s" @click="scrStore.currentScript = s; addrStore.currentAddress = ''">
                    {{ s.slice(0, 10) + " ... " + s.slice(s.length - 10) }}
                </q-btn>

            </q-item-section>
        </q-item>
        <q-linear-progress query track-color="primary" color="accent" class="q-mt-sm" v-if='scrStore.slLoading' />
        <q-item>
            <q-item-section>
                <q-btn class="q-mb-xl" color="accent" text-color="white" @click="scrStore.loadMoreScripts"
                    :disabled="!netStore.LoggedIn">
                    Load Scripts
                </q-btn>
            </q-item-section>
        </q-item>
    </q-list>
</template>