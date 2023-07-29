// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            title: "Script Explorer",
            meta: [
                {
                    name: "description",
                    content: "This is an open source Blockchain Explorer for the Cardano Blockchain."
                },
                {
                    name: "keywords",
                    content: "Cardano, Blockchain, Blockchain Explorer, Ada, Crypto Assets, Cryptography, Open Source, Quirin Schlegel, Script, Script Explorer"
                }
            ]
        }
    },
    modules: [[
        '@pinia/nuxt',
        {
            autoImports: ['defineStore', 'acceptHMRUpdate'],
        },
    ], [
        '@nuxtjs/tailwindcss'
    ]],

    imports: {
        dirs: ['stores'],
    },
})
