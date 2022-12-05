<script setup>
import { computed } from '@vue/reactivity';
import { useGridStore } from 'src/stores/grid-store'

const gridStore = useGridStore();

const props = defineProps({
    gridId: String,
    gridType: String
})
const toggleOn = computed(() => {
    return ((props.gridType === 'address') ? gridStore.addrList :
        (props.gridType === 'tx') ? gridStore.txList : []
    ).filter((f) => f.id === props.gridId).length > 0
})
</script>
<template>
    <div class="q-gutter-sm">
        <q-btn v-if="!toggleOn" flat bordered round icon="sym_o_radio_button_unchecked" @click="gridStore.addItem(props.gridId, props.gridType)" />
        <q-btn v-if="toggleOn" flat bordered round icon="sym_o_radio_button_checked" @click="gridStore.removeItem(props.gridId, props.gridType)" />
    </div>
</template>