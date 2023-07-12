import { defineStore } from 'pinia';
import axios from "axios"
import { useNetStore } from './net-store';

const netStore = useNetStore();

type State = {
    txList: localTx[],
    utxosList: localUtxos[],
    currentTx: string,
    currentTxIndex: string
}

export const useTxStore = defineStore('tx-store', {
    state: ():State => ({
        txList: [],
        utxosList: [],
        currentTx: '',
        currentTxIndex: ''
    }),

    actions: {
        async loadTx(tx: string) {
            const tmp = this.txList.filter((f) => f.network === netStore.mode && f.hash === tx)
            if (tx !== undefined && tmp.length === 0) {
                const pid: string = netStore.getPid()
                const headers = {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    'project_id': pid
                }
                const net = { network: netStore.mode }
                try {
                    const response = await axios.get<Transaction>(
                        netStore.ApiDetails.url + 'txs/' + tx, { headers })
                    const res:localTx = {
                        ...response.data,
                        ...<Network>net
                    }
                    this.txList.push(res)
                    return res
                } catch (err) {
                    console.log(err)
                    return false
                }
            }
            return tmp[0]
        },
        async loadUtxos(tx:string, scriptHash = '') {
            const tmp = this.utxosList.filter((f) => f.network === netStore.mode && f.hash === tx)
            if (tx !== '' && tmp.length === 0) {
                const pid: string = netStore.getPid()
                const headers = {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    'project_id': pid
                }
                const net = { network: netStore.mode }
                try {
                    const response = await axios.get<Utxos>(
                        netStore.ApiDetails.url + 'txs/' + tx + '/utxos', { headers })
                    const res:localUtxos = {
                        ...response.data,
                        ...<Network>net,
                        ...<scriptListItem>{script_hash: scriptHash}
                    }
                    this.utxosList.push(res)
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