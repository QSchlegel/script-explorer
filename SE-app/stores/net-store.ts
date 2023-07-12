import { defineStore } from 'pinia';
import axios from "axios"
//import { useLocalStorage } from '@vueuse/core'

type State = {
    ApiDetails:{
        url: string,
        pid: string
    },
    LoggedIn: Boolean,
    mode:String
}
export const useNetStore = defineStore('net-store', {
    state: ():State => ({
        //TD store as a List
        ApiDetails: {
            url: '',
            pid: ''
        },
        LoggedIn: false,
        mode: ''

    }),
    actions: {
        getPid():string {
            return this.ApiDetails.pid
        },
        async setApi(pID: string) {
            //Check API Credentials
            this.ApiDetails = {
                url: '',
                pid: pID
            }

            if (pID.startsWith('mainnet')) { this.ApiDetails.url = 'https://cardano-mainnet.blockfrost.io/api/v0/'; this.mode = 'mainnet' }
            if (pID.startsWith('preprod')) { this.ApiDetails.url = 'https://cardano-preprod.blockfrost.io/api/v0/'; this.mode = 'preprod' }
            if (pID.startsWith('preview')) { this.ApiDetails.url = 'https://cardano-preview.blockfrost.io/api/v0/'; this.mode = 'preview' }

            if (pID.startsWith('mainnetxyz')) { this.ApiDetails.url = 'https://blockfrost-proxy.script-explorer.workers.dev/'; this.mode = 'mainnet' }
            if (pID.startsWith('preprodxyz')) { this.ApiDetails.url = 'https://blockfrost-proxy.script-explorer.workers.dev/'; this.mode = 'preprod' }
            if (pID.startsWith('previewxyz')) { this.ApiDetails.url = 'https://blockfrost-proxy.script-explorer.workers.dev/'; this.mode = 'preview' }

            try {
                const headers = {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    'project_id': this.ApiDetails.pid
                }
                const data = await axios.get(this.ApiDetails.url + "metrics", { headers })
                if (data.status === 200) {
                    this.LoggedIn = true;
                    return true
                }
            } catch (err) {
                this.clearApi()
            }
            return false
        },
        clearApi() {
            this.$reset()
            this.ApiDetails = {
                url: '',
                pid: ''
            },
            this.LoggedIn = false
            this.mode = ''

        }
    }
})