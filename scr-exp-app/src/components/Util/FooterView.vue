<template>
    <div class="row q-mt-xl">
        <div class="col" />
        <div class="col-auto q-px-lg q-pt-md">
            <router-link to="/" class="text-black" style="text-decoration: none;">Home</router-link>
        </div>
        <div class="col-auto q-px-lg q-pt-md">
            <router-link to="/about" class="text-black" style="text-decoration: none;">About</router-link>
        </div>
        <div class="col-auto q-px-lg q-pt-md">
            <router-link to="/donate" class="text-black" style="text-decoration: none;">Donate</router-link>
        </div>
        <div class="col" />

    </div>

    <div class="row q-py-xl">
        <div class="col" />
        <div class="col-auto q-px-lg q-pt-sm">
            <div class="q-gutter-sm">
                <q-btn class="text-black col" href="https://discord.gg/QN9x4Kq5vR" style="text-decoration:none"
                    target="_blank" flat round icon="discord" size="1em" />
                <q-btn class="text-black col" href="https://github.com/QSchlegel/script-explorer"
                    style="text-decoration:none" target="_blank" flat round icon="lab la-github" size="1em" />
            </div>
        </div>
        <div class="col" />
    </div>
</template>