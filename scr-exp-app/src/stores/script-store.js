import { defineStore } from 'pinia';
import axios from "axios"

export const useScriptStore = defineStore('scr', {
    state: () => ({

        ApiDetails: {
            url: '',
            pid: ''
        },
        LoggedIn: false,

        ScriptList: [],
        SLLoading: false,

        ScrDataList: [],
        ScrJson: {},
        ScrRList: [],

        page: 1,
        CurScript: '',

        TxList: [],
        CurTx: '',
        CurTxIndex: '',

        GraphList: [],

        AssetList: [],
        CurAsset: ''

    }),
    actions: {
        async setApi(pID) {
            //Check API Credentials
            this.ApiDetails = {
                url: (pID.slice(0, 7) === "mainnet") ? 'https://cardano-mainnet.blockfrost.io/api/v0/' : 'https://cardano-testnet.blockfrost.io/api/v0/',
                pid: pID
            }
            try {
                const data = await axios.get(this.ApiDetails.url, {
                    headers: {
                        project_id: this.ApiDetails.pid
                    }
                })
                if (data.data.url !== '') {
                    this.LoggedIn = true;
                    this.loadMoreScripts()
                }

            } catch (err) {
                this.ApiDetails = {
                    url: '',
                    pid: ''
                }
                this.LoggedIn = false
            }
        },
        clearApi() {
            this.ApiDetails = {
                url: '',
                pid: ''
            }
            this.LoggedIn = false
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
            if (this.CurScript !== undefined && this.ScrRList.filter((f) => f.script_hash === this.CurScript).length === 0) {
                try {
                    const data = await axios.get(
                        this.ApiDetails.url + '/scripts/' + this.CurScript + '/redeemers', {
                        headers: {
                            project_id: this.ApiDetails.pid
                        }
                    })
                    this.ScrRList = this.ScrRList.concat({
                        script_hash: this.CurScript,
                        data: data.data
                    })
                } catch (err) {
                    console.log(err)
                }
            }
        },
        async loadScriptTx() {
            if (this.CurTx !== undefined && this.TxList.filter((f) => f.hash === this.CurTx).length === 0) {
                try {
                    const data = await axios.get(
                        this.ApiDetails.url + '/txs/' + this.CurTx + '/utxos', {
                        headers: {
                            project_id: this.ApiDetails.pid
                        }
                    })
                    this.TxList = this.TxList.concat(data.data)
                    this.createGraph(this.CurTx)
                } catch (err) {
                    console.log(err)
                }
            }
        },
        async loadAsset() {
            if (this.CurAsset !== undefined && this.AssetList.filter((f) => f.asset === this.CurAsset).length === 0) {
                try {
                    const data = await axios.get(
                        this.ApiDetails.url + '/assets/' + this.CurAsset, {
                        headers: {
                            project_id: this.ApiDetails.pid
                        }
                    })
                    this.AssetList = this.AssetList.concat(data.data)
                } catch (err) {
                    console.log(err)
                }
            }

        },
        createGraph(CurTx) {

            const tx = this.TxList.filter((f) => f.hash === this.CurTx)[0]
            const l = []
            const valIn  = tx.inputs .map((m) => m.amount.map((n) => Object.assign(n, { addr: m.tx_hash + "-" + m.output_index }))).flat()
            const valOut = tx.outputs.map((m) => m.amount.map((n) => Object.assign(n, { addr: this.CurTx + "-" + m.output_index }))).flat()
            const calcPrice = (u, q) => {
                if (u === "lovelace") q = q / 1000000
                return q
            }
            const shortenUnit = (u) => {
                if (u === "lovelace") return "₳"
                return u.slice(0, 3) + "..." + u.slice(u.length - 3)
            }
            const shortenTx = (tx) => { return tx.slice(0, 3) + "..." + tx.slice(tx.length - 3) }
            const shortenAddr = (a) => {return a.slice(0, 3) + "..." + a.slice(a.length - 5)}
            
            //Inputs
            //Input addr to values
            valIn.map((m) =>
                l.push({
                    source: shortenAddr(m.addr) + "-i",
                    target: shortenUnit(m.unit) + "-i",
                    value: calcPrice(m.unit, m.quantity)
                }))

            //Values In to tx 
            valIn.map((m) =>
                l.push({
                    source: shortenUnit(m.unit) + "-i",
                    target: shortenTx(CurTx),
                    value: calcPrice(m.unit, m.quantity)
                })
            )
            // Outputs
            //tx  to Values Out
            valOut.map((m) =>
                l.push({
                    source: shortenTx(CurTx),
                    target: shortenUnit(m.unit) + "-o",
                    value: calcPrice(m.unit, m.quantity)
                })
            )
            //Values to Output tx
            valOut.map((m) =>
                l.push({
                    source: shortenUnit(m.unit) + "-o",
                    target: shortenAddr(m.addr) + "-o",
                    value: calcPrice(m.unit, m.quantity)
                }))
            const n = [... new Set(l.map((m) => m.source)), ... new Set(l.map((m) => m.target))]
            this.GraphList.push({
                id: CurTx,
                nodes: n,
                links: l,
            })
        }
    }
});