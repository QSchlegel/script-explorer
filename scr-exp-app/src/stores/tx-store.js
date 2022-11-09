import { defineStore } from 'pinia';
import axios from "axios"
import { useNetStore } from './net-store';
import { useScrStore } from './scr-store';

const netStore = useNetStore();
const scrStore = useScrStore();

export const useTxStore = defineStore('tx-store', {
    state: () => ({

        txList:         [],
        utxosList:       [],
        currentTx:          '',
        currentTxIndex:     ''
        
    }),
    actions: {
        async loadTx(){},
        async loadUtxos() {
            if (this.currentTx !== '' && this.txList.filter((f) => f.hash === this.currentTx).length === 0) {
                try {
                    const data = await axios.get(
                        netStore.ApiDetails.url + 'txs/' + this.currentTx + '/utxos', {
                        headers: { project_id: netStore.ApiDetails.pid }
                    })
                    this.utxosList = this.utxosList.concat({
                        script_hash:    scrStore.currentScript,
                        txHash:         data.data.hash,
                        inputs:         data.data.inputs,
                        outputs:         data.data.outputs,
                        data:           data.data
                    })
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }
})