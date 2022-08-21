<template>

    <q-separator />

    <div class="q-mt-sm q-mb-xs col" v-if='props.data.type == "sig"' style="word-wrap:break-word">
        {{ "Signed by: "+ props.data.keyHash + " 🗝"}}
    </div>
    <div class="q-mt-sm q-mb-xs col" v-if='props.data.type == "before"'>{{ "Before Slot: " + props.data.slot + " 🕰" }}</div>
    <div class="q-mt-sm q-mb-xs col" v-if='props.data.type == "after"'>{{ "After Slot: " + props.data.slot + " 🕰" }}</div>

    <div class="q-ma-md"  v-if='props.data.type == "all" || props.data.type == "any" || props.data.type == "atLeast"'>
        <div class="text-h6" v-if='props.data.type == "atLeast"'> {{ "Requiered Conditions: " + props.data.type + " - " +
                props.data.required
        }}</div>
        <div class="text-bold" v-if='props.data.type != "atLeast"'>{{ "Requiered Conditions: " + props.data.type }}</div>

        <q-list bordered v-for='j, index in props.data.scripts' :key="index">
            
            <q-item>
                <JsonView :data="j"></JsonView>
            </q-item>

        </q-list>
    </div>

</template>

<script setup>

const props = defineProps({
    data: null
})
</script>