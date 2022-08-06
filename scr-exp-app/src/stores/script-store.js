import { defineStore } from 'pinia';
import axios from "axios"

export const useScriptStore = defineStore('scr', {
    state: () => ({

        ApiDetails: {
            url: '',
            pid: ''
        },

        ScriptList: [],
        SLLoading: false,

        ScrDataList: [],
        ScrJson: {},
        ScrRList: [],

        page: 1,
        CurScript: '',

        TxList: [],
        CurTx: '',

        AssetList: [],
        CurAsset: ''

    }),
    actions: {
        setApi(pID) {
            this.ApiDetails = {
                url: (pID.slice(0, 7) === "mainnet") ? 'https://cardano-mainnet.blockfrost.io/api/v0/' : 'https://cardano-testnet.blockfrost.io/api/v0/',
                pid: pID
            }
        },
        clearApi() {
            this.ApiDetails = {
                url: '',
                pid: ''
            }
        },
        async loadMoreScripts() {
            try {
                this.SLLoading = true
                const data = await axios.get(this.ApiDetails.url + '/scripts', {
                    headers: {
                        project_id: this.ApiDetails.pid
                    },
                    params: { page: this.page, order: 'desc' }
                })
                this.ScriptList = this.ScriptList.concat(data.data.map((s) => s.script_hash))
                this.page++
                this.SLLoading = false
            } catch (err) {
                console.log(err)
            }
        },
        async loadScriptData() {
            try {
                const data = await axios.get(this.ApiDetails.url + '/scripts/' + this.CurScript, {
                    headers: {
                        project_id: this.ApiDetails.pid
                    }
                })
                this.ScrDataList = this.ScrDataList.concat(data.data)
            } catch (err) {
                console.log(err)
            }
        },
        async loadScriptJson() {
            try {
                const data = await axios.get(
                    this.ApiDetails.url + '/scripts/' + this.CurScript + '/json', {
                    headers: {
                        project_id: this.ApiDetails.pid
                    }
                })
                this.ScrJson = data.data.json
            } catch (err) {
                console.log(err)
            }
        },
        async loadScriptRedemer() {
            if (this.CurScript !== undefined && this.ScrRList.filter((f) => f.script_hash === this.CurScript).length === 0){
            try {
                const data = await axios.get(
                    this.ApiDetails.url + '/scripts/' + this.CurScript +'/redeemers', {
                    headers: {
                        project_id: this.ApiDetails.pid
                    }
                })
                this.ScrRList = this.ScrRList.concat({
                    script_hash : this.CurScript,
                    data        : data.data
                })
            } catch (err){
                console.log(err)
            }}
        },
        async loadScriptTx(){
            if (this.CurTx !== undefined && this.TxList.filter((f) => f.hash === this.CurTx).length === 0){
            try{
                const data = await axios.get(
                    this.ApiDetails.url +'/txs/'+ this.CurTx + '/utxos',{
                        headers: {
                            project_id: this.ApiDetails.pid
                        }
                    })
                this.TxList = this.TxList.concat(data.data)
            } catch (err){
                console.log(err)
            }}
        },
        async loadAsset(){
            if (this.CurAsset !== undefined && this.AssetList.filter((f)=> f.asset ===this.CurAsset).length === 0){
                try{
                const data = await axios.get(
                    this.ApiDetails.url +'/assets/'+this.CurAsset, {
                        headers: {
                            project_id: this.ApiDetails.pid
                        }
                })
                this.AssetList = this.AssetList.concat(data.data)
            } catch (err){
                console.log(err)
            }
            }
            
        }
    }
});