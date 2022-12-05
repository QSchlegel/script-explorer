import { defineStore } from 'pinia';
import { useAddrStore } from './addr-store';
import { useTxStore } from './tx-store';

const addrStore = useAddrStore();
const txStore = useTxStore();

export const useGridStore = defineStore('grid-store', {
    state: () => ({
        addrList: [],
        txList: [],
        graph:[],
        gridSwitch: true
    }),
    actions: {
        async addItem(gridId, gridType) {
            switch (gridType) {
                case 'address': if (this.addrList.filter((f) => f.id === gridId).length === 0) {
                    this.addrList.push({ id: gridId });
                     await this.loadAddressItems(gridId)
                     this.generateGraph()
                } break
                case 'tx': if (this.txList.filter((f) => f.id === gridId).length === 0) {
                    this.txList.push({ id: gridId });
                    await this.loadTxItems(gridId)
                    this.generateGraph()
                } break
            }
            
        },
        removeItem(gridId, gridType) {
            switch (gridType) {
                case 'address': this.addrList = this.addrList.filter((f) => f.id !== gridId); break
                case 'tx': this.txList = this.txList.filter((f) => f.id !== gridId); break
            }
            this.generateGraph()
        },
        async loadAddressItems(addr) {
            //loadAddr -> Txs -> addrs-> in and outxo 
            const addrObj = addrStore.addressTxList.filter((f) => f.address === addr)
            var txList = []
            if (addrObj.length > 0) {
                addrObj[0].data
                    .map((m) => { txList.push({ tx: m.tx_hash }); return m.tx_hash })
                txList = txList.map((m) => {
                    const AddrIn = [];
                    const AddrOut = [];
                    txStore.loadUtxos(m.tx)
                        .then(_ => {
                            txStore.utxosList
                                .filter((f) => f.txHash === m.tx)
                                .map((n) => {
                                    n.inputs.map((k) => AddrIn.push(k.address))
                                    n.outputs.map((k) => AddrOut.push(k.address))
                                    return n
                                })
                        })
                    return {
                        id: m.tx,
                        inAddr: AddrIn,
                        outAddr: AddrOut
                    }
                })
                this.addrList = this.addrList.map((m) => (m.id === addr) ? { id: addr, txs: txList } : m)
            }
        },
        async loadTxItems(tx) {
            const AddrIn = [];
            const AddrOut = [];
            txStore.loadUtxos(tx)
                .then(_ => {
                    txStore.utxosList
                        .filter((f) => f.txHash === tx)
                        .map((n) => {
                            n.inputs.map((k) => AddrIn.push(k.address))
                            n.outputs.map((k) => AddrOut.push(k.address))
                            return n
                        })
                })
            this.txList = this.txList.map((m) => (m.id === tx) ? {
                id: tx,
                inAddr: AddrIn,
                outAddr: AddrOut
            } : m)
        },
        generateGraph() {
            const tmp = [];
            this.addrList.map((m) => m.txs)
                .flat()
                .concat(this.txList)
                .map((m) => {
                    m.inAddr.map((n) => tmp.push({
                        source: n,
                        target: m.id,
                        type: "input"
                    }));
                    m.outAddr.map((n) => tmp.push({
                        source: m.id,
                        target: n,
                        type: "output"
                    }))
                    return m
                })
            this.graph = Array.from(new Set(tmp.map(el => JSON.stringify(el)))).map(el => JSON.parse(el))
        }
    }
})