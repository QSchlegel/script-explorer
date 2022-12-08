import { defineStore } from 'pinia';
import axios from "axios"
import { useNetStore } from './net-store';

const netStore = useNetStore();

export const useScrStore = defineStore('scr-store', {
    state: () => ({

        scriptList: [],
        slLoading: false,
        page: 1,

        scriptDataList: [],
        plutusList: [],
        timelock: {},
        dLoading: false,

        currentScript: '',
        loadAddress: false


    }),
    actions: {
        async loadMoreScripts() {
            try {
                this.slLoading = true
                const data = await axios.get(netStore.ApiDetails.url + 'scripts', {
                    headers: { project_id: netStore.ApiDetails.pid },
                    params: { page: this.page, order: 'desc' }
                })
                this.scriptList = this.scriptList.concat(data.data.map((s) => s.script_hash))
                this.page++
                this.slLoading = false

            } catch (err) {
                console.log(err)
            }
        },

        async loadScriptData(scriptHash) {
            if (this.scriptDataList.filter((f) => f.script_hash === scriptHash)) {
                try {
                    this.dLoading = true
                    const data = await axios.get(netStore.ApiDetails.url + 'scripts/' + scriptHash, {
                        headers: { project_id: netStore.ApiDetails.pid }
                    })
                    this.scriptDataList = this.scriptDataList.concat(data.data)
                    switch (data.data.type) {
                        case 'timelock':
                            this.loadScriptJson(scriptHash);
                            break;
                        case 'plutusV1':
                            this.loadScriptRedemer(scriptHash);
                            break;
                        case 'plutusV2':
                            this.loadScriptRedemer(scriptHash);
                            break;
                    }
                    return true
                } catch (err) {
                    console.log(err)
                    return false
                }
            }
            return false
        },

        async loadScriptJson(scriptHash) {
            try {
                const data = await axios.get(netStore.ApiDetails.url + 'scripts/' + scriptHash + '/json', {
                    headers: { project_id: netStore.ApiDetails.pid }
                })
                this.timelock = data.data.json
                //load Policy => load Assets
            } catch (err) {
                console.log(err)
            }
            this.dLoading = false
        },

        async loadScriptRedemer(scriptHash) {
            if (this.plutusList.filter((f) => f.scriptHash === scriptHash).length === 0) {
                try {
                    const data = await axios.get(netStore.ApiDetails.url + '/scripts/' + scriptHash + '/redeemers', {
                        headers: { project_id: netStore.ApiDetails.pid }
                    })
                    this.plutusList = this.plutusList.concat({
                        scriptHash: scriptHash,
                        data: data.data
                    })

                } catch (err) {
                    console.log(err)
                }
            }
            this.dLoading = false
        },
        toggleLoadAddrOff() {
            this.loadAddress = false
        }
    }
})