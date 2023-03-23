import { defineStore } from 'pinia';
import axios from "axios"
import { useNetStore } from './net-store';

const netStore = useNetStore();

type State = {
    scriptList: localScriptListItem[],
    slLoading: boolean,
    page: number,

    scriptDataList: localScriptInfo[],
    plutusList: localRedeemer[],
    timelock: {},
    dLoading: boolean,
    currentScript: string
}

export const useScrStore = defineStore('scr-store', {
    state: (): State => ({
        scriptList: [],
        slLoading: false,
        page: 1,

        scriptDataList: [],
        plutusList: [],
        timelock: {},
        dLoading: false,
        currentScript: ''
    }),

    actions: {
        sDLGet(scr: string) { return this.scriptDataList.filter(f => f.network === netStore.mode && f.script_hash === scr)[0] },

        async loadMoreScripts(p: number) {
            const pid: string = netStore.getPid()
            const headers = {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'project_id': pid
            }
            const net = { network: netStore.mode }
            try {
                this.slLoading = true
                const response = await axios.get<scriptListItem[]>(netStore.ApiDetails.url + 'scripts', {
                    headers,
                    params: { count: 20, page: p, order: 'desc' }
                })
                this.page = p
                this.scriptList = response.data.map(m =>
                    <localScriptListItem>{
                        ...<scriptListItem>m,
                        ...<Network>net
                    }
                )
                this.slLoading = false
                response.data.map((s) => this.loadScriptData(s.script_hash))
            } catch (err) {
                console.log(err)
            }
        },

        async loadScriptData(scriptHash: string) {
            const tmp = this.scriptDataList.filter((f) => f.network === netStore.mode && f.script_hash === scriptHash)
            if (tmp.length === 0) {
                const pid: string = netStore.getPid()
                const headers = {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    'project_id': pid
                }
                const net = { network: netStore.mode }
                try {
                    this.dLoading = true
                    const response = await axios.get<scriptInfo>(`${netStore.ApiDetails.url}scripts/${scriptHash}`, { headers })
                    const res: localScriptInfo = {
                        ...response.data,
                        ...<Network>net
                    }
                    this.scriptDataList.push(res)
                    return res
                } catch (err) {
                    return false
                }
            }
            return tmp[0]
        },

        async loadScriptJson(scriptHash: string) {
            const pid: string = netStore.getPid()
            const headers = {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'project_id': pid
            }
            const net = { network: netStore.mode }
            try {
                const data = await axios.get(`${netStore.ApiDetails.url}scripts/${scriptHash}/json`, { headers })
                this.timelock = data.data.json
                //load Policy => load Assets
                return true
            } catch (err) {
                console.log(err)
            }
            this.dLoading = false
            return false
        },

        async loadScriptRedeemer(scriptHash: string) {
            const tmp = this.plutusList.filter((f) => f.network === netStore.mode && f.script_hash === scriptHash)
            if (tmp.length === 0) {
                const pid: string = netStore.getPid()
                const headers = {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    'project_id': pid
                }
                const net = { network: netStore.mode }
                try {
                    const response = await axios.get<Redeemer[]>(
                        `${netStore.ApiDetails.url}scripts/${scriptHash}/redeemers`, 
                        { headers }
                    )
                    const res: localRedeemer[] = response.data.map(m => <localRedeemer>{
                            ...m,
                            ...<Network>net,
                            ...<scriptListItem>{ script_hash: scriptHash }
                        }
                    )
                    this.plutusList = this.plutusList.concat(res)
                    return res
                } catch (err) {
                    return false
                }
            }
            this.dLoading = false
            return tmp[0]
        }
    }
})

