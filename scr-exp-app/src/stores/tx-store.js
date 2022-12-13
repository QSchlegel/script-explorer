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
            if (tx !== undefined && this.txList.filter((f)=> f.hash === tx).length === 0){
                try {
                    const data = await axios.get(
                        netStore.ApiDetails.url + 'txs/' + tx, {
                        headers: { project_id: netStore.ApiDetails.pid }
                    })
                    this.txList.push(data.data)
                } catch (err) {
                    console.log(err)
                    return false 
                }
            }
        },
        async loadUtxos(tx, scriptHash='') {
            if (tx !== '' && this.utxosList.filter((f) => f.txHash === tx).length === 0) {
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
                    return true
                } catch (err) {
                    console.log(err)
                    return false
                }
            }
            return true
        }
    }
})