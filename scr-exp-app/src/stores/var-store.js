import { defineStore } from 'pinia';

export const useVarStore = defineStore('var-store', {
    state: () => ({
        addressType: 'Script',

    })
})