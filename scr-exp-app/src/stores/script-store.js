import { defineStore } from 'pinia';
import axios from "axios"
import { useStorage } from '@vueuse/core'

export const useScriptStore = defineStore('scr', {
    state: () => ({

        ApiDetails: useStorage('ApiDetails',{
            url: String,
            pid: String
        }),
        LoggedIn: useStorage('LoggedIn', Boolean),

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
                url: '',
                pid: pID
            }
            switch(pID.slice(0,7)){
                case 'mainnet': this.ApiDetails.url = 'https://cardano-mainnet.blockfrost.io/api/v0/'; break;
                case 'testnet': this.ApiDetails.url = 'https://cardano-testnet.blockfrost.io/api/v0/'; break;
                case 'preprod': this.ApiDetails.url = 'https://cardano-preprod.blockfrost.io/api/v0/'; break;
                case 'preview': this.ApiDetails.url = 'https://cardano-preview.blockfrost.io/api/v0/'; break;
                default:
                    
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
                this.clearApi()
            }
        },
        clearApi() {
            this.$reset()
            this.ApiDetails = {}
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
            const valIn  = tx.inputs .map((m) => m.amount.map((n) => Object.assign(n, { utxo: m.tx_hash + "-" + m.output_index, addr:m.address, collateral:m.collateral }))).flat()
            const valOut = tx.outputs.map((m) => m.amount.map((n) => Object.assign(n, { utxo: this.CurTx + "-"+ m.output_index, addr:m.address+" " }))).flat()
            const calcPrice = (u, q) => {
                if (u === "lovelace") q = q / 1000000
                return q
            }
            const shortenUnit = (u) => {
                if (u === "lovelace") return "Ada_₳"
                return "Unit_"+u.slice(0, 3) + " ... " + u.slice(u.length - 3)
            }
            const shortenUtxO = (tx) => { return "UtxO_"+tx.slice(0, 3) + " ... " + tx.slice(tx.length - 5)}
            const shortenAddr = (a)  => { return "Addr_"+a.slice(5, 15)  + " ... " + a.slice(a.length - 6)}

            //ToDo Display Fees,
            
            //Detect Burns 🔥 and Mints 🔨
            valOut.map((m)=>
                (valIn.filter((f) => f.unit === m.unit  ).length === 0 && m.unit !== "lovelace")?
                    l.push(
                        {
                            source: "Util",
                            target: "m_Mint 🔨",
                            value: calcPrice(m.unit, m.quantity)
                        },{
                        source: "m_Mint 🔨",
                        target: shortenUnit(m.unit),
                        value: calcPrice(m.unit, m.quantity)
                    }):m
            )
            valIn.map((m)=>
                (valOut.filter((f) => f.unit === m.unit  ).length === 0 && m.unit !== "lovelace")?
                    l.push({
                        source: shortenUnit(m.unit),
                        target: "b_Burn 🔥",
                        value: calcPrice(m.unit, m.quantity)
                    },{
                        source: "b_Burn 🔥",
                        target: "Util",
                        value: calcPrice(m.unit, m.quantity)
                    }):m
            )

            //Inputs
            valIn.map((m)=>
                l.push({
                    source: "in"+shortenAddr(m.addr),
                    target: "in"+shortenUtxO(m.utxo),
                    value: calcPrice(m.unit, m.quantity)
                }))
            //Input utxo to values
            valIn.map((m) =>
                (m.collateral)? l.push({
                    source: "in"+shortenUtxO(m.utxo),
                    target: shortenUnit(m.unit),
                    value: calcPrice(m.unit, m.quantity)
                },{
                    source: shortenUnit(m.unit),
                    target: "c_Collateral",
                    value: calcPrice(m.unit, m.quantity)
                }):l.push({
                    source: "in"+shortenUtxO(m.utxo),
                    target: shortenUnit(m.unit),
                    value: calcPrice(m.unit, m.quantity)
                }))

            
            //Outputs
            //values to output utxo
            valOut.map((m) =>
                l.push({
                    source: shortenUnit(m.unit),
                    target: "out"+shortenUtxO(m.utxo),
                    value: calcPrice(m.unit, m.quantity)
                },{
                    source: "out"+shortenUtxO(m.utxo),
                    target: "out"+shortenAddr(m.addr),
                    value: calcPrice(m.unit, m.quantity)
                }))
            l.push({
                source: shortenUnit('lovelace'),
                target: "Fee",
                value: this.ScrRList.filter((f)=> f.script_hash === this.CurScript)[0].data[0].fee/100000
            })
            
            //const n = [... new Set(l.map((m) => m.source)), ... new Set(l.map((m) => m.target))]
            this.GraphList.push({
                id: CurTx,
               
                links: l,
            })
        }
    }
});