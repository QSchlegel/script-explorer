import { defineStore } from 'pinia';
import axios from "axios"
import { useNetStore } from './net-store';

const netStore = useNetStore();

export const useTxStore = defineStore('tx-store', {
    state: () => ({

        txList: [],
        utxosList: [],
        currentTx: '',
        currentTxIndex: ''

    }),
    actions: {
        async loadTx(tx) {
            const tmp = this.txList.filter((f) => f.network === netStore.mode && f.hash === tx)
            if (tx !== undefined && tmp.length === 0) {
                try {
                    var data = await axios.get(
                        netStore.ApiDetails.url + 'txs/' + tx, {
                        headers: {
                            project_id: netStore.ApiDetails.pid,
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                        }
                    })
                    data.data.network = netStore.mode
                    this.txList.push(data.data)
                    return data.data
                } catch (err) {
                    console.log(err)
                    return false
                }
            }
            return tmp[0]
        },
        async loadUtxos(tx, scriptHash = '') {
            const tmp = this.utxosList.filter((f) => f.network === netStore.mode && f.txHash === tx)
            if (tx !== '' && tmp.length === 0) {
                try {
                    const data = await axios.get(
                        netStore.ApiDetails.url + 'txs/' + tx + '/utxos', {
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
                        txHash: data.data.hash,
                        inputs: data.data.inputs,
                        outputs: data.data.outputs
                    }
                    this.utxosList = this.utxosList.concat(res)
                    return res
                } catch (err) {
                    console.log(err)
                    return false
                }
            }
            return tmp[0]
        }
    }
})