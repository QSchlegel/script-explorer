<template>
    <div>
        <v-layout>
            <v-app-bar density="compact" rounded>
                <template v-slot:prepend>
                    <v-app-bar-nav-icon />
                </template>

                <v-app-bar-title>Script-Explorer</v-app-bar-title>

                <template v-slot:append>

                    <v-card class="mx-auto" min-width="200" max-width="400" elevation="0">
                        <v-card-text>
                            <v-text-field :loading="loading" elevation="0" variant="underlined" label=""
                                append-inner-icon="mdi-magnify" single-line hide-details @click:append-inner="onClick"
                                v-on:keyup.enter="onEnter"></v-text-field>
                        </v-card-text>
                    </v-card>

                    <v-btn icon="mdi-dots-vertical" @click.stop="drawer = !drawer" />
                </template>
            </v-app-bar>

            <v-navigation-drawer v-model="drawer" temporary location="right">
                <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
                    title="John Leider"></v-list-item>

                <v-divider></v-divider>

                <v-list density="compact" nav>
                    <v-list-item prepend-icon="mdi-view-dashboard" title="Home" value="home"></v-list-item>
                    <v-list-item prepend-icon="mdi-forum" title="About" value="about"></v-list-item>
                </v-list>
            </v-navigation-drawer>
            <v-main style="height: 250px">
                <div class="d-flex justify-center align-center h-100">

                </div>
            </v-main>
        </v-layout>
        <slot />
        <v-layout>
            <v-footer class="text-center d-flex flex-column">

                <div>
                    <v-btn @click="toggleTheme">toggle theme</v-btn>
                    Discord Github
                </div>
                <v-divider></v-divider>

                <div>
                    {{ new Date().getFullYear() }} Script-Explorer
                </div>

            </v-footer>
        </v-layout>
    </div>
</template>


<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme()
const toggleTheme = () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'


const drawer = ref(null)
const loaded = ref(false)
const loading = ref(false)




const onClick = _ => {
    loading.value = true

    setTimeout(() => {
        loading.value = false
        loaded.value = true
    }, 2000)
}
const onEnter = _ => {
    loading.value = true

    setTimeout(() => {
        loading.value = false
        loaded.value = true
    }, 2000)
}


</script>