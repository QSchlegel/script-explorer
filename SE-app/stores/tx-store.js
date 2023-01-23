import { defineStore } from 'pinia';
import axios from "axios"
import { useNetStore } from './net-store';

const netStore = useNetStore();

export const useTxStore = defineStore('tx-store', {
    state: () => ({

        txList:         [],
        utxosList:       [],
        currentTx:'',
        currentTxIndex:''
        
    }),
    actions: {
        async loadTx(tx){
            const tmp = this.txList.filter((f)=> f.hash === tx)
            if (tx !== undefined && tmp.length === 0){
                try {
                    const data = await axios.get(
                        netStore.ApiDetails.url + 'txs/' + tx, {
                        headers: { project_id: netStore.ApiDetails.pid }
                    })
                    this.txList.push(data.data)
                    return data.data
                } catch (err) {
                    console.log(err)
                    return false 
                }
            }
            return tmp[0]
        },
        async loadUtxos(tx, scriptHash='') {
            const tmp = this.utxosList.filter((f) => f.txHash === tx)
            if (tx !== '' && tmp.length === 0) {
                try {
                    const data = await axios.get(
                        netStore.ApiDetails.url + 'txs/' + tx + '/utxos', {
                        headers: { project_id: netStore.ApiDetails.pid }
                    })
                    this.utxosList = this.utxosList.concat({
                        scriptHash  :   scriptHash,
                        txHash      :   data.data.hash,
                        inputs      :   data.data.inputs,
                        outputs     :   data.data.outputs
                    })
                    return {
                        scriptHash  :   scriptHash,
                        txHash      :   data.data.hash,
                        inputs      :   data.data.inputs,
                        outputs     :   data.data.outputs
                    }
                } catch (err) {
                    console.log(err)
                    return false
                }
            }
            return tmp[0]
        }
    }
})