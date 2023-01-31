import { defineStore } from 'pinia';
import axios from "axios"
import { useStorage } from '@vueuse/core'

export const useNetStore = defineStore('net-store', {
    state: () => ({
        //TD store as a List
        ApiDetails: useStorage('ApiDetails', {
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
            if (pID.startsWith('mainnet')) { this.ApiDetails.url = 'https://blockfrost-proxy.script-explorer.workers.dev/'; this.mode = 'mainnet' }

            try {
                const data = await axios.get(this.ApiDetails.url + "metrics", {
                    headers: {
                        project_id: this.ApiDetails.pid,
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    }
                })

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
            this.ApiDetails = {}
            this.LoggedIn = false
            this.mode = ''

        }
    }
})