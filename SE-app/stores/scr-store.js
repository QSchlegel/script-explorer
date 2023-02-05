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
        sDLGet(scr) { return this.scriptDataList.filter(f => f.network === netStore.mode && f.script_hash === scr)[0] },
        async loadMoreScripts(p) {

            if (netStore.LoggedIn !== true) { return }
            try {
                this.slLoading = true
                const data = await axios.get(netStore.ApiDetails.url + 'scripts', {
                    headers: { project_id: netStore.ApiDetails.pid },
                    params: { count: 20, page: p, order: 'desc' }
                })
                this.page = p
                this.scriptList = data.data.map(s => {return { scriptHash: s.script_hash, network: netStore.mode }})
                this.slLoading = false
                data.data.map((s) => this.loadScriptData(s.script_hash))
                return
            } catch (err) {
                console.log(err)
            }
        },

        async loadScriptData(scriptHash) {
            const tmp = this.scriptDataList.filter((f) => f.network === netStore.mode && f.script_hash === scriptHash)
            if (tmp.length === 0) {
                try {
                    this.dLoading = true
                    var data = await axios.get(netStore.ApiDetails.url + 'scripts/' + scriptHash, {
                        headers: {
                            project_id: netStore.ApiDetails.pid,
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                        }
                    })
                    data.data.network = netStore.mode
                    this.scriptDataList = this.scriptDataList.concat(data.data)
                    return data.data
                } catch (err) {
                    return false
                }
            }
            return tmp[0]
        },

        async loadScriptJson(scriptHash) {
            try {
                const data = await axios.get(netStore.ApiDetails.url + 'scripts/' + scriptHash + '/json', {
                    headers: {
                        project_id: netStore.ApiDetails.pid,
                        'Access-Control-Allow-Headers': '*',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                    }
                })
                this.timelock = data.data.json
                //load Policy => load Assets
                return true
            } catch (err) {
                console.log(err)
            }
            this.dLoading = false
            return false
        },
        //ToDo check if empty
        async loadScriptRedeemer(scriptHash) {
            const tmp = this.plutusList.filter((f) => f.network === netStore.mode && f.scriptHash === scriptHash)
            if (tmp.length === 0) {
                try {
                    const data = await axios.get(netStore.ApiDetails.url + 'scripts/' + scriptHash + '/redeemers', {
                        headers: {
                            project_id: netStore.ApiDetails.pid,
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                        }
                    })
                    const res = {
                        network: netStore.mode,
                        scriptHash: scriptHash,
                        data: data.data
                    }
                    this.plutusList = this.plutusList.concat(res)
                    return res
                } catch (err) {
                    return false
                }
            }
            this.dLoading = false
            return tmp[0]
        },
        toggleLoadAddrOff() {
            this.loadAddress = false
        }
    }
})