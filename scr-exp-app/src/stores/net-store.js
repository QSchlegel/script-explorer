import { defineStore } from 'pinia';
import axios from "axios"
import { useStorage } from '@vueuse/core'

export const useNetStore = defineStore('net-store', {
    state: () => ({
//TD store as a List
        ApiDetails: useStorage('ApiDetails',{
            url: String,
            pid: String
        }),
        LoggedIn: useStorage('LoggedIn', Boolean),
        mode: useStorage('mode', String)
        
    }),
    actions: {
        async setApi(pID) {
            //Check API Credentials
            this.ApiDetails = {
                url: '',
                pid: pID
            }

            if(pID.startsWith('mainnet')){this.ApiDetails.url   = 'https://cardano-mainnet.blockfrost.io/api/v0/'; this.mode='mainnet'}
            if(pID.startsWith('testnet')){this.ApiDetails.url   = 'https://cardano-testnet.blockfrost.io/api/v0/'; this.mode='testnet'}
            if(pID.startsWith('preprod')){this.ApiDetails.url   = 'https://cardano-preprod.blockfrost.io/api/v0/'; this.mode='testnet'}
            if(pID.startsWith('preview')){this.ApiDetails.url   = 'https://cardano-preview.blockfrost.io/api/v0/'; this.mode='testnet'}

            
            try {
                const data = await axios.get(this.ApiDetails.url, {
                    headers: {
                        project_id: this.ApiDetails.pid
                    }
                })
                
                if (data.data.url !== '') {
                    this.LoggedIn = true;
                }

            } catch (err) {
                this.clearApi()
            }
        },
        clearApi() {
            this.$reset()
            this.ApiDetails = {}
            this.LoggedIn = false
            this.mode = ''
            
        }
    }
})